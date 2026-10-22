import {test,expect} from '@playwright/test';
import {markerPath} from '../../src/features/chart/ChartScene';
import {markerBatches} from '../../src/features/chart/markerBatches';
import {addPairs,createProject,type Marker} from '../../src/domain/model';
import {createCoordinates} from '../../src/domain/geometry';
test('all six batched SVG glyphs preserve bounds, path lengths and raster coverage',async({page},info)=>{
 const shapes:Marker[]=['circle','square','triangle','diamond','cross','plus'];
 const pixels=Array.from({length:30},(_,i)=>({x:12+i%10*13,y:12+Math.floor(i/10)*18})),ids=pixels.map((_,i)=>String(i));
 const svg=(batch:boolean)=>`<svg xmlns="http://www.w3.org/2000/svg" width="900" height="80">${shapes.map((shape,i)=>`<g transform="translate(${i*150},0)" fill="#ffffff" stroke="#476e98" stroke-width=".9">${batch?markerBatches(pixels,ids,markerPath(shape,3)).map(p=>`<path d="${p.d}"/>`).join(''):pixels.map(p=>`<path d="${markerPath(shape,3)}" transform="translate(${p.x},${p.y})"/>`).join('')}</g>`).join('')}</svg>`;
 await page.goto('/');const error=await page.evaluate(async({a,b})=>{
  const raster=async(svg:string)=>{const img=new Image();img.src='data:image/svg+xml,'+encodeURIComponent(svg);await img.decode();const c=document.createElement('canvas');c.width=900;c.height=80;const ctx=c.getContext('2d')!;ctx.drawImage(img,0,0);return ctx.getImageData(0,0,900,80).data};const first=await raster(a),next=await raster(b);
  // Chromium uses different edge antialiasing for a compound path. Compare the
  // actual shape/coverage, rather than requiring identical edge alpha values.
  let missing=0;for(const [from,to] of [[first,next],[next,first]])for(let y=1;y<79;y++)for(let x=1;x<899;x++){if(from[(y*900+x)*4+3]<64)continue;let found=false;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(to[((y+dy)*900+x+dx)*4+3]>=64)found=true;if(!found)missing++}
  const measure=(text:string)=>{const container=document.createElement('div');container.style.cssText='position:absolute;left:-10000px';container.innerHTML=text;document.body.append(container);const result=[...container.querySelectorAll('g')].map(g=>({box:g.getBBox(),length:[...g.querySelectorAll('path')].reduce((n,p)=>n+p.getTotalLength(),0)}));container.remove();return result};const old=measure(a),batched=measure(b);
  const boundsError=Math.max(...old.flatMap((v,i)=>(['x','y','width','height'] as const).map(k=>Math.abs(v.box[k]-batched[i].box[k])))),lengthError=Math.max(...old.map((v,i)=>Math.abs(v.length-batched[i].length)));
  return{missing,boundsError,lengthError};
 },{a:svg(false),b:svg(true)});
 await info.attach('glyph-comparison.json',{body:JSON.stringify(error),contentType:'application/json'});
 for(const [label,text] of [['individual',svg(false)],['batched',svg(true)]])await info.attach(`${label}.svg`,{body:text,contentType:'image/svg+xml'});
 expect(error.missing).toBe(0);expect(error.boundsError).toBeLessThan(.01);expect(error.lengthError).toBeLessThan(.02);
});
test('dense point-only markers retain exact nearest source selection and reveal original points on zoom',async({page})=>{
 const p=addPairs(createProject(),Array.from({length:100000},(_,i)=>({x:i,y:Math.sin(i/20)})),'observations');p.series[0].mode='points';p.series[0].style.markerVisible=true;p.viewport={xMin:12340,xMax:12360,yMin:-2,yMax:2};p.legend.visible=false;
 await page.goto('/');await page.locator('input[type=file]').setInputFiles({name:'exact.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(p))});const box=(await page.getByTestId('chart').boundingBox())!,c=createCoordinates(p,box.width,box.height),point=p.datasets[0].points[12348];
 await expect(page.locator(`[data-point="${point.id}"]`)).toHaveCount(1);await page.mouse.move(box.x+c.x(point.x),box.y+c.y(point.y));await expect(page.getByRole('tooltip')).toContainText('X 12348');await page.mouse.click(box.x+c.x(point.x),box.y+c.y(point.y));await expect(page.getByLabel('Текущая серия',{exact:true})).toHaveValue(p.series[0].id);await expect(page.getByLabel('Показывать точки',{exact:true})).toBeChecked();
});
