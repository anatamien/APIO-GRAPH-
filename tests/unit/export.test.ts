import {it,expect} from 'vitest';
import {createProject,addPairs,makeObject} from '../../src/domain/model';
import {fitView,minorTicks} from '../../src/domain/geometry';
import {renderSvg} from '../../src/features/export/svgRenderer';
import {outputStyle} from '../../src/features/chart/ChartScene';
import {serialize,deserialize} from '../../src/domain/project';
it('EXP-T03/04/05/08 XML escaping, independent geometry, BW identities, immutable styles',()=>{
  let p=createProject();for(let i=0;i<4;i++)p=addPairs(p,[{x:0,y:i},{x:1,y:i+1}],`s${i}`);p=fitView(p);
  p.objects.push(makeObject('text',[{mode:'page',pageX:0.4,pageY:0.2}],'<script>alert(1)</script>ρ²'));
  p.objects.push(makeObject('rectangle',[{mode:'data',x:0.2,y:0.5},{mode:'data',x:0.4,y:2}]));
  const before=JSON.stringify(p),svg=renderSvg(p,{width:1200,height:800,colorMode:'strict-bw'});
  expect(svg).toContain('viewBox="0 0 1200 800"');expect(svg).not.toContain('<script>');expect(svg).toContain('&lt;script&gt;');expect(svg).not.toMatch(/(?:href=|foreignObject|data-handle)/);expect(svg).toContain('stroke-dasharray="8 5"');expect(svg).toContain('url(#hatch)');expect(JSON.stringify(p)).toBe(before);
});
it('EXP BW identities agree between plot and legend after changing series order',()=>{
 let p=createProject();p=addPairs(p,[{x:0,y:0},{x:1,y:1}],'A');p=addPairs(p,[{x:0,y:1},{x:1,y:2}],'B');p.series[0].order=10;p.series[1].order=0;p=fitView(p);
 const svg=renderSvg(p,{width:1200,height:800,colorMode:'strict-bw'});
 const plotA=svg.slice(svg.indexOf(`data-series="${p.series[0].id}"`)).split('</g>')[0];
 const legendA=svg.slice(svg.lastIndexOf(`data-target="series:${p.series[0].id}"`)).split('</g>')[0];
 const dash=(value:string)=>/stroke-dasharray="([^"]*)"/.exec(value)?.[1]??'';
 expect(dash(plotA)).toBe(dash(legendA));expect(outputStyle(p.series[0],0,'strict-bw').dash).toBe('solid');
});
it('EXP-014 preserves physical point sizes through the chosen DPI',()=>{
 const p=createProject();
 const a=renderSvg(p,{width:1200,height:800,dpi:96}),b=renderSvg(p,{width:1200,height:800,dpi:300});
 expect(a).toContain('viewBox="0 0 1200 800"');expect(b).toContain('viewBox="0 0 384 256"');
 expect(b).toContain('width="1200" height="800"');expect(b).toContain('font-size="16"');
});
it('EDT minor ticks subdivide the major intervals without overflow',()=>{
 expect(minorTicks([0,2,4],1)).toEqual([1,3]);
 expect(minorTicks([0,2],0)).toEqual([]);
 expect(minorTicks([-1e308,1e308],1)).toEqual([0]);
 const p=createProject();p.axes.x.tickMode='manual';p.axes.x.tickStep=2;p.axes.x.minorDivisions=1;
 expect(renderSvg(p,{width:1200,height:800})).toContain('data-minor-axis="x"');
});
it('OBJ text rotation survives schema round-trip and exports as geometry',()=>{
 const p=createProject(),o=makeObject('text',[{mode:'page',pageX:0.5,pageY:0.5}],'rho');p.objects.push(o);
 p.extensions.textRotation={[o.id]:45};
 expect(renderSvg(deserialize(serialize(p)).project,{width:1200,height:800})).toContain('rotate(45 600 400)');
});
it('OBJ infinite line remains finite across a viewport wider than Number.MAX_VALUE',()=>{
 const p=createProject();p.viewport={xMin:-1e308,xMax:1e308,yMin:-1e308,yMax:1e308};
 const o=makeObject('line',[{mode:'data',x:0,y:0}]);o.geometry={directionX:1,directionY:1};p.objects.push(o);
 const svg=renderSvg(p,{width:1200,height:800});
 const line=svg.slice(svg.indexOf(`data-object="${o.id}"`)).split('</g>')[0];
 expect(line).toContain('<line');expect(line).not.toMatch(/NaN|Infinity/);
});
