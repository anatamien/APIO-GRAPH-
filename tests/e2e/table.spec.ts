import {downloadedGraph} from './projectDownload';
import {enterEditor} from './helpers';
import { readFile } from 'node:fs/promises'
import { expect, test, type Locator, type Page } from '@playwright/test'
import type { ProjectDocument } from '../../src/domain/model'
import { makeObject } from '../../src/domain/model'

const headerButton = (page: Page, name: string) => page.locator('header').getByRole('button', { name, exact: true })
const dataPanel = (page: Page) => page.getByRole('dialog', { name: 'Таблица данных', exact: true })
const importPanel = (page: Page) => page.getByRole('dialog', { name: 'Импорт данных', exact: true })

async function openImport(page: Page, text: string) {
  await headerButton(page, 'Импорт данных').click()
  await importPanel(page).getByLabel('Исходный текст', { exact: true }).fill(text)
  return importPanel(page)
}

async function importSource(page: Page, text: string) {
  const panel = await openImport(page, text)
  await panel.getByRole('button', { name: 'Построить', exact: true }).click()
  await expect(panel).toHaveCount(0)
}

async function savedProject(page: Page): Promise<ProjectDocument> {
  const pending = page.waitForEvent('download')
  await headerButton(page, 'Сохранить').click()
  const download = await pending
  const path = await download.path()
  expect(path).toBeTruthy()
  return await downloadedGraph(await readFile(path!)) as ProjectDocument
}

async function pasteRange(target: Locator, text: string) {
  await target.evaluate((element, value) => {
    const data = new DataTransfer()
    data.setData('text/plain', value)
    element.dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true }))
  }, text)
}

test('manual entry edits finite values and Escape cancels an invalid draft', async ({ page }) => {
  await page.goto('/');await enterEditor(page);
  await headerButton(page, 'Таблица').click()
  const panel = dataPanel(page)
  await panel.getByRole('button', { name: 'Добавить строку', exact: true }).click()
  await expect(panel.locator('[data-point-id]')).toHaveCount(0)
  await panel.getByRole('textbox',{name:'Новая точка X',exact:true}).fill('0')
  await panel.getByRole('textbox',{name:'Новая точка Y',exact:true}).fill('0')
  await panel.getByRole('button',{name:'Добавить точку',exact:true}).click()
  await expect(panel.locator('[data-point-id]')).toHaveCount(1)
  const originalId = await panel.locator('[data-point-id]').getAttribute('data-point-id')
  await panel.getByRole('button', { name: 'X 1: 0', exact: true }).dblclick()
  await panel.getByRole('textbox', { name: 'X 1', exact: true }).fill('-2.5e1')
  await panel.getByRole('textbox', { name: 'X 1', exact: true }).press('Enter')
  await expect(panel.getByRole('button', { name: 'X 1: -25', exact: true })).toBeVisible()
  await panel.getByRole('button', { name: 'Y 1: 0', exact: true }).press('F2')
  await panel.getByRole('textbox', { name: 'Y 1', exact: true }).fill('not a number')
  await panel.getByRole('textbox', { name: 'Y 1', exact: true }).press('Enter')
  await expect(panel.getByRole('alert')).toHaveText('Недопустимое число')
  await panel.getByRole('textbox', { name: 'Y 1', exact: true }).press('Escape')
  await expect(panel.getByRole('button', { name: 'Y 1: 0', exact: true })).toBeVisible()
  const saved = await savedProject(page)
  expect(saved.datasets[0].source.kind).toBe('manual')
  expect(saved.datasets[0].points).toEqual([{ id: originalId, x: -25, y: 0 }])
})

test('duplicate and sort retain original point IDs and undo restores the source order', async ({ page }) => {
  await page.goto('/');await enterEditor(page);
  await importSource(page, 'X;Y\n2;30\n1;10\n3;20')
  await headerButton(page, 'Таблица').click()
  const panel = dataPanel(page)
  const originalIds = await panel.locator('[data-point-id]').evaluateAll(rows => rows.map(row => row.getAttribute('data-point-id')))
  await panel.getByRole('button', { name: 'Выбрать строку 1', exact: true }).click()
  await panel.getByRole('button', { name: 'Дублировать строку', exact: true }).click()
  const duplicated = await savedProject(page)
  expect(duplicated.datasets[0].points.map(point => [point.x, point.y])).toEqual([[2, 30], [2, 30], [1, 10], [3, 20]])
  const duplicateId = duplicated.datasets[0].points[1].id
  expect(originalIds).not.toContain(duplicateId)
  expect(duplicated.datasets[0].points.filter(point => originalIds.includes(point.id))).toHaveLength(3)
  page.once('dialog',dialog=>dialog.accept())
  await panel.getByRole('button', { name: 'Сортировать по Y', exact: true }).click()
  const sorted = await savedProject(page)
  expect(sorted.datasets[0].points.map(point => point.y)).toEqual([10, 20, 30, 30])
  expect(new Set(sorted.datasets[0].points.map(point => point.id))).toEqual(new Set([...originalIds, duplicateId]))
  await headerButton(page, 'Отменить').click()
  const restored = await savedProject(page)
  expect(restored.datasets[0].points).toEqual(duplicated.datasets[0].points)
})

