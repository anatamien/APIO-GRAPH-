import {enterEditor} from './helpers';
import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import type { ProjectDocument } from '../../src/domain/model';
import {addPairs,createProject} from '../../src/domain/model';

const headerButton = (page: Page, name: string) => page.locator('header').getByRole('button', { name, exact: true });
const analysisPanel = (page: Page) => page.locator('.analysis-panel');
async function importSource(page: Page, text: string) {
  await headerButton(page, 'Импорт данных').click();
  const panel = page.getByRole('dialog', { name: 'Импорт данных', exact: true });
  await panel.getByLabel('Исходный текст', { exact: true }).fill(text);
  await panel.getByRole('button', { name: 'Построить', exact: true }).click();
  await expect(panel).toHaveCount(0);
}
async function openAnalysis(page: Page) {
  const button=headerButton(page,'Математика');await expect(button.locator('svg')).toHaveCount(1);await button.click();
  await expect(analysisPanel(page)).toBeVisible();
  return analysisPanel(page);
}
async function savedFile(page: Page) {
  const pending = page.waitForEvent('download');
  await headerButton(page, 'Сохранить').click();
  const download = await pending;
  const path = await download.path();
  expect(path).toBeTruthy();
  return { path: path!, project: JSON.parse(await readFile(path!, 'utf8')) as ProjectDocument };
}
const saved = async (page: Page) => (await savedFile(page)).project;
const summaryValue = (panel: Locator, label: string) => panel.locator('dt').filter({ hasText: new RegExp(`^${label}$`) }).first().locator('..').locator('dd');
async function calculate(panel: Locator) {
  await panel.getByRole('button', { name: 'Рассчитать', exact: true }).click();
  await expect(panel.getByRole('button', { name: 'Добавить результат', exact: true })).toBeVisible();
}
async function numberField(panel: Locator, name: string, value: number) {
  await panel.getByLabel(name, { exact: true }).fill(String(value));
  await panel.getByLabel(name, { exact: true }).press('Tab');
}

