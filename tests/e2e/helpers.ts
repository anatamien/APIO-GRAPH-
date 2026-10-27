import {expect,type Page} from '@playwright/test';
export async function enterEditor(page:Page){
 await page.getByRole('button',{name:'Новый проект',exact:true}).click();
 await page.getByRole('button',{name:'Вручную',exact:true}).click();
 await page.getByRole('dialog',{name:'Таблица данных',exact:true}).getByRole('button',{name:'Закрыть',exact:true}).click();
 await expect(page.getByTestId('chart')).toBeVisible();
}

export async function selectSeries(page:Page,id:string){
 await page.locator('header').getByRole('button',{name:'Свойства графика',exact:true}).click();
 const selector=page.getByLabel('Текущая серия',{exact:true});if(await selector.count())await selector.selectOption(id);
 const markers=page.locator('.marker-settings');if(await markers.count()&&!await markers.evaluate(e=>e.hasAttribute('open')))await markers.locator(':scope > summary').click();
}

export async function workspaceRecoveryPresent(page:Page){return page.evaluate(()=>new Promise<boolean>((resolve,reject)=>{const open=indexedDB.open('apio-workspace-recovery',1);open.onupgradeneeded=()=>open.result.createObjectStore('recovery');open.onerror=()=>reject(open.error);open.onsuccess=()=>{const db=open.result,q=db.transaction('recovery').objectStore('recovery').get('current');q.onsuccess=()=>{resolve(!!q.result);db.close()};q.onerror=()=>{db.close();reject(q.error)}}}))}
