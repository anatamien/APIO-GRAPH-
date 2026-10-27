import type {TextPart} from './model';
import {replaceText} from './textEditing';
export interface TableNumberFormat {mode:'original'|'fixed'|'scientific';digits:number}
const token='[+−-]?(?:[0-9]+(?:[.,][0-9]*)?|[.,][0-9]+)(?:[eE][+−-]?[0-9]+)?';
const numeric=new RegExp(`^(\\s*)(${token})(?:(\\s*(?:±|\\+/-)\\s*)(${token}))?(\\s*%?\\s*)$`);
function decimal(text:string){const m=/^([+−-]?)(\d*)(?:([.,])(\d*))?(?:[eE]([+−-]?\d+))?$/.exec(text);if(!m)return null;const digits=(m[2]+(m[4]??'')).replace(/^0+/,'')||'0',exp=Number((m[5]??'0').replace('−','-'));if(digits.length>1000||Math.abs(exp)>1000)return null;return{negative:m[1]==='-'||m[1]==='−',coefficient:BigInt(digits),length:digits.length,power:exp-(m[4]?.length??0),comma:m[3]===','}}
function round(coefficient:bigint,shift:number){if(shift>=0)return coefficient*10n**BigInt(shift);const divisor=10n**BigInt(-shift),q=coefficient/divisor,r=coefficient%divisor;return q+(r*2n>=divisor?1n:0n)}
/** Decimal-string rounding avoids a binary64 round-trip or changing stored scientific text. Ties round away from zero. */
export function formatDecimal(text:string,format:TableNumberFormat):string{
 if(format.mode==='original')return text;const n=decimal(text);if(!n)return text;const places=Math.max(0,Math.min(15,Math.floor(format.digits))),sign=n.negative?'-':'',dot=n.comma?',':'.';
 if(format.mode==='fixed'){const value=round(n.coefficient,n.power+places).toString().padStart(places+1,'0');return sign+(places?value.slice(0,-places)+dot+value.slice(-places):value)}
 let exponent=n.coefficient===0n?0:n.length-1+n.power,value=round(n.coefficient,places-(n.length-1)).toString();if(value.length>places+1){value=value.slice(0,-1);exponent++}value=value.padStart(places+1,'0');return sign+value[0]+(places?dot+value.slice(1):'')+'e'+(exponent>=0?'+':'')+exponent;
}
export function tableDisplayText(parts:TextPart[],format?:TableNumberFormat):TextPart[]{
 if(!format||format.mode==='original'||parts.some(p=>p.baseline!=='normal'))return parts;const text=parts.map(p=>p.text).join(''),match=numeric.exec(text);if(!match)return parts;const display=match[1]+formatDecimal(match[2],format)+(match[3]??'')+(match[4]?formatDecimal(match[4],format):'')+match[5];return display===text?parts:replaceText(parts,display);
}
export function tableDecimalPlaces(parts:TextPart[]):number{const text=parts.map(p=>p.text).join(''),match=numeric.exec(text);return match?Math.min(15,/[.,](\d*)/.exec(match[2])?.[1].length??0):0}
