import {it,expect} from 'vitest';
import references from '../fixtures/peak-fit-reference.json';
import nist from '../fixtures/nist-gauss1.json';
import {fitPeaks,initialPeakFit,peakProfile,peakFitOutput} from '../../src/domain/math/peakFit';
import {boundedLeastSquares} from '../../src/domain/math/leastSquares';
for(const fixture of references.cases)it(`bounded peak fitting agrees with independent SciPy TRF: ${fixture.name}`,()=>{
 const before=JSON.stringify(fixture),result=fitPeaks(fixture.points,fixture.options),fit=result.data.peakFit;
 expect(fit.n).toBe(fixture.points.length);expect(fit.condition).toBeLessThan(1e10);expect(Math.abs(fit.sse/fixture.expected.sse-1)).toBeLessThan(1e-7);
 fixture.expected.components.forEach((expected,i)=>{const actual=fit.components[i];expect(Math.abs(actual.center-expected.center)).toBeLessThan(fixture.name==='large-x'?.00025:2e-6);for(const key of ['height','fwhm','eta'] as const)expect(Math.abs(actual[key]-expected[key])/(Math.abs(expected[key])||1)).toBeLessThan(3e-5)});
 expect(Math.abs(fit.baseline.intercept-fixture.expected.intercept)/(Math.abs(fixture.expected.intercept)||1)).toBeLessThan(3e-5);if(fixture.options.baseline.mode==='linear')expect(fit.baseline.slope).toBeCloseTo(fixture.expected.slope,6);
 const residual=peakFitOutput(fixture.points,fit,'residual');expect(residual.length).toBe(fixture.points.length);expect(JSON.stringify(fixture)).toBe(before);
});
it('rejects zero/negative widths, impossible bounds, insufficient distinct X, singular components and iteration exhaustion',()=>{
 const points=references.cases[0].points,options=initialPeakFit(points);
 expect(()=>fitPeaks(points,{...options,components:[{...options.components[0],fwhm:{value:0,min:null,max:null,fixed:false}}]})).toThrow('PEAK_FIT_BOUNDS');
 expect(()=>fitPeaks(points,{...options,components:[options.components[0],options.components[0]]})).toThrow('PEAK_FIT_DEGENERATE');
 expect(()=>fitPeaks(points,{...options,maxIterations:1})).toThrow('PEAK_FIT_ITERATIONS');
 expect(()=>fitPeaks(points.map(p=>({...p,x:0})),{...options,range:[-1,1]})).toThrow('PEAK_FIT_DEGENERATE');
 expect(()=>boundedLeastSquares({initial:[1],lower:[2],upper:[3],fixed:[false],observations:10,row:()=>0})).toThrow('PEAK_FIT_BOUNDS');
});
it('uses actual height/common FWHM, area-normalized mixing and full observations in an explicit range',()=>{
 for(const model of ['gaussian','lorentzian','pseudo-voigt'] as const){expect(peakProfile(model,4,4,3,2,.7)).toBeCloseTo(3,14);expect(peakProfile(model,5,4,3,2,.7)).toBeCloseTo(1.5,14)}
 const fixture=references.cases[0],options=structuredClone(fixture.options);options.range=[-2,2];const result=fitPeaks(fixture.points,options);expect(result.points.length).toBe(fixture.points.filter(p=>p.x>=-2&&p.x<=2).length);expect(result.summary.parameterUncertainty).toBe('not-estimated-no-noise-model');
});
for(const [index,start]of nist.starts.entries())it(`streaming QR optimizer agrees with NIST certified Gauss1 from start ${index+1}`,()=>{
 const scale=[100,.01,100,100,100,100,100,100];
 const result=boundedLeastSquares({initial:start.map((v,i)=>v/scale[i]),lower:[0,0,0,0,.001,0,0,.001],upper:Array(8).fill(Infinity),fixed:Array(8).fill(false),observations:nist.points.length,row:(i,v,j)=>{
  const p=nist.points[i],x=p.x/100,exp=Math.exp(-v[1]*x),u=(x-v[3])/v[4],w=(x-v[6])/v[7],g=Math.exp(-u*u),h=Math.exp(-w*w);
  if(j){j[0]=exp;j[1]=-v[0]*x*exp;j[2]=g;j[3]=2*v[2]*u*g/v[4];j[4]=2*v[2]*u*u*g/v[4];j[5]=h;j[6]=2*v[5]*w*h/v[7];j[7]=2*v[5]*w*w*h/v[7]}
  return p.y/100-(v[0]*exp+v[2]*g+v[5]*h);
 }},{maxIterations:200,tolerance:1e-11});
 for(let i=0;i<8;i++)expect(Math.abs(result.values[i]*scale[i]/nist.certified[i]-1)).toBeLessThan(2e-8);
 expect(Math.abs(result.cost*10000/nist.sse-1)).toBeLessThan(1e-10);
});