test('large Worker preview transfers copied Float64 coordinates and preserves all source measurements',async({page})=>{
  await page.goto('/');
  const project=addPairs(createProject(),Array.from({length:12001},(_,i)=>({x:i/8,y:3*(i/8)+2})),'large source');
  await page.locator('input[type=file]').setInputFiles({name:'large.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(project))});
  await expect(page.getByTestId('chart')).toHaveAttribute('data-raw-point-count','12001');
  const panel=await openAnalysis(page);await calculate(panel);
  await expect(summaryValue(panel,'a')).toHaveText('3');await expect(summaryValue(panel,'b')).toHaveText('2');
  await panel.getByRole('button',{name:'Добавить результат',exact:true}).click();
  const result=await saved(page);expect(result.datasets[0]).toEqual(project.datasets[0]);
  expect(result.calculations[0].summary).toMatchObject({a:expect.closeTo(3,9),b:expect.closeTo(2,9)});
  expect(result.datasets[0].points.at(-1)).toEqual(project.datasets[0].points.at(-1));
});

test('MTH-T01/15 actual Worker preview and running cancellation create no history entry', async ({ page }) => {
  await page.goto('/');await enterEditor(page);
  await importSource(page, 'X;Y\n0;1\n1;3\n2;5');
  const workerUrls: string[] = [];
  page.on('worker', worker => workerUrls.push(worker.url()));
  const panel = await openAnalysis(page);
  await calculate(panel);
  await expect(summaryValue(panel, 'a')).toHaveText('2');
  await expect(summaryValue(panel, 'b')).toHaveText('1');
  await expect(summaryValue(panel, 'R²')).toHaveText('1');
  expect(workerUrls.some(url => url.includes('analysis.worker'))).toBe(true);
  expect((await saved(page)).calculations).toHaveLength(0);

  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/analysis.worker.ts*', async route => { await gate; await route.continue().catch(() => {}); });
  try {
    await panel.getByLabel('Операция', { exact: true }).selectOption('statistics');
    await panel.getByRole('button', { name: 'Рассчитать', exact: true }).click();
    await expect(panel.getByRole('button', { name: 'Вычисление…', exact: true })).toBeDisabled();
    await panel.getByRole('button', { name: 'Отмена', exact: true }).click();
    await expect(panel.getByRole('button', { name: 'Рассчитать', exact: true })).toBeEnabled();
    await expect(panel.getByRole('button', { name: 'Добавить результат', exact: true })).toHaveCount(0);
  } finally { release(); await page.unroute('**/analysis.worker.ts*'); }
  const cancelled = await saved(page);
  expect(cancelled.calculations).toHaveLength(0);
  expect(cancelled.datasets).toHaveLength(1);
  await panel.getByRole('button', { name: 'Отмена', exact: true }).click();
  await headerButton(page, 'Отменить').click();
  expect((await saved(page)).datasets).toHaveLength(0);
});

test('MTH-T14 source edits mark a fit outdated and Worker recomputation updates it atomically', async ({ page }) => {
  await page.goto('/');await enterEditor(page);
  await importSource(page, 'X;Y\n0;1\n1;3\n2;5');
  let panel = await openAnalysis(page);
  await calculate(panel);
  await panel.getByRole('button', { name: 'Добавить результат', exact: true }).click();
  const before = await saved(page);
  expect(before.calculations).toHaveLength(1);
  expect(before.calculations[0]).toMatchObject({ kind: 'linear-fit', status: 'valid', summary: { a: expect.closeTo(2, 12), b: expect.closeTo(1, 12) }, parameters: { sourceSeriesIds: [before.series[0].id] } });
  expect(typeof before.calculations[0].parameters.calculatedAt).toBe('string');
  const derived = before.datasets.find(d => d.id === before.calculations[0].resultDatasetId)!;
  expect(derived.points).toHaveLength(401);

  await headerButton(page, 'Таблица').click();
  const table = page.getByRole('dialog', { name: 'Таблица данных', exact: true });
  await table.getByLabel('Серия / набор данных', { exact: true }).selectOption(before.series[0].id);
  await table.getByRole('button', { name: 'Y 3: 5', exact: true }).dblclick();
  await table.getByRole('textbox', { name: 'Y 3', exact: true }).fill('9');
  await table.getByRole('textbox', { name: 'Y 3', exact: true }).press('Enter');
  const outdated = await saved(page);
  expect(outdated.calculations[0].status).toBe('outdated');
  expect(outdated.datasets.find(d => d.id === derived.id)!.points).toEqual(derived.points);
  await expect(page.locator(`[data-series="${before.series[1].id}"]`)).toHaveCount(0);

  panel = await openAnalysis(page);
  await panel.getByRole('button', { name: 'Пересчитать', exact: true }).click();
  await expect(panel.getByRole('button', { name: 'Пересчитать', exact: true })).toHaveCount(0);
  const recomputed = await saved(page);
  expect(recomputed.calculations[0].status).toBe('valid');
  expect(recomputed.calculations[0].summary.a).toBeCloseTo(4, 11);
  expect(recomputed.datasets.find(d => d.id === derived.id)!.points.map(p => p.id)).toEqual(derived.points.map(p => p.id));
  await expect(page.locator(`[data-series="${before.series[1].id}"]`)).toHaveCount(1);
  await headerButton(page, 'Отменить').click();
  const undone = await saved(page);
  expect(undone.calculations[0].status).toBe('outdated');
  expect(undone.datasets.find(d => d.id === derived.id)!.points).toEqual(derived.points);
  expect(undone.datasets[0].points[2].y).toBe(9);
});

test('source visibility keeps the calculated preview, result and data intact and persists through export and reopening',async({page})=>{
  await page.goto('/');await enterEditor(page);await importSource(page,'X;Y\n0;1\n1;3\n2;5');const original=await saved(page),sourceId=original.series[0].id;
  let panel=await openAnalysis(page);await calculate(panel);await panel.getByLabel('Показывать исходный график',{exact:true}).uncheck();await expect(page.locator(`[data-series="${sourceId}"]`)).toHaveCount(0);await expect(panel.getByRole('button',{name:'Добавить результат',exact:true})).toBeVisible();await expect(summaryValue(panel,'a')).toHaveText('2');
  await panel.getByRole('button',{name:'Добавить результат',exact:true}).click();const added=await saved(page),resultId=added.series[1].id;expect(added.datasets[0]).toEqual(original.datasets[0]);expect(added.series[0].visible).toBe(false);expect(added.calculations[0].status).toBe('valid');await expect(page.locator(`[data-series="${resultId}"]`)).toHaveCount(1);
  await panel.getByLabel('Показывать исходный график',{exact:true}).check();await expect(page.locator('[data-series]')).toHaveCount(2);await headerButton(page,'Отменить').click();await expect(panel.getByLabel('Показывать исходный график',{exact:true})).not.toBeChecked();await expect(page.locator(`[data-series="${resultId}"]`)).toHaveCount(1);await headerButton(page,'Повторить').click();await expect(panel.getByLabel('Показывать исходный график',{exact:true})).toBeChecked();const shown=await saved(page);expect(shown.datasets).toEqual(added.datasets);expect(shown.calculations).toEqual(added.calculations);
  await panel.getByLabel('Показывать исходный график',{exact:true}).uncheck();const hidden=await savedFile(page);await headerButton(page,'Экспорт').click();await page.getByLabel('Формат',{exact:true}).selectOption('svg');const download=page.waitForEvent('download');await page.getByRole('button',{name:'Сохранить изображение',exact:true}).click();const svg=await readFile((await(await download).path())!,'utf8');expect(svg).not.toContain(`data-series="${sourceId}"`);expect(svg).toContain(`data-series="${resultId}"`);
  await page.locator('input[type=file]').setInputFiles(hidden.path);panel=await openAnalysis(page);await expect(panel.getByLabel('Показывать исходный график',{exact:true})).not.toBeChecked();await expect(page.locator(`[data-series="${resultId}"]`)).toHaveCount(1);
  await headerButton(page,'Настройки').click();await page.getByLabel('Язык',{exact:true}).selectOption('en');await page.getByRole('button',{name:'Close',exact:true}).click();await headerButton(page,'Mathematics').click();await expect(page.getByLabel('Show source graph',{exact:true})).not.toBeChecked();await page.getByLabel('Show source graph',{exact:true}).check();await expect(page.locator('[data-series]')).toHaveCount(2);
});

test('MTH-T06/07 uneven-X SG reproduces a quadratic and rejects an even window before saving', async ({ page }) => {
  await page.goto('/');await enterEditor(page);
  const xs = [0, 0.5, 2, 4, 7, 11, 16];
  await importSource(page, `X;Y\n${xs.map(x => `${x};${3 + 2 * x + x * x}`).join('\n')}`);
  const panel = await openAnalysis(page);
  await panel.getByLabel('Операция', { exact: true }).selectOption('savitzky-golay');
  await numberField(panel, 'Окно наблюдений', 4);
  await numberField(panel, 'Степень полинома', 2);
  await panel.getByRole('button', { name: 'Рассчитать', exact: true }).click();
  await expect(panel.getByRole('alert')).toContainText('нечетным');
  expect((await saved(page)).calculations).toHaveLength(0);
  await numberField(panel, 'Окно наблюдений', 5);
  await calculate(panel);
  await panel.getByRole('button', { name: 'Добавить результат', exact: true }).click();
  const project = await saved(page);
  expect(project.calculations[0].parameters).toMatchObject({ window: 5, degree: 2 });
  expect(project.datasets[1].points).toHaveLength(xs.length);
  project.datasets[1].points.forEach((p, i) => { expect(p.x).toBe(xs[i]); expect(p.y).toBeCloseTo(3 + 2 * xs[i] + xs[i] ** 2, 10); });
});

test('MTH-T09 sorting and duplicate aggregation are explicit and never reorder source rows', async ({ page }) => {
  await page.goto('/');await enterEditor(page);
  await importSource(page, 'X;Y\n2;4\n0;0\n1;1\n1;3');
  const original = await saved(page);
  const panel = await openAnalysis(page);
  // Repeated X observations remain legitimate OLS input until the user changes policy.
  await calculate(panel);
  await expect(summaryValue(panel, 'Число наблюдений')).toHaveText('4');
  await panel.getByLabel('Операция', { exact: true }).selectOption('savitzky-golay');
  await numberField(panel, 'Окно наблюдений', 3);
  await numberField(panel, 'Степень полинома', 2);
  await panel.getByRole('button', { name: 'Рассчитать', exact: true }).click();
  await expect(panel.getByRole('alert')).toContainText('не упорядочены');
  await panel.getByLabel('Сортировать рабочую копию', { exact: true }).check();
  await panel.getByRole('button', { name: 'Рассчитать', exact: true }).click();
  await expect(panel.getByRole('alert')).toContainText('повторяющиеся X');
  await panel.getByLabel('Повторяющиеся X', { exact: true }).selectOption('mean');
  await calculate(panel);
  await panel.getByRole('button', { name: 'Добавить результат', exact: true }).click();
  const project = await saved(page);
  expect(project.datasets[0].points).toEqual(original.datasets[0].points);
  expect(project.calculations[0].parameters).toMatchObject({ sortCopy: true, duplicates: 'mean' });
  expect(project.datasets[1].points.map(p => p.x)).toEqual([0, 1, 2]);
  project.datasets[1].points.forEach((p, i) => expect(p.y).toBeCloseTo([0, 2, 4][i], 10));
});

test('MTH-T10 scalar statistics and bounded integral persist without adding duplicate curves', async ({ page }) => {
  await page.goto('/');await enterEditor(page);
  await importSource(page, 'X;Y\n0;0\n1;2\n2;4');
  const panel = await openAnalysis(page);
  await panel.getByLabel('Операция', { exact: true }).selectOption('statistics');
  await calculate(panel);
  await expect(summaryValue(panel, 'Среднее Y')).toHaveText('2');
  await panel.getByRole('button', { name: 'Добавить результат', exact: true }).click();
  await panel.getByLabel('Операция', { exact: true }).selectOption('integral');
  await panel.getByLabel('Выбор наблюдений', { exact: true }).selectOption('x');
  await panel.getByLabel('X от', { exact: true }).fill('0.25');
  await panel.getByLabel('X до', { exact: true }).fill('1.5');
  await calculate(panel);
  await expect(summaryValue(panel, 'Интеграл')).toHaveText('2.1875');
  await panel.getByRole('button', { name: 'Добавить результат', exact: true }).click();
  const file = await savedFile(page), project = file.project;
  expect(project.datasets).toHaveLength(1);
  expect(project.series).toHaveLength(1);
  expect(project.calculations.map(c => c.resultDatasetId)).toEqual([null, null]);
  expect(project.calculations[0].summary).toMatchObject({ n: 3, meanY: 2, medianY: 2, stdDevY: 2 });
  expect(project.calculations[1].summary.integral).toBeCloseTo(2.1875, 12);
  expect(project.calculations[1].parameters.range).toEqual([0.25, 1.5]);
  await page.locator('input[type=file]').setInputFiles(file.path);
  await openAnalysis(page);
  await expect(analysisPanel(page).locator('details')).toHaveCount(2);
  await analysisPanel(page).locator('summary').filter({ hasText: /^Интеграл/ }).click();
  await expect(analysisPanel(page).locator('details').filter({ hasText: /^Интеграл/ }).locator('dd').first()).toBeVisible();
  expect((await saved(page)).calculations).toEqual(project.calculations);
});

test('MTH editable fit equation adds a Courier New text object', async ({ page }) => {
  await page.goto('/');await enterEditor(page);
  await importSource(page, 'X;Y\n0;1\n1;3\n2;5');
  const panel = await openAnalysis(page);
  await calculate(panel);
  await expect(panel.getByLabel('Уравнение', { exact: true })).toHaveValue('y = 2*x + 1');
  await panel.getByLabel('Уравнение', { exact: true }).fill('y = 2*x + 1  ·  control');
  await panel.getByRole('button', { name: 'Добавить уравнение на график', exact: true }).click();
  const project = await saved(page);
  expect(project.objects).toHaveLength(1);
  expect(project.objects[0]).toMatchObject({ type: 'text', style: { fontFamily: 'Courier New' }, text: [{ text: 'y = 2*x + 1  ·  control', baseline: 'normal' }] });
  expect(project.calculations).toHaveLength(0);
});
