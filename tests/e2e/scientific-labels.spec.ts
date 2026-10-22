import {test,expect} from '@playwright/test';
import {createProject,addPairs} from '../../src/domain/model';

for(const [width,height] of [[1280,800],[900,650],[700,500]])test(`left tools stay outside long negative scientific Y labels at ${width}x${height}`,async({page},info)=>{
 await page.setViewportSize({width,height});
 for(const language of ['ru','en'])for(const theme of ['light','dark']){
  await page.addInitScript(({language,theme})=>localStorage.setItem('apio.settings',JSON.stringify({language,theme,left:true,pinned:true,largeUI:true})),{language,theme});
  await page.goto('/');const p=addPairs(createProject(),[-2,-1,0,1,2].map(x=>({x:x*10,y:x*1e20})),'Scientific measurements');
  p.viewport={xMin:-25,xMax:25,yMin:-2.5e20,yMax:2.5e20};p.axes.y.numberFormat='scientific';p.axes.y.precision=6;p.axes.y.label='Y, A / m²';
  await page.locator('input[type=file]').setInputFiles({name:'scientific-labels.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(p))});
  const tools=page.locator('.tool-wings'),chart=page.getByTestId('chart');await expect(tools).toBeVisible();await expect(chart).toHaveAttribute('data-raw-point-count','5');
  const texts=chart.locator('[data-target="axis:y"] text');await expect(texts.filter({hasText:/-/}).first()).toBeVisible();
  const labels=await texts.allTextContents();expect(labels.some(s=>s.includes('e')||s.includes('×')||s.includes('10'))).toBe(true);
  await expect.poll(async()=>{const t=(await tools.boundingBox())!;for(const text of await texts.all()){const b=(await text.boundingBox())!;if(t.x+t.width>b.x)return false}return true}).toBe(true);
  const axisBefore=(await chart.boundingBox())!;await tools.getByRole('button').first().hover();expect(await chart.boundingBox()).toEqual(axisBefore);
  if(language==='ru'&&theme==='dark')await page.screenshot({path:info.outputPath(`scientific-y-${width}.png`)});
 }
});
