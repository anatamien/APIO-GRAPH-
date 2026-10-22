import {useMemo,useState} from 'react';
import {Panel,Select,type T} from '../../app/controls';
import {decodeText} from './parser';
import type {OpenedFile} from '../../platform/files';

export function EncodingPanel({file,t,onClose,onAccept}:{file:OpenedFile;t:T;onClose:()=>void;onAccept:(text:string,encoding:string)=>void}){
 const [encoding,setEncoding]=useState('windows-1251');
 const decoded=useMemo(()=>{try{return decodeText(file.bytes,encoding)}catch{return null}},[file,encoding]);
 return <Panel title={t('encoding')} t={t} onClose={onClose}>
  <p>{file.name} · {t('fileSize')}: {file.bytes.length.toLocaleString()}</p>
  <p className="notice">{t('encodingRequired')}</p>
  <Select label={t('encoding')} value={encoding} items={['windows-1251','windows-1252','utf-8','utf-16le','utf-16be','koi8-r'].map(value=>[value,value])} onChange={setEncoding}/>
  {decoded===null?<p role="alert" className="error">{t('encodingInvalid')}</p>:<textarea aria-label={t('preview')} readOnly value={decoded.split(/\r?\n/).slice(0,100).join('\n')}/>}
  <button className="primary" disabled={decoded===null} onClick={()=>{if(decoded!==null)onAccept(decoded,encoding)}}>{t('apply')}</button>
 </Panel>
}
