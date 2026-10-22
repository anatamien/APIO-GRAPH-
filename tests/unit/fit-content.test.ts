import {describe,it,expect} from 'vitest';
import {createProject,addPairs,makeObject} from '../../src/domain/model';
import {createCoordinates} from '../../src/domain/geometry';
import {fitContent} from '../../src/domain/fitContent';
import {objectBounds} from '../../src/domain/objectBounds';

describe('F9 includes finite visible content without editing the document',()=>{
 it('fits a rotated indexed label and full callout outside data range, keeping source and anchors',()=>{
  const p=addPairs(createProject(),[{x:1,y:2},{x:2,y:3}],'Raw');
  const label=makeObject('text',[{mode:'data',x:-5,y:20}],'Long label with units, m2');label.text=[{text:'Long label with units, m',baseline:'normal',bold:false,italic:false},{text:'2',baseline:'super',bold:false,italic:false}];
  const callout=makeObject('callout',[{mode:'data',x:2,y:3},{mode:'data',x:7,y:12}],'A multiline\ncallout');p.objects=[label,callout];p.extensions.textRotation={[label.id]:45};const original=structuredClone(p);
  const viewport=fitContent(p,1000,700),c=createCoordinates({...p,viewport},1000,700);
  for(const o of p.objects){const b=objectBounds(p,o,c);expect(b.left).toBeGreaterThan(c.left+7);expect(b.right).toBeLessThan(c.right-7);expect(b.top).toBeGreaterThan(c.top+7);expect(b.bottom).toBeLessThan(c.bottom-7)}
  expect(p).toEqual(original);
 });
 it('fits data-only objects, ignores hidden objects and infinite lines, preserves empty navigation',()=>{
  const p=createProject();p.viewport={xMin:10,xMax:11,yMin:30,yMax:31};expect(fitContent(p,900,650)).toEqual(p.viewport);
  p.objects=[makeObject('marker',[{mode:'data',x:-200,y:100}])];const fit=fitContent(p,900,650);expect(fit.xMin).toBeLessThan(-200);expect(fit.xMax).toBeGreaterThan(-200);
  const hidden=makeObject('text',[{mode:'data',x:1e20,y:1e20}],'Hidden');hidden.visible=false;p.objects.push(hidden,makeObject('line',[{mode:'data',x:1e15,y:1e15}]));expect(fitContent(p,900,650)).toEqual(fit);
 });
 it('keeps page-fixed anchors and fits point offsets inside a reduced available width',()=>{
  const p=addPairs(createProject(),[{x:1,y:2},{x:3,y:4}],'Raw'),pt=p.datasets[0].points[1];const o=makeObject('callout',[{mode:'point',datasetId:p.datasets[0].id,pointId:pt.id,fallbackX:pt.x,fallbackY:pt.y,offsetXpx:30,offsetYpx:-60},{mode:'data',x:5,y:7}],'Offset tip');p.objects=[o,makeObject('text',[{mode:'page',pageX:.4,pageY:.3}],'Fixed')];
  const viewport=fitContent(p,1200,800,{right:790}),c=createCoordinates({...p,viewport},1200,800),b=objectBounds(p,o,c);expect(b.right).toBeLessThan(780);expect(b.top).toBeGreaterThan(c.top+7);expect(p.objects[1].anchors).toEqual([{mode:'page',pageX:.4,pageY:.3}]);
 });
 it('handles tiny finite domains and marker/range extents without runaway growth',()=>{
  const p=addPairs(createProject(),[{x:1e-250,y:2e-250},{x:2e-250,y:3e-250}],'Tiny');p.objects=[makeObject('range-x',[{mode:'data',x:1e-250,y:2e-250},{mode:'data',x:2e-250,y:3e-250}])];const v=fitContent(p,900,650);expect(Object.values(v).every(Number.isFinite)).toBe(true);expect(v.xMin).toBeLessThan(1e-250);expect(v.xMax).toBeGreaterThan(2e-250);expect(v.xMax).toBeLessThan(1e-248);
 });
 it('ignores a range band coordinate which is not used by the renderer',()=>{const p=addPairs(createProject(),[{x:0,y:0},{x:10,y:10}],'Raw');p.objects=[makeObject('range-x',[{mode:'data',x:1,y:1e12},{mode:'data',x:2,y:1e12}])];const v=fitContent(p,1200,800);expect(v.yMax).toBeLessThan(100);p.objects=[makeObject('range-y',[{mode:'data',x:1e12,y:1},{mode:'data',x:1e12,y:2}])];expect(fitContent(p,1200,800).xMax).toBeLessThan(100)});
 it('does not chase a page-fixed part outside a docked panel or change its anchors',()=>{const p=addPairs(createProject(),[{x:0,y:0},{x:10,y:10}],'Raw');p.objects=[makeObject('callout',[{mode:'data',x:5,y:5},{mode:'page',pageX:.9,pageY:.3}],'Page-fixed label')];const before=structuredClone(p),v=fitContent(p,1200,800,{right:790});expect(v.xMax).toBeLessThan(100);expect(v.yMax).toBeLessThan(100);expect(p).toEqual(before);p.objects[0].anchors.reverse();const reverse=fitContent(p,1200,800,{right:790});expect(reverse.xMax).toBeLessThan(100);expect(reverse.yMax).toBeLessThan(100)});
 it('does not shrink the measurements trying to fit glyphs larger than the whole available canvas',()=>{const p=addPairs(createProject(),[{x:0,y:0},{x:10,y:10}],'Raw'),o=makeObject('text',[{mode:'data',x:5,y:5}],'Long scientific caption '.repeat(30));o.style.fontSizePt=72;p.objects=[o];expect(fitContent(p,1200,800,{right:790}).xMax).toBeLessThan(100)});
});
