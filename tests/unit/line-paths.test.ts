import {it,expect} from 'vitest';
import {screenLinePaths} from '../../src/features/chart/linePaths';
import {createCoordinates} from '../../src/domain/geometry';
import {createProject} from '../../src/domain/model';
it('projects each point once and preserves the same path and dash phase for prepared pixels',()=>{
 const p=createProject(),c=createCoordinates(p,1200,800),points=Array.from({length:1000},(_,i)=>({x:i/100,y:Math.sin(i)}));let calls=0;
 const coordinate={...c,x:Object.assign((value:number)=>{calls++;return c.x(value)},{invert:c.x.invert}),y:Object.assign((value:number)=>{calls++;return c.y(value)},{invert:c.y.invert})};
 const result=screenLinePaths(points,coordinate);expect(calls).toBe(points.length*2);expect(result).toEqual(screenLinePaths(points.map(pt=>({x:c.x(pt.x),y:c.y(pt.y)}))));
});
it('splits a dense trace without sorting, dropping extrema or disconnecting its stroke',()=>{
 const p=createProject(),c=createCoordinates(p,1200,800),points=Array.from({length:500},(_,i)=>({id:String(i),x:i%13,y:i===271?9:i%7}));
 const paths=screenLinePaths(points,c);expect(paths.length).toBeGreaterThan(1);
 const pair=(d:string)=>d.slice(1).split('L').map(v=>v.split(',').map(Number));
 const decoded=paths.flatMap((path,i)=>pair(path.d).slice(i?2:0));expect(decoded).toHaveLength(500);
 for(let i=0;i<500;i++){expect(decoded[i][0]).toBeCloseTo(c.x(points[i].x),7);expect(decoded[i][1]).toBeCloseTo(c.y(points[i].y),7)}
 for(let i=1;i<paths.length;i++)expect(pair(paths[i].d).slice(0,2)).toEqual(pair(paths[i-1].d).slice(-2));
 expect(paths[0].offset).toBe(0);expect(paths[1].offset).toBeLessThan(0);
});
