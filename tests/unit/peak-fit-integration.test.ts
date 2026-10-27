import {it,expect} from 'vitest';
import fixture from '../fixtures/peak-fit-reference.json';
import {createProject,addPairs,id} from '../../src/domain/model';
import {History,editPoint} from '../../src/domain/commands';
import {fitPeaks} from '../../src/domain/math/peakFit';
import {calculatePreview} from '../../src/features/analysis/operations';
import {applyPeakFit} from '../../src/features/analysis/peakFitOperations';
import {validateProject,serialize,deserialize} from '../../src/domain/project';
import {createRecomputeJob,executeRecomputeJob,applyCalculationPatches} from '../../src/features/analysis/recalculation';
import {unpackCoordinates} from '../../src/features/analysis/pointBuffer';
import {writeWorkspace,readWorkspace} from '../../src/features/workspace/archive';
const labels={component:'Component',residual:'Residual',baseline:'Baseline'};
function prepared(){const f=fixture.cases[3],p=addPairs(createProject(),f.points,'Original'),fit=fitPeaks(p.datasets[0].points,f.options),result=calculatePreview('peak-fit-output',p.datasets[0].points,{fit:fit.data.peakFit,output:'all'});return{p,options:f.options,result}}
it('peak fitting applies full independent outputs in one Undo and survives both APH containers',async()=>{
 const {p,options,result}=prepared(),h=new History(p);h.execute('ApplyMath',q=>applyPeakFit(q,p.series[0].id,options,result,'Fit',labels));const next=h.current;expect(validateProject(next).errors).toEqual([]);expect(next.datasets[0]).toBe(p.datasets[0]);expect(next.calculations.length).toBe(5);expect(next.series.slice(1).every(s=>s.visible&&s.style.markerVisible===false)).toBe(true);expect(new Set(next.series.slice(1).map(s=>s.style.stroke)).size).toBe(5);expect(next.datasets.slice(1).every(d=>d.points.length===p.datasets[0].points.length)).toBe(true);expect(deserialize(serialize(next)).project.datasets).toEqual(next.datasets);const tab=id(),archive=await readWorkspace(await writeWorkspace({id:id(),activeId:tab,tabs:[{id:tab,label:'Fit',project:next}]}));expect(archive.graph(tab).calculations).toEqual(next.calculations);h.undo();expect(h.current).toBe(p);h.redo();expect(h.current).toBe(next);
});
it('recompute retains styles/IDs and component-only recompute uses stored parent fit instead of optimizing again',()=>{
 const {p,options,result}=prepared(),fitted=applyPeakFit(p,p.series[0].id,options,result,'Fit',labels),master=fitted.calculations[0],aux=fitted.calculations[1],styled={...fitted,series:fitted.series.map((s,i)=>i===2?{...s,visible:false,style:{...s.style,stroke:'#A01020'}}:s)},changed=editPoint(styled,p.datasets[0].id,p.datasets[0].points[10].id,{x:p.datasets[0].points[10].x,y:p.datasets[0].points[10].y+.01});expect(changed.calculations.every(c=>c.status==='outdated')).toBe(true);const patches=executeRecomputeJob(createRecomputeJob(changed)),applied=applyCalculationPatches(changed,changed,patches.map(patch=>({calculation:patch.calculation,datasetId:patch.datasetId,points:patch.coordinates?unpackCoordinates(patch.coordinates).map((point,i)=>({...point,id:changed.datasets.find(d=>d.id===patch.datasetId)!.points[patch.indices![i]].id})):undefined})));expect(validateProject(applied).errors).toEqual([]);expect(applied.calculations.every(c=>c.status==='valid')).toBe(true);expect(applied.series).toBe(changed.series);const job=createRecomputeJob(applied,[aux.id]);expect(job.calculations.every(c=>c.kind==='peak-fit-output')).toBe(true);expect(job.peakFits?.[master.id]).toEqual(applied.calculations[0].data!.peakFit);expect(executeRecomputeJob(job).every(p=>p.calculation.status==='valid')).toBe(true);
});
