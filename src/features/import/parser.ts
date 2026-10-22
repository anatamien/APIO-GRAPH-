export type ParseOptions = {
  delimiter?: 'auto' | 'space' | 'tab' | ',' | ';'
  decimal?: 'auto' | '.' | ','
  header?: 'auto' | boolean
  skipRows?: number
  comments?: boolean
}

export type ParseDiagnostic = {
  line: number
  column: number
  code: string
  raw: string
}

export type ParsedTable = {
  headers: string[]
  rows: { line: number; cells: string[]; values: (number | null)[] }[]
  diagnostics: ParseDiagnostic[]
  delimiter: string
  decimal: '.' | ','
  ambiguous: boolean
}

type Decimal = '.' | ','
type RecordIssue = { column: number; code: string }
type SourceRecord = { line: number; cells: string[]; raw: string; issues: RecordIssue[] }

/** Strict numeric input: no grouping separators, coercion, or partial parses. */
export function parseNumber(input: string, decimal: Decimal = '.'): number {
  const text = input.trim().replaceAll('\u2212', '-')
  if (!text) throw new Error('empty_value')
  if (/^[+-]?(?:NaN|Infinity)$/i.test(text)) throw new Error('non_finite_number')
  const pattern = decimal === ','
    ? /^[+-]?(?:\d+(?:,\d*)?|,\d+)(?:[eE][+-]?\d+)?$/
    : /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/
  if (!pattern.test(text)) throw new Error('invalid_number')
  const value = Number(decimal === ',' ? text.replace(',', '.') : text)
  if (!Number.isFinite(value)) throw new Error('non_finite_number')
  return value
}

/** Decode without replacement characters; a caller can offer another encoding on failure. */
export function decodeText(bytes: Uint8Array, encoding?: string): string {
  let selected = encoding?.trim() || 'auto'
  if (selected === 'auto') {
    selected = bytes[0] === 0xff && bytes[1] === 0xfe ? 'utf-16le'
      : bytes[0] === 0xfe && bytes[1] === 0xff ? 'utf-16be' : 'utf-8'
  }
  let decoder: TextDecoder
  try {
    decoder = new TextDecoder(selected, { fatal: true })
  } catch {
    throw new Error('unknown_encoding')
  }
  try {
    return decoder.decode(bytes)
  } catch {
    throw new Error('invalid_encoding')
  }
}

function readRecords(input: string, delimiter: string, options: ParseOptions, limit = Infinity): SourceRecord[] {
  const records: SourceRecord[] = []
  let line = 1
  let index = 0
  const skipped = Math.max(0, Math.floor(options.skipRows ?? 0))
  while (index < input.length && line <= skipped) {
    if (input[index] === '\r' || input[index] === '\n') {
      if (input[index] === '\r' && input[index + 1] === '\n') index++
      line++
    }
    index++
  }
  let recordStart = index
  let recordLine = line
  let cells: string[] = []
  let issues: RecordIssue[] = []
  let value = ''
  let started = false
  let quoted = false
  let afterQuote = false

  const issue = (code: string) => {
    const column = cells.length + 1
    if (!issues.some(item => item.column === column && item.code === code)) issues.push({ column, code })
  }
  const finishField = () => {
    if (delimiter !== ' ' || started) cells.push(value)
    value = ''
    started = false
    afterQuote = false
  }
  const finishRecord = (end: number) => {
    finishField()
    const raw = input.slice(recordStart, end)
    if (raw.trim()) records.push({ line: recordLine, cells, raw, issues })
    cells = []
    issues = []
  }

  while (index < input.length) {
    if (options.comments && index === recordStart) {
      let marker = index
      while (input[marker] === ' ' || input[marker] === '\t') marker++
      if (input[marker] === '#' || input.slice(marker, marker + 2) === '//') {
        while (index < input.length && input[index] !== '\n' && input[index] !== '\r') index++
        if (index < input.length) {
          if (input[index] === '\r' && input[index + 1] === '\n') index++
          index++
          line++
        }
        recordStart = index
        recordLine = line
        continue
      }
    }
    const char = input[index]
    if (quoted) {
      if (char === '"') {
        if (input[index + 1] === '"') {
          value += '"'
          index += 2
          continue
        }
        quoted = false
        afterQuote = true
      } else {
        if (char === '\r' || char === '\n') {
          if (char === '\r' && input[index + 1] === '\n') {
            value += '\r'
            index++
          }
          line++
        }
        value += input[index]
      }
    } else if (char === '\n' || char === '\r') {
      finishRecord(index)
      if (records.length >= limit) return records
      if (char === '\r' && input[index + 1] === '\n') index++
      line++
      recordStart = index + 1
      recordLine = line
    } else if (char === delimiter) {
      finishField()
    } else if (char === '"') {
      if (!value.trim() && !afterQuote) {
        quoted = true
        started = true
      } else {
        issue('unexpected_quote')
        value += char
        started = true
      }
    } else {
      if (afterQuote && char.trim()) issue('characters_after_quote')
      value += char
      started = true
    }
    index++
  }
  if (quoted) issue('unclosed_quote')
  if (recordStart < input.length) finishRecord(input.length)
  return records
}

function isNumber(input: string, decimal: Decimal): boolean {
  try { parseNumber(input, decimal); return true } catch { return false }
}

