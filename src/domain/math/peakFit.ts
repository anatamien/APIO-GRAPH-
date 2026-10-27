import {MathError,readRange,finite,type XY,type CalculationResult} from './core';
import {boundedLeastSquares} from './leastSquares';
export type PeakProfile='gaussian'|'lorentzian'|'pseudo-voigt';
export interface FitParameter {value:number;min:number|null;max:number|null;fixed:boolean}
export interface PeakFitComponent {model:PeakProfile;center:FitParameter;height:FitParameter;fwhm:FitParameter;eta:FitParameter}
export interface PeakFitOptions {range:[number,number];components:PeakFitComponent[];baseline:{mode:'none'|'constant'|'linear';referenceX:number;intercept:FitParameter;slope:FitParameter};maxIterations?:number;timeLimitMs?:number}
export interface PeakFitData {version:1;components:{model:PeakProfile;center:number;height:number;fwhm:number;eta:number;area:number}[];baseline:{mode:'none'|'constant'|'linear';referenceX:number;intercept:number;slope:number};range:[number,number];n:number;sse:number;rmse:number;rSquared:number|null;iterations:number;condition:number;method:'scaled-projected-lm-givens-qr'}
const ln2=Math.LN2,cG=2*Math.sqrt(ln2/Math.PI),cL=2/Math.PI;
/** eta is the integrated Lorentzian area fraction. Both kernels share FWHM; height is the actual peak maximum. */
export function peakProfile(model:PeakProfile,x:number,center:number,height:number,fwhm:number,eta:number):number{
 const u=(x-center)/fwhm,e=model==='gaussian'?0:model==='lorentzian'?1:eta,den=(1-e)*cG+e*cL;
 if(Math.abs(u)>1e150)return 0;return height*((1-e)*cG*Math.exp(-4*ln2*u*u)+e*cL/(1+4*u*u))/den;
}
function parameter(raw:unknown):FitParameter{const p=raw as FitParameter;if(!p||typeof p!=='object'||!Number.isFinite(p.value)||typeof p.fixed!=='boolean'||p.min!==null&&!Number.isFinite(p.min)||p.max!==null&&!Number.isFinite(p.max)||p.min!==null&&p.value<p.min||p.max!==null&&p.value>p.max||p.min!==null&&p.max!==null&&p.min>p.max)throw new MathError('PEAK_FIT_BOUNDS');return p}
export function peakFitOptions(raw:Record<string,unknown>):PeakFitOptions{
 const options=raw as unknown as PeakFitOptions,range=readRange(options.range);if(!range||range[0]>=range[1]||!Array.isArray(options.components)||options.components.length<1||options.components.length>8||!options.baseline||!['none','constant','linear'].includes(options.baseline.mode)||!Number.isFinite(options.baseline.referenceX))throw new MathError('PEAK_FIT_PARAMETERS');
 for(const c of options.components){if(!c||!['gaussian','lorentzian','pseudo-voigt'].includes(c.model))throw new MathError('PEAK_FIT_PARAMETERS');for(const key of ['center','height','fwhm','eta'] as const)parameter(c[key]);if(c.fwhm.value<=0||c.fwhm.min!==null&&c.fwhm.min<=0||c.eta.value<0||c.eta.value>1||c.eta.min!==null&&c.eta.min<0||c.eta.max!==null&&c.eta.max>1)throw new MathError('PEAK_FIT_BOUNDS')}
 parameter(options.baseline.intercept);parameter(options.baseline.slope);return options;
}
export function evaluatePeakFit(x:number,result:PeakFitData,output:'sum'|'baseline'|'component'='sum',componentIndex=0):number{
 const base=result.baseline.mode==='none'?0:result.baseline.intercept+(result.baseline.mode==='linear'?result.baseline.slope*(x-result.baseline.referenceX):0);
 if(output==='baseline')return finite(base);if(output==='component'){const c=result.components[componentIndex];if(!c)throw new MathError('PEAK_FIT_COMPONENT');return finite(peakProfile(c.model,x,c.center,c.height,c.fwhm,c.eta))}
 let y=base;for(const c of result.components)y+=peakProfile(c.model,x,c.center,c.height,c.fwhm,c.eta);return finite(y);
}
export function peakFitOutput(points:readonly XY[],result:PeakFitData,output:'sum'|'baseline'|'component'|'residual',componentIndex=0):XY[]{return points.filter(p=>p.x>=result.range[0]&&p.x<=result.range[1]).map(p=>({x:p.x,y:output==='residual'?finite(p.y-evaluatePeakFit(p.x,result)):evaluatePeakFit(p.x,result,output,componentIndex)}))}
export function fitPeaks(points:readonly XY[],raw:Record<string,unknown>):CalculationResult&{data:{peakFit:PeakFitData}}{
 if(points.length>1000000)throw new MathError('MATH_OUTPUT_LIMIT');
 const o=peakFitOptions(raw),selected=points.filter(p=>p.x>=o.range[0]&&p.x<=o.range[1]);if(!selected.length)throw new MathError('MATH_POINTS');let xMin=Infinity,xMax=-Infinity,yMin=Infinity,yMax=-Infinity;
 for(const p of selected){if(!Number.isFinite(p.x)||!Number.isFinite(p.y))throw new MathError('MATH_NONFINITE_INPUT');xMin=Math.min(xMin,p.x);xMax=Math.max(xMax,p.x);yMin=Math.min(yMin,p.y);yMax=Math.max(yMax,p.y)}
 const xScale=xMax-xMin,xOrigin=xMin/2+xMax/2,yOrigin=o.baseline.mode==='none'?0:yMin/2+yMax/2,yScale=Math.max(Math.abs(yMin-yOrigin),Math.abs(yMax-yOrigin))||1,minWidth=Math.max(xScale*1e-10,Math.max(Math.abs(xMin),Math.abs(xMax))*Number.EPSILON*4,Number.MIN_VALUE);
 if(!(xScale>0)||!Number.isFinite(xScale)||!Number.isFinite(yScale))throw new MathError('PEAK_FIT_DEGENERATE');
 const initial:number[]=[],lower:number[]=[],upper:number[]=[],fixed:boolean[]=[],maps:{offset:number;scale:number}[]=[],components=o.components.length,baselineIndex=components*4;
 const add=(p:FitParameter,offset:number,scale:number,lo=-Infinity,hi=Infinity,force=false)=>{const l=Math.max(lo,p.min??-Infinity),h=Math.min(hi,p.max??Infinity);initial.push((p.value-offset)/scale);lower.push((l-offset)/scale);upper.push((h-offset)/scale);fixed.push(p.fixed||force);maps.push({offset,scale})};
 for(const c of o.components){add(c.center,xOrigin,xScale);add(c.height,0,yScale);add(c.fwhm,0,xScale,minWidth);add({...c.eta,value:c.model==='gaussian'?0:c.model==='lorentzian'?1:c.eta.value},0,1,0,1,c.model!=='pseudo-voigt')}
 add(o.baseline.intercept,yOrigin,yScale,-Infinity,Infinity,o.baseline.mode==='none');add(o.baseline.slope,0,yScale/xScale,-Infinity,Infinity,o.baseline.mode!=='linear');if(o.baseline.mode==='none'){initial[baselineIndex]=-yOrigin/yScale;lower[baselineIndex]=-Infinity;upper[baselineIndex]=Infinity}
 const xs=new Float64Array(selected.length),ys=new Float64Array(selected.length);for(let i=0;i<selected.length;i++){xs[i]=(selected[i].x-xOrigin)/xScale;ys[i]=(selected[i].y-yOrigin)/yScale}
 const reference=(o.baseline.referenceX-xOrigin)/xScale;
 const solution=boundedLeastSquares({initial,lower,upper,fixed,observations:selected.length,row:(index,v,jac)=>{
  const x=xs[index];let value=o.baseline.mode==='none'?0:v[baselineIndex]+(o.baseline.mode==='linear'?v[baselineIndex+1]*(x-reference):0);if(jac){jac[baselineIndex]=o.baseline.mode==='none'?0:1;jac[baselineIndex+1]=o.baseline.mode==='linear'?x-reference:0}
  for(let i=0;i<components;i++){const at=i*4,center=v[at],height=v[at+1],width=v[at+2],eta=v[at+3],u=(x-center)/width;if(Math.abs(u)>1e150)continue;const u2=u*u,g=Math.exp(-4*ln2*u2),l=1/(1+4*u2),a=(1-eta)*cG,b=eta*cL,den=a+b,numerator=a*g+b*l,profile=numerator/den;value+=height*profile;
   if(jac){const dg=8*ln2*u*g/width,dl=8*u*l*l/width;jac[at]=height*(a*dg+b*dl)/den;jac[at+1]=profile;jac[at+2]=height*(a*dg*u+b*dl*u)/den;jac[at+3]=height*((cL*l-cG*g)*den-numerator*(cL-cG))/(den*den)}
  }return ys[index]-value;
 }},{maxIterations:o.maxIterations,timeLimitMs:o.timeLimitMs});
 const values=solution.values.map((v,i)=>finite(v*maps[i].scale+maps[i].offset));let mean=0,m2=0;for(let i=0;i<ys.length;i++){const d=ys[i]-mean;mean+=d/(i+1);m2+=d*(ys[i]-mean)}
 const result:PeakFitData={version:1,components:o.components.map((c,i)=>{const [center,height,fwhm,eta]=values.slice(i*4,i*4+4);return{model:c.model,center,height,fwhm,eta,area:finite(height*fwhm/((1-eta)*cG+eta*cL))}}),baseline:{mode:o.baseline.mode,referenceX:o.baseline.referenceX,intercept:o.baseline.mode==='none'?0:values[baselineIndex],slope:o.baseline.mode==='linear'?values[baselineIndex+1]:0},range:[...o.range],n:selected.length,sse:finite(solution.cost*yScale*yScale),rmse:finite(Math.sqrt(solution.cost/selected.length)*yScale),rSquared:m2>Number.EPSILON*Number.EPSILON*selected.length?finite(1-solution.cost/m2):null,iterations:solution.iterations,condition:solution.condition,method:'scaled-projected-lm-givens-qr'};
 return{points:peakFitOutput(selected,result,'sum'),summary:{n:result.n,sse:result.sse,rmse:result.rmse,rSquared:result.rSquared,iterations:result.iterations,conditionEstimate:result.condition,method:result.method,parameterUncertainty:'not-estimated-no-noise-model'},data:{peakFit:result}};
}
export function fitParameter(value:number,min:number|null=null,max:number|null=null,fixed=false):FitParameter{return{value,min,max,fixed}}
export function initialPeakFit(points:readonly XY[],count=1,model:PeakProfile='gaussian'):PeakFitOptions{
 if(!points.length)throw new MathError('MATH_POINTS');let min=Infinity,max=-Infinity,low=Infinity,high=-Infinity;for(const p of points){min=Math.min(min,p.x);max=Math.max(max,p.x);low=Math.min(low,p.y);high=Math.max(high,p.y)}const span=max-min;if(!(span>0))throw new MathError('PEAK_FIT_DEGENERATE');
 return{range:[min,max],components:Array.from({length:count},(_,i)=>({model,center:fitParameter(min+span*(i+1)/(count+1),min,max),height:fitParameter((high-low||Math.abs(high)||1)/count),fwhm:fitParameter(span/(count*4),span*1e-8,span*2),eta:fitParameter(.5,0,1)})),baseline:{mode:'constant',referenceX:min/2+max/2,intercept:fitParameter(low),slope:fitParameter(0)},maxIterations:150,timeLimitMs:15000};
}
