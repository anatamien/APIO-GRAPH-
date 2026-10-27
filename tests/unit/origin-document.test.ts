import {describe,expect,it} from 'vitest';
import {ownOriginModel} from '../fixtures/origin';
import {readOriginArchive,writeOriginArchive,readOriginZip,writeOriginZip} from '../../src/features/origin/archive';
import {OriginViewHistory,initialOriginView} from '../../src/features/origin/history';
import {Workspace,graphName,tabDirty} from '../../src/domain/workspace';

describe('Origin document round trip',()=>{
 it('restores source bytes and rejects a damaged zip rather than decoding it as text',async()=>{
  const model=ownOriginModel(),resources=new Map([['original',new Uint8Array([1,2,3])]]),view=initialOriginView(model);
  const bytes=await writeOriginArchive(model,resources,view);expect([...bytes.slice(0,4)]).toEqual([80,75,3,4]);
  const result=await readOriginArchive(bytes);expect(result.model).toEqual(model);expect(result.resources.get('original')).toEqual(new Uint8Array([1,2,3]));
  const bad=bytes.slice();bad[40]^=1;await expect(readOriginArchive(bad)).rejects.toThrow('ORIGIN_INVALID_ARCHIVE');
  const entries=readOriginZip(bytes),manifest=JSON.parse(new TextDecoder().decode(entries.get('manifest.json')!));manifest.minimumReader='9.0';entries.set('manifest.json',new TextEncoder().encode(JSON.stringify(manifest)));await expect(readOriginArchive(writeOriginZip(entries))).rejects.toThrow('ORIGIN_ARCHIVE_VERSION');
 });
 it('excludes original only on explicit choice and marks archive fidelity accordingly',async()=>{
  const model=ownOriginModel(),view={...initialOriginView(model),includeSource:false};
  const result=await readOriginArchive(await writeOriginArchive(model,new Map([['original',new Uint8Array([1,2,3])]]),view));
  expect(result.model.sourceResourceId).toBeNull();expect(result.resources.size).toBe(0);expect(result.model.nodes[0].capabilities.archived).toBe(false);
 });
 it('view undo and save checkpoints preserve later changes without copying scientific resources',()=>{
  const history=new OriginViewHistory(initialOriginView(ownOriginModel()));expect(history.dirty).toBe(false);
  history.edit({encoding:'windows-1252'});const saved=history.saveCheckpoint();history.edit({encoding:'utf-8'});saved();expect(history.dirty).toBe(true);history.undo();expect(history.current.encoding).toBe('windows-1252');expect(history.dirty).toBe(false);history.redo();expect(history.dirty).toBe(true);
 });
 it('adds a separate Origin tab without replacing a populated chart and names it from its own document',()=>{
  const w=new Workspace(),first=w.active;first.placeholder=false;
  const model=ownOriginModel(),history=new OriginViewHistory(initialOriginView(model),true);
  const tab=w.addOrigin({sessionId:'own',model,history});expect(w.tabs).toHaveLength(2);expect(w.tabs[0]).toBe(first);expect(graphName(tab,'Graph')).toBe('Own synthetic.opj');expect(tabDirty(tab)).toBe(true);
  w.activate(first.id);expect(w.active.origin).toBeUndefined();expect(w.dirty).toBe(true);
 });
});
