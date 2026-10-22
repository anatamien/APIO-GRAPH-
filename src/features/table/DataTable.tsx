import { useEffect, useId, useMemo, useRef, useState } from 'react'
import {Plus,Copy,Trash2,SlidersHorizontal,ChevronDown} from 'lucide-react'
import type { ClipboardEvent, KeyboardEvent } from 'react'
import type { ProjectDocument } from '../../domain/model'
import { addPairs, id } from '../../domain/model'
import { deletePoint, editPoint } from '../../domain/commands'
import { createCoordinates,pointIndex } from '../../domain/geometry'
import { addTranslations } from '../../app/i18n'
import { parseNumber, parseText } from '../import/parser'
import type { ParseOptions } from '../import/parser'
import {Check} from '../../app/controls'

addTranslations({
  'table.firstPoint':['Добавить первую точку','Add first point'], 'table.pasteValues':['Вставить значения','Paste values'],
  'table.addData':['Добавить данные к графику','Add data to graph'], 'table.fromFile':['Из файла','From file'], 'table.fromPaste':['Вставить таблицу','Paste a table'], 'table.fromManual':['Ввести вручную','Enter manually'],
  'table.raw':['Исходные данные','Source data'], 'table.calculated':['Расчёт · только чтение','Calculated · read-only'], 'table.properties':['Свойства выбранной серии','Selected series properties'], 'table.newX':['Новая точка X','New point X'], 'table.newY':['Новая точка Y','New point Y'], 'table.commitRow':['Добавить точку','Add point'],
  'table.emptyTitle':['Данных пока нет','No data yet'], 'table.emptyHint':['Добавьте первую точку или вставьте значения X/Y.','Add the first point or paste X/Y values.'], 'table.draftHint':['Новая серия на текущих осях. Сохранится после ввода X и Y.','A new series on the current axes. Saved after entering X and Y.'],
  'table.sortConfirm':['Сортировка изменит исходный порядок точек. Продолжить?','Sorting changes the original point order. Continue?'], 'table.copy':['Копировать таблицу','Copy table'], 'table.copyError':['Не удалось скопировать данные.','Could not copy data.'],
  'table.derivedReadOnly': ['Расчетный ряд доступен только для чтения. Измените исходные данные и пересчитайте результат.', 'Calculated data is read-only. Edit the source data and recalculate the result.'],
  'common.close': ['Закрыть', 'Close'], 'import.decimal': ['Десятичный символ', 'Decimal symbol'],
  'table.title': ['Таблица данных', 'Data table'], 'table.dataset': ['Серия / набор данных', 'Series / dataset'], 'table.noData': ['Нет данных', 'No data'],
  'table.edit': ['Изменить координату', 'Edit coordinate'], 'table.addRow': ['Добавить строку', 'Add row'], 'table.newSeries': ['Новая серия', 'New series'],
  'table.manualSeries': ['Ручные данные', 'Manual data'], 'table.duplicate': ['Дублировать строку', 'Duplicate row'], 'table.delete': ['Удалить строку', 'Delete row'],
  'table.sortX': ['Сортировать по X', 'Sort by X'], 'table.sortY': ['Сортировать по Y', 'Sort by Y'], 'table.rowCount': ['Всего строк', 'Total rows'],
  'table.editHint': ['Двойной щелчок или F2 — изменить; Enter — применить, Esc — отменить.', 'Double-click or F2 to edit; Enter applies, Esc cancels.'],
  'table.data': ['Координаты точек', 'Point coordinates'], 'table.row': ['Строка', 'Row'], 'table.selectRow': ['Выбрать строку', 'Select row'],
  'table.detachConfirm': ['Точка связана с объектами. Удалить точку и отвязать объекты с сохранением координат?', 'This point has linked objects. Delete it and detach objects at their last coordinates?'],
  'table.editError': ['Не удалось изменить строку.', 'Could not edit the row.'], 'table.paste': ['Вставить диапазон', 'Paste range'],
  'table.pastePreview': ['Предпросмотр вставки', 'Paste preview'], 'table.pasteTarget': ['Начать со строки', 'Start at row'], 'table.pasteColumn': ['Начать со столбца', 'Start at column'],
  'table.pasteApply': ['Применить диапазон', 'Apply range'], 'table.pasteHint': ['Существующие точки сохранят свои идентификаторы; новые пары будут добавлены в конец.', 'Existing points keep their IDs; new pairs are appended at the end.'],
  'table.pasteColumns': ['Для диапазона нужны один или два числовых столбца.', 'A range requires one or two numeric columns.'],
  'table.pasteOverflow': ['Два столбца можно вставить начиная с X.', 'Start at X to paste two columns.'],
  'table.pasteNeedsPairs': ['Для новых строк укажите обе координаты X и Y.', 'New rows require both X and Y coordinates.'],
  'table.skipPasteErrors': ['Пропустить ошибочные строки', 'Skip invalid rows'], 'table.pasteCount': ['Строк к вставке', 'Rows to paste'],
  'table.pasteAppended': ['Новых точек', 'New points'],
  'diagnostic.empty_value': ['Пустое числовое значение', 'Empty numeric value'], 'diagnostic.invalid_number': ['Недопустимое число', 'Invalid number'],
  'diagnostic.non_finite_number': ['Число должно быть конечным', 'Number must be finite'], 'diagnostic.column_count': ['Число колонок отличается от остальных строк', 'Column count differs from the other rows'],
  'diagnostic.ambiguous_format': ['Неоднозначный формат данных', 'Ambiguous data format'], 'diagnostic.unclosed_quote': ['Незакрытая кавычка', 'Unclosed quote'],
  'diagnostic.unexpected_quote': ['Неожиданная кавычка внутри поля', 'Unexpected quote in a field'], 'diagnostic.characters_after_quote': ['Символы после закрывающей кавычки', 'Characters after a closing quote'],
})

