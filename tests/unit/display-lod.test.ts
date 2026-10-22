import {it,expect} from 'vitest';
import {visiblePoints} from '../../src/features/chart/displayPoints';
import {renderSvg} from '../../src/features/export/svgRenderer';
import {largeProject} from '../fixtures/large-data';
import {makeSeries} from '../../src/domain/model';
it('bounds prepared margins even when millions of coincident samples enter just outside the view',()=>{
 const points=Array.from({length:100000},(_,i)=>({id:String(i),x:15,y:i%7}));
 const prepared=visiblePoints(points,0,10,1000,.5);expect(prepared.length).toBeLessThan(2100);expect(prepared[0]).toBe(points[0]);expect(prepared.at(-1)).toBe(points.at(-1));
 expect(visiblePoints(points,0,10,1000,.5)).toBe(prepared);expect(points).toHaveLength(100000);
});
it('preserves every local measurement when a dense cluster lies in the prepared margin',()=>{
 const local=Array.from({length:11},(_,i)=>({id:'local'+i,x:i,y:i%3})),points=[...local,...Array.from({length:100000},(_,i)=>({id:'cluster'+i,x:14,y:i%7}))];
 const prepared=visiblePoints(points,0,10,1000,.5);for(const point of local)expect(prepared).toContain(point);expect(prepared.length).toBeLessThan(2100);
 expect(prepared.map(p=>points.indexOf(p))).toEqual(prepared.map(p=>points.indexOf(p)).sort((a,b)=>a-b));
});
it('shares a finite screen detail budget across visible series but exports every measurement',()=>{
 const p=largeProject(8000);for(let i=1;i<4;i++){const d={...p.datasets[0],id:crypto.randomUUID()};p.datasets.push(d);p.series.push(makeSeries(d.id,'source '+i,i))}
 p.series=p.series.map(s=>({...s,mode:'line-points',style:{...s.style,markerVisible:true}}));
 const options={width:1200,height:800};const screen=renderSvg(p,{...options,screen:true});expect((screen.match(/data-point=/g)??[]).length).toBeLessThan(2000);
 const exact=renderSvg(p,options);expect((exact.match(/data-point=/g)??[]).length).toBe(32000);
 const zoom=renderSvg({...p,viewport:{...p.viewport,xMin:100,xMax:110}},{...options,screen:true});for(let i=100;i<=110;i++)expect((zoom.match(new RegExp(`data-point="${p.datasets[0].points[i].id}"`,'g'))??[]).length).toBe(4);
 expect(p.datasets[0].points).toHaveLength(8000);
});
it('recovers every local measurement when zooming into a large monotonic acquisition',()=>{
 const points=Array.from({length:20000},(_,i)=>({id:String(i),x:i,y:Math.sin(i/20)}));
 const all=visiblePoints(points,0,20000,1000);expect(all.length).toBeLessThan(1100);
 const local=visiblePoints(points,12340,12360,1000);for(let i=12340;i<=12360;i++)expect(local).toContain(points[i]);expect(local[0]).toBe(points[12339]);expect(local.at(-1)).toBe(points[12361]);
 expect(visiblePoints(points,12340,12360,1000)).toBe(local);
});
it('keeps decreasing and arbitrary X acquisitions ordered and preserves extrema',()=>{
 const points=Array.from({length:20000},(_,i)=>({id:String(i),x:20000-i,y:i===12345?1e9:i%11}));
 const local=visiblePoints(points,7650,7660,1000);expect(local).toContain(points[12345]);expect(local.map(p=>Number(p.id))).toEqual(local.map(p=>Number(p.id)).sort((a,b)=>a-b));
 const arbitrary=points.map((p,i)=>({...p,x:i%17})),shown=visiblePoints(arbitrary,0,10,1000);expect(shown).toContain(arbitrary[12345]);expect(shown.map(p=>Number(p.id))).toEqual(shown.map(p=>Number(p.id)).sort((a,b)=>a-b));
});
