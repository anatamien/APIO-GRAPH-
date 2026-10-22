import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { decodeText, parseNumber, parseText } from '../../src/features/import/parser'

const fixture = (name: string) => readFileSync(new URL(`../fixtures/import/${name}`, import.meta.url), 'utf8')

describe('import fixtures', () => {
  it('retains all space-separated points in source order', () => {
    const result = parseText(fixture('spaces.txt'))
    expect(result.rows.map(row => row.values)).toEqual([[0, 1], [1, 3], [2, 5], [3, 7], [4, 9]])
    expect(result.rows.map(row => row.line)).toEqual([1, 2, 3, 4, 5])
    expect(result.headers).toEqual([])
    expect(result.delimiter).toBe(' ')
    expect(result.ambiguous).toBe(false)
    expect(result.diagnostics).toEqual([])
  })

  it('detects tabs with an explicit source header', () => {
    const result = parseText(fixture('tabs.tsv'))
    expect(result.headers).toEqual(['X', 'Y'])
    expect(result.delimiter).toBe('\t')
    expect(result.rows.map(row => row.values)).toEqual([[0, 1], [1, 3], [2, 5], [3, 7], [4, 9]])
    expect(result.diagnostics).toEqual([])
  })

  it('distinguishes semicolon-delimited decimal commas', () => {
    const result = parseText(fixture('decimal-comma.csv'))
    expect(result.headers).toEqual(['Время', 'Концентрация'])
    expect(result.delimiter).toBe(';')
    expect(result.decimal).toBe(',')
    expect(result.rows.map(row => row.values)).toEqual([[0, 1.25], [0.5, 2.5], [1, 3.75]])
    expect(result.ambiguous).toBe(false)
    expect(result.diagnostics).toEqual([])
  })

  it('keeps all three columns for mapping more than one series', () => {
    const result = parseText(fixture('three-columns.csv'))
    expect(result.headers).toEqual(['Time', 'ExpA', 'ExpB'])
    expect(result.rows.map(row => row.values)).toEqual([[0, 1, 1.2], [1, 2.1, 2.3], [2, 3.8, 3.7]])
    expect(result.diagnostics).toEqual([])
  })

  it('retains duplicates and negative coordinates', () => {
    const result = parseText(fixture('duplicates.txt'))
    expect(result.rows.map(row => row.values)).toEqual([[-1, 2], [0, 3], [0, 4], [1, 5], [1, 5]])
    expect(result.diagnostics).toEqual([])
  })

  it('retains Unicode header text without splitting label spaces', () => {
    const result = parseText(fixture('unicode-header.txt'))
    expect(result.headers).toEqual(['Время (с)', 'Концентрация (мг/л)'])
    expect(result.rows.map(row => row.values)).toEqual([[0, 1.5], [2, 2.75]])
    expect(result.diagnostics).toEqual([])
  })

  it('retains bad rows and reports their source line and column', () => {
    const result = parseText(fixture('invalid-rows.txt'))
    expect(result.rows.map(row => row.values)).toEqual([[0, 1], [1, 3], [2, null], [3, 7]])
    expect(result.rows[2]).toEqual({ line: 4, cells: ['2', '12,3,4'], values: [2, null] })
    expect(result.diagnostics).toContainEqual({ line: 4, column: 2, code: 'invalid_number', raw: '12,3,4' })
  })

  it('requires a choice for a single decimal-comma-looking field', () => {
    const result = parseText(fixture('ambiguity.txt'))
    expect(result.ambiguous).toBe(true)
    expect(result.rows).toHaveLength(1)
    expect(result.rows[0].values.every(value => value === null)).toBe(true)
    expect(result.diagnostics).toContainEqual({ line: 1, column: 1, code: 'ambiguous_format', raw: '1,25' })
    expect(parseText(fixture('ambiguity.txt'), { delimiter: 'space', decimal: ',' }).rows[0].values).toEqual([1.25])
    expect(parseText(fixture('ambiguity.txt'), { delimiter: ',', decimal: '.' }).rows[0].values).toEqual([1, 25])
  })
})

