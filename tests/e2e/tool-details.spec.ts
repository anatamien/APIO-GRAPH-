import { readFile } from 'node:fs/promises'
import { expect, test, type Page } from '@playwright/test'
import { addPairs, createProject, makeObject, type ProjectDocument } from '../../src/domain/model'

function fixture(): ProjectDocument {
  const project = addPairs(createProject(), [{ x: 0, y: 0 }, { x: 10, y: 10 }], 'Source')
  project.legend.visible = false
  return project
}

async function open(page: Page, project = fixture()) {
  await page.goto('/')
  await page.locator('input[type=file]').setInputFiles({ name: 'interaction.aph', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(project)) })
  await expect(page.locator('[data-series]')).toHaveCount(project.series.length)
}

async function saved(page: Page): Promise<ProjectDocument> {
  const pending = page.waitForEvent('download')
  await page.locator('header').getByRole('button', { name: 'Сохранить', exact: true }).click()
  const download = await pending
  return JSON.parse(await readFile((await download.path())!, 'utf8')) as ProjectDocument
}

async function location(page: Page, x: number, y: number) {
  const chart = page.getByTestId('chart')
  const box = (await chart.boundingBox())!
  const plot = await chart.locator('clipPath rect').evaluate(element => ({
    x: Number(element.getAttribute('x')), y: Number(element.getAttribute('y')),
    width: Number(element.getAttribute('width')), height: Number(element.getAttribute('height')),
  }))
  return { x: box.x + plot.x + x / 10 * plot.width, y: box.y + plot.y + (1 - y / 10) * plot.height }
}

async function drag(page: Page, from: { x: number; y: number }, to: { x: number; y: number }) {
  await page.mouse.move(from.x, from.y)
  await page.mouse.down()
  await page.mouse.move(to.x, to.y, { steps: 8 })
  await page.mouse.up()
}

test('rectangle creation works in every direction and exposes four resize corners plus a center move handle', async ({ page }) => {
  await open(page)
  for (const [x1, y1, x2, y2] of [[3, 3, 7, 7], [7, 3, 3, 7], [7, 7, 3, 3], [3, 7, 7, 3]]) {
    await page.keyboard.press('r')
    await drag(page, await location(page, x1, y1), await location(page, x2, y2))
  }
  const chart = page.getByTestId('chart')
  await expect(chart.locator('[data-handle^="corner-"]')).toHaveCount(4)
  await expect(chart.locator('[data-handle="center"]')).toHaveCount(1)
  const before = await saved(page)
  expect(before.objects).toHaveLength(4)
  for (const object of before.objects) {
    expect(object.type).toBe('rectangle')
    expect(object.name).toBe('Область')
    const points = object.anchors.map(anchor => anchor.mode === 'data' ? anchor : null)
    expect(Math.min(...points.map(point => point!.x))).toBeCloseTo(3)
    expect(Math.max(...points.map(point => point!.x))).toBeCloseTo(7)
    expect(Math.min(...points.map(point => point!.y))).toBeCloseTo(3)
    expect(Math.max(...points.map(point => point!.y))).toBeCloseTo(7)
  }
  await drag(page, await location(page, 5, 5), await location(page, 5.5, 5.5))
  const moved = (await saved(page)).objects.at(-1)!
  for (const [index, anchor] of moved.anchors.entries()) {
    expect(anchor.mode).toBe('data')
    if (anchor.mode !== 'data' || before.objects.at(-1)!.anchors[index].mode !== 'data') throw new Error('Expected data anchors')
    const prior = before.objects.at(-1)!.anchors[index] as { x: number; y: number }
    expect(anchor.x).toBeCloseTo(prior.x + 0.5)
    expect(anchor.y).toBeCloseTo(prior.y + 0.5)
  }
})

