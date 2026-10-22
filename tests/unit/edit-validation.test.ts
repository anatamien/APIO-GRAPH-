import {it,expect} from 'vitest';
import {addPairs,createProject} from '../../src/domain/model';
import {validateProject,validateEdit,serialize,deserialize} from '../../src/domain/project';
import {History} from '../../src/domain/commands';
it('keeps the full boundary depth limit for newly introduced undefined leaves',()=>{
 const p=createProject();validateProject(p);let nested:unknown=undefined;for(let i=0;i<59;i++)nested={next:nested};const next={...p,extensions:{extra:nested}};
 expect(validateProject(next).errors.some(e=>e.includes('TOO_DEEP'))).toBe(true);expect(validateEdit(p,next).errors.some(e=>e.includes('TOO_DEEP'))).toBe(true);
});
it('validates a small extension edit without rereading unchanged imported provenance',()=>{
 const p=addPairs(createProject(),[{x:1,y:2}],'source');let reads=0;const rows:Record<string,number>={};
 for(let i=0;i<10000;i++)Object.defineProperty(rows,String(i),{get:()=>{reads++;return i+1},enumerable:true});p.extensions={sourceRows:{[p.datasets[0].id]:rows},textRotation:{}};expect(validateProject(p).errors).toEqual([]);reads=0;
 const next={...p,extensions:{...p.extensions,textRotation:{label:45}}};expect(validateEdit(p,next).errors).toEqual([]);expect(reads).toBe(0);
 expect(validateEdit(next,{...next,extensions:{...next.extensions,newValue:{bad:NaN}}}).errors.length).toBeGreaterThan(0);
});
it('retains measurement validation through viewport navigation before the next edit',()=>{
 const p=addPairs(createProject(),Array.from({length:10000},(_,x)=>({x,y:x})),'source');let reads=0;
 for(const pt of p.datasets[0].points){const x=pt.x;Object.defineProperty(pt,'x',{get:()=>{reads++;return x},enumerable:true})}validateProject(p);
 const h=new History(p);for(let i=0;i<10;i++)h.navigate({...p.viewport,xMin:i,xMax:i+10});reads=0;
 expect(validateEdit(h.current,{...h.current,project:{...p.project,title:'after pan'}}).errors).toEqual([]);expect(reads).toBe(0);expect(h.dirty).toBe(false);
 const untrusted=addPairs(createProject(),[{x:0,y:1}],'source');untrusted.datasets[0].points[0].x=NaN;const other=new History(untrusted);other.navigate({...p.viewport});expect(validateEdit(other.current,{...other.current,project:{...p.project,title:'bad'}}).errors.length).toBeGreaterThan(0);
});
it('validates a style edit without reading already validated measurements',()=>{
 const p=addPairs(createProject(),Array.from({length:10000},(_,x)=>({x,y:x})),'source');let reads=0;
 for(const pt of p.datasets[0].points){const x=pt.x;Object.defineProperty(pt,'x',{get:()=>{reads++;return x},enumerable:true})}
 expect(validateProject(p).errors).toEqual([]);reads=0;
 expect(validateEdit(p,{...p,series:p.series.map(s=>({...s,style:{...s.style,stroke:'#123456'}}))}).errors).toEqual([]);expect(reads).toBe(0);
});
it('checks all changed measurements, references, styles and extension numbers',()=>{
 const p=addPairs(createProject(),[{x:1,y:2}],'source');validateProject(p);
 expect(validateEdit(p,{...p,datasets:p.datasets.map(d=>({...d,points:[{...d.points[0],x:NaN}]}))}).errors.length).toBeGreaterThan(0);
 expect(validateEdit(p,{...p,series:p.series.map(s=>({...s,datasetId:'missing'}))}).errors.length).toBeGreaterThan(0);
 expect(validateEdit(p,{...p,series:p.series.map(s=>({...s,style:{...s.style,strokeWidthPt:-1}}))}).errors.length).toBeGreaterThan(0);
 expect(validateEdit(p,{...p,extensions:{bad:Infinity}}).errors.length).toBeGreaterThan(0);
 const untrusted=addPairs(createProject(),[{x:1,y:2}],'source');untrusted.datasets[0].points[0].y=NaN;
 expect(validateEdit(untrusted,{...untrusted,project:{...untrusted.project,title:'x'}}).errors.length).toBeGreaterThan(0);
});
it('full boundary validation never trusts cached arrays after in-place corruption',()=>{
 const p=addPairs(createProject(),[{x:1,y:2}],'source');validateProject(p);p.datasets[0].points[0].x=Infinity;
 expect(validateProject(p).errors.length).toBeGreaterThan(0);expect(()=>serialize(p)).toThrow();
});
it('checks a changed point without repeating numeric checks for untouched point objects',()=>{
 const p=addPairs(createProject(),Array.from({length:10000},(_,x)=>({x,y:x})),'source');let reads=0;
 for(const pt of p.datasets[0].points){const x=pt.x;Object.defineProperty(pt,'x',{get:()=>{reads++;return x},enumerable:true})}validateProject(p);
 const next={...p,datasets:p.datasets.map(d=>({...d,points:d.points.map((pt,i)=>i===9999?{...pt,x:7}:pt)}))};reads=0;
 expect(validateEdit(p,next).errors).toEqual([]);expect(reads).toBeLessThan(10);
 const duplicate={...next,datasets:next.datasets.map(d=>({...d,points:[...d.points,d.points[0]]}))};expect(validateEdit(next,duplicate).errors.length).toBeGreaterThan(0);
});
it('serializes exactly once normally and preserves signed zero alongside escaped marker-like text',()=>{
 const p=addPairs(createProject(),[{x:-0,y:Number.MIN_VALUE}],'source');p.project.title='quoted "__negative_zero_example__';
 const text=serialize(p),restored=deserialize(text).project;expect(Object.is(restored.datasets[0].points[0].x,-0)).toBe(true);expect(restored.project.title).toBe(p.project.title);expect(restored.datasets[0].points[0].y).toBe(Number.MIN_VALUE);
});
