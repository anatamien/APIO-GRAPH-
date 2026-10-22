import {it,expect} from 'vitest';
import {SnapshotCache,unpackSnapshot} from '../../src/platform/serializationCache';
import {addPairs,createProject} from '../../src/domain/model';
import {Workspace} from '../../src/domain/workspace';
it('sends immutable measurements and extension maps once, then only changed metadata',()=>{
 const p=addPairs(createProject(),[{x:-0,y:1.0000000000000002}],'source');p.extensions.sourceRows={[p.datasets[0].id]:{[p.datasets[0].points[0].id]:9}};
 const cache=new SnapshotCache(),store=new Map<number,unknown>(),first=cache.pack(p);for(const r of first.resources)store.set(r.id,r.value);cache.acknowledge(first.keep);
 expect(first.resources).toHaveLength(2);expect(unpackSnapshot(first.root,store)).toEqual(p);
 const next={...p,series:p.series.map(s=>({...s,name:'changed'}))},second=cache.pack(next);expect(second.resources).toHaveLength(0);expect(unpackSnapshot(second.root,store)).toEqual(next);expect(Object.is(unpackSnapshot(second.root,store).datasets[0].points[0].x,-0)).toBe(true);
 const edited={...next,datasets:next.datasets.map(d=>({...d,points:d.points.map(pt=>({...pt,y:3}))}))};expect(cache.pack(edited).resources).toHaveLength(1);
});
it('round-trips all recovery tabs and prunes resources of closed documents',()=>{
 const w=new Workspace(),a=w.add(addPairs(createProject(),[{x:1,y:2}],'first'),{dirty:true});w.add(addPairs(createProject(),[{x:3,y:4}],'second'),{dirty:true});
 const cache=new SnapshotCache(),store=new Map<number,unknown>(),first=cache.pack(w.recoveryDocument());for(const r of first.resources)store.set(r.id,r.value);cache.acknowledge(first.keep);
 expect(unpackSnapshot(first.root,store)).toEqual(w.recoveryDocument());expect(first.resources).toHaveLength(2);
 w.close(a.id);const second=cache.pack(w.recoveryDocument());expect(second.keep).toHaveLength(1);expect(second.resources).toHaveLength(0);
 expect(()=>unpackSnapshot(second.root,new Map())).toThrow('SERIALIZATION_RESOURCE_MISSING');
});
it('preserves arbitrary JSON extension keys without treating them as object prototypes',()=>{
 const p=createProject();p.extensions=JSON.parse('{"__proto__":{"note":"keep"},"constructor":{"value":-0}}');
 const cache=new SnapshotCache(),packet=cache.pack(p),store=new Map(packet.resources.map(r=>[r.id,r.value]));
 const restored=unpackSnapshot(packet.root,store);expect(Object.hasOwn(restored.extensions,'__proto__')).toBe(true);expect(JSON.stringify(restored.extensions)).toBe(JSON.stringify(p.extensions));
});
