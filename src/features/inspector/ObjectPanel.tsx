import {useState} from 'react';
import {Eye,EyeOff,LockKeyhole,LockKeyholeOpen,LocateFixed,Type,MessageSquare,ArrowUpRight,RectangleHorizontal,Minus,MoveUpRight,Dot} from 'lucide-react';
import type {ProjectDocument,DrawObject} from '../../domain/model';
import {Panel,type T} from '../../app/controls';
import {createCoordinates} from '../../domain/geometry';
import {returnObjectToCanvas} from '../../domain/objectBounds';
import {addTranslations} from '../../app/i18n';
addTranslations({graphObjects:['Объекты графика','Graph objects'],hiddenObjects:['Скрыто','Hidden'],objectProperties:['Свойства','Properties'],hideObject:['Скрыть','Hide'],showObject:['Показать','Show'],lockObject:['Заблокировать','Lock'],unlockObject:['Разблокировать','Unlock'],returnObject:['Вернуть на холст','Return to canvas'],noObjects:['Дополнительных объектов пока нет. Добавьте текст, выноску или фигуру инструментами.','No additional objects yet. Add text, a callout or a shape using the tools.']});
const icons={text:Type,callout:MessageSquare,arrow:ArrowUpRight,rectangle:RectangleHorizontal,segment:Minus,line:MoveUpRight,marker:Dot,'range-x':RectangleHorizontal,'range-y':RectangleHorizontal};
export function ObjectPanel({project:p,t,onClose,onSelect,onChange}:{project:ProjectDocument;t:T;onClose:()=>void;onSelect:(id:string)=>void;onChange:(label:string,fn:(p:ProjectDocument)=>ProjectDocument)=>void}){
 const [scroll,setScroll]=useState(0),rowHeight=72,start=Math.max(0,Math.floor(scroll/rowHeight)-3),end=Math.min(p.objects.length,start+24),hidden=p.objects.filter(o=>!o.visible).length;
 const names=new Map<string,number>();for(const o of p.objects){const name=o.name||t(o.type);names.set(name,(names.get(name)??0)+1)}
 const change=(o:DrawObject,patch:Partial<DrawObject>)=>onChange('EditObject',q=>({...q,objects:q.objects.map(a=>a.id===o.id?{...a,...patch}:a)}));
 return <Panel title={t('graphObjects')} t={t} className="object-panel" onClose={onClose}><p className="object-summary">{t('graphObjects')} ({p.objects.length}) · {t('hiddenObjects')} {hidden}</p>
  {!p.objects.length?<p className="muted">{t('noObjects')}</p>:<div className="object-list" onScroll={e=>setScroll(e.currentTarget.scrollTop)}><div style={{height:p.objects.length*rowHeight,position:'relative'}}>{p.objects.slice(start,end).map((o,i)=>{const index=start+i,Icon=icons[o.type],name=o.name||t(o.type),accessibleName=(names.get(name)??0)>1?name+' · '+(index+1):name;return <div key={o.id} className="object-row" data-object-row={o.id} data-hidden={!o.visible} style={{position:'absolute',top:index*rowHeight,left:0,right:0,height:rowHeight}}>
   <button className="object-open" aria-label={`${t('objectProperties')}: ${accessibleName}`} onClick={()=>onSelect(o.id)}><Icon size={18}/><span>{name}<small>{t(o.type)} · {index+1}</small></span></button>
   <button aria-label={`${t(o.visible?'hideObject':'showObject')}: ${accessibleName}`} title={t(o.visible?'hideObject':'showObject')} onClick={()=>change(o,{visible:!o.visible})}>{o.visible?<Eye size={17}/>:<EyeOff size={17}/>}</button>
   <button aria-label={`${t(o.locked?'unlockObject':'lockObject')}: ${accessibleName}`} title={t(o.locked?'unlockObject':'lockObject')} onClick={()=>change(o,{locked:!o.locked})}>{o.locked?<LockKeyhole size={16}/>:<LockKeyholeOpen size={16}/>}</button>
   <button disabled={o.locked} aria-label={`${t('returnObject')}: ${accessibleName}`} title={t('returnObject')} onClick={()=>{const canvas=document.querySelector<HTMLElement>('.chart-host'),b=canvas?.getBoundingClientRect(),panel=document.querySelector<HTMLElement>('.object-panel')?.getBoundingClientRect();onChange('MoveObject',q=>({...q,objects:q.objects.map(a=>a.id===o.id?returnObjectToCanvas(q,a,createCoordinates(q,b?.width??q.page.widthPx,b?.height??q.page.heightPx),b&&panel&&panel.left>b.left?panel.left-b.left:undefined):a)}))}}><LocateFixed size={17}/></button>
  </div>})}</div></div>}
 </Panel>;
}
