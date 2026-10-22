import type {Language} from '../../app/i18n';
export interface Settings {language:Language;theme:'system'|'light'|'dark';pinned:boolean;left:boolean;repeatTool:boolean;snap:'none'|'dataPoint'|'grid';snapRadius:number;animations:boolean;largeUI:boolean}
const defaults:Settings={language:'ru',theme:'system',pinned:false,left:false,repeatTool:false,snap:'dataPoint',snapRadius:10,animations:true,largeUI:false};
export function loadSettings():Settings{try{return {...defaults,...JSON.parse(localStorage.getItem('apio.settings')??'{}')}}catch{return defaults}}
export function saveSettings(s:Settings){localStorage.setItem('apio.settings',JSON.stringify(s))}