export interface DataTableProps {
  project: ProjectDocument
  onChange: (label: string, transform: (project: ProjectDocument) => ProjectDocument) => void
  t: (key: string) => string
  onClose: () => void
  onAddData?: (source:'file'|'text') => void
  onProperties?: (seriesId:string) => void
}

type Editing = { pointId: string; field: 'x' | 'y'; draft: string }
const rowHeight = 34
const viewportHeight = 360
const numberText = (value: number) => Object.is(value, -0) ? '-0' : String(value)

export function DataTable({ project, onChange, t, onClose,onAddData,onProperties }: DataTableProps) {
  const titleId = useId()
  const [seriesId, setSeriesId] = useState(project.series[0]?.id || '')
  const [addMenu,setAddMenu]=useState(false)
  const [newSeriesDraft,setNewSeriesDraft]=useState(false)
  const [rowDraft,setRowDraft]=useState<{datasetId?:string;x:string;y:string}|null>(null)
  const [tableHeight,setTableHeight]=useState(viewportHeight)
  const [selectedPointId, setSelectedPointId] = useState('')
  const [selectedField, setSelectedField] = useState<'x' | 'y'>('x')
  const [editing, setEditing] = useState<Editing | null>(null)
  const [decimal, setDecimal] = useState<'.' | ','>('.')
  const [scrollTop, setScrollTop] = useState(0)
  const [error, setError] = useState('')
  const [pasteText, setPasteText] = useState<string | null>(null)
  const [pasteOptions, setPasteOptions] = useState<ParseOptions>({ delimiter: 'auto', decimal: 'auto', header: 'auto' })
  const [pasteRow, setPasteRow] = useState(0)
  const [pasteField, setPasteField] = useState<'x' | 'y'>('x')
  const [skipPasteErrors, setSkipPasteErrors] = useState(false)
  const scroller = useRef<HTMLDivElement>(null)
  const series=newSeriesDraft?undefined:project.series.find(item=>item.id===seriesId)
  const dataset = series&&project.datasets.find(item => item.id === series.datasetId)
  const derived = dataset?.role === 'derived'
  const points = dataset?.points ?? []
  const indices=useMemo(()=>pointIndex(points),[points])
  const selectedIndex=indices.get(selectedPointId)
  const selected = selectedIndex===undefined?undefined:points[selectedIndex]
  const first = Math.max(0, Math.min(Math.max(0, points.length - 1), Math.floor(scrollTop / rowHeight) - 4))
  const last = Math.min(points.length, first + Math.ceil(tableHeight / rowHeight) + 8)
  useEffect(()=>{const node=scroller.current;if(!node)return;const observer=new ResizeObserver(()=>setTableHeight(node.clientHeight));observer.observe(node);return()=>observer.disconnect()},[])
  const cancelRow=()=>{setRowDraft(null);setNewSeriesDraft(false);setError('')}
  let draftValid=false
  if(rowDraft)try{parseNumber(rowDraft.x,decimal);parseNumber(rowDraft.y,decimal);draftValid=true}catch{/* Incomplete drafts never enter the document. */}
  const pasted = useMemo(() => parseText(pasteText ?? '', pasteOptions), [pasteText, pasteOptions])
  const pasteBadLines = new Set(pasted.diagnostics.map(item => item.line))
  const pasteRows = pasted.rows.filter(row => !pasteBadLines.has(row.line))
  const pasteColumns = pasted.headers.length || pasted.rows[0]?.cells.length || 0
  const pasteProblem = pasteColumns < 1 || pasteColumns > 2 ? 'table.pasteColumns'
    : pasteColumns === 2 && pasteField === 'y' ? 'table.pasteOverflow'
    : pasteColumns === 1 && pasteRow + pasteRows.length > points.length ? 'table.pasteNeedsPairs' : ''
  const canPaste = pasteRows.length > 0 && !pasted.ambiguous && !pasteProblem && (!pasted.diagnostics.length || skipPasteErrors)

  const startEditing = (pointId: string, field: 'x' | 'y') => {
    if (derived) return
    const index=indices.get(pointId),point=index===undefined?undefined:points[index]
    if (!point) return
    setSelectedPointId(pointId)
    setSelectedField(field)
    setEditing({ pointId, field, draft: decimal === ',' ? numberText(point[field]).replace('.', ',') : numberText(point[field]) })
    setError('')
  }
  const commitEditing = () => {
    if (!editing || !dataset) return
    let value: number
    try { value = parseNumber(editing.draft, decimal) }
    catch (caught) { setError(t(`diagnostic.${caught instanceof Error ? caught.message : 'invalid_number'}`)); return }
    const targetDataset = dataset.id
    const { pointId, field } = editing
    onChange('table.edit', current => {
      const point = current.datasets.find(item => item.id === targetDataset)?.points.find(item => item.id === pointId)
      return !point || Object.is(point[field], value) ? current : editPoint(current, targetDataset, pointId, { x: point.x, y: point.y, [field]: value })
    })
    setEditing(null)
    setError('')
  }
  const editKeys = (event: KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation()
    if (event.key === 'Escape') { event.preventDefault(); setEditing(null); setError('') }
    if (event.key === 'Enter') { event.preventDefault(); commitEditing() }
  }
  const beginManual=()=>{setAddMenu(false);setNewSeriesDraft(true);setRowDraft({x:'',y:''});setSelectedPointId('');setEditing(null);setError('')}
  const commitRow=()=>{
    if(!rowDraft||!draftValid)return
    const xy={x:parseNumber(rowDraft.x,decimal),y:parseNumber(rowDraft.y,decimal)},pointId=id();let created=''
    onChange('table.addRow',current=>{
      if(!rowDraft.datasetId){const next=addPairs(current,[xy],`${t('table.manualSeries')} ${current.series.length+1}`,{kind:'manual'});created=next.series.at(-1)!.id;return next}
      const target=current.datasets.find(d=>d.id===rowDraft.datasetId);if(!target||target.role==='derived')return current
      const next={...current,datasets:current.datasets.map(d=>d.id===target.id?{...d,points:[...d.points,{id:pointId,...xy}]}:d)}
      return editPoint(next,target.id,pointId,xy)
    })
    if(created)setSeriesId(created);setNewSeriesDraft(false);setRowDraft(null);setSelectedPointId(created?'':pointId);setError('')
    if(scroller.current){scroller.current.scrollTop=Math.max(0,points.length*rowHeight-tableHeight/2);setScrollTop(scroller.current.scrollTop)}
  }
  const addRow = (duplicate = false) => {
    if (derived) return
    if(!duplicate){setRowDraft({...(dataset?{datasetId:dataset.id}:{}),x:'',y:''});setEditing(null);setError('');return}
    if (!dataset||!selected) return
    const targetDataset = dataset.id
    const pointId = id()
    const source = { x: selected.x, y: selected.y }
    onChange(duplicate ? 'table.duplicate' : 'table.addRow', current => {
      const currentDataset = current.datasets.find(item => item.id === targetDataset)
      if (!currentDataset) return current
      const index = duplicate ? currentDataset.points.findIndex(point => point.id === selected?.id) + 1 : currentDataset.points.length
      const nextPoints = [...currentDataset.points.slice(0, index), { id: pointId, ...source }, ...currentDataset.points.slice(index)]
      const next = { ...current, datasets: current.datasets.map(item => item.id === targetDataset ? { ...item, points: nextPoints } : item) }
      return editPoint(next, targetDataset, pointId, source)
    })
    setSelectedPointId(pointId)
    setEditing(null)
    const index = duplicate ? points.findIndex(point => point.id === selected?.id) + 1 : points.length
    if (scroller.current) { scroller.current.scrollTop = Math.max(0, index * rowHeight - viewportHeight / 2); setScrollTop(scroller.current.scrollTop) }
  }
  const removeRow = () => {
    if (derived) return
    if (!selected || !dataset) return
    const targetDataset = dataset.id
    const pointId = selected.id
    onChange('table.delete', current => {
      try { return deletePoint(current, targetDataset, pointId, false) }
      catch (caught) {
        if (caught instanceof Error && caught.message === 'POINT_HAS_LINKS') {
          const canvas=document.querySelector<HTMLElement>('.chart-host');
          return window.confirm(t('table.detachConfirm')) ? deletePoint(current, targetDataset, pointId, true, createCoordinates(current,canvas?.clientWidth??current.page.widthPx,canvas?.clientHeight??current.page.heightPx)) : current
        }
        setError(t('table.editError'))
        return current
      }
    })
    setEditing(null)
  }
  const sortRows = (field: 'x' | 'y') => {
    if (derived) return
    if (!dataset || !points.length || !window.confirm(t('table.sortConfirm'))) return
    const targetDataset = dataset.id
    onChange(field === 'x' ? 'table.sortX' : 'table.sortY', current => {
      const original = current.datasets.find(item => item.id === targetDataset)
      if (!original) return current
      const sorted = [...original.points].sort((left, right) => left[field] - right[field])
      if (sorted.every((point, index) => point.id === original.points[index].id)) return current
      const next = { ...current, datasets: current.datasets.map(item => item.id === targetDataset ? { ...item, points: sorted } : item) }
      return editPoint(next, targetDataset, sorted[0].id, sorted[0])
    })
    setEditing(null)
  }
  const openPaste = (text: string) => {
    if (derived) { setError(t('table.derivedReadOnly')); return }
    setPasteRow(Math.max(0, points.findIndex(point => point.id === selected?.id)))
    setPasteField(editing?.field ?? selectedField)
    setPasteText(text)
    setSkipPasteErrors(false)
    setEditing(null)
  }
  const paste = (event: ClipboardEvent<HTMLElement>) => {
    event.stopPropagation()
    const text = event.clipboardData.getData('text/plain')
    if (!text) return
    const target = event.target as HTMLElement
    if (target.tagName === 'TEXTAREA' || (target.tagName === 'INPUT' && !/[\t\r\n]/.test(text))) return
    event.preventDefault()
    openPaste(text)
  }
  const copyTable=async()=>{try{await navigator.clipboard.writeText(points.map(p=>`${numberText(p.x)}\t${numberText(p.y)}`).join('\n'))}catch{setError(t('table.copyError'))}}
  const applyPaste = () => {
    if (!canPaste || derived) return
    const targetDataset = dataset?.id
    let created=''
    onChange('table.paste', current => {
      if (!targetDataset) {
        const next = addPairs(current, pasteRows.map(row => ({ x: row.values[0]!, y: row.values[1]! })), `${t('table.manualSeries')} ${current.series.length + 1}`, { kind: 'clipboard' })
        created=next.series.at(-1)!.id
        return next
      }
      const original = current.datasets.find(item => item.id === targetDataset)
      if (!original) return current
      const nextPoints = [...original.points]
      for (const [offset, row] of pasteRows.entries()) {
        const position = pasteRow + offset
        const point = nextPoints[position]
        if (point) nextPoints[position] = pasteColumns === 2
          ? { ...point, x: row.values[0]!, y: row.values[1]! }
          : { ...point, [pasteField]: row.values[0]! }
        else nextPoints.push({ id: id(), x: row.values[0]!, y: row.values[1]! })
      }
      const next = { ...current, datasets: current.datasets.map(item => item.id === targetDataset ? { ...item, points: nextPoints } : item) }
      return editPoint(next, targetDataset, nextPoints[pasteRow].id, nextPoints[pasteRow])
    })
    if(created)setSeriesId(created)
    setNewSeriesDraft(false)
    setRowDraft(null)
    setPasteText(null)
  }
  const cell = (pointId: string, field: 'x' | 'y', value: number, index: number) => editing?.pointId === pointId && editing.field === field
    ? <input autoFocus aria-label={`${field.toUpperCase()} ${index + 1}`} value={editing.draft} spellCheck={false} onFocus={event => event.target.select()} onChange={event => setEditing(previous => previous ? { ...previous, draft: event.target.value } : null)} onBlur={commitEditing} onKeyDown={editKeys} />
    : <button type="button" className="cell-button" aria-label={`${field.toUpperCase()} ${index + 1}: ${numberText(value)}`} onClick={() => { setSelectedPointId(pointId); setSelectedField(field) }} onDoubleClick={() => startEditing(pointId, field)} onKeyDown={event => { if (event.key === 'F2' || event.key === 'Enter') { event.preventDefault(); event.stopPropagation(); startEditing(pointId, field) } }}>{numberText(value)}</button>

  return <section className="panel data-panel" role="dialog" aria-labelledby={titleId} onPaste={paste}>
    <div className="panel-header"><h2 id={titleId}>{t('table.title')}</h2><button type="button" aria-label={t('common.close')} onClick={onClose}>×</button></div>
    <div className="panel-body data-table-body">
    <div className="data-context"><label className="field">{t('table.dataset')}<select aria-label={t('table.dataset')} value={newSeriesDraft?'draft':series?.id || ''} disabled={!project.series.length} onChange={event => { setSeriesId(event.target.value);cancelRow();setSelectedPointId('');setEditing(null);setScrollTop(0); if (scroller.current) scroller.current.scrollTop = 0 }}>
      {(!series||newSeriesDraft)&&<option value={newSeriesDraft?'draft':''}>{t(newSeriesDraft?'table.manualSeries':'table.noData')}</option>}{project.series.map(item => <option value={item.id} key={item.id}>{item.name}</option>)}
    </select></label>
    <div className="data-meta"><span className="data-badge">{t(derived?'table.calculated':'table.raw')}</span><span>{t('table.rowCount')}: {points.length}</span>{onProperties&&<button type="button" className="icon-button" aria-label={t('table.properties')} title={t('table.properties')} disabled={!series} onClick={()=>series&&onProperties(series.id)}><SlidersHorizontal size={16}/></button>}</div>
    <button className="data-add-menu" type="button" aria-expanded={addMenu} onClick={()=>setAddMenu(value=>!value)}><Plus size={16}/>{t('table.addData')}<ChevronDown size={14}/></button>
    {addMenu&&<div className="data-add-options" role="group" aria-label={t('table.addData')}><button type="button" onClick={()=>onAddData?.('file')}>{t('table.fromFile')}</button><button type="button" onClick={()=>onAddData?.('text')}>{t('table.fromPaste')}</button><button type="button" onClick={beginManual}>{t('table.fromManual')}</button></div>}
    </div>
    <div className="data-row-actions" role="group" aria-label={t('table.data')}><button type="button" className="primary" disabled={derived} onClick={() => addRow()}><Plus size={16}/>{t('table.addRow')}</button><button type="button" className="icon-button" aria-label={t('table.duplicate')} title={t('table.duplicate')} disabled={!selected || derived} onClick={() => addRow(true)}><Copy size={16}/></button><button type="button" className="icon-button" aria-label={t('table.delete')} title={t('table.delete')} disabled={!selected || derived} onClick={removeRow}><Trash2 size={16}/></button><button type="button" className="icon-button" aria-label={t('table.copy')} title={t('table.copy')} disabled={!points.length} onClick={()=>void copyTable()}><Copy size={16}/></button></div>
    <div className="data-commands"><button type="button" disabled={derived} onClick={() => openPaste('')}>{t('table.paste')}</button><button type="button" title={t('table.sortConfirm')} disabled={!points.length || derived} onClick={() => sortRows('x')}>{t('table.sortX')}</button><button type="button" title={t('table.sortConfirm')} disabled={!points.length || derived} onClick={() => sortRows('y')}>{t('table.sortY')}</button><label className="data-decimal" title={t('import.decimal')}><select aria-label={t('import.decimal')} value={decimal} onChange={event => { setDecimal(event.target.value as '.' | ','); setEditing(null); setError('') }}><option value=".">.</option><option value=",">,</option></select></label></div>
    {derived ? <p className="muted data-help">{t('table.derivedReadOnly')}</p>:<p className="muted data-help">{t('table.editHint')}</p>}
    {rowDraft&&<div className="data-row-draft" onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();cancelRow()}if(e.key==='Enter'){e.preventDefault();e.stopPropagation();commitRow()}}}>{newSeriesDraft&&<small className="muted">{t('table.draftHint')}</small>}<div className="draft-coordinates"><label className="field">X<input autoFocus aria-label={t('table.newX')} value={rowDraft.x} spellCheck={false} onChange={e=>setRowDraft({...rowDraft,x:e.target.value})}/></label><label className="field">Y<input aria-label={t('table.newY')} value={rowDraft.y} spellCheck={false} onChange={e=>setRowDraft({...rowDraft,y:e.target.value})}/></label></div><div className="row"><button type="button" onClick={cancelRow}>{t('cancel')}</button><button type="button" className="primary" disabled={!draftValid} onClick={commitRow}>{t('table.commitRow')}</button></div></div>}
    {error && <p className="error" role="alert">{error}</p>}
    <div ref={scroller} className="table-scroll data-grid" tabIndex={0} aria-label={t('table.data')} onScroll={event => setScrollTop(event.currentTarget.scrollTop)}>
      <table aria-label={t('table.data')} aria-rowcount={points.length + 1} style={{ width: '100%', tableLayout: 'fixed' }}><thead style={{ position: 'sticky', top: 0, zIndex: 1 }}><tr style={{ height: rowHeight }}><th style={{ width: 66 }}>{t('table.row')}</th><th>X</th><th>Y</th></tr></thead><tbody>
        {first > 0 && <tr aria-hidden="true" style={{ height: first * rowHeight }}><td colSpan={3} style={{ padding: 0, border: 0 }} /></tr>}
        {points.slice(first, last).map((point, offset) => {
          const index = first + offset
          return <tr key={point.id} data-point-id={point.id} aria-rowindex={index + 2} aria-selected={selected?.id === point.id} style={{ height: rowHeight }} className={selected?.id === point.id ? 'selected-row' : undefined}><th scope="row"><button type="button" aria-label={`${t('table.selectRow')} ${index + 1}`} onClick={() => setSelectedPointId(point.id)}>{index + 1}</button></th><td>{cell(point.id, 'x', point.x, index)}</td><td>{cell(point.id, 'y', point.y, index)}</td></tr>
        })}
        {last < points.length && <tr aria-hidden="true" style={{ height: (points.length - last) * rowHeight }}><td colSpan={3} style={{ padding: 0, border: 0 }} /></tr>}
      </tbody></table>
      {!points.length && !rowDraft&&<div className="data-empty"><strong>{t('table.emptyTitle')}</strong><p>{t('table.emptyHint')}</p><button type="button" onClick={()=>addRow()}>{t('table.firstPoint')}</button><button type="button" onClick={()=>openPaste('')}>{t('table.pasteValues')}</button></div>}
    </div>
    {pasteText !== null && <section className="panel paste-panel" role="dialog" aria-label={t('table.pastePreview')}><div className="panel-header"><h3>{t('table.pastePreview')}</h3><button type="button" aria-label={t('common.close')} onClick={() => setPasteText(null)}>×</button></div>
      <label className="field">{t('sourceText')}<textarea aria-label={t('sourceText')} value={pasteText} rows={4} onChange={event => { setPasteText(event.target.value); setSkipPasteErrors(false) }} /></label>
      <div className="fields"><label className="field">{t('delimiter')}<select aria-label={t('delimiter')} value={pasteOptions.delimiter} onChange={event => { setPasteOptions(previous => ({ ...previous, delimiter: event.target.value as ParseOptions['delimiter'] })); setSkipPasteErrors(false) }}><option value="auto">{t('auto')}</option><option value="tab">{t('tab')}</option><option value="space">{t('space')}</option><option value=",">,</option><option value=";">;</option></select></label>
        <label className="field">{t('decimal')}<select aria-label={t('decimal')} value={pasteOptions.decimal} onChange={event => { setPasteOptions(previous => ({ ...previous, decimal: event.target.value as ParseOptions['decimal'] })); setSkipPasteErrors(false) }}><option value="auto">{t('auto')}</option><option value=".">.</option><option value=",">,</option></select></label>
        <label className="field">{t('table.pasteTarget')}<input type="number" min={1} max={points.length + 1} value={pasteRow + 1} onChange={event => setPasteRow(Math.max(0, Math.min(points.length, (Number(event.target.value) || 1) - 1)))} /></label>
        <label className="field">{t('table.pasteColumn')}<select aria-label={t('table.pasteColumn')} value={pasteField} onChange={event => setPasteField(event.target.value as 'x' | 'y')}><option value="x">X</option><option value="y">Y</option></select></label>
      </div><p className="muted">{t('table.pasteHint')}</p><p aria-live="polite">{t('table.pasteCount')}: {pasteRows.length} · {t('table.pasteAppended')}: {Math.max(0, pasteRow + pasteRows.length - points.length)}</p>
      <div className="table-scroll" style={{ maxHeight: 180, overflow: 'auto' }}><table aria-label={t('preview')}><thead><tr><th>{t('row')}</th><th>{pasteColumns === 1 ? pasteField.toUpperCase() : 'X'}</th>{pasteColumns > 1 && <th>Y</th>}</tr></thead><tbody>{pasted.rows.slice(0, 100).map(row => <tr key={row.line} className={pasteBadLines.has(row.line) ? 'invalid-row' : undefined}><th>{row.line}</th>{row.cells.map((value, index) => <td key={index}>{value}</td>)}</tr>)}</tbody></table></div>
      {pasteProblem && <p className="error" role="alert">{t(pasteProblem)}</p>}
      {pasted.diagnostics.length > 0 && <div className="error" role="alert"><p>{t('reported')}: {pasted.diagnostics.length}</p><ul>{pasted.diagnostics.slice(0, 100).map((diagnostic, index) => <li key={index}>{t('row')} {diagnostic.line}, {t('column')} {diagnostic.column}: {t(`diagnostic.${diagnostic.code}`)} <code>{diagnostic.raw}</code></li>)}</ul></div>}
      {pasted.diagnostics.length > 0 && !pasted.ambiguous && <Check label={`${t('table.skipPasteErrors')} (${pasteBadLines.size})`} value={skipPasteErrors} onChange={setSkipPasteErrors}/>}
      <div className="row"><button type="button" onClick={() => setPasteText(null)}>{t('cancel')}</button><button type="button" className="primary" disabled={!canPaste} onClick={applyPaste}>{t('table.pasteApply')}</button></div>
    </section>}</div>
  </section>
}
export default DataTable