test('range paste updates the selected column and appends full pairs with one undo step', async ({ page }) => {
  await page.goto('/');await enterEditor(page);
  await importSource(page, 'X;Y\n0;1\n1;2\n2;3')
  await headerButton(page, 'Таблица').click()
  const panel = dataPanel(page)
  const before = await savedProject(page)
  const y = panel.getByRole('button', { name: 'Y 2: 2', exact: true })
  await y.click()
  await pasteRange(y, '20\n30')
  let preview = panel.getByRole('dialog', { name: 'Предпросмотр вставки', exact: true })
  await expect(preview.getByLabel('Начать со строки', { exact: true })).toHaveValue('2')
  await expect(preview.getByLabel('Начать со столбца', { exact: true })).toHaveValue('y')
  await preview.getByRole('button', { name: 'Применить диапазон', exact: true }).click()
  const singleColumn = await savedProject(page)
  expect(singleColumn.datasets[0].points.map(point => [point.x, point.y])).toEqual([[0, 1], [1, 20], [2, 30]])
  expect(singleColumn.datasets[0].points.map(point => point.id)).toEqual(before.datasets[0].points.map(point => point.id))
  const x = panel.getByRole('button', { name: 'X 3: 2', exact: true })
  await x.click()
  await pasteRange(x, '200\t300\n400\t500')
  preview = panel.getByRole('dialog', { name: 'Предпросмотр вставки', exact: true })
  await expect(importPanel(page)).toHaveCount(0)
  await preview.getByRole('button', { name: 'Применить диапазон', exact: true }).click()
  const twoColumns = await savedProject(page)
  expect(twoColumns.datasets).toHaveLength(1)
  expect(twoColumns.datasets[0].points.map(point => [point.x, point.y])).toEqual([[0, 1], [1, 20], [200, 300], [400, 500]])
  expect(twoColumns.datasets[0].points.slice(0, 3).map(point => point.id)).toEqual(before.datasets[0].points.map(point => point.id))
  expect(before.datasets[0].points.map(point => point.id)).not.toContain(twoColumns.datasets[0].points[3].id)
  await headerButton(page, 'Отменить').click()
  expect((await savedProject(page)).datasets[0].points).toEqual(singleColumn.datasets[0].points)
})

test('multiple Y mappings and swapping X/Y create the selected coordinate pairs', async ({ page }) => {
  await page.goto('/');await enterEditor(page);
  const panel = await openImport(page, 'Time;A;B\n0;1;10\n1;2;20')
  await panel.getByRole('button', { name: 'Добавить серию', exact: true }).click()
  await expect(panel.getByLabel('Столбец Y 2', { exact: true })).toHaveValue('2')
  await panel.getByRole('button', { name: 'Поменять X/Y 1', exact: true }).click()
  await panel.getByRole('button', { name: 'Построить', exact: true }).click()
  await expect(page.locator('[data-series]')).toHaveCount(2)
  const saved = await savedProject(page)
  expect(saved.datasets.map(dataset => dataset.points.map(point => [point.x, point.y]))).toEqual([[[1, 0], [2, 1]], [[0, 10], [1, 20]]])
  expect(saved.series.map(series => series.name)).toEqual(['Time', 'B'])
  expect(saved.axes.x.label).toBe('A')
  expect(saved.axes.y.label).toBe('')
})

test('ambiguous imports require a separator choice before committing', async ({ page }) => {
  await page.goto('/');await enterEditor(page);
  const panel = await openImport(page, '1,25')
  const build = panel.getByRole('button', { name: 'Построить', exact: true })
  await expect(build).toBeDisabled()
  await expect(panel.getByRole('alert')).toContainText('Выберите разделитель')
  await panel.getByLabel('Разделитель', { exact: true }).selectOption(',')
  await panel.getByLabel('Десятичный символ', { exact: true }).selectOption('.')
  await expect(build).toBeEnabled()
  await build.click()
  expect((await savedProject(page)).datasets[0].points.map(point => [point.x, point.y])).toEqual([[1, 25]])
})

