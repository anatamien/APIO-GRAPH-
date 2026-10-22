import {it,expect} from 'vitest';
import {previewProject} from '../../src/features/export/previewProject';
import {createProject,addPairs,makeObject} from '../../src/domain/model';
it('does not copy provenance or recovery metadata into the bounded render preview',()=>{
 const p=addPairs(createProject(),Array.from({length:10000},(_,x)=>({x,y:x})),'source');p.extensions={sourceRows:Object.fromEntries(p.datasets[0].points.map((pt,i)=>[pt.id,i+1])),textRotation:{},largeImportMetadata:'x'.repeat(1000000)};
 const preview=previewProject(p,100);expect(preview.extensions).toEqual({textRotation:{}});expect(JSON.stringify(preview).length).toBeLessThan(30000);expect(p.extensions.largeImportMetadata).toHaveLength(1000000);
});
it('bounds preview data while retaining exact linked measurements and acquisition order',()=>{
 const p=addPairs(createProject(),Array.from({length:20000},(_,i)=>({x:i%43,y:i===1234?1e9:i%11})),'source'),points=p.datasets[0].points,point=points[12001];
 p.objects=[makeObject('text',[{mode:'point',datasetId:p.datasets[0].id,pointId:point.id,fallbackX:-1,fallbackY:-1,offsetXpx:3,offsetYpx:4}],'linked')];
 const preview=previewProject(p,1000);expect(preview.datasets[0].points.length).toBeLessThan(1100);expect(preview.datasets[0].points).toContain(point);expect(preview.datasets[0].points).toContain(points[1234]);
 const indices=preview.datasets[0].points.map(pt=>points.indexOf(pt));expect(indices).toEqual([...indices].sort((a,b)=>a-b));expect(preview.objects).toBe(p.objects);expect(p.datasets[0].points).toBe(points);expect(points).toHaveLength(20000);
 expect(previewProject(p,0).datasets[0].points).toEqual([point]);
});
