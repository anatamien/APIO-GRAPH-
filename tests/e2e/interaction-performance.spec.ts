import {test,expect,type Page} from '@playwright/test';
import {createProject,addPairs} from '../../src/domain/model';
import {readFile} from 'node:fs/promises';

async function open(page:Page){await page.goto('/');const p=addPairs(createProject(),[{x:2,y:2},{x:8,y:8}],'source');p.legend.visible=false;await page.locator('input[type=file]').setInputFiles({name:'gesture.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(p))});await expect(page.getByTestId('chart')).toBeVisible();return p}
async function save(page:Page){const pending=page.waitForEvent('download');await page.locator('header').getByRole('button',{name:'Сохранить',exact:true}).click();return JSON.parse(await readFile((await(await pending).path())!,'utf8'))}

test('unchanged hover skips the core scene and navigation keeps one wheel subscription',async({page})=>{
 await page.addInitScript(()=>{
  const state={renders:0,wheelAdds:0,wheelRemoves:0};Object.assign(window,{sceneProbe:state});
  type Fiber={type?:{name?:string;type?:{name?:string}};flags:number;child?:Fiber;sibling?:Fiber};
  const renderers=new Map<number,unknown>();
  Object.assign(window,{__REACT_DEVTOOLS_GLOBAL_HOOK__:{supportsFiber:true,renderers,inject:(renderer:unknown)=>{renderers.set(1,renderer);return 1},onCommitFiberUnmount:()=>{},onCommitFiberRoot:(_id:number,root:{current:Fiber})=>{
   const visit=(f:Fiber|undefined)=>{if(!f)return;if((f.type?.name==='ChartScene'||f.type?.type?.name==='ChartScene')&&(f.flags&1))state.renders++;visit(f.child);visit(f.sibling)};visit(root.current);
  }}});
  const add=EventTarget.prototype.addEventListener,remove=EventTarget.prototype.removeEventListener;
  EventTarget.prototype.addEventListener=function(...args:Parameters<typeof add>){if(args[0]==='wheel'&&this instanceof SVGSVGElement)state.wheelAdds++;return add.apply(this,args)};
  EventTarget.prototype.removeEventListener=function(...args:Parameters<typeof remove>){if(args[0]==='wheel'&&this instanceof SVGSVGElement)state.wheelRemoves++;return remove.apply(this,args)};
 });
 await open(page);const b=(await page.getByTestId('chart').boundingBox())!;await page.mouse.move(b.x+b.width*.4,b.y+b.height*.2);await page.waitForTimeout(100);
 const probe=()=>page.evaluate(()=>(window as unknown as {sceneProbe:{renders:number;wheelAdds:number;wheelRemoves:number}}).sceneProbe);
 const before=await probe();expect(before.renders).toBeGreaterThan(0);
 for(let i=0;i<12;i++)await page.mouse.move(b.x+b.width*.4+i,b.y+b.height*.2);
 await page.waitForTimeout(100);expect((await probe()).renders).toBe(before.renders);
 for(let i=0;i<6;i++)await page.mouse.wheel(0,i%2?80:-80);
 await page.waitForTimeout(100);const after=await probe();expect(after.renders).toBeGreaterThan(before.renders);expect(after.wheelAdds).toBe(before.wheelAdds);expect(after.wheelRemoves).toBe(before.wheelRemoves);
});
test('pan commits the actual release coordinates even without a final move event',async({page})=>{
 const p=await open(page),b=(await page.getByTestId('chart').boundingBox())!;
 await page.mouse.move(b.x+400,b.y+200);await page.mouse.down({button:'middle'});await page.mouse.move(b.x+410,b.y+200);
 await page.getByTestId('chart').evaluate((el,{x,y})=>el.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:1,button:1,clientX:x,clientY:y})),{x:b.x+500,y:b.y+200});
 await page.mouse.up({button:'middle'});const changed=await save(page);
 const plot=await page.locator('#plot-clip rect').evaluate(el=>Number(el.getAttribute('width')));
 expect(changed.viewport.xMin).toBeCloseTo(p.viewport.xMin-100/plot*10,6);expect(changed.datasets).toEqual(p.datasets);await expect(page.locator('header').getByRole('button',{name:'Отменить',exact:true})).toBeDisabled();
});
test('captured pan continues beyond the chart boundary and cancellation restores its start',async({page})=>{
 const p=await open(page),b=(await page.getByTestId('chart').boundingBox())!;
 await page.mouse.move(b.x+400,b.y+200);await page.mouse.down({button:'middle'});await page.mouse.move(b.x+430,b.y+200);
 await page.mouse.move(b.x+430,b.y-10);await page.mouse.move(b.x+490,b.y-10);await page.mouse.up({button:'middle'});
 const changed=await save(page);expect(changed.viewport.yMin).not.toBe(p.viewport.yMin);
 const plot=await page.locator('#plot-clip rect').evaluate(el=>Number(el.getAttribute('width')));expect(changed.viewport.xMin).toBeCloseTo(-90/plot*10,6);
 await page.mouse.move(b.x+400,b.y+200);await page.mouse.down({button:'middle'});await page.mouse.move(b.x+500,b.y+220);await page.keyboard.press('Escape');await page.mouse.up({button:'middle'});expect((await save(page)).viewport).toEqual(changed.viewport);
});
test('axis number formatting updates the coordinate margins and series together',async({page})=>{
 await open(page);await page.locator('[data-axis-label="y"]').click();const inspector=page.locator('.inspector');
 const before=await page.locator('#plot-clip rect').getAttribute('x');
 await inspector.getByLabel('Формат чисел',{exact:true}).selectOption('fixed');await inspector.getByLabel('Знаки после запятой',{exact:true}).fill('12');
 await expect.poll(()=>page.locator('#plot-clip rect').getAttribute('x')).not.toBe(before);
});
test('dragging a panel reads its dimensions once instead of on every pointer event',async({page})=>{
 await open(page);await page.locator('header').getByRole('button',{name:'Настройки',exact:true}).click();
 const panel=page.locator('.panel'),header=panel.locator('.panel-header'),b=(await header.boundingBox())!;
 await panel.evaluate(el=>{const target=el as HTMLElement&{sizeReads:number};target.sizeReads=0;const proto=Object.getOwnPropertyDescriptor(HTMLElement.prototype,'offsetWidth')!;Object.defineProperty(el,'offsetWidth',{get(){target.sizeReads++;return proto.get!.call(this)}})});
 await page.mouse.move(b.x+40,b.y+20);await page.mouse.down();
 await header.evaluate((el,{x,y})=>{for(let i=0;i<100;i++)el.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerId:1,buttons:1,clientX:x-i,clientY:y+10}))},{x:b.x+40,y:b.y+20});
 await page.mouse.up();expect(await panel.evaluate(el=>(el as HTMLElement&{sizeReads:number}).sizeReads)).toBeLessThan(8);
});
