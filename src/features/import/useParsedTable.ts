import {useEffect,useMemo,useState} from 'react';
import {parseText,type ParsedTable,type ParseOptions} from './parser';
const empty:ParsedTable={headers:[],rows:[],diagnostics:[],delimiter:'space',decimal:'.',ambiguous:false};

/** Large imports stay cancellable without blocking the editor's main thread. */
export function useParsedTable(text:string,options:ParseOptions){
 const large=text.length>100000&&typeof Worker!=='undefined';
 const [remote,setRemote]=useState<{text:string;options:ParseOptions;table?:ParsedTable;error?:string}|null>(null);
 const synchronous=useMemo(()=>large?null:parseText(text,options),[large,text,options]);
 useEffect(()=>{
  if(!large)return;
  let active=true;const worker=new Worker(new URL('./parse.worker.ts',import.meta.url),{type:'module'});
  worker.onmessage=(event:MessageEvent<{table?:ParsedTable;error?:string}>)=>{if(active)setRemote({text,options,...event.data});worker.terminate()};
  worker.onerror=()=>{if(active)setRemote({text,options,error:'import.parseFailure'});worker.terminate()};
  worker.postMessage({text,options});return()=>{active=false;worker.terminate()};
 },[large,text,options]);
 const current=large&&remote?.text===text&&remote.options===options?remote:null;
 return {table:synchronous??current?.table??empty,pending:large&&!current,error:current?.error??''};
}
