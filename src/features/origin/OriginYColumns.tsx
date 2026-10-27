import {useMemo,useState} from 'react';
import type {T} from '../../app/controls';
import type {OriginModel,OriginColumn} from './model';
import {originIndex,originName} from './resolve';
export function OriginYColumns({model,columns,encoding,selected,onChange,t}:{model:OriginModel;columns:OriginColumn[];encoding:string;x:string;selected:string[];onChange:(ids:string[])=>void;t:T}){
 const [top,setTop]=useState(0),index=originIndex(model),checked=useMemo(()=>new Set(selected),[selected]),virtual=columns.length>40,start=virtual?Math.max(0,Math.floor(top/32)-2):0,last=virtual?Math.min(columns.length,start+14):columns.length;
 return <fieldset className="origin-y-columns" onScroll={e=>setTop(e.currentTarget.scrollTop)}><legend>{t('originYColumns')}</legend><div style={virtual?{height:columns.length*32,position:'relative'}:undefined}>{columns.slice(start,last).map((c,i)=><label className="check" key={c.nodeId} style={virtual?{position:'absolute',top:(start+i)*32,height:32,left:0,right:0,boxSizing:'border-box',whiteSpace:'nowrap',overflow:'hidden'}:undefined}><input type="checkbox" checked={checked.has(c.nodeId)} onChange={e=>onChange(e.target.checked?[...selected,c.nodeId]:selected.filter(id=>id!==c.nodeId))}/>{originName(index.nodes.get(c.nodeId)!,encoding)} ({c.role})</label>)}</div></fieldset>;
}
