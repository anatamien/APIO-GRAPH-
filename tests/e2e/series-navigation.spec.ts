import {test,expect,type Page} from '@playwright/test';
import {addPairs,createProject} from '../../src/domain/model';
import {createCoordinates} from '../../src/domain/geometry';
import {readFile} from 'node:fs/promises';

async function save(page:Page){const pending=page.waitForEvent('download');await page.locator('header').getByRole('button',{name:'Сохранить',exact:true}).click();return JSON.parse(await readFile((await(await pending).path())!,'utf8'))}

test('panning translates prepared series without rebuilding their paths or markers',async({page})=>{
 await page.goto('/');const p=addPairs(createProject(),Array.from({length:1000},(_,i)=>({x:i,y:Math.sin(i/20)})),'source');p.viewport={xMin:400,xMax:410,yMin:-2,yMax:2};p.legend.visible=false;p.series[0].mode='line-points';p.series[0].style.markerVisible=true;
 await page.locator('input[type=file]').setInputFiles({name:'pan.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(p))});
 const chart=page.getByTestId('chart'),series=page.locator('[data-series]').first();await expect(series).toBeVisible();
 const box=(await chart.boundingBox())!;await page.mouse.move(box.x+600,box.y+300);await page.mouse.down({button:'middle'});
 await page.mouse.move(box.x+590,box.y+305);await page.waitForTimeout(40);
 await series.evaluate(el=>{const state={geometry:0};Object.assign(window,{panProbe:state});new MutationObserver(records=>{state.geometry+=records.filter(r=>r.type==='childList'||['d','transform'].includes(r.attributeName??'')).length}).observe(el,{subtree:true,childList:true,attributes:true})});
 for(let i=1;i<=10;i++)await page.mouse.move(box.x+590-i*25,box.y+305+i);
 await page.waitForTimeout(40);expect(await page.evaluate(()=>(window as unknown as {panProbe:{geometry:number}}).panProbe.geometry)).toBe(0);
 // Newly exposed data were outside the original viewport but must already exist in the prepared margin.
 const marker=page.locator(`[data-series] [data-point="${p.datasets[0].points[411].id}"]`);await expect(marker).toHaveCount(1);
 const before=await marker.evaluate(el=>{const pt=new DOMPoint().matrixTransform((el as SVGGraphicsElement).getScreenCTM()!);return{x:pt.x,y:pt.y}});
 await page.mouse.up({button:'middle'});await page.waitForTimeout(50);
 const after=await marker.evaluate(el=>{const pt=new DOMPoint().matrixTransform((el as SVGGraphicsElement).getScreenCTM()!);return{x:pt.x,y:pt.y}});
 expect(after.x).toBeCloseTo(before.x,5);expect(after.y).toBeCloseTo(before.y,5);
});

test('large pans reprepare coverage and zoom and fit still align markers with the exact saved view',async({page})=>{
 await page.goto('/');const p=addPairs(createProject(),Array.from({length:1000},(_,i)=>({x:i,y:Math.sin(i/20)})),'source');p.viewport={xMin:400,xMax:410,yMin:-2,yMax:2};p.legend.visible=false;p.series[0].mode='line-points';p.series[0].style.markerVisible=true;
 await page.locator('input[type=file]').setInputFiles({name:'coverage.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(p))});
 const chart=page.getByTestId('chart'),box=(await chart.boundingBox())!;
 await page.mouse.move(box.x+900,box.y+300);await page.mouse.down({button:'middle'});await page.mouse.move(box.x+100,box.y+330);await page.mouse.move(box.x+100,box.y+330);await page.mouse.up({button:'middle'});
 // Chromium's screen CTM uses float precision; require sub-thousandth-pixel alignment.
 const check=async(index:number)=>{const actual=await save(page);expect(actual.datasets).toEqual(p.datasets);const c=createCoordinates(actual,box.width,box.height),point=p.datasets[0].points[index],marker=page.locator(`[data-series] [data-point="${point.id}"],[data-series] [data-marker-ids~="${point.id}"]`);await expect(marker).toHaveCount(1);const position=await marker.evaluate((el,id)=>{let origin=new DOMPoint();const ids=el.getAttribute('data-marker-ids');if(ids){const i=ids.split(' ').indexOf(id),moves=[...(el.getAttribute('d')??'').matchAll(/M([^m]+)m/g)],xy=moves[i][1].split(',').map(Number);origin=new DOMPoint(xy[0],xy[1])}const pixel=origin.matrixTransform((el as SVGGraphicsElement).getScreenCTM()!);return{x:pixel.x,y:pixel.y}},point.id);expect(Math.abs(position.x-box.x-c.x(point.x))).toBeLessThan(.001);expect(Math.abs(position.y-box.y-c.y(point.y))).toBeLessThan(.001);return position};
 let position=await check(408);await page.mouse.move(position.x,position.y);await page.mouse.wheel(0,-240);await page.waitForTimeout(50);position=await check(408);
 await page.mouse.move(position.x,position.y);await expect(page.getByRole('tooltip')).toContainText('X 408');
 await page.keyboard.press('F9');await page.waitForTimeout(50);await check(408);
});
