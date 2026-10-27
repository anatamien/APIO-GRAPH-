import type {OriginModel} from './model';
/** Change the working set; archived resources remain intact and can be re-included. */
export function setOriginIncluded(model:OriginModel,current:readonly string[],id:string,include:boolean):string[]{
 const nodes=new Map(model.nodes.map(n=>[n.id,n]));if(!nodes.has(id))throw new Error('ORIGIN_OBJECT_MISSING');
 const children=new Map<string,string[]>(),parents=new Map<string,string[]>(),dependencies=new Map<string,string[]>(),dependents=new Map<string,string[]>();
 const add=(map:Map<string,string[]>,from:string,to:string)=>{const list=map.get(from)??[];list.push(to);map.set(from,list)};
 for(const n of model.nodes)if(n.parentId){add(children,n.parentId,n.id);add(parents,n.id,n.parentId)}
 for(const r of model.relations)if(r.to){if(r.kind==='contains'){add(children,r.from,r.to);add(parents,r.to,r.from)}else{add(dependencies,r.from,r.to);add(dependents,r.to,r.from)}}
 const selected=new Set(current),visit=new Set<string>(),queue=[id];
 for(let i=0;i<queue.length;i++){const key=queue[i];if(visit.has(key))continue;visit.add(key);if(include)selected.add(key);else selected.delete(key);queue.push(...children.get(key)??[]);if(!include)queue.push(...dependents.get(key)??[])}
 if(include){const required=[...selected];for(let i=0;i<required.length;i++){const key=required[i];for(const dep of [...dependencies.get(key)??[],...parents.get(key)??[]])if(!selected.has(dep)){selected.add(dep);required.push(dep)}}}
 return model.nodes.filter(n=>selected.has(n.id)).map(n=>n.id);
}
