import {measurementRow,uncertaintyIssue,type MeasurementMapping} from './uncertaintyMapping';
import '../inspector/UncertaintyEditor';
import { useId, useMemo, useState } from 'react'
import type { ProjectDocument } from '../../domain/model'
import { addPairs, createProject,schemaAtLeast } from '../../domain/model'
import { fitView } from '../../domain/geometry'
import { addTranslations } from '../../app/i18n'
import { useParsedTable } from './useParsedTable'
import type { ParseOptions } from './parser'
import {openFile} from '../../platform/files'
import type {OpenedFile} from '../../platform/files'
import {decodeText} from './parser'
import {Check} from '../../app/controls'

addTranslations({
  'common.close': ['Закрыть', 'Close'], 'common.cancel': ['Отмена', 'Cancel'], 'common.auto': ['Авто', 'Auto'],
  'import.chooseFile': ['Выбрать файл', 'Choose file'],
  'import.changeFile': ['Выбрать другой файл', 'Choose another file'],
  'import.fileTitle': ['Импорт файла', 'Import file'], 'import.pasteTitle': ['Вставить таблицу', 'Paste a table'],
  'common.yes': ['Да', 'Yes'], 'common.no': ['Нет', 'No'], 'common.untitled': ['Новый проект', 'Untitled'],
  'import.title': ['Импорт данных', 'Import data'], 'import.sourceText': ['Исходный текст', 'Source text'],
  'import.delimiter': ['Разделитель', 'Delimiter'], 'import.decimal': ['Десятичный символ', 'Decimal symbol'],
  'import.space': ['Пробел', 'Space'], 'import.tab': ['Табуляция', 'Tab'], 'import.comma': ['Запятая', 'Comma'], 'import.semicolon': ['Точка с запятой', 'Semicolon'],
  'import.header': ['Строка заголовка', 'Header row'], 'import.skipRows': ['Пропустить строк', 'Skip rows'], 'import.comments': ['Комментарии # и //', 'Comments # and //'],
  'import.mapping': ['Колонки серий', 'Series columns'], 'import.column': ['Столбец', 'Column'], 'import.xColumn': ['Столбец X', 'X column'], 'import.yColumn': ['Столбец Y', 'Y column'],
  'import.swap': ['Поменять X/Y', 'Swap X/Y'], 'import.addMapping': ['Добавить серию', 'Add series'], 'import.removeMapping': ['Удалить пару колонок', 'Remove column pair'],
  'import.rows': ['Прочитано строк', 'Rows read'], 'import.validRows': ['Корректных строк', 'Valid rows'], 'import.problems': ['Проблемы', 'Problems'],
  'import.line': ['Строка', 'Line'], 'import.preview': ['Предпросмотр данных', 'Data preview'], 'import.previewLimit': ['Показаны первые 100 строк. Импорт использует все строки.', 'Showing the first 100 rows. Import uses every row.'],
  'import.ambiguous': ['Выберите разделитель и десятичный символ: возможны разные варианты разбора.', 'Choose a delimiter and decimal symbol: the source has more than one interpretation.'],
  'import.skipConsent': ['Пропустить ошибочные строки', 'Skip invalid rows'], 'import.destination': ['Куда импортировать', 'Import destination'],
  'import.newProject': ['Новый график (отдельная вкладка)', 'New graph (separate tab)'], 'import.append': ['Добавить в текущий график', 'Add to current graph'], 'import.build': ['Построить', 'Plot'],
  'import.series': ['Измерения', 'Measurements'], 'import.noValidRows': ['Нет корректных координат в выбранных колонках.', 'No valid coordinates in the selected columns.'],
  'import.parsing': ['Чтение всех строк… Можно отменить импорт.', 'Reading all rows… Import can be canceled.'], 'import.parseFailure': ['Не удалось разобрать текст. Измените параметры или повторите импорт.', 'The text could not be parsed. Change the options or retry the import.'],
  'import.sourceExcerpt': ['Исходный текст: показаны первые 100 строк. Разбор использует полный файл.', 'Source text: showing the first 100 rows. Parsing uses the complete file.'], 'import.editFullSource': ['Редактировать весь исходный текст', 'Edit the complete source text'],
  'diagnostic.empty_value': ['Пустое числовое значение', 'Empty numeric value'], 'diagnostic.invalid_number': ['Недопустимое число', 'Invalid number'],
  'diagnostic.non_finite_number': ['Число должно быть конечным', 'Number must be finite'], 'diagnostic.column_count': ['Число колонок отличается от остальных строк', 'Column count differs from the other rows'],
  'diagnostic.ambiguous_format': ['Неоднозначный формат данных', 'Ambiguous data format'], 'diagnostic.unclosed_quote': ['Незакрытая кавычка', 'Unclosed quote'],
  'diagnostic.unexpected_quote': ['Неожиданная кавычка внутри поля', 'Unexpected quote in a field'], 'diagnostic.characters_after_quote': ['Символы после закрывающей кавычки', 'Characters after a closing quote'],
})

