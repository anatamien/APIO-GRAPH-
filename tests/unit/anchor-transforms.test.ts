import {describe,it,expect} from 'vitest';
import {addPairs,createProject,type Anchor} from '../../src/domain/model';
import {anchorPixel,createCoordinates} from '../../src/domain/geometry';
import {convertAnchor,bindAnchorPoint,anchorLinked} from '../../src/domain/anchorTransforms';
describe('independent anchor modes',()=>{
 it('keeps the displayed position across data/page/point conversion at actual canvas size',()=>{
  const p=addPairs(createProject(),[{x:2,y:3},{x:7,y:8}],'Raw'),c=createCoordinates(p,1130,720),a:Anchor={mode:'data',x:4,y:6},pixel=anchorPixel(p,a,c);
  const page=convertAnchor(p,a,'page',c),data=convertAnchor(p,page,'data',c);expect(anchorPixel(p,page,c)).toEqual(pixel);expect(anchorPixel(p,data,c).x).toBeCloseTo(pixel.x,9);
  const linked=bindAnchorPoint(p,a,p.datasets[0].id,p.datasets[0].points[1].id,c,true);expect(linked.mode).toBe('point');expect(anchorPixel(p,linked,c)).toEqual(pixel);expect(anchorLinked(p,linked)).toBe(true);
 });
 it('snap is explicit; missing links keep finite fallback and can detach',()=>{
  const p=addPairs(createProject(),[{x:2,y:3}],'Raw'),c=createCoordinates(p,900,650),a:Anchor={mode:'data',x:4,y:6},linked=bindAnchorPoint(p,a,p.datasets[0].id,p.datasets[0].points[0].id,c,false);expect(linked).toMatchObject({mode:'point',offsetXpx:0,offsetYpx:0});const broken={...p,datasets:[]};expect(anchorLinked(broken,linked)).toBe(false);const detached=convertAnchor(broken,linked,'data',c);expect(detached).toEqual({mode:'data',x:2,y:3});expect(()=>bindAnchorPoint(p,a,p.datasets[0].id,'missing',c,true)).toThrow();
 });
 it('does not produce an invalid page anchor when the source lies outside the page',()=>{const p=createProject(),c=createCoordinates(p,900,650),a:Anchor={mode:'data',x:1e5,y:1e5};expect(convertAnchor(p,a,'page',c)).toBe(a)});
 it('tracks an edited measurement with the same point ID through viewport changes; label anchor is independent',()=>{
  const p=addPairs(createProject(),[{x:2,y:3},{x:5,y:8}],'Raw'),c=createCoordinates(p,1200,800),label:Anchor={mode:'page',pageX:.7,pageY:.3};const linked=bindAnchorPoint(p,{mode:'data',x:4,y:6},p.datasets[0].id,p.datasets[0].points[0].id,c,true);
  const moved={...p,viewport:{xMin:-10,xMax:30,yMin:-5,yMax:20},datasets:p.datasets.map(d=>({...d,points:d.points.map((a,i)=>i===0?{...a,x:8,y:9}:a)}))},next=createCoordinates(moved,1200,800);expect(anchorPixel(moved,linked,next)).toEqual({x:next.x(8)+(linked.mode==='point'?linked.offsetXpx:0),y:next.y(9)+(linked.mode==='point'?linked.offsetYpx:0)});expect(anchorPixel(moved,label,next)).toEqual(anchorPixel(p,label,c));expect(anchorLinked(JSON.parse(JSON.stringify(moved)),linked)).toBe(true);
 });
});
