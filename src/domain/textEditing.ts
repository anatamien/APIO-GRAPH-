import type {TextPart} from './model';
type Style=Partial<Pick<TextPart,'baseline'|'bold'|'italic'>>;
const normal:Omit<TextPart,'text'>={baseline:'normal',bold:false,italic:false};
function merge(parts:TextPart[]):TextPart[]{const result:TextPart[]=[];for(const p of parts){if(!p.text)continue;const last=result.at(-1);if(last&&last.baseline===p.baseline&&last.bold===p.bold&&last.italic===p.italic)last.text+=p.text;else result.push({...p})}return result.length?result:[{...normal,text:''}]}
function slice(parts:TextPart[],start:number,end:number){let offset=0;const result:TextPart[]=[];for(const p of parts){const from=Math.max(0,start-offset),to=Math.min(p.text.length,end-offset);if(to>from)result.push({...p,text:p.text.slice(from,to)});offset+=p.text.length}return result}
function range(text:string,start:number,end:number){start=Math.max(0,Math.min(text.length,start));end=Math.max(start,Math.min(text.length,end));const low=(n:number)=>n>0&&n<text.length&&/[\uDC00-\uDFFF]/.test(text[n])&&/[\uD800-\uDBFF]/.test(text[n-1]);return {start:low(start)?start-1:start,end:low(end)?end+1:end}}
export function formatTextRange(parts:TextPart[],start:number,end:number,style:Style):TextPart[]{const text=parts.map(p=>p.text).join(''),r=range(text,start,end);if(r.start===r.end)return parts;return merge([...slice(parts,0,r.start),...slice(parts,r.start,r.end).map(p=>({...p,...style})),...slice(parts,r.end,text.length)])}
/** Replace the changed span only, keeping all untouched scientific formatting. */
export function replaceText(parts:TextPart[],next:string):TextPart[]{
 const previous=parts.map(p=>p.text).join('');if(next===previous)return parts;let start=0,end=0;
 while(start<Math.min(previous.length,next.length)&&previous[start]===next[start])start++;
 while(end<Math.min(previous.length-start,next.length-start)&&previous[previous.length-1-end]===next[next.length-1-end])end++;
 const r=range(previous,start,previous.length-end);start=r.start;end=previous.length-r.end;
 const before=slice(parts,0,start),after=slice(parts,previous.length-end,previous.length),style=slice(parts,Math.max(0,start-1),Math.max(1,start))[0]??parts[0]??normal;
 return merge([...before,{...style,text:next.slice(start,next.length-end)},...after]);
}
