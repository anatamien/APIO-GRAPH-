export const SYMBOLS_EVENT='apio:show-symbols';
export const showSymbols=()=>window.dispatchEvent(new Event(SYMBOLS_EVENT));
export type SymbolGroup='greek'|'math'|'units'|'arrows';
export interface ScientificSymbol {value:string;ru:string;en:string;group:SymbolGroup}
const greekRu=['альфа','бета','гамма','дельта','эпсилон','дзета','эта','тета','йота','каппа','лямбда','мю','ню','кси','омикрон','пи','ро','сигма','тау','ипсилон','фи','хи','пси','омега'];
const greekEn=['alpha','beta','gamma','delta','epsilon','zeta','eta','theta','iota','kappa','lambda','mu','nu','xi','omicron','pi','rho','sigma','tau','upsilon','phi','chi','psi','omega'];
export const scientificSymbols:ScientificSymbol[]=[
 ...[...'αβγδεζηθικλμνξοπρστυφχψωΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ'].map((value,i)=>({value,ru:greekRu[i%24]+(i>=24?' прописная':''),en:greekEn[i%24]+(i>=24?' uppercase':''),group:'greek' as const})),
 ...(['±|плюс минус|plus minus','×|умножение|multiply','⋅|скалярное произведение|dot product','÷|деление|division','≈|приблизительно равно|approximately equal','≠|не равно|not equal','≤|меньше или равно|less or equal','≥|больше или равно|greater or equal','∞|бесконечность|infinity','∂|частная производная|partial derivative','∫|интеграл|integral','√|корень|square root','∑|сумма|sum','∏|произведение|product','∈|принадлежит|element of','∝|пропорционально|proportional'].map(row=>{const [value,ru,en]=row.split('|');return {value,ru,en,group:'math' as const}})),
 ...(['°|градус|degree','Å|ангстрем|angstrom','ℏ|постоянная Планка|Planck constant','‰|промилле|per mille','′|угловая минута|arcminute','″|угловая секунда|arcsecond','ℓ|литр|litre'].map(row=>{const [value,ru,en]=row.split('|');return {value,ru,en,group:'units' as const}})),
 ...(['→|стрелка вправо|right arrow','←|стрелка влево|left arrow','↑|стрелка вверх|up arrow','↓|стрелка вниз|down arrow','↔|двунаправленная стрелка|bidirectional arrow','⇒|следовательно|implies'].map(row=>{const [value,ru,en]=row.split('|');return {value,ru,en,group:'arrows' as const}})),
];
const key='apio.symbol-preferences.v1';
export interface SymbolPreferences {recent:string[];favorites:string[]}
export function symbolPreferences():SymbolPreferences{try{const text=localStorage.getItem(key)??'{}';if(text.length>12000)return {recent:[],favorites:[]};const raw=JSON.parse(text),allowed=new Set(scientificSymbols.map(s=>s.value));return {recent:Array.isArray(raw.recent)?raw.recent.filter((v:unknown)=>typeof v==='string'&&allowed.has(v)).slice(0,16):[],favorites:Array.isArray(raw.favorites)?raw.favorites.filter((v:unknown)=>typeof v==='string'&&allowed.has(v)).slice(0,80):[]}}catch{return {recent:[],favorites:[]}}}
export function saveSymbolPreferences(value:SymbolPreferences){try{localStorage.setItem(key,JSON.stringify(value))}catch{/* Device preferences are optional; editing remains available. */}}