export interface ImportPanelProps {
  text: string
  setText: (text: string) => void
  name: string
  onImport: (project: ProjectDocument) => void
  project: ProjectDocument
  t: (key: string) => string
  onClose: () => void
  onBlank?:()=>void
  onFile?: (file: OpenedFile) => void | Promise<void>
  source: 'file' | 'text'
  standalone?: boolean
  initialDestination?: 'new' | 'append'
  lockDestination?: boolean
}

type Mapping = MeasurementMapping

export function ImportPanel({onBlank, text, setText, name, onImport, project, t, onClose, onFile, source, standalone=false, initialDestination,lockDestination=false }: ImportPanelProps) {
  const titleId = useId()
  const modeName = useId()
  const [options, setOptions] = useState<ParseOptions>({ delimiter: 'auto', decimal: 'auto', header: 'auto', skipRows: 0, comments: false })
  const [mappings, setMappings] = useState<Mapping[]>([{ x: 0, y: 1 }])
  const [mode, setMode] = useState<'new' | 'append'>(initialDestination ?? 'new')
  const [skipErrors, setSkipErrors] = useState(false)
  const [error, setError] = useState('')
  const [fullSource, setFullSource] = useState(false)
  const excerpt = text.length > 100000 && !fullSource
  const {table, pending, error: parseError} = useParsedTable(text, options)
  const columns = Math.max(table.headers.length, ...table.rows.slice(0, 200).map(row => row.cells.length), 0)
  const badLines = useMemo(()=>new Set(table.diagnostics.map(diagnostic=>diagnostic.line)),[table])
  const usable = useMemo(()=>table.rows.filter(row=>!badLines.has(row.line)),[table,badLines])
  const uncertaintyDiagnostics=useMemo(()=>{let count=0;const examples:{line:number;column:number;code:string}[]=[];for(const mapping of mappings)for(const row of usable){const issue=uncertaintyIssue(row.values,mapping);if(issue){count++;if(examples.length<100)examples.push({...issue,line:row.line})}}return{count,examples}},[usable,mappings])
  const validMapping = mappings.length > 0 && mappings.every(mapping => mapping.x >= 0 && mapping.y >= 0 && mapping.x < columns && mapping.y < columns&&[mapping.errorX,mapping.errorY].every(c=>c===undefined||c>=0&&c<columns))
  const canBuild = !pending && !parseError && validMapping && !table.ambiguous && usable.length > 0
    && (!(table.diagnostics.length+uncertaintyDiagnostics.count) || skipErrors)
    && mappings.every(mapping => usable.some(row=>measurementRow(row.values,mapping)!==null))

  const columnName = (index: number) => table.headers[index] || `${t('import.column')} ${index + 1}`
  const updateOptions = (update: Partial<ParseOptions>) => {
    setOptions(previous => ({ ...previous, ...update }))
    setSkipErrors(false)
    setError('')
  }
  const updateMapping = (index: number, update: Partial<Mapping>) => {
    setMappings(previous => previous.map((mapping, position) => position === index ? { ...mapping, ...update } : mapping))
  }
  const build = () => {
    if (!canBuild) return
    const fresh = mode === 'new' || (!project.datasets.length && !project.objects.length)
    let next = mode === 'new' ? createProject() : project
    for (const mapping of mappings) {
      const pairs = usable.flatMap(row => {
        const point=measurementRow(row.values,mapping)
        return point?[point]:[]
      })
      if (!pairs.length) { setError(t('import.noValidRows')); return }
      const seriesName = table.headers[mapping.y] || (mappings.length > 1 ? `${name || t('import.series')} · ${columnName(mapping.y)}` : name || t('import.series'))
      next = addPairs(next, pairs, seriesName, { kind: 'import', ...(name ? { displayName: name } : {}) })
      const dataset = next.datasets[next.datasets.length - 1]
      if(mapping.errorX!==undefined||mapping.errorY!==undefined)next={...next,schemaVersion:schemaAtLeast(next.schemaVersion,'1.3.0'),datasets:next.datasets.map(d=>d.id===dataset.id?{...d,uncertainty:{x:{mode:mapping.errorX!==undefined?'per-point':'none'},y:{mode:mapping.errorY!==undefined?'per-point':'none'}}}:d)}
      const sourceLines = usable.filter(row=>measurementRow(row.values,mapping)!==null)
      const previous = next.extensions.sourceRows
      next = { ...next, extensions: { ...next.extensions, sourceRows: { ...(previous && typeof previous === 'object' ? previous : {}), [dataset.id]: Object.fromEntries(dataset.points.map((point, index) => [point.id, sourceLines[index].line])) } } }
    }
    if (fresh) {
      next = {
        ...next,
        project: { ...next.project, title: name || t('common.untitled') },
        axes: {
          x: { ...next.axes.x, label: table.headers[mappings[0].x] || 'X' },
          y: { ...next.axes.y, label: mappings.length === 1 ? table.headers[mappings[0].y] || 'Y' : '' },
        },
      }
      next = fitView(next)
    }
    onImport(next)
  }

  return <section className={`panel import-panel ${standalone?'standalone-import':''}`} role="dialog" aria-labelledby={titleId}>
    <div className="panel-header"><div><h2 id={titleId}>{t(source==='file'?'import.fileTitle':standalone?'import.pasteTitle':'import.title')}</h2>{name && <p>{name}</p>}</div><button type="button" aria-label={t('common.close')} onClick={onClose}>×</button></div>
    <div className="panel-body">{(source==='file'||!standalone)&&<button type="button" className="file-picker" onClick={()=>void (async()=>{try{const file=await openFile('data');if(file){if(onFile)await onFile(file);else setText(decodeText(file.bytes));setSkipErrors(false);setError('')}}catch(e){setError(String(e))}})()}>{t(source==='file'?'import.changeFile':'import.chooseFile')}</button>}
    {source==='text'&&<><label className="field">{t('import.sourceText')}<textarea aria-label={t('import.sourceText')} readOnly={excerpt} value={excerpt ? text.slice(0,20000).split('\n').slice(0,100).join('\n') : text} rows={6} spellCheck={false} onChange={event => { setText(event.target.value); setSkipErrors(false) }} /></label>
    {excerpt && <><p className="muted">{t('import.sourceExcerpt')}</p><button type="button" onClick={()=>setFullSource(true)}>{t('import.editFullSource')}</button></>}</>}
    {pending && <p role="status">{t('import.parsing')}</p>}{parseError && <p role="alert" className="error">{t(parseError)}</p>}
    <div className="fields">
      <label className="field">{t('import.delimiter')}<select aria-label={t('import.delimiter')} value={options.delimiter} onChange={event => updateOptions({ delimiter: event.target.value as ParseOptions['delimiter'] })}>
        <option value="auto">{t('common.auto')}</option><option value="space">{t('import.space')}</option><option value="tab">{t('import.tab')}</option><option value=",">{t('import.comma')}</option><option value=";">{t('import.semicolon')}</option>
      </select></label>
      <label className="field">{t('import.decimal')}<select aria-label={t('import.decimal')} value={options.decimal} onChange={event => updateOptions({ decimal: event.target.value as ParseOptions['decimal'] })}><option value="auto">{t('common.auto')}</option><option value=".">.</option><option value=",">,</option></select></label>
      <label className="field">{t('import.header')}<select aria-label={t('import.header')} value={String(options.header)} onChange={event => updateOptions({ header: event.target.value === 'auto' ? 'auto' : event.target.value === 'true' })}><option value="auto">{t('common.auto')}</option><option value="true">{t('common.yes')}</option><option value="false">{t('common.no')}</option></select></label>
      <label className="field">{t('import.skipRows')}<input aria-label={t('import.skipRows')} type="number" min={0} step={1} value={options.skipRows} onChange={event => updateOptions({ skipRows: Math.max(0, Number(event.target.value) || 0) })} /></label>
      <Check label={t('import.comments')} value={!!options.comments} onChange={comments=>updateOptions({comments})}/>
    </div>
    <fieldset><legend>{t('import.mapping')}</legend>{mappings.map((mapping, index) => <div className="mapping-row" key={index}>
      <label>X<select aria-label={`${t('import.xColumn')} ${index + 1}`} value={mapping.x} onChange={event => updateMapping(index, { x: Number(event.target.value) })}>{Array.from({ length: Math.max(columns, 2) }, (_, column) => <option value={column} key={column}>{columnName(column)}</option>)}</select></label>
      <button type="button" title={t('import.swap')} aria-label={`${t('import.swap')} ${index + 1}`} onClick={() => updateMapping(index, { x: mapping.y, y: mapping.x })}>⇄</button>
      <label>Y<select aria-label={`${t('import.yColumn')} ${index + 1}`} value={mapping.y} onChange={event => updateMapping(index, { y: Number(event.target.value) })}>{Array.from({ length: Math.max(columns, 2) }, (_, column) => <option value={column} key={column}>{columnName(column)}</option>)}</select></label>
      <details className="uncertainty-mapping"><summary>{t('uncertaintySource')}</summary><div className="row">{(['errorX','errorY'] as const).map(key=><label className="field" key={key}>Δ{key==='errorX'?'X':'Y'}<select aria-label={`${t('uncertaintyColumn')} Δ${key==='errorX'?'X':'Y'} ${index+1}`} value={mapping[key]??-1} onChange={e=>updateMapping(index,{[key]:Number(e.target.value)<0?undefined:Number(e.target.value)})}><option value={-1}>{t('uncertaintyNone')}</option>{Array.from({length:columns},(_,column)=><option value={column} key={column}>{columnName(column)}</option>)}</select></label>)}</div></details>
      {mappings.length > 1 && <button type="button" aria-label={`${t('import.removeMapping')} ${index + 1}`} onClick={() => setMappings(previous => previous.filter((_, position) => position !== index))}>×</button>}
    </div>)}<button type="button" disabled={columns < 2} onClick={() => setMappings(previous => [...previous, { x: 0, y: Math.min(columns - 1, previous.length + 1) }])}>{t('import.addMapping')}</button></fieldset>
    <p className="muted" aria-live="polite">{t('import.rows')}: {table.rows.length} · {t('import.validRows')}: {usable.length} · {t('import.problems')}: {table.diagnostics.length}</p>
    {table.ambiguous && <p className="error" role="alert">{t('import.ambiguous')}</p>}
    {table.rows.length > 0 && <div className="table-scroll" style={{ maxHeight: 220, overflow: 'auto' }}><table aria-label={t('import.preview')}><thead><tr><th>{t('import.line')}</th>{Array.from({ length: columns }, (_, column) => <th key={column}>{columnName(column)}</th>)}</tr></thead><tbody>{table.rows.slice(0, 100).map(row => <tr key={row.line} className={badLines.has(row.line) ? 'invalid-row' : undefined}><th scope="row">{row.line}</th>{Array.from({ length: columns }, (_, column) => <td key={column}>{row.cells[column] ?? ''}</td>)}</tr>)}</tbody></table></div>}
    {table.rows.length > 100 && <p className="muted">{t('import.previewLimit')}</p>}
    {table.diagnostics.length > 0 && <details open={table.ambiguous}><summary>{t('import.problems')} ({table.diagnostics.length})</summary><ul>{table.diagnostics.slice(0, 100).map((diagnostic, index) => <li key={index}>{t('import.line')} {diagnostic.line}, {t('import.column')} {diagnostic.column}: {t(`diagnostic.${diagnostic.code}`)} <code>{diagnostic.raw}</code></li>)}</ul></details>}
    {uncertaintyDiagnostics.count>0&&<details><summary>{t('uncertainty')} ({uncertaintyDiagnostics.count})</summary><ul>{uncertaintyDiagnostics.examples.map((d,i)=><li key={i}>{t('import.line')} {d.line}, {t('import.column')} {d.column}: {t(d.code)}</li>)}</ul></details>}
    {table.diagnostics.length+uncertaintyDiagnostics.count > 0 && !table.ambiguous && <Check label={`${t('import.skipConsent')} (${badLines.size})`} value={skipErrors} onChange={setSkipErrors}/>}
    {onBlank&&mode==='new'&&<button type="button" className="blank-sheet-action" onClick={onBlank}>{t('blankSheet')}</button>}
    {lockDestination?<p className="muted">{t('import.append')}</p>:<fieldset className="import-destination"><legend>{t('import.destination')}</legend><label className="check"><input type="radio" name={modeName} checked={mode === 'new'} onChange={() => setMode('new')} /><span>{t('import.newProject')}</span></label><label className="check"><input type="radio" name={modeName} checked={mode === 'append'} onChange={() => setMode('append')} /><span>{t('import.append')}</span></label></fieldset>}
    {error && <p className="error" role="alert">{error}</p>}
    <div className="row"><button type="button" onClick={onClose}>{t('common.cancel')}</button><button type="button" className="primary" disabled={!canBuild} onClick={build}>{t('import.build')}</button></div></div>
  </section>
}
export default ImportPanel