test('each rectangle corner resizes around its opposite corner without moving it', async ({ page }) => {
  const project = fixture()
  project.objects = [makeObject('rectangle', [{ mode: 'data', x: 3, y: 3 }, { mode: 'data', x: 7, y: 7 }])]
  await open(page, project)
  await page.mouse.click((await location(page, 5, 5)).x, (await location(page, 5, 5)).y)
  for (let index = 0; index < 4; index++) {
    const handle = page.locator(`[data-handle="corner-${index}"]`)
    await expect(handle).toBeVisible()
    const opposite = (await page.locator(`[data-handle="corner-${(index + 2) % 4}"]`).boundingBox())!
    const box = (await handle.boundingBox())!
    await drag(page, { x: box.x + box.width / 2, y: box.y + box.height / 2 }, { x: box.x + box.width / 2 + (index === 0 || index === 3 ? -20 : 20), y: box.y + box.height / 2 + (index < 2 ? -15 : 15) })
    const fixed = (await page.locator(`[data-handle="corner-${(index + 2) % 4}"]`).boundingBox())!
    expect(fixed.x).toBeCloseTo(opposite.x, 3)
    expect(fixed.y).toBeCloseTo(opposite.y, 3)
  }
  expect((await saved(page)).objects).toHaveLength(1)
})

test('infinite lines expose a direction handle and save a normalized data-space direction', async ({ page }) => {
  await open(page)
  await page.getByRole('toolbar').hover()
  await page.getByRole('toolbar').getByRole('button', { name: 'Прямая', exact: true }).click()
  await drag(page, await location(page, 3, 3), await location(page, 5, 4))
  const handle = page.locator('[data-handle="direction"]')
  await expect(handle).toHaveCount(1)
  const box = (await handle.boundingBox())!
  await drag(page, { x: box.x + box.width / 2, y: box.y + box.height / 2 }, await location(page, 3, 7))
  const object = (await saved(page)).objects[0]
  expect(object.type).toBe('line')
  expect(object.name).toBe('Прямая')
  expect(object.geometry.directionX).toBeCloseTo(0, 8)
  expect(object.geometry.directionY).toBeCloseTo(1, 8)
  expect(Math.hypot(object.geometry.directionX!, object.geometry.directionY!)).toBeCloseTo(1, 12)
  expect(object.anchors).toHaveLength(1)
})

test('Shift-click toggles selection and Alt-click cycles overlapping objects in visual order', async ({ page }) => {
  const project = fixture()
  const first = makeObject('rectangle', [{ mode: 'data', x: 2, y: 2 }, { mode: 'data', x: 6, y: 6 }])
  const second = makeObject('rectangle', [{ mode: 'data', x: 4, y: 4 }, { mode: 'data', x: 8, y: 8 }])
  first.zIndex = 1
  second.zIndex = 2
  project.objects = [first, second]
  await open(page, project)
  const click = async (x: number, y: number, modifier?: 'Shift' | 'Alt') => {
    if (modifier) await page.keyboard.down(modifier)
    const point = await location(page, x, y)
    await page.mouse.click(point.x, point.y)
    if (modifier) await page.keyboard.up(modifier)
  }
  await click(3, 3)
  await click(7, 7, 'Shift')
  await expect(page.locator('[data-selected-object]')).toHaveCount(2)
  await click(3, 3, 'Shift')
  await expect(page.locator(`[data-selected-object="${first.id}"]`)).toHaveCount(0)
  await expect(page.locator(`[data-selected-object="${second.id}"]`)).toHaveCount(1)
  await click(5.5, 5.5, 'Alt')
  await expect(page.locator(`[data-selected-object="${first.id}"]`)).toHaveCount(1)
  await expect(page.locator(`[data-selected-object="${second.id}"]`)).toHaveCount(0)
  await click(5.5, 5.5, 'Alt')
  await expect(page.locator(`[data-selected-object="${second.id}"]`)).toHaveCount(1)
  expect((await saved(page)).objects).toEqual(project.objects)
})

test('axis label double-click edits inline and Escape cancels without creating text objects', async ({ page }) => {
  await open(page)
  await page.keyboard.press('t')
  await page.locator('[data-axis-label="x"]').dblclick()
  const input = page.locator('.inline-axis').getByRole('textbox', { name: 'Подпись X', exact: true })
  await input.fill('Time, seconds')
  await input.press('Enter')
  let project = await saved(page)
  expect(project.axes.x.label).toBe('Time, seconds')
  expect(project.objects).toHaveLength(0)
  await page.locator('[data-axis-label="x"]').dblclick()
  await input.fill('Discard this')
  await input.press('Escape')
  project = await saved(page)
  expect(project.axes.x.label).toBe('Time, seconds')
  expect(project.objects).toHaveLength(0)
})
