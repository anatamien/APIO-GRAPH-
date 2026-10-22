export interface ExportSize {width:number;height:number;dpi:number;units:'px'|'mm';locked:boolean;ratio:number}
export function createExportSize(width:number,height:number):ExportSize{return {width,height,dpi:96,units:'px',locked:true,ratio:width/height}}
const rounded=(n:number,places:number)=>Number(n.toFixed(places));
/** Canonical dimensions stay unrounded; only user-facing values/output pixels round. */
export function displayExportSize(s:ExportSize){const factor=s.units==='mm'?25.4/s.dpi:1,precision=s.units==='mm'?3:0;return {width:rounded(s.width*factor,precision),height:rounded(s.height*factor,precision)}}
export function editExportSide(s:ExportSize,side:'width'|'height',value:number):ExportSize{
 if(!Number.isFinite(value)||value<=0)return s;
 const pixels=s.units==='mm'?value*s.dpi/25.4:Math.round(value);
 return {...s,[side]:pixels,...(s.locked?side==='width'?{height:pixels/s.ratio}:{width:pixels*s.ratio}:{})};
}
export function setExportUnits(s:ExportSize,units:ExportSize['units']):ExportSize{return {...s,units}}
export function setExportDpi(s:ExportSize,dpi:number):ExportSize{const factor=s.units==='mm'?dpi/s.dpi:1;return {...s,dpi,width:s.width*factor,height:s.height*factor}}
export function lockExportAspect(s:ExportSize,locked:boolean):ExportSize{return {...s,locked,ratio:locked&&!s.locked?s.width/s.height:s.ratio}}
