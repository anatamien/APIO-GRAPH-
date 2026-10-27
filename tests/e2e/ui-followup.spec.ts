import {downloadedGraph} from './projectDownload';
import {test,expect,type Page} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {addPairs,createProject,makeObject,type ProjectDocument} from '../../src/domain/model';
async function open(page:Page,p=addPairs(createProject(),[{x:2,y:2},{x:6,y:6}],'Source')){p.series=p.series.map(s=>({...s,mode:'line-points',style:{...s.style,markerVisible:true}}));p.legend.visible=false;await page.goto('/');await page.locator('input[type=file]').setInputFiles({name:'followup.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(p))});await expect(page.getByTestId('chart')).toBeVisible();return p}
async function save(page:Page):Promise<ProjectDocument>{const pending=page.waitForEvent('download');await page.locator('header').getByRole('button',{name:'Сохранить',exact:true}).click();return await downloadedGraph(await readFile((await(await pending).path())!))}
test('launch has no editor chrome; header plus starts data input in the editor and the bottom bar stays absent',async({page})=>{
 await page.goto('/');await expect(page.locator('.welcome-screen')).toBeVisible();await expect(page.locator('.app-header')).toHaveCount(0);await expect(page.getByTestId('chart')).toHaveCount(0);await expect(page.locator('footer')).toHaveCount(0);
 await open(page);await expect(page.locator('.brand')).toHaveCount(0);await expect(page.locator('header').getByRole('button',{name:'Найти команду',exact:true})).toHaveCount(0);await expect(page.locator('.file-menu-button')).toHaveCount(0);await expect(page.locator('.canvas-hint')).toHaveCount(0);
 await page.locator('header').getByRole('button',{name:'Новый проект',exact:true}).click();await expect(page.getByTestId('chart')).toBeVisible();await expect(page.locator('.app-header')).toBeVisible();await expect(page.locator('.welcome-screen')).toHaveCount(0);await expect(page.getByRole('radio',{name:'Новый график (отдельная вкладка)',exact:true})).toBeChecked();
});
test('unchanged fields, blur and selecting the existing series mode create no history entries',async({page})=>{
 const p=await open(page),point=page.locator('[data-point]').first();await point.click();const panel=page.locator('.inspector'),field=panel.getByLabel('Толщина, pt',{exact:true});
 for(let i=0;i<5;i++){await field.focus();await field.press('Tab')}
 await panel.getByRole('radio',{name:'Оба',exact:true}).click();await panel.getByLabel('Видимость',{exact:true}).check();
 expect((await save(page)).series).toEqual(p.series);await page.locator('header').getByRole('button',{name:'История',exact:true}).click();await expect(page.locator('.history-list button')).toHaveCount(1);await expect(page.locator('header').getByRole('button',{name:'Отменить',exact:true})).toBeDisabled();
});
test('font size arrows apply immediately while focus remains in the input',async({page})=>{
 const p=createProject(),o=makeObject('text',[{mode:'page',pageX:.3,pageY:.4}],'Size check');p.objects=[o];await open(page,p);await page.locator('[data-object] text').click();const size=page.getByLabel('Размер текста, pt',{exact:true});await size.focus();await size.press('ArrowUp');await expect(size).toBeFocused();await expect(size).toHaveValue(String(o.style.fontSizePt+1));await expect(page.locator('[data-object] text')).toHaveAttribute('font-size',String((o.style.fontSizePt+1)*4/3));await size.press('ArrowDown');await expect(page.locator('[data-object] text')).toHaveAttribute('font-size',String(o.style.fontSizePt*4/3));
});
test('larger interface keeps circular colors and exposes all tools without a scrollbar at 1024×768',async({page})=>{
 await page.setViewportSize({width:1024,height:768});await open(page);await page.locator('header').getByRole('button',{name:'Настройки',exact:true}).click();await page.getByLabel('Увеличенный интерфейс',{exact:true}).check();
 for(const swatch of await page.locator('.color-picker .swatches').first().getByRole('button').all()){const b=(await swatch.boundingBox())!;expect(b.width).toBe(b.height);expect(b.height).toBeLessThanOrEqual(24)}
 await page.getByRole('button',{name:'Закрыть',exact:true}).click();const toolbar=page.getByRole('toolbar');await toolbar.locator('.tool-trigger').focus();await page.keyboard.press('Enter');await expect(toolbar).toHaveClass(/expanded/);await expect(toolbar.getByRole('button',{name:'Другие инструменты',exact:true})).toBeVisible();
 for(const element of await page.locator('.toolbar,.tool-items,.tool-reveal').all()){const overflow=await element.evaluate(e=>({x:getComputedStyle(e).overflowX,y:getComputedStyle(e).overflowY,scroll:e.scrollWidth,client:e.clientWidth}));expect(['auto','scroll']).not.toContain(overflow.x);expect(['auto','scroll']).not.toContain(overflow.y)}
 await page.screenshot({path:'test-results/followup-large-tools.png'});
});
test('F9 fits all measurements with margins and leaves the project history and numerical data intact',async({page})=>{
 const p=addPairs(createProject(),[{x:-200,y:-50},{x:1000,y:300},{x:40,y:170}],'Wide range');await open(page,p);await page.keyboard.press('F9');
 const clip=await page.getByTestId('chart').locator('clipPath rect').evaluate(e=>({x:Number(e.getAttribute('x')),y:Number(e.getAttribute('y')),w:Number(e.getAttribute('width')),h:Number(e.getAttribute('height'))}));
 for(const point of await page.locator('[data-point]').all()){const pos=await point.evaluate(e=>{const m=(e as SVGGraphicsElement).transform.baseVal.consolidate()!.matrix;return{x:m.e,y:m.f}});expect(pos.x).toBeGreaterThan(clip.x);expect(pos.x).toBeLessThan(clip.x+clip.w);expect(pos.y).toBeGreaterThan(clip.y);expect(pos.y).toBeLessThan(clip.y+clip.h)}
 const after=await save(page);expect(after.datasets).toEqual(p.datasets);expect(after.viewport).not.toEqual(p.viewport);await expect(page.locator('header').getByRole('button',{name:'Отменить',exact:true})).toBeDisabled();
});
test('Shift draws segments, arrows and infinite lines exactly horizontally or vertically',async({page})=>{
 await open(page);for(const type of ['segment','arrow','line'])for(const vertical of [false,true]){
  if(type==='line'){await page.getByRole('toolbar').hover();await page.getByRole('toolbar').getByRole('button',{name:'Прямая',exact:true}).click()}else await page.keyboard.press(type==='segment'?'l':'a');
  const b=(await page.getByTestId('chart').boundingBox())!,start={x:b.x+250,y:b.y+240},end={x:start.x+(vertical?20:170),y:start.y+(vertical?160:20)};
  await page.keyboard.down('Shift');await page.mouse.move(start.x,start.y);await page.mouse.down();await page.mouse.move(end.x,end.y,{steps:6});await page.mouse.up();await page.keyboard.up('Shift');
  const object=(await save(page)).objects.at(-1)!;expect(object.type).toBe(type);if(type==='line'){expect(vertical?object.geometry.directionX:object.geometry.directionY).toBe(0)}else{const [a,b]=object.anchors;if(a.mode!=='data'||b.mode!=='data')throw new Error('Expected unsnapped data coordinates');expect(vertical?a.x:a.y).toBeCloseTo(vertical?b.x:b.y,12)}
 }
});
