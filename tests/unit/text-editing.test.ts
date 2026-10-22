import {describe,it,expect} from 'vitest';
import type {TextPart} from '../../src/domain/model';
import {formatTextRange,replaceText} from '../../src/domain/textEditing';
import {createProject,makeObject} from '../../src/domain/model';
import {layoutText} from '../../src/domain/textGeometry';
import {objectBounds} from '../../src/domain/objectBounds';
import {createCoordinates} from '../../src/domain/geometry';
const normal=(text:string):TextPart=>({text,baseline:'normal',bold:false,italic:false});
describe('selection based scientific text',()=>{
 it('formats only 2 in H2O and 2+ in Co2+, without changing actual text',()=>{
  expect(formatTextRange([normal('H2O')],1,2,{baseline:'sub'})).toEqual([normal('H'),{...normal('2'),baseline:'sub'},normal('O')]);expect(formatTextRange([normal('Co2+')],2,4,{baseline:'super'})).toEqual([normal('Co'),{...normal('2+'),baseline:'super'}]);
 });
 it('preserves overlapping styles, spaces, Greek and multiline runs; normal rejoins equivalent parts',()=>{
  const p=[normal('α\nSO4'),{...normal('2−'),bold:true}];const q=formatTextRange(p,4,5,{baseline:'sub'}),r=formatTextRange(q,5,7,{baseline:'super',italic:true});expect(r.map(p=>p.text).join('')).toBe('α\nSO42−');expect(r.at(-1)).toMatchObject({text:'2−',bold:true,italic:true,baseline:'super'});expect(formatTextRange(formatTextRange([normal('H2O')],1,2,{baseline:'sub'}),1,2,{baseline:'normal'})).toEqual([normal('H2O')]);
 });
 it('text replacement keeps untouched styled fragments and Unicode characters',()=>{
  const p=[normal('H'),{...normal('2'),baseline:'sub' as const},normal('O · ρ')];expect(replaceText(p,'H2O · α')).toEqual([normal('H'),{...normal('2'),baseline:'sub'},normal('O · α')]);expect(formatTextRange([normal('😀x')],1,2,{bold:true}).map(p=>p.text).join('')).toBe('😀x');
 });
 it('lays out Cyrillic, Greek, mixed indices and multiline rotated labels at several font sizes',()=>{
  const text='Соль SO42− · αi · 103\nВода H2O';let parts=[normal(text)];for(const [find,baseline] of [['4','sub'],['2−','super'],['i','sub'],['3','super']] as const){const from=text.indexOf(find);parts=formatTextRange(parts,from,from+find.length,{baseline})}
  expect(parts.map(a=>a.text).join('')).toBe(text);for(const fontSizePt of [6,13,32,72]){const p=createProject(),o=makeObject('text',[{mode:'data',x:5,y:5}]);o.text=parts;o.style.fontSizePt=fontSizePt;p.extensions.textRotation={[o.id]:37};const layout=layoutText(o);expect(layout.runs.every(r=>Number.isFinite(r.x+r.y+r.size))).toBe(true);expect(layout.bounds.height).toBeGreaterThan(fontSizePt);for(let i=1;i<layout.runs.length;i++)if(layout.runs[i].x!==0)expect(layout.runs[i].x).toBeGreaterThanOrEqual(layout.runs[i-1].x);const bounds=objectBounds(p,o,createCoordinates(p,1200,800));expect(Object.values(bounds).every(Number.isFinite)).toBe(true);expect(bounds.right).toBeGreaterThan(bounds.left);expect(bounds.bottom).toBeGreaterThan(bounds.top)}
 });
});
