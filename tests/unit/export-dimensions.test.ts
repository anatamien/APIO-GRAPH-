import {describe,it,expect} from 'vitest';
import {createExportSize,editExportSide,displayExportSize,setExportUnits,setExportDpi,lockExportAspect} from '../../src/domain/exportDimensions';

describe('stable export dimensions',()=>{
 it('rounds pixels for display/output without chaining aspect from rounded values',()=>{
  let s=createExportSize(1200,800);for(let i=1;i<=10;i++)s=editExportSide(s,'width',1200+i);expect(displayExportSize(s)).toEqual({width:1210,height:807});for(let i=9;i>=0;i--)s=editExportSide(s,'width',1200+i);expect(displayExportSize(s)).toEqual({width:1200,height:800});expect(s.width/s.height).toBe(1.5);
 });
 it('keeps independent sizes unlocked, captures a new ratio on relock and ignores invalid input',()=>{
  let s=lockExportAspect(createExportSize(1200,800),false);s=editExportSide(s,'height',700);s=editExportSide(s,'width',1000);expect(displayExportSize(s)).toEqual({width:1000,height:700});s=lockExportAspect(s,true);s=editExportSide(s,'width',1100);expect(displayExportSize(s)).toEqual({width:1100,height:770});expect(editExportSide(s,'width',NaN)).toBe(s);expect(editExportSide(s,'height',0)).toBe(s);
 });
 it('converts exact physical dimensions across DPI and unit roundtrips without accumulated rounding',()=>{
  let s=setExportUnits(createExportSize(1200,800),'mm');expect(displayExportSize(s)).toEqual({width:317.5,height:211.667});s=setExportDpi(s,300);expect(Math.round(s.width)).toBe(3750);expect(displayExportSize(s)).toEqual({width:317.5,height:211.667});s=editExportSide(s,'width',177.8);expect(Math.round(s.width)).toBe(2100);expect(Math.round(s.height)).toBe(1400);
  for(let i=0;i<30;i++)s=setExportUnits(setExportUnits(s,'px'),'mm');expect(displayExportSize(s)).toEqual({width:177.8,height:118.533});
 });
});
