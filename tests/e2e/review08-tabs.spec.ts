import {test,expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import path from 'node:path';
import {Workspace} from '../../src/domain/workspace';
import {createProject,addPairs} from '../../src/domain/model';

for(const count of [1,5,10,30,100])test(`08 tabs: ${count} graphs retain commands, selection, search and a single canvas`,async({page})=>{
 const workspace=new Workspace();for(let i=1;i<=count;i++){const p=addPairs(createProject(),[{x:0,y:i},{x:2,y:i+2}],`Series ${i}`);p.project.title=`Scientific measurements ${String(i).padStart(3,'0')}.txt`;workspace.add(p)}
 await page.addInitScript(text=>localStorage.setItem('apio-graph.recovery.v1',JSON.stringify({text,path:null,writtenAt:Date.now()})),workspace.recovery());
 await page.goto('/');await page.getByRole('button',{name:'Восстановить',exact:true}).click();await expect(page.getByRole('tab')).toHaveCount(count);await expect(page.getByTestId('chart')).toHaveCount(1);
 for(const width of [1024,1280,1920]){await page.setViewportSize({width,height:900});for(const name of ['Открыть','Сохранить','Новый проект','Настройки']){const button=page.locator('.app-header').getByRole('button',{name,exact:true});await expect(button).toBeVisible();const box=(await button.boundingBox())!;expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(width)}expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)}
 if(count>1){await page.getByRole('button',{name:'Все открытые графики',exact:true}).click();await page.getByLabel('Найти график',{exact:true}).fill('001');await page.getByRole('option',{name:'Scientific measurements 001.txt',exact:true}).click();await expect(page.getByRole('tab',{name:'Scientific measurements 001.txt',exact:true})).toHaveAttribute('aria-selected','true');await page.keyboard.press('Control+Tab');await expect(page.getByRole('tab',{name:'Scientific measurements 002.txt',exact:true})).toHaveAttribute('aria-selected','true')}
 if(count>=30){await page.setViewportSize({width:1024,height:800});const tabs=page.locator('.tab-list');expect(await tabs.evaluate(el=>el.scrollWidth>el.clientWidth)).toBe(true);const viewport=await page.getByTestId('chart').locator('[data-plot-clip] rect').evaluate(el=>el.getAttribute('width'));await tabs.hover();await page.mouse.wheel(0,400);await expect.poll(()=>tabs.evaluate(el=>el.scrollLeft)).toBeGreaterThan(0);expect(await page.getByTestId('chart').locator('[data-plot-clip] rect').evaluate(el=>el.getAttribute('width'))).toBe(viewport);await expect(page.getByTestId('chart')).toHaveCount(1);if(process.env.APIO_REVIEW08_SHOTS){await mkdir(process.env.APIO_REVIEW08_SHOTS,{recursive:true});await page.screenshot({path:path.join(process.env.APIO_REVIEW08_SHOTS,`tabs-${count}.png`)})}}
});