describe('numeric conversion', () => {
  it.each([
    [' 1.25e-6 ', '.', 0.00000125],
    ['−1.25E−2', '.', -0.0125],
    ['+.5', '.', 0.5],
    ['1,25e2', ',', 125],
    ['-0', '.', -0],
    ['1.7976931348623157e308', '.', Number.MAX_VALUE],
    ['5e-324', '.', Number.MIN_VALUE],
  ] as const)('parses finite numeric input %s', (input, decimal, expected) => {
    expect(Object.is(parseNumber(input, decimal), expected)).toBe(true)
  })

  it.each(['', ' ', '12,3,4', '1,25', '1 234', '0x10', '1e', '2x', '--1', '1.2.3'])('rejects malformed dot-decimal input %s', input => {
    expect(() => parseNumber(input)).toThrow(input.trim() ? 'invalid_number' : 'empty_value')
  })

  it.each(['NaN', 'Infinity', '-Infinity', '1e309'])('rejects non-finite input %s', input => {
    expect(() => parseNumber(input)).toThrow('non_finite_number')
  })

  it('rejects dot decimals when the comma format is selected', () => {
    expect(() => parseNumber('1.25', ',')).toThrow('invalid_number')
  })
})

describe('row preservation and explicit settings', () => {
  it('does not infer a header from a partly numeric malformed first row', () => {
    const result = parseText('0;broken\n1;2\n2;3')
    expect(result.headers).toEqual([])
    expect(result.rows.map(row => row.values)).toEqual([[0, null], [1, 2], [2, 3]])
    expect(result.diagnostics).toContainEqual({ line: 1, column: 2, code: 'invalid_number', raw: 'broken' })
  })

  it.each(['NaN;Infinity', '1e;2x', '12,3,4;5'])('does not infer a header from malformed numeric values %s', first => {
    const result = parseText(`${first}\n1;2\n2;3`)
    expect(result.headers).toEqual([])
    expect(result.rows).toHaveLength(3)
    expect(result.rows[0].line).toBe(1)
    expect(result.diagnostics.length).toBeGreaterThan(0)
  })

  it('honors explicit header choices', () => {
    expect(parseText('1;2\n3;4', { header: true }).headers).toEqual(['1', '2'])
    const withoutHeader = parseText('X;Y\n3;4', { header: false })
    expect(withoutHeader.headers).toEqual([])
    expect(withoutHeader.rows).toHaveLength(2)
    expect(withoutHeader.rows[0].values).toEqual([null, null])
  })

  it('skips physical rows and comments only when requested while preserving source lines', () => {
    const result = parseText('metadata\r\n# comment\r\n\r\nX;Y\r\n0;1\r\n  // another\r\n1;bad', { skipRows: 1, comments: true })
    expect(result.headers).toEqual(['X', 'Y'])
    expect(result.rows.map(row => row.line)).toEqual([5, 7])
    expect(result.diagnostics).toContainEqual({ line: 7, column: 2, code: 'invalid_number', raw: 'bad' })
    const commentsOff = parseText('# comment\n1;2', { delimiter: ';', header: false })
    expect(commentsOff.rows.map(row => row.line)).toEqual([1, 2])
  })

  it('validates rows after the 200-row detection sample without dropping any', () => {
    const input = Array.from({ length: 200 }, (_, index) => `${index};${index + 1}`).join('\n') + '\n200;bad\n201;202;203'
    const result = parseText(input)
    expect(result.rows).toHaveLength(202)
    expect(result.rows[200].values).toEqual([200, null])
    expect(result.rows[201].values).toEqual([201, 202, 203])
    expect(result.diagnostics).toContainEqual({ line: 201, column: 2, code: 'invalid_number', raw: 'bad' })
    expect(result.diagnostics).toContainEqual({ line: 202, column: 3, code: 'column_count', raw: '201;202;203' })
  })

  it('reports empty fields, missing columns and non-finite values', () => {
    const result = parseText('X;Y\n0;\n1\n2;Infinity', { delimiter: ';' })
    expect(result.rows.map(row => row.values)).toEqual([[0, null], [1], [2, null]])
    expect(result.diagnostics).toContainEqual({ line: 2, column: 2, code: 'empty_value', raw: '' })
    expect(result.diagnostics).toContainEqual({ line: 3, column: 2, code: 'column_count', raw: '1' })
    expect(result.diagnostics).toContainEqual({ line: 4, column: 2, code: 'non_finite_number', raw: 'Infinity' })
  })

  it('preserves cell whitespace in the preview and normalizes it only for values and headers', () => {
    const result = parseText(' X ; Y \n 1.25 ; 2.5 ', { delimiter: ';' })
    expect(result.headers).toEqual(['X', 'Y'])
    expect(result.rows[0].cells).toEqual([' 1.25 ', ' 2.5 '])
    expect(result.rows[0].values).toEqual([1.25, 2.5])
  })

  it('uses a clear comma-separated header to resolve the comma ambiguity', () => {
    const result = parseText('X,Y\n1,25\n2,50')
    expect(result.headers).toEqual(['X', 'Y'])
    expect(result.ambiguous).toBe(false)
    expect(result.rows.map(row => row.values)).toEqual([[1, 25], [2, 50]])
  })

  it('returns an empty table for blank input', () => {
    expect(parseText('\uFEFF\r\n  \n')).toEqual({ headers: [], rows: [], diagnostics: [], delimiter: ' ', decimal: '.', ambiguous: false })
  })
})