test('invalid rows require skip consent and an entire import is one undo step', async ({ page }) => {
  await page.goto('/');await enterEditor(page);
  const panel = await openImport(page, 'X;Y\n0;1\n1;broken\n2;3')
  const build = panel.getByRole('button', { name: 'Построить', exact: true })
  await expect(build).toBeDisabled()
  const badRow = panel.getByRole('table', { name: 'Предпросмотр данных', exact: true }).locator('tr').filter({ hasText: 'broken' })
  await expect(badRow.getByRole('rowheader')).toHaveText('3')
  await panel.getByLabel('Пропустить ошибочные строки (1)', { exact: true }).check()
  await expect(build).toBeEnabled()
  await build.click()
  expect((await savedProject(page)).datasets[0].points.map(point => [point.x, point.y])).toEqual([[0, 1], [2, 3]])
  await headerButton(page, 'Отменить').click()
  await expect(page.locator('[data-series]')).toHaveCount(0)
})

test('append imports preserve existing axes and dataset identities', async ({ page }) => {
  await page.goto('/');await enterEditor(page);
  await importSource(page, 'X;Y\n0;1\n1;2')
  const before = await savedProject(page)
  const panel = await openImport(page, 'NewX;NewY\n1000;2000\n1001;2001')
  await expect(panel.getByRole('radio', { name: 'Новый график (отдельная вкладка)', exact: true })).toBeChecked()
  await panel.getByRole('radio', { name: 'Добавить в текущий график', exact: true }).check()
  await panel.getByRole('button', { name: 'Построить', exact: true }).click()
  const saved = await savedProject(page)
  expect(saved.datasets).toHaveLength(2)
  expect(saved.datasets[0]).toEqual(before.datasets[0])
  expect(saved.axes).toEqual(before.axes)
  expect(saved.viewport).toEqual(before.viewport)
})

test('paste preview rejects partial new points and requires consent for invalid rows', async ({ page }) => {
  await page.goto('/');await enterEditor(page);
  await importSource(page, 'X;Y\n0;1\n1;2')
  await headerButton(page, 'Таблица').click()
  const panel = dataPanel(page)
  const y = panel.getByRole('button', { name: 'Y 2: 2', exact: true })
  await y.click()
  await pasteRange(y, '20\n30')
  const preview = panel.getByRole('dialog', { name: 'Предпросмотр вставки', exact: true })
  await expect(preview.getByRole('alert')).toHaveText('Для новых строк укажите обе координаты X и Y.')
  await expect(preview.getByRole('button', { name: 'Применить диапазон', exact: true })).toBeDisabled()
  await preview.getByLabel('Исходный текст', { exact: true }).fill('10;20\n11;bad\n12;22')
  await preview.getByLabel('Начать со столбца', { exact: true }).selectOption('x')
  await expect(preview.getByRole('button', { name: 'Применить диапазон', exact: true })).toBeDisabled()
  await preview.getByLabel('Пропустить ошибочные строки (1)', { exact: true }).check()
  await preview.getByRole('button', { name: 'Применить диапазон', exact: true }).click()
  expect((await savedProject(page)).datasets[0].points.map(point => [point.x, point.y])).toEqual([[0, 1], [10, 20], [12, 22]])
})

test('linked point deletion can be canceled or detach its annotation at the edited coordinates', async ({ page }) => {
  await page.goto('/');await enterEditor(page);
  await importSource(page, 'X;Y\n0;1\n1;2')
  const source = await savedProject(page)
  const point = source.datasets[0].points[0]
  source.objects = [makeObject('text', [{ mode: 'point', datasetId: source.datasets[0].id, pointId: point.id, fallbackX: point.x, fallbackY: point.y, offsetXpx: 0, offsetYpx: 0 }], 'Linked')]
  await page.locator('input[type=file]').setInputFiles({ name: 'linked.aph', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(source)) })
  await headerButton(page, 'Таблица').click()
  const panel = dataPanel(page)
  await panel.getByRole('button', { name: 'Y 1: 1', exact: true }).dblclick()
  await panel.getByRole('textbox', { name: 'Y 1', exact: true }).fill('10')
  await panel.getByRole('textbox', { name: 'Y 1', exact: true }).press('Enter')
  page.once('dialog', dialog => dialog.dismiss())
  await panel.getByRole('button', { name: 'Удалить строку', exact: true }).click()
  expect((await savedProject(page)).datasets[0].points).toHaveLength(2)
  page.once('dialog', dialog => dialog.accept())
  await panel.getByRole('button', { name: 'Удалить строку', exact: true }).click()
  const saved = await savedProject(page)
  expect(saved.datasets[0].points).toHaveLength(1)
  expect(saved.objects[0].anchors[0]).toEqual({ mode: 'data', x: 0, y: 10 })
})
