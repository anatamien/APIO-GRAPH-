/** All native file access is mediated by Rust commands and native dialogs. */
import type {InvokeArgs,InvokeOptions} from '@tauri-apps/api/core';
export interface OpenedFile { name: string; path: string; bytes: Uint8Array }
export interface Recovery { text: string; path: string | null }

const RECOVERY_KEY = 'apio-graph.recovery.v1';
const MAX_FILE_BYTES = 200 * 1024 * 1024;
interface BrowserRecovery extends Recovery { writtenAt: number }
let recoveryTime = 0;

/** Large browser backups use IndexedDB; desktop backups continue to use atomic files. */
async function browserBackup(action: 'read' | 'write' | 'delete', value?: BrowserRecovery): Promise<BrowserRecovery | undefined> {
  if (typeof indexedDB === 'undefined') {
    if (action === 'write') throw new Error('RECOVERY_UNAVAILABLE');
    return undefined;
  }
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('apio-graph-recovery', 1);
    request.onupgradeneeded = () => { request.result.createObjectStore('recovery'); };
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result, tx = db.transaction('recovery', action === 'read' ? 'readonly' : 'readwrite'), store = tx.objectStore('recovery');
      let result: BrowserRecovery | undefined;
      if (action === 'read') { const read = store.get('current'); read.onsuccess = () => { result = read.result as BrowserRecovery | undefined; }; }
      else if (action === 'write') store.put(value, 'current');
      else store.delete('current');
      tx.oncomplete = () => { db.close(); resolve(result); };
      tx.onabort = () => { db.close(); reject(tx.error); };
    };
  });
}

function validRecovery(value: unknown): BrowserRecovery {
  if (typeof value !== 'object' || value === null || !('text' in value) || typeof value.text !== 'string' || !('path' in value) || (value.path !== null && typeof value.path !== 'string')) throw new Error('RECOVERY_INVALID');
  return {text: value.text, path: value.path, writtenAt: 'writtenAt' in value && typeof value.writtenAt === 'number' && Number.isFinite(value.writtenAt) ? value.writtenAt : 0};
}

export function isDesktop(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

async function invoke<T>(command: string, args?: InvokeArgs,options?:InvokeOptions): Promise<T> {
  const { invoke: nativeInvoke } = await import('@tauri-apps/api/core');
  try { return await (options?nativeInvoke<T>(command,args,options):nativeInvoke<T>(command, args)); }
  catch (error) { throw typeof error === 'string' ? new Error(error) : error; }
}

const NATIVE_BLOCK_BYTES=256*1024;
let nativeWrites:Promise<unknown>=Promise.resolve();
/** Bound each WebView IPC copy; Rust validates and atomically writes only a complete upload. */
function writeNative<T>(command:string,bytes:Uint8Array,headers:Record<string,string>,signal?:AbortSignal):Promise<T>{
  const run=async()=>{
    signal?.throwIfAborted();if(bytes.byteLength>MAX_FILE_BYTES)throw new Error('FILE_TOO_LARGE');
    if(bytes.byteLength<=NATIVE_BLOCK_BYTES)return invoke<T>(command,bytes,{headers});
    let id:number|undefined;
    try{
      id=await invoke<number>('begin_binary_transfer',{length:bytes.byteLength});
      if(!Number.isSafeInteger(id)||id<=0)throw new Error('FILE_INVALID_TRANSFER');
      for(let offset=0;offset<bytes.byteLength;offset+=NATIVE_BLOCK_BYTES){
        signal?.throwIfAborted();const end=Math.min(bytes.byteLength,offset+NATIVE_BLOCK_BYTES);
        const written=await invoke<number>('append_binary_transfer',bytes.subarray(offset,end),{headers:{'x-apio-transfer':String(id),'x-apio-offset':String(offset)}});
        if(written!==end)throw new Error('FILE_INCOMPLETE_TRANSFER');
      }
      signal?.throwIfAborted();return await invoke<T>(command,new Uint8Array(),{headers:{...headers,'x-apio-transfer':String(id)}});
    }finally{if(id!==undefined)await invoke('abort_binary_transfer',{id}).catch(()=>{})}
  };
  const next=nativeWrites.catch(()=>{}).then(run);nativeWrites=next;return next;
}

function nativeFile(input:unknown):OpenedFile|null{
  // Tauri's postMessage fallback returns raw responses as JSON byte arrays.
  let buffer:ArrayBuffer;
  if(input instanceof ArrayBuffer)buffer=input;
  else if(Array.isArray(input)&&input.length<=MAX_FILE_BYTES+1024*1024&&input.every(v=>Number.isInteger(v)&&v>=0&&v<=255))buffer=new Uint8Array(input).buffer;
  else throw new Error('FILE_INVALID_RESPONSE');
  const bytes=new Uint8Array(buffer);if(!bytes.length)return null;
  const end=bytes.indexOf(10);if(end<0||end>1024*1024)throw new Error('FILE_INVALID_RESPONSE');
  let metadata:unknown;try{metadata=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes.subarray(0,end)))}catch{throw new Error('FILE_INVALID_RESPONSE')}
  if(!metadata||typeof metadata!=='object'||!('name'in metadata)||typeof metadata.name!=='string'||!('path'in metadata)||typeof metadata.path!=='string')throw new Error('FILE_INVALID_RESPONSE');
  const data=bytes.subarray(end+1);if(data.byteLength>MAX_FILE_BYTES)throw new Error('FILE_TOO_LARGE');
  return {name:metadata.name,path:metadata.path,bytes:data};
}

