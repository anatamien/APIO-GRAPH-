import {enterEditor} from './helpers';
import { test, expect } from '@playwright/test';
test('IMP-T08 PRJ-T01 EXP-T01 import, save, reopen, SVG and PNG',async({page})=>{
  await page.goto('/');await enterEditor(page);
  await page.locator('header').getByRole('button',{name:'Импорт данных',exact:true}).click();
  await page.getByLabel('Исходный текст').fill('X;Y\n0;1\n1;3\n2;5');
  await page.getByRole('button',{name:'Построить',exact:true}).click();
  await expect(page.locator('[data-series]')).toHaveCount(1);
  const download=page.waitForEvent('download');await page.getByRole('button',{name:'Сохранить',exact:true}).click();
  const file=await download;expect(file.suggestedFilename()).toMatch(/\.aph$/);const path=await file.path();expect(path).toBeTruthy();
  await page.locator('input[type=file]').setInputFiles(path!);
  await expect(page.locator('[data-series]')).toHaveCount(1);
  await page.getByRole('button',{name:'Экспорт',exact:true}).click();
  await page.getByLabel('Формат').selectOption('svg');
  const svg=page.waitForEvent('download');await page.getByRole('button',{name:'Сохранить изображение'}).click();expect((await svg).suggestedFilename()).toMatch(/\.svg$/);
  await page.getByLabel('Формат').selectOption('png');
  const png=page.waitForEvent('download');await page.getByRole('button',{name:'Сохранить изображение'}).click();expect((await png).suggestedFilename()).toMatch(/\.png$/);
});
