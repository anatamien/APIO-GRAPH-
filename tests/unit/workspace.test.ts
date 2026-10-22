import {expect,it} from 'vitest';
import {Workspace,graphName,graphFilename} from '../../src/domain/workspace';
import {createProject,addPairs} from '../../src/domain/model';
import {serialize} from '../../src/domain/project';

const measured=()=>addPairs(createProject(),[{x:1,y:2},{x:3,y:5}],'Measurements');
it('reuses only the initial untouched placeholder and retains opened graphs including empty projects',()=>{
 const w=new Workspace(),a=w.add(measured(),{path:'first.aph'});expect(w.tabs).toHaveLength(1);
 const b=w.add(createProject(),{path:'empty.aph'});expect(w.tabs).toHaveLength(2);expect(w.active).toBe(b);w.activate(a.id);expect(w.active).toBe(a);
 w.close(b.id);expect(w.active).toBe(a);w.close(a.id);expect(w.tabs).toHaveLength(1);expect(w.active.placeholder).toBe(true);
});
it('keeps each graph history, view and original save path independent',()=>{
 const w=new Workspace(),a=w.add(measured(),{path:'a.aph'});a.history.execute('Legend',p=>({...p,legend:{...p.legend,visible:false}}));a.history.navigate({xMin:-20,xMax:40,yMin:-10,yMax:50});const original=a.history.current;
 const b=w.add(measured(),{path:'b.aph'});b.history.execute('ProjectTitle',p=>({...p,project:{...p.project,title:'Second'}}));b.history.undo();expect(a.history.current).toBe(original);expect(a.path).toBe('a.aph');expect(b.path).toBe('b.aph');w.activate(a.id);expect(w.active.history.canUndo).toBe(true);expect(w.active.history.current.legend.visible).toBe(false);
});
it('uses source names and clean aph suggestions instead of an unrelated Untitled label',()=>{
 const w=new Workspace(),p=measured();p.project.title='Co 0.05 NaOH.txt';const a=w.add(p,{dirty:true});expect(graphName(a,'График')).toBe('Co 0.05 NaOH.txt');expect(graphFilename(a,'График')).toBe('Co 0.05 NaOH.aph');
 const b=w.add(createProject());expect(graphName(b,'Graph')).toMatch(/^Graph \d+$/);b.path='C:\\data\\result.aph';expect(graphName(b,'Graph')).toBe('result.aph');
});
it('recovers inactive unsaved tabs and clean active tabs without embedding recovery metadata in project saves',()=>{
 const w=new Workspace(),a=w.add(measured(),{path:'a.aph',dirty:true}),b=w.add(measured(),{path:'b.aph',readOnly:true});const q=new Workspace();q.restore(w.recovery(),null);
 expect(q.tabs).toHaveLength(2);expect(q.tabs[0].history.current).toEqual(a.history.current);expect(q.tabs[0].history.dirty).toBe(true);expect(q.active.history.current).toEqual(b.history.current);expect(q.active.readOnly).toBe(true);expect(q.active.history.dirty).toBe(false);expect(q.tabs[0].history.current.extensions.apioWorkspaceRecovery).toBeUndefined();q.close(q.active.id);expect(q.dirty).toBe(true);
});
it('validates all recovered documents before replacing any currently open graph',()=>{
 const w=new Workspace(),a=w.add(measured(),{path:'a.aph'}),root=measured();root.extensions.apioWorkspaceRecovery={version:1,activeIndex:0,tabs:[{document:{format:'invalid'},path:null,readOnly:false,dirty:true}]};
 expect(()=>w.restore(serialize(root),null)).toThrow();expect(w.tabs).toEqual([a]);expect(w.active).toBe(a);
});
it('continues to restore previous single-project recovery files with their original paths',()=>{
 const w=new Workspace(),p=measured();w.restore(serialize(p),'C:/saved.aph');expect(w.tabs).toHaveLength(1);expect(w.active.path).toBe('C:/saved.aph');expect(w.active.history.current).toEqual(p);expect(w.active.history.dirty).toBe(true);
});
it('stores each open document exactly once while retaining the legacy project envelope',()=>{
 const w=new Workspace(),first=measured(),second=measured();w.add(first,{dirty:true});w.add(second,{dirty:true});
 const text=w.recovery();expect(text.split(first.datasets[0].points[0].id).length-1).toBe(1);expect(text.split(second.datasets[0].points[0].id).length-1).toBe(1);
 const q=new Workspace();q.restore(text,null);expect(q.tabs.map(t=>t.history.current.datasets)).toEqual([first.datasets,second.datasets]);
});
