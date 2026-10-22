import {test,expect} from '@playwright/test';
import {addPairs,createProject} from '../../src/domain/model';

test('tool opening starts on hover and reveals one surface without stretching icons',async({page})=>{
 await page.goto('/');const p=addPairs(createProject(),[{x:0,y:0},{x:10,y:10}],'source');await page.locator('input[type=file]').setInputFiles({name:'tools.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(p))});
 const toolbar=page.getByRole('toolbar'),started=await toolbar.evaluate(async el=>{el.dispatchEvent(new PointerEvent('pointerover',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);return el.classList.contains('expanded')});expect(started).toBe(true);
 const wing=toolbar.locator('.tool-wings');await expect(wing).not.toHaveCSS('background-color','rgba(0, 0, 0, 0)');
 for(const items of await toolbar.locator('.tool-items').all())await expect(items).toHaveCSS('background-color','rgba(0, 0, 0, 0)');
 const widths=await toolbar.locator('.tool-items button').evaluateAll(buttons=>buttons.map(b=>b.getBoundingClientRect().width));for(const width of widths)expect(width).toBeCloseTo(36,3);
 await expect(toolbar.locator('.tool-items').first()).toHaveCSS('transform','matrix(1, 0, 0, 1, 0, 0)');
 await toolbar.evaluate(el=>el.dispatchEvent(new PointerEvent('pointerout',{bubbles:true,relatedTarget:document.body})));await page.waitForTimeout(80);await toolbar.evaluate(el=>el.dispatchEvent(new PointerEvent('pointerover',{bubbles:true})));await page.waitForTimeout(250);await expect(toolbar).toHaveClass(/expanded/);
});

test('the single tool surface opens vertically in a short window and honors reduced motion',async({page})=>{
 await page.setViewportSize({width:1024,height:640});await page.goto('/');const p=addPairs(createProject(),[{x:0,y:0},{x:10,y:10}],'source');await page.locator('input[type=file]').setInputFiles({name:'vertical.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(p))});
 await page.locator('header').getByRole('button',{name:'Настройки',exact:true}).click();await page.getByLabel('Панель слева',{exact:true}).check();await page.getByRole('button',{name:'Закрыть',exact:true}).click();
 const toolbar=page.getByRole('toolbar');await toolbar.locator('.tool-trigger').hover();await expect(toolbar).toHaveClass(/expanded/);await expect(toolbar.locator('.tool-items').first()).toHaveCSS('transform','matrix(1, 0, 0, 1, 0, 0)');
 const first=(await toolbar.locator('.tool-wing-before').boundingBox())!,last=(await toolbar.locator('.tool-wing-after').boundingBox())!;expect(first.y+first.height).toBeCloseTo(last.y,1);expect(first.y).toBeGreaterThan(0);expect(last.y+last.height).toBeLessThan(640);
 await page.emulateMedia({reducedMotion:'reduce'});await expect(toolbar.locator('.tool-wings')).toHaveCSS('transition-duration','0s');await expect(toolbar.locator('.tool-items').first()).toHaveCSS('transition-duration','0s');
 await page.screenshot({path:'test-results/toolbar-vertical-surface.png'});
});
