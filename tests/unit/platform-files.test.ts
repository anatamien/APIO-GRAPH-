import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearRecovery, initialFile, isDesktop, onDroppedFile, openFile, readRecovery, saveImage, saveProject, writeRecovery } from '../../src/platform/files';

const { nativeInvoke, nativeListen } = vi.hoisted(() => ({ nativeInvoke: vi.fn(), nativeListen: vi.fn() }));
vi.mock('@tauri-apps/api/core', () => ({ invoke: nativeInvoke }));
vi.mock('@tauri-apps/api/event', () => ({ listen: nativeListen }));
function nativeFileReply(name:string,path:string,bytes:number[]):ArrayBuffer{const header=new TextEncoder().encode(JSON.stringify({name,path})+'\n'),body=new Uint8Array(header.length+bytes.length);body.set(header);body.set(bytes,header.length);return body.buffer}

beforeEach(() => {
  vi.unstubAllGlobals();
  nativeInvoke.mockReset();
  nativeListen.mockReset();
});

describe('browser recovery', () => {
  beforeEach(() => {
    const storage = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
    });
  });

  it('keeps the complete document and original path until explicitly cleared', async () => {
    const text = '{"format":"APIO_GRAPH_PROJECT","text":"Δ <script>","value":1.0000000000000002}';
    const path = 'C:/данные/experiment.aph';
    expect(await readRecovery()).toBeNull();
    await writeRecovery(text, path);
    expect(await readRecovery()).toEqual({ text, path });
    await clearRecovery();
    expect(await readRecovery()).toBeNull();
  });

  it('reports damaged recovery data without deleting it', async () => {
    localStorage.setItem('apio-graph.recovery.v1', '{"text":42,"path":null}');
    await expect(readRecovery()).rejects.toThrow('RECOVERY_INVALID');
    expect(localStorage.getItem('apio-graph.recovery.v1')).not.toBeNull();
  });

  it('has no startup association in the browser', async () => {
    expect(isDesktop()).toBe(false);
    expect(await initialFile()).toBeNull();
    expect(nativeInvoke).not.toHaveBeenCalled();
  });
});

