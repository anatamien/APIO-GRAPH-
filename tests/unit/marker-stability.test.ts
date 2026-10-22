import {it,expect} from 'vitest';
import {visibleMarkerPoints} from '../../src/features/chart/displayPoints';
it('retains every interior sampled point ID across a small pan at a density boundary',()=>{
 const points=Array.from({length:50000},(_,i)=>({id:String(i),x:i<5000?i:5000+(i-5000)/2,y:Math.sin(i/20)}));
 const a=visibleMarkerPoints(points,3000,4999.5,751),b=visibleMarkerPoints(points,3001,5000.5,751),next=new Set(b.map(p=>p.id));
 const interior=a.filter(p=>p.x>3100&&p.x<4800);expect(interior.length).toBeGreaterThan(50);expect(interior.filter(p=>!next.has(p.id))).toEqual([]);
});
it('keeps exact vertical observations at a large offset when tile indices exceed safe integers',()=>{
 const points=Array.from({length:1000},(_,i)=>({id:String(i),x:0,y:1e16+2*i}));
 const shown=visibleMarkerPoints(points,-.5,.5,1000,0,[1e16+100,1e16+104]);for(let i=50;i<=52;i++)expect(shown).toContain(points[i]);
});
it('bounds screen detail for enormous finite scientific X domains',()=>{
 for(const span of [1e306,1e308]){const points=Array.from({length:10000},(_,i)=>({id:String(i),x:i/9999*span,y:Math.sin(i/20)}));expect(visibleMarkerPoints(points,0,span,1000).length).toBeLessThan(3000)}
});
it('keeps useful vertical trace detail and restores exact observations on Y zoom',()=>{
 const points=Array.from({length:10000},(_,i)=>({id:String(i),x:0,y:i}));
 expect(visibleMarkerPoints(points,-.5,.5,1000).length).toBeGreaterThan(200);
 const local=visibleMarkerPoints(points,-.5,.5,1000,0,[1234,1254]);for(let i=1234;i<=1254;i++)expect(local).toContain(points[i]);
});
it('includes exact tile-boundary observations in descending acquisitions without duplicates',()=>{
 const points=[{id:'2',x:2,y:2},{id:'1',x:1,y:1},{id:'0a',x:0,y:0},{id:'0b',x:0,y:3}];
 expect(visibleMarkerPoints(points,0,2,1000)).toEqual(points);
});
it('keeps decreasing acquisition order, sparse local detail and exact source references',()=>{
 const local=Array.from({length:11},(_,i)=>({id:'local'+i,x:i,y:i%3})),points=[...local,...Array.from({length:100000},(_,i)=>({id:'dense'+i,x:14,y:i%7}))];
 for(const data of [points,[...points].reverse()]){const shown=visibleMarkerPoints(data,0,10,1000,.5);for(const p of local)expect(shown).toContain(p);expect(shown.length).toBeLessThan(2500);const indices=shown.map(p=>data.indexOf(p));expect(indices).toEqual([...indices].sort((a,b)=>a-b))}
 const zoom=visibleMarkerPoints(points,3,6,1000);for(let i=3;i<=6;i++)expect(zoom).toContain(local[i]);expect(points).toHaveLength(100011);
});