describe('quoted records', () => {
  it('reads RFC4180 delimiters, escaped quotes and multiline fields without losing source lines', () => {
    const result = parseText('"Time, seconds","Value ""A"""\r\n"1","2"\r\n"bad\r\nvalue","3"\r\n4,5', { delimiter: ',' })
    expect(result.headers).toEqual(['Time, seconds', 'Value "A"'])
    expect(result.rows.map(row => row.line)).toEqual([2, 3, 5])
    expect(result.rows.map(row => row.cells)).toEqual([['1', '2'], ['bad\r\nvalue', '3'], ['4', '5']])
    expect(result.rows.map(row => row.values)).toEqual([[1, 2], [null, 3], [4, 5]])
    expect(result.diagnostics).toContainEqual({ line: 3, column: 1, code: 'invalid_number', raw: 'bad\r\nvalue' })
  })

  it('detects quoted decimal commas with a comma delimiter', () => {
    const result = parseText('"X","Y"\n"1,25","2,50"\n"3,75","4,00"')
    expect(result.delimiter).toBe(',')
    expect(result.decimal).toBe(',')
    expect(result.ambiguous).toBe(false)
    expect(result.rows.map(row => row.values)).toEqual([[1.25, 2.5], [3.75, 4]])
  })

  it('does not treat quoted comment markers as comments', () => {
    const result = parseText('"# value";Y\n1;2', { delimiter: ';', comments: true })
    expect(result.headers).toEqual(['# value', 'Y'])
    expect(result.rows[0].values).toEqual([1, 2])
  })

  it('reports an unclosed quote while retaining its entire record', () => {
    const result = parseText('X;Y\n0;"bad\nnext', { delimiter: ';' })
    expect(result.rows).toHaveLength(1)
    expect(result.rows[0].cells).toEqual(['0', 'bad\nnext'])
    expect(result.diagnostics).toContainEqual({ line: 2, column: 2, code: 'unclosed_quote', raw: 'bad\nnext' })
  })

  it('reports malformed quoting instead of silently repairing numeric data', () => {
    const result = parseText('X;Y\n0;"2"oops\n1;3"4', { delimiter: ';' })
    expect(result.rows).toHaveLength(2)
    expect(result.rows.map(row => row.values)).toEqual([[0, null], [1, null]])
    expect(result.diagnostics.some(diagnostic => diagnostic.line === 2 && diagnostic.code === 'characters_after_quote')).toBe(true)
    expect(result.diagnostics.some(diagnostic => diagnostic.line === 3 && diagnostic.code === 'unexpected_quote')).toBe(true)
  })
})

describe('text decoding', () => {
  it('decodes UTF-8 and strips its optional BOM', () => {
    const bytes = new TextEncoder().encode('Время;Y\n0;1')
    expect(decodeText(bytes)).toBe('Время;Y\n0;1')
    expect(decodeText(new Uint8Array([0xef, 0xbb, 0xbf, ...bytes]))).toBe('Время;Y\n0;1')
  })

  it('detects UTF-16 little endian and big endian from their BOMs', () => {
    expect(decodeText(new Uint8Array([0xff, 0xfe, 0x10, 0x04, 0x3b, 0x00, 0x59, 0x00]))).toBe('А;Y')
    expect(decodeText(new Uint8Array([0xfe, 0xff, 0x04, 0x10, 0x00, 0x3b, 0x00, 0x59]))).toBe('А;Y')
    expect(decodeText(new Uint8Array([0x41, 0x00]), 'utf-16le')).toBe('A')
  })

  it('fails on malformed bytes without silently inserting replacement characters', () => {
    expect(() => decodeText(new Uint8Array([0xc3, 0x28]))).toThrow('invalid_encoding')
    expect(() => decodeText(new Uint8Array([0xff, 0xfe, 0x41]))).toThrow('invalid_encoding')
    expect(() => decodeText(new Uint8Array([0xfe, 0xff, 0xd8, 0x00]))).toThrow('invalid_encoding')
  })

  it('accepts a user-selected encoding and rejects an unknown encoding', () => {
    expect(decodeText(new Uint8Array([0xc0]), 'windows-1251')).toBe('А')
    expect(() => decodeText(new Uint8Array([65]), 'unknown-encoding')).toThrow('unknown_encoding')
  })
})