describe('native command boundary', () => {
  beforeEach(() => vi.stubGlobal('window', { __TAURI_INTERNALS__: {} }));

  it('transfers large native files in bounded ordered blocks and commits every original byte',async()=>{
    const bytes=Uint8Array.from({length:786449},(_,i)=>i%256),parts:Uint8Array[]=[];let committed=false;
    nativeInvoke.mockImplementation(async(command,args,options)=>{
      if(command==='begin_binary_transfer'){expect(args.length).toBe(bytes.length);return 7}
      if(command==='append_binary_transfer'){expect(args.byteLength).toBeLessThanOrEqual(262144);expect(options.headers['x-apio-transfer']).toBe('7');expect(Number(options.headers['x-apio-offset'])).toBe(parts.reduce((n,p)=>n+p.length,0));parts.push(new Uint8Array(args));return parts.reduce((n,p)=>n+p.length,0)}
      if(command==='save_project'){expect(args.byteLength).toBe(0);expect(options.headers['x-apio-transfer']).toBe('7');expect(options.headers['x-apio-path']).toBe(encodeURIComponent('C:/Δ.aph'));committed=true;return 'C:/Δ.aph'}
    });
    expect(await saveProject(bytes,'C:/Δ.aph')).toBe('C:/Δ.aph');expect(committed).toBe(true);expect(parts.length).toBeGreaterThan(1);
    const actual=new Uint8Array(bytes.length);let offset=0;for(const part of parts){actual.set(part,offset);offset+=part.length}expect(actual).toEqual(bytes);expect(bytes.byteLength).toBe(786449);
  });

  it('aborts an incomplete native upload instead of writing a partial file',async()=>{
    nativeInvoke.mockImplementation(async(command)=>{if(command==='begin_binary_transfer')return 9;if(command==='append_binary_transfer')throw new Error('transfer failed')});
    await expect(saveProject(new Uint8Array(300000),'C:/keep.aph')).rejects.toThrow('transfer failed');
    expect(nativeInvoke).toHaveBeenCalledWith('abort_binary_transfer',{id:9});expect(nativeInvoke.mock.calls.some(([c])=>c==='save_project')).toBe(false);
  });
  it('cancels a running image upload before its native Save dialog or file write',async()=>{
    const controller=new AbortController();nativeInvoke.mockImplementation(async(command,args)=>{if(command==='begin_binary_transfer')return 10;if(command==='append_binary_transfer'){controller.abort();return args.byteLength}});
    await expect(saveImage(new Uint8Array(600000),'png',controller.signal)).rejects.toMatchObject({name:'AbortError'});
    expect(nativeInvoke).toHaveBeenCalledWith('abort_binary_transfer',{id:10});expect(nativeInvoke.mock.calls.some(([c])=>c==='save_image')).toBe(false);
  });
  it('serializes native uploads without mixing concurrent save and recovery bytes',async()=>{
    let sequence=0,active=0,written=0;const order:string[]=[];
    nativeInvoke.mockImplementation(async(command,args,options)=>{
      if(command==='begin_binary_transfer'){expect(active).toBe(0);active=++sequence;written=0;return active}
      if(command==='append_binary_transfer'){expect(Number(options.headers['x-apio-transfer'])).toBe(active);written+=args.length;return written}
      if(command==='save_project'||command==='write_recovery'){expect(written).toBe(300000);order.push(command);return 'C:/project.aph'}
      if(command==='abort_binary_transfer')active=0;
    });
    await Promise.all([saveProject(new Uint8Array(300000)),writeRecovery(new Uint8Array(300000),null)]);expect(order).toEqual(['save_project','write_recovery']);
  });

  it('preserves file bytes and native dialog cancellation', async () => {
    nativeInvoke.mockResolvedValueOnce(nativeFileReply('data.csv','C:/data.csv',[0,128,255]));
    expect(await openFile()).toEqual({ name: 'data.csv', path: 'C:/data.csv', bytes: new Uint8Array([0, 128, 255]) });
    nativeInvoke.mockResolvedValueOnce(new ArrayBuffer(0));
    expect(await openFile()).toBeNull();
  });

  it('passes save and export data to the controlled Rust commands', async () => {
    nativeInvoke.mockResolvedValueOnce('C:/project.aph');
    expect(await saveProject('complete project', 'C:/project.aph', false)).toBe('C:/project.aph');
    expect(nativeInvoke).toHaveBeenLastCalledWith('save_project', new TextEncoder().encode('complete project'), {headers:{'x-apio-path':encodeURIComponent('C:/project.aph'),'x-apio-save-as':'0'}});
    nativeInvoke.mockResolvedValueOnce('C:/chart.png');
    await saveImage(new Uint8Array([137, 80, 78, 71]), '.PNG');
    expect(nativeInvoke).toHaveBeenLastCalledWith('save_image', new Uint8Array([137, 80, 78, 71]), {headers:{'x-apio-extension':'png'}});
  });

  it('does not clear recovery if a native save fails', async () => {
    nativeInvoke.mockRejectedValueOnce(new Error('disk full'));
    await expect(saveProject('project', 'C:/project.aph')).rejects.toThrow('disk full');
    expect(nativeInvoke).toHaveBeenCalledTimes(1);
  });

  it('subscribes to native drops and consumes only paths supplied by Rust', async () => {
    const unlisten = vi.fn();
    const callback = vi.fn();
    nativeListen.mockResolvedValue(unlisten);
    nativeInvoke.mockResolvedValue(nativeFileReply('dropped.csv','C:/dropped.csv',[49,44,50]));
    expect(await onDroppedFile(callback)).toBe(unlisten);
    expect(nativeListen).toHaveBeenCalledWith('apio://files-dropped', expect.any(Function));
    nativeListen.mock.calls[0][1]({ payload: ['C:/dropped.csv'] });
    await vi.waitFor(() => expect(callback).toHaveBeenCalledWith({ name: 'dropped.csv', path: 'C:/dropped.csv', bytes: new Uint8Array([49, 44, 50]) }));
    expect(nativeInvoke).toHaveBeenCalledWith('read_dropped_file', { path: 'C:/dropped.csv' });
  });

  it('surfaces native drop errors with stable codes', async () => {
    const onError = vi.fn();
    nativeListen.mockResolvedValue(vi.fn());
    nativeInvoke.mockRejectedValue('FILE_TOO_LARGE');
    await onDroppedFile(vi.fn(), onError);
    nativeListen.mock.calls[0][1]({ payload: ['C:/large.csv'] });
    await vi.waitFor(() => expect(onError).toHaveBeenCalledWith(expect.objectContaining({ message: 'FILE_TOO_LARGE' })));
  });
  it('retains Unicode metadata and binary newlines and rejects damaged response headers',async()=>{
    nativeInvoke.mockResolvedValueOnce(nativeFileReply('Δ.csv','C:/данные/Δ.csv',[10,0,128,255]));expect(await openFile()).toEqual({name:'Δ.csv',path:'C:/данные/Δ.csv',bytes:new Uint8Array([10,0,128,255])});
    nativeInvoke.mockResolvedValueOnce(new Uint8Array([1,2,3]).buffer);await expect(openFile()).rejects.toThrow('FILE_INVALID_RESPONSE');
  });
  it('accepts the bounded Tauri postMessage byte-array fallback without truncating invalid bytes',async()=>{
    nativeInvoke.mockResolvedValueOnce(Array.from(new Uint8Array(nativeFileReply('Δ.csv','C:/Δ.csv',[0,128,255]))));expect((await openFile())?.bytes).toEqual(new Uint8Array([0,128,255]));
    nativeInvoke.mockResolvedValueOnce([]);expect(await openFile()).toBeNull();
    for(const invalid of [[-1],[256],[1.5],['1'],{}]){nativeInvoke.mockResolvedValueOnce(invalid);await expect(openFile()).rejects.toThrow('FILE_INVALID_RESPONSE')}
  });
});
