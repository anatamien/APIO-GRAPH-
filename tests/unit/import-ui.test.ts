import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { addPairs, createProject } from '../../src/domain/model'
import { ImportPanel } from '../../src/features/import/ImportPanel'
import { DataTable } from '../../src/features/table/DataTable'

const t = (key: string) => key

describe('import and table controls', () => {
  it('provides accessible source, explicit mapping and commit controls in the import preview', () => {
    const html = renderToStaticMarkup(createElement(ImportPanel, {
      source:'text',text: 'Time;A;B\n0;1;2', setText: () => {}, name: 'source.csv',
      project: createProject(), onImport: () => {}, t, onClose: () => {},
    }))
    expect(html).toContain('aria-label="import.sourceText"')
    expect(html).toContain('import.addMapping')
    expect(html).toContain('import.build')
    expect(html).toContain('Time')
    expect(html).toContain('source.csv')
  })

  it('renders only visible rows from a large source table', () => {
    const project = addPairs(createProject(), Array.from({ length: 10000 }, (_, x) => ({ x, y: x * 2 })), 'Measured')
    const html = renderToStaticMarkup(createElement(DataTable, { project, onChange: () => {}, t, onClose: () => {} }))
    expect(html).toContain('aria-rowcount="10001"')
    expect((html.match(/data-point-id=/g) ?? []).length).toBeGreaterThan(0)
    expect((html.match(/data-point-id=/g) ?? []).length).toBeLessThan(40)
    expect(html).toContain('table.addRow')
  })

  it('exposes manual entry when no dataset exists', () => {
    const html = renderToStaticMarkup(createElement(DataTable, { project: createProject(), onChange: () => {}, t, onClose: () => {} }))
    expect(html).toContain('table.addRow')
    expect(html).toContain('table.addData')
  })
})
