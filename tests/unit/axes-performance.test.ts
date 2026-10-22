import {it,expect} from 'vitest';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createProject} from '../../src/domain/model';
import {createCoordinates,axisTicks} from '../../src/domain/geometry';
import {ChartScene} from '../../src/features/chart/ChartScene';
it('shares coordinate preparation and invalidates changes to formatting, ranges and size',()=>{
 const p=createProject(),c=createCoordinates(p,1200,800);expect(createCoordinates(p,1200,800)).toBe(c);
 const changed={...p,axes:{...p.axes,y:{...p.axes.y,numberFormat:'fixed' as const,precision:12}}};expect(createCoordinates(changed,1200,800).left).toBeGreaterThan(c.left);expect(createCoordinates(p,1000,800).right).not.toBe(c.right);
 expect(createCoordinates({...p,viewport:{...p.viewport,xMax:20}},1200,800).x(10)).not.toBe(c.x(10));
});
it('bounds screen grid DOM without changing manual steps or the complete exact export',()=>{
 const p=createProject();p.axes.x={...p.axes.x,tickMode:'manual',tickStep:.001,minorDivisions:20};
 const html=renderToStaticMarkup(createElement(ChartScene,{p,width:1200,height:800,screen:true}));expect((html.match(/<(?:path|line|text)\b/g)??[]).length).toBeLessThan(1000);
 expect(p.axes.x.tickStep).toBe(.001);expect(axisTicks(p.axes.x,0,10)).toHaveLength(10001);
});