function isHeader(records: SourceRecord[], decimal: Decimal, option: ParseOptions['header']): boolean {
  if (!records.length || option === false) return false
  if (option === true) return true
  const first = records[0]
  if (first.issues.length || !first.cells.length) return false
  // Numeric-looking mistakes, non-finite values, and mixed numeric/text rows are data.
  const labels = first.cells.every(cell => {
    const text = cell.trim()
    return /\p{L}/u.test(text)
      && !/^[+\-\u2212]?(?:\d|[.,]\d|NaN\b|Infinity\b)/i.test(text)
      && !isNumber(text, '.') && !isNumber(text, ',')
  })
  return labels && records.slice(1).some(record => record.cells.some(cell => isNumber(cell, decimal)))
}

function commonWidth(records: SourceRecord[]): number {
  const counts = new Map<number, number>()
  let width = records[0]?.cells.length ?? 0
  let count = 0
  for (const record of records) {
    const frequency = (counts.get(record.cells.length) ?? 0) + 1
    counts.set(record.cells.length, frequency)
    if (frequency > count) { width = record.cells.length; count = frequency }
  }
  return width
}

type Hypothesis = {
  delimiter: string
  decimal: Decimal
  header: boolean
  records: SourceRecord[]
  width: number
  score: number
  validRows: number
}

function evaluate(records: SourceRecord[], delimiter: string, decimal: Decimal, options: ParseOptions): Hypothesis {
  const header = isHeader(records, decimal, options.header)
  const data = header ? records.slice(1) : records
  const width = header ? records[0].cells.length : commonWidth(data)
  let numeric = 0
  let fields = 0
  let stable = 0
  let validRows = 0
  for (const record of data) {
    const valid = record.cells.filter(cell => isNumber(cell, decimal)).length
    numeric += valid
    fields += record.cells.length
    if (record.cells.length === width) {
      stable++
      if (valid === width && !record.issues.length) validRows++
    }
  }
  const length = data.length || 1
  const score = validRows / length * 100 + numeric / (fields || 1) * 25
    + stable / length * 10 + (width > 1 ? 5 : 0)
    - data.filter(record => record.issues.length).length / length * 20
  return { delimiter, decimal, header, records, width, score, validRows }
}

function differentInterpretation(left: Hypothesis, right: Hypothesis): boolean {
  const leftRows = left.header ? left.records.slice(1) : left.records
  const rightRows = right.header ? right.records.slice(1) : right.records
  if (leftRows.length !== rightRows.length) return true
  return leftRows.some((record, index) => {
    const other = rightRows[index]
    return record.cells.length !== other.cells.length || record.cells.some((cell, column) => {
      try { return !Object.is(parseNumber(cell, left.decimal), parseNumber(other.cells[column], right.decimal)) }
      catch { return cell !== other.cells[column] }
    })
  })
}

/** Infer from at most 200 nonempty records, then verify every source record. */
export function parseText(input: string, options: ParseOptions = {}): ParsedTable {
  const text = input.replace(/^\uFEFF/, '')
  const delimiters = !options.delimiter || options.delimiter === 'auto'
    ? [' ', '\t', ';', ',']
    : [options.delimiter === 'space' ? ' ' : options.delimiter === 'tab' ? '\t' : options.delimiter]
  const decimals: Decimal[] = !options.decimal || options.decimal === 'auto' ? ['.', ','] : [options.decimal]
  const hypotheses = delimiters.flatMap(delimiter => {
    const sample = readRecords(text, delimiter, options, 200)
    return decimals.map(decimal => evaluate(sample, delimiter, decimal, options))
  }).sort((left, right) => right.score - left.score)
  const selected = hypotheses[0]
  // Equivalent integer formats are harmless; plausible distinct numeric readings need a choice.
  const ambiguous = hypotheses.some(other => other !== selected && other.validRows > 0
    && selected.validRows > 0 && selected.score - other.score <= 6
    && !(selected.header && selected.width > 1 && other.width === 1)
    && differentInterpretation(selected, other))
  const records = readRecords(text, selected.delimiter, options)
  const diagnostics: ParseDiagnostic[] = []
  for (const record of records) {
    for (const issue of record.issues) diagnostics.push({
      line: record.line, column: issue.column, code: issue.code, raw: record.cells[issue.column - 1] ?? record.raw,
    })
  }
  const headers = selected.header && records.length ? records[0].cells.map(cell => cell.trim()) : []
  const data = selected.header ? records.slice(1) : records
  if (ambiguous && data.length) diagnostics.push({ line: data[0].line, column: 1, code: 'ambiguous_format', raw: data[0].raw })
  const rows = data.map(record => {
    if (record.cells.length !== selected.width) diagnostics.push({
      line: record.line, column: Math.min(record.cells.length, selected.width) + 1, code: 'column_count', raw: record.raw,
    })
    const values = record.cells.map((cell, index) => {
      if (ambiguous || record.issues.some(issue => issue.column === index + 1)) return null
      try {
        return parseNumber(cell, selected.decimal)
      } catch (error) {
        diagnostics.push({ line: record.line, column: index + 1, code: error instanceof Error ? error.message : 'invalid_number', raw: cell })
        return null
      }
    })
    return { line: record.line, cells: record.cells, values }
  })
  return { headers, rows, diagnostics, delimiter: selected.delimiter, decimal: selected.decimal, ambiguous }
}