function filename(path: string | null | undefined, fallback: string): string {
  return path?.split(/[\\/]/).pop() || fallback;
}

function download(bytes: Uint8Array, name: string, mime: string): string {
  const blob = new Blob([new Uint8Array(bytes)], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return name;
}

export async function openFile(kind: 'all' | 'project' | 'data' = 'all'): Promise<OpenedFile | null> {
  if (isDesktop()) return nativeFile(await invoke('open_file', {kind}));
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = kind==='project'?'.aph':kind==='data'?'.txt,.csv,.tsv':'.aph,.txt,.csv,.tsv';
    input.hidden = true;
    document.body.append(input);
    input.addEventListener('cancel', () => { input.remove(); resolve(null); }, { once: true });
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      input.remove();
      if (!file) { resolve(null); return; }
      if (file.size > MAX_FILE_BYTES) { reject(new Error('FILE_TOO_LARGE')); return; }
      file.arrayBuffer().then(bytes => resolve({ name: file.name, path: file.name, bytes: new Uint8Array(bytes) }), reject);
    }, { once: true });
    input.click();
  });
}

export async function saveProject(text: string|Uint8Array, path?: string | null, saveAs = false): Promise<string | null> {
  const bytes = typeof text==='string'?new TextEncoder().encode(text):text;
  if (isDesktop()) return writeNative('save_project',bytes,{'x-apio-path':encodeURIComponent(path??''),'x-apio-save-as':saveAs?'1':'0'});
  if (bytes.byteLength > MAX_FILE_BYTES) throw new Error('FILE_TOO_LARGE');
  const name = filename(path, 'project.aph').replace(/(?:\.aph)?$/i, '.aph');
  return download(bytes, name, 'application/vnd.apio-graph+json');
}

export async function saveImage(bytes: Uint8Array, extension: string,signal?:AbortSignal): Promise<string | null> {
  extension = extension.replace(/^\./, '').toLowerCase();
  const mime: Record<string, string> = { svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', tif: 'image/tiff', tiff: 'image/tiff' };
  if (!mime[extension]) throw new Error('EXPORT_UNSUPPORTED_FORMAT');
  if (bytes.byteLength > MAX_FILE_BYTES) throw new Error('FILE_TOO_LARGE');
  signal?.throwIfAborted();
  if (isDesktop()) return writeNative('save_image',bytes,{'x-apio-extension':extension},signal);
  return download(bytes, `chart.${extension}`, mime[extension]);
}

export async function writeRecovery(input: string|Uint8Array, path: string | null): Promise<void> {
  if (isDesktop()) return writeNative('write_recovery',typeof input==='string'?new TextEncoder().encode(input):input,{'x-apio-path':encodeURIComponent(path??'')});
  const text=typeof input==='string'?input:new TextDecoder().decode(input);
  const value = {text, path, writtenAt: recoveryTime = Math.max(Date.now(), recoveryTime + 1)};
  if(text.length>2*1024*1024&&typeof indexedDB!=='undefined'){await browserBackup('write',value);return}
  try { localStorage.setItem(RECOVERY_KEY, JSON.stringify(value)); }
  catch (error) {
    if (typeof indexedDB === 'undefined') throw error;
    await browserBackup('write', value);
    return;
  }
  await browserBackup('delete');
}

export async function readRecovery(): Promise<Recovery | null> {
  if (isDesktop()) return invoke('read_recovery');
  const saved = localStorage.getItem(RECOVERY_KEY);
  let local: BrowserRecovery | undefined;
  if (saved) { try { local = validRecovery(JSON.parse(saved)); } catch { throw new Error('RECOVERY_INVALID'); } }
  let stored: BrowserRecovery | undefined;
  try { const value = await browserBackup('read'); if (value) stored = validRecovery(value); }
  catch (error) { if (!local) throw error; }
  const recovery = stored && (!local || stored.writtenAt >= local.writtenAt) ? stored : local;
  if (!recovery) return null;
  recoveryTime = Math.max(recoveryTime, recovery.writtenAt);
  return {text: recovery.text, path: recovery.path};
}

export async function clearRecovery(): Promise<void> {
  if (isDesktop()) return invoke('clear_recovery');
  localStorage.removeItem(RECOVERY_KEY);
  await browserBackup('delete');
}

export async function initialFile(): Promise<OpenedFile | null> {
  if (!isDesktop()) return null;
  return nativeFile(await invoke('initial_file'));
}

/** Paths are readable only after Rust receives the corresponding OS drop event. */
export async function onDroppedFile(
  callback: (file: OpenedFile) => void | Promise<void>,
  onError?: (error: unknown) => void,
): Promise<() => void> {
  if (!isDesktop()) return () => undefined;
  const { listen } = await import('@tauri-apps/api/event');
  return listen<string[]>('apio://files-dropped', event => {
    void (async () => {
      for (const path of event.payload) {
        const file = nativeFile(await invoke('read_dropped_file', { path }));
        if (file) await callback(file);
      }
    })().catch(error => { if (onError) onError(error); });
  });
}
