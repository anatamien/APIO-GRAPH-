import {createProject,id,makeObject,makeSeries,type ProjectDocument,type Point,type Series,type TextPart} from '../../domain/model';
import type {PlotArea} from '../../domain/plotAreas';
import {layoutText} from '../../domain/textGeometry';
import {autoRange} from '../../domain/geometry';
import type {OriginModel} from './model';
import {originTextFrame} from './textFrame';
import {originIndex,originName,originText,resolvePage,type XYLink} from './resolve';
export interface OriginConversion {project:ProjectDocument;issues:{nodeId:string;code:string}[]}
export interface ConvertRequest {nodeId:string;encoding:string;links?:XYLink[]}
const colors=/^#[0-9a-f]{6}$/i;
/** Passive text conversion. Unknown Origin control codes remain in provenance, never execute. */
export function originPlainText(text:string):string{
 const greek:Record<string,string>={D:'Δ',d:'δ',m:'μ',a:'α',b:'β',g:'γ',s:'σ',S:'Σ',w:'ω',W:'Ω',p:'π',q:'θ'};
 return text.replace(/\\\(x([0-9a-f]{4,6})\)/gi,(raw,hex:string)=>parseInt(hex,16)<=0x10ffff?String.fromCodePoint(parseInt(hex,16)):raw).replace(/\\g\((.)\)/g,(_,c:string)=>greek[c]??c).replace(/\\[biu]\(([^()]*)\)/g,'$1').replace(/\\\+\(o\)/g,'°').replace(/\\-\(0\)/g,'₀').replace(/\\[-+]\(([^()]*)\)/g,'$1').replace(/\0+$/,'');
}
export function originTextParts(raw:string):TextPart[]{
 const parts:TextPart[]=[],text=raw.replace(/\\\(x[0-9a-f]{4,6}\)/gi,m=>originPlainText(m)).replace(/\\g\(.\)/g,m=>originPlainText(m)),pattern=/\\([-+biu])\(([^()]*)\)/g;let last=0;for(const match of text.matchAll(pattern)){if(match.index!>last)parts.push({text:text.slice(last,match.index),baseline:'normal',bold:false,italic:false});parts.push({text:match[2],baseline:match[1]==='-'?'sub':match[1]==='+'?'super':'normal',bold:match[1]==='b',italic:match[1]==='i'});last=match.index!+match[0].length}if(last<text.length)parts.push({text:text.slice(last),baseline:'normal',bold:false,italic:false});return parts;
}
export function convertOrigin(model:OriginModel,resources:ReadonlyMap<string,Uint8Array>,request:ConvertRequest):OriginConversion{
 const index=originIndex(model),selected=index.nodes.get(request.nodeId);if(!selected)throw new Error('ORIGIN_NODE_MISSING');
 const page=request.links?undefined:resolvePage(model,request.nodeId),links=request.links??page!.links,issues=page?[...page.issues]:[],p=createProject(),breaks:Record<string,string[]>={},provenance:Record<string,unknown>={},interpolation:Record<string,string>={},units:Record<string,{x:string;y:string}>={},rotations:Record<string,number>={},snapshots:Record<string,{source:string;formulaHex:string}>={},cache=new Map<string,{datasetId:string;breaks:string[]}>();
 p.extensions.canvasTheme='source';p.project.title=originName(page?.graph??selected,request.encoding);p.legend.visible=false;
 const graphs=page?.graph.properties;if(graphs){const w=Number(graphs.widthOriginUnits),h=Number(graphs.heightOriginUnits);if(w>0&&h>0){p.page.widthPx=1200;p.page.heightPx=Math.round(Math.max(200,Math.min(10000,1200*h/w)))}}
 const seriesByLayer=new Map<string,Series[]>();
 for(const link of links){
  const y=index.columns.get(link.y),x=link.x?index.columns.get(link.x):undefined;if(!y||(!x&&!link.rowIndex))throw new Error('ORIGIN_X_REQUIRED');
  if(y.rowCount>1000000||(x?.rowCount??0)>1000000)throw new Error('ORIGIN_POINT_LIMIT');
  const key=`${link.x??'row'}|${link.y}`,yn=index.nodes.get(y.nodeId)!,xn=x?index.nodes.get(x.nodeId):undefined,curve=link.curveId?index.nodes.get(link.curveId):undefined;
  let pair=cache.get(key);
  if(!pair){
   const bytes=(id:string)=>{const b=resources.get(id);if(!b)throw new Error('ORIGIN_INVALID_RESOURCE');return b},yv=bytes(y.values),yt=bytes(y.tags),xd=x?bytes(x.values):undefined,xt=x?bytes(x.tags):undefined,yd=new DataView(yv.buffer,yv.byteOffset,yv.byteLength),xdata=xd?new DataView(xd.buffer,xd.byteOffset,xd.byteLength):undefined;
   if(p.datasets.reduce((n,d)=>n+d.points.length,0)+y.rowCount>2000000)throw new Error('ORIGIN_WORKING_MEMORY_LIMIT');
   const pointNamespace=id().slice(0,24),points:Point[]=[],gapIds:string[]=[],rowRuns:{pointStart:number;sourceStart:number;length:number}[]=[];let gap=false,lastRow=-2;
   const yStart=Number(yn.properties.beginRow??0),xStart=Number(xn?.properties.beginRow??0),rows=y.rowCount;
   for(let row=0;row<rows;row++){
    const sourceRow=yStart+row,xrow=sourceRow-xStart,yvalue=yd.getFloat64(row*8,true),xvalue=xdata&&xrow>=0&&xrow<x!.rowCount?xdata.getFloat64(xrow*8,true):link.rowIndex?sourceRow+1:NaN;
    const usable=(yt[row]&127)===0&&!(yt[row]&128)&&(!xt||(xrow>=0&&xrow<x!.rowCount&&(xt[xrow]&127)===0&&!(xt[xrow]&128)))&&Number.isFinite(yvalue)&&Number.isFinite(xvalue);
    if(!usable){gap=true;continue}
    const point={id:pointNamespace+points.length.toString(16).padStart(12,'0'),x:xvalue,y:yvalue};if(gap&&points.length)gapIds.push(point.id);gap=false;
    if(sourceRow===lastRow+1)rowRuns[rowRuns.length-1].length++;else rowRuns.push({pointStart:points.length,sourceStart:sourceRow,length:1});lastRow=sourceRow;points.push(point);
   }
   if(!points.length){issues.push({nodeId:link.y,code:'ORIGIN_NO_FINITE_XY'});continue}
   const datasetId=id(),name=originPlainText(originText(yn.properties.longNameHex,request.encoding))||originName(yn,request.encoding);
   p.datasets.push({id:datasetId,name,role:'raw',source:{kind:'import',displayName:model.source.name},points});breaks[datasetId]=graphs?.connectMissingData===true?[]:gapIds;
   if(typeof yn.properties.commandHex==='string'&&yn.properties.commandHex)snapshots[datasetId]={source:'Origin',formulaHex:yn.properties.commandHex};
   provenance[datasetId]={xColumn:link.x,yColumn:link.y,rowIndex:!!link.rowIndex,rows:rowRuns,passiveFormulaHex:yn.properties.commandHex??'',xUnitHex:xn?.properties.unitHex??'',yUnitHex:yn.properties.unitHex??'',sampled:false};
   units[datasetId]={x:link.rowIndex?'row':originText(xn?.properties.unitHex,request.encoding),y:originText(yn.properties.unitHex,request.encoding)};pair={datasetId,breaks:gapIds};cache.set(key,pair);
  }
  const dataset=p.datasets.find(d=>d.id===pair.datasetId)!,s=makeSeries(dataset.id,dataset.name,p.series.length),cp=curve?.properties;
  if(cp){s.mode=cp.plotType===201||cp.lineConnect===0?'points':cp.plotType===202?'line-points':'line';s.visible=cp.hidden!==true;s.style.markerVisible=s.mode!=='line';for(const [key,value]of Object.entries({stroke:cp.lineColor,markerStroke:cp.symbolColor,markerFill:cp.symbolFillColor}))if(typeof value==='string'&&colors.test(value))s.style[key as 'stroke']=value;
   const width=Number(cp.lineWidth),opacity=Number(cp.lineOpacity),marker=Number(cp.symbolSize);if(width>0&&width<=20)s.style.strokeWidthPt=Math.max(.1,width*(graphs?p.page.widthPx/Number(graphs.widthOriginUnits):1));if(opacity>=0&&opacity<=1)s.style.opacity=opacity;if(marker>0&&marker<=50)s.style.markerSizePt=marker;s.style.dash=(['solid','dash','dot','dash-dot']as const)[Number(cp.lineStyle)]??'solid';
  }
  if(cp&&Number(cp.lineConnect)>1){interpolation[s.id]=({8:'basis',9:'natural',11:'step-after',12:'step-before',13:'step',14:'step'} as Record<number,string>)[Number(cp.lineConnect)];if([8,9,14].includes(Number(cp.lineConnect)))issues.push({nodeId:link.curveId!,code:'ORIGIN_INTERPOLATION_EQUIVALENCE_UNVERIFIED'})}
  p.series.push(s);const layer=link.layerId??'data',list=seriesByLayer.get(layer)??[];list.push(s);seriesByLayer.set(layer,list);
 }
 if(!p.series.length)throw new Error(issues[0]?.code??'ORIGIN_NO_FINITE_XY');
 const areas:PlotArea[]=[];
 for(const layer of page?.layers??[]){
  const series=seriesByLayer.get(layer.id)??[];if(!series.length)continue;const frame=layer.properties.frame as number[],w=Number(graphs?.widthOriginUnits),h=Number(graphs?.heightOriginUnits);
  if(!Array.isArray(frame)||frame.length!==4||!(w>0&&h>0)||frame.some(v=>!Number.isFinite(v))||!(frame[0]<frame[2]&&frame[1]<frame[3])||frame[0]<0||frame[1]<0||frame[2]>w||frame[3]>h){issues.push({nodeId:layer.id,code:'ORIGIN_FRAME_UNRESOLVED'});continue}
  const axes=structuredClone(p.axes),view={xMin:0,xMax:1,yMin:0,yMax:1};
  for(const dim of ['x','y']as const){const source=layer.properties[`${dim}Axis`] as Record<string,unknown>,axis=axes[dim],min=Number(source.min),max=Number(source.max);axis.mode='manual';axis.min=min;axis.max=max;axis.grid=source.grid===true;axis.minorDivisions=Math.min(10,Math.max(0,Number(source.minorDivisions??0)));axis.strokeWidthPt=Math.max(.1,Math.min(10,(Number(source.strokeWidth??.8)||.8)*p.page.widthPx/w));axis.tickStep=Number(source.step)>0?Number(source.step):1;axis.tickOrigin=0;const decimals=Number(source.tickDecimals),format=Number(source.tickFormat);if(Number.isInteger(decimals)&&decimals>=0&&decimals<=12){axis.numberFormat=format===1?'scientific':'fixed';axis.precision=decimals}else if(decimals===-1&&format===0){let digits=0;while(digits<12&&Math.abs(Number(axis.tickStep.toFixed(digits))-axis.tickStep)>axis.tickStep*1e-10)digits++;if(digits<12){axis.numberFormat='fixed';axis.precision=digits}}axis.tickMode=(max-min)/axis.tickStep<100?'manual':'auto';axis.label=originPlainText(originText(index.nodes.get(`${layer.id}:axis:${dim}`)?.properties.textHex,request.encoding));const first=links.find(link=>link.layerId===layer.id),column=first?index.nodes.get((dim==='x'?first.x:first.y)??''):undefined;axis.unit=originText(column?.properties.unitHex,request.encoding);if(axis.label.includes('%(')){axis.label=axis.unit||dim.toUpperCase();issues.push({nodeId:layer.id,code:'ORIGIN_DYNAMIC_AXIS_TITLE_PARTIAL'})}if(index.nodes.get(`${layer.id}:axis:${dim}`)?.properties.shown===false)axis.label='';if(dim==='x'){view.xMin=min;view.xMax=max}else{view.yMin=min;view.yMax=max}}
  const objectIds:string[]=[];
  for(const text of index.children.get(layer.id)??[]){if(text.kind!=='text'||text.id.endsWith(':legend')||text.properties.shown===false)continue;let raw=originText(text.properties.textHex,request.encoding);const axisDim=text.id.endsWith(':axis:x')?'x':text.id.endsWith(':axis:y')?'y':null;if(axisDim&&originTextFrame(text.properties.frame,Number(text.properties.rotation??0))){if(raw.includes('%('))raw=axes[axisDim].label;axes[axisDim].label=''}const rotation=Number(text.properties.rotation??0),box=originTextFrame(text.properties.frame,rotation);if(!raw.trim()||!box)continue;if(rotation%90)issues.push({nodeId:text.id,code:'ORIGIN_TEXT_ROTATION_EQUIVALENCE_UNVERIFIED'});if(box[0]<0||box[2]>w||box[1]<0||box[3]>h){issues.push({nodeId:text.id,code:'ORIGIN_TEXT_OUTSIDE_PAGE_ARCHIVED'});continue}
   const o=makeObject('text',[{mode:'page',pageX:Math.max(0,Math.min(1,Number(box[0])/w)),pageY:Math.max(0,Math.min(1,Number(box[3])/h))}],originPlainText(raw));o.name=originName(text,request.encoding);o.text=originTextParts(raw);o.style.fontSizePt=Math.max(1,Math.min(200,Number(text.properties.fontSize)||12));const angle=-Number(text.properties.rotation??0),quarter=Math.abs(Math.sin(angle*Math.PI/180))>.99,targetWidth=(quarter?Number(box[3])-Number(box[1]):Number(box[2])-Number(box[0]))*p.page.widthPx/w,targetHeight=(quarter?Number(box[2])-Number(box[0]):Number(box[3])-Number(box[1]))*p.page.heightPx/h,measure=layoutText({...o}).bounds;const fitted=o.style.fontSizePt*Math.min(targetWidth/measure.width,targetHeight/measure.height);if(fitted<6||fitted>200)issues.push({nodeId:text.id,code:'ORIGIN_TEXT_SIZE_ADJUSTED'});o.style.fontSizePt=Math.max(6,Math.min(200,fitted));const measured=layoutText({...o}).bounds,radians=angle*Math.PI/180,cx=(measured.x+measured.width/2),cy=(measured.y+measured.height/2);o.anchors=[{mode:'page',pageX:Math.max(0,Math.min(1,(Number(box[0])+Number(box[2]))/2/w-(cx*Math.cos(radians)-cy*Math.sin(radians))/p.page.widthPx)),pageY:Math.max(0,Math.min(1,(Number(box[1])+Number(box[3]))/2/h-(cx*Math.sin(radians)+cy*Math.cos(radians))/p.page.heightPx))}];rotations[o.id]=angle;const color=text.properties.color;if(typeof color==='string'&&colors.test(color))o.style.stroke=color;p.objects.push(o);objectIds.push(o.id);
  }
  const legendNode=index.nodes.get(`${layer.id}:legend`),legendRaw=originText(legendNode?.properties.textHex,request.encoding),box=legendNode?.properties.frame as number[]|undefined;
  const legend={visible:!!legendRaw&&legendNode?.properties.shown!==false,anchor:{mode:'page' as const,pageX:Math.max(0,Math.min(1,(box?.[0]??0)/w)),pageY:Math.max(0,Math.min(1,(box?.[1]??0)/h))}};
  const legendStyle=legend.visible&&box?{fontSizePt:Math.max(6,((box[3]-box[1])*p.page.heightPx/h)/Math.max(1,series.length)*.55),lineHeightPx:Math.max(12,((box[3]-box[1])*p.page.heightPx/h)/Math.max(1,series.length))}:undefined;
  const display=(dim:'x'|'y')=>{const source=layer.properties[`${dim}Axis`]as Record<string,unknown>;return {numbers:source.labelsVisible!==false,line:source.lineVisible!==false,opposite:source.oppositeHidden===false}};const axisDisplay={x:display('x'),y:display('y')};
  areas.push({legendStyle,axisDisplay,id:layer.id,name:originName(layer,request.encoding),frame:[frame[0]/w,frame[1]/h,frame[2]/w,frame[3]/h],axes,viewport:view,seriesIds:series.map(s=>s.id),objectIds,legend});
 }
 if(page&&!areas.length)throw new Error('ORIGIN_FRAME_UNRESOLVED');
 if(areas.length){p.axes=areas[0].axes;p.viewport=areas[0].viewport;p.legend=areas[0].legend;p.extensions.plotAreas={version:1,activeId:areas[0].id,areas};const owned=new Set(areas.flatMap(a=>a.seriesIds));p.series=p.series.filter(s=>owned.has(s.id));p.datasets=p.datasets.filter(d=>p.series.some(s=>s.datasetId===d.id))}else{p.viewport=autoRange(p);p.axes.x.label=links.some(l=>l.rowIndex)?'Row index':'X';p.axes.y.label='Y'}
 p.extensions.importedSnapshots=snapshots;p.extensions.textRotation=rotations;p.extensions.datasetUnits=units;p.extensions.lineBreaks=breaks;p.extensions.seriesInterpolation=interpolation;p.extensions.originImport={version:1,sourceSHA256:model.source.sha256,sourceName:model.source.name,nodeId:request.nodeId,decoder:model.decoder,datasets:provenance,issues,originalModified:false,formulasExecuted:false};
 return {project:p,issues};
}
