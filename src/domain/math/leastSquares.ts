import {MathError} from './core';
export interface LeastSquaresProblem {initial:number[];lower:number[];upper:number[];fixed:boolean[];observations:number;row:(index:number,values:readonly number[],jacobian:Float64Array|null)=>number}
export interface LeastSquaresSolution {values:number[];iterations:number;cost:number;condition:number}
/** Streaming Givens QR: storage O(parameters²), without forming JᵀJ or an N×N matrix. */
function insert(R:Float64Array,q:Float64Array,row:Float64Array,rhs:number,m:number){
 for(let j=0;j<m;j++){const b=row[j];if(b===0)continue;const a=R[j*m+j],h=Math.hypot(a,b),c=a/h,s=b/h;for(let k=j;k<m;k++){const r=R[j*m+k],v=row[k];R[j*m+k]=c*r+s*v;row[k]=-s*r+c*v}const v=q[j];q[j]=c*v+s*rhs;rhs=-s*v+c*rhs}
}
/** One-sided Jacobi SVD on the small, column-normalized R diagnoses unidentifiable parameters. */
function conditionOf(R:Float64Array,m:number):number{
 if(!m)return 1;const a=R.slice();for(let j=0;j<m;j++){let norm=0;for(let i=0;i<m;i++)norm=Math.hypot(norm,a[i*m+j]);if(!norm)return Infinity;for(let i=0;i<m;i++)a[i*m+j]/=norm}
 for(let sweep=0;sweep<50;sweep++){let changed=false;for(let p=0;p<m-1;p++)for(let q=p+1;q<m;q++){let alpha=0,beta=0,gamma=0;for(let i=0;i<m;i++){const x=a[i*m+p],y=a[i*m+q];alpha+=x*x;beta+=y*y;gamma+=x*y}if(Math.abs(gamma)<=1e-14*Math.sqrt(alpha*beta))continue;const z=(beta-alpha)/(2*gamma),t=(z<0?-1:1)/(Math.abs(z)+Math.hypot(1,z)),c=1/Math.hypot(1,t),s=c*t;for(let i=0;i<m;i++){const x=a[i*m+p],y=a[i*m+q];a[i*m+p]=c*x-s*y;a[i*m+q]=s*x+c*y}changed=true}if(!changed)break}
 let lo=Infinity,hi=0;for(let j=0;j<m;j++){let norm=0;for(let i=0;i<m;i++)norm=Math.hypot(norm,a[i*m+j]);lo=Math.min(lo,norm);hi=Math.max(hi,norm)}return hi/lo;
}
export function boundedLeastSquares(problem:LeastSquaresProblem,{maxIterations=150,timeLimitMs=15000,tolerance=1e-9}:{maxIterations?:number;timeLimitMs?:number;tolerance?:number}={}):LeastSquaresSolution{
 const {initial,lower,upper,fixed,observations:n}=problem,k=initial.length;
 if(!k||k>40||[lower,upper,fixed].some(a=>a.length!==k)||!Number.isInteger(n)||n<1||!Number.isInteger(maxIterations)||maxIterations<1||maxIterations>1000||!Number.isFinite(timeLimitMs)||timeLimitMs<1||timeLimitMs>120000)throw new MathError('PEAK_FIT_PARAMETERS');
 for(let j=0;j<k;j++)if(!Number.isFinite(initial[j])||Number.isNaN(lower[j])||Number.isNaN(upper[j])||lower[j]>upper[j]||initial[j]<lower[j]||initial[j]>upper[j]||typeof fixed[j]!=='boolean'||!fixed[j]&&lower[j]===upper[j])throw new MathError('PEAK_FIT_BOUNDS',{parameter:j});
 const free=initial.flatMap((_,j)=>fixed[j]?[]:[j]),m=free.length;if(n<=m)throw new MathError('PEAK_FIT_OBSERVATIONS',{required:m+1});const start=performance.now(),clock=()=>{if(performance.now()-start>timeLimitMs)throw new MathError('PEAK_FIT_TIMEOUT')};
 const jac=new Float64Array(k),row=new Float64Array(m);
 const evaluate=(values:number[],linearize:boolean)=>{const R=new Float64Array(m*m),q=new Float64Array(m),g=new Float64Array(m),norm=new Float64Array(m);let cost=0,compensation=0;
  for(let i=0;i<n;i++){if((i&2047)===0)clock();if(linearize)jac.fill(0);const residual=problem.row(i,values,linearize?jac:null);if(!Number.isFinite(residual))throw new MathError('PEAK_FIT_NONFINITE');const term=residual*residual,next=cost+term;compensation+=(Math.abs(cost)>=Math.abs(term)?cost-next+term:term-next+cost);cost=next;if(!linearize)continue;
   for(let j=0;j<m;j++){const v=jac[free[j]];if(!Number.isFinite(v))throw new MathError('PEAK_FIT_NONFINITE');row[j]=v;g[j]+=v*residual;norm[j]+=v*v}insert(R,q,row,residual,m);
  }cost+=compensation;if(!Number.isFinite(cost))throw new MathError('PEAK_FIT_NONFINITE');return{cost,R,q,g,norm};
 };
 let values=[...initial],state=evaluate(values,true),lambda=1e-3,condition=conditionOf(state.R,m),iterations=0;
 if(condition>1e12)throw new MathError('PEAK_FIT_DEGENERATE');if(!m)return{values,iterations,cost:state.cost,condition};
 for(;iterations<maxIterations;iterations++){
  clock();let gradient=0;for(let j=0;j<m;j++){const at=free[j],g=state.g[j],projected=values[at]<=lower[at]&&g<0||values[at]>=upper[at]&&g>0?0:g;gradient=Math.max(gradient,Math.abs(projected)/(Math.sqrt(state.norm[j])*Math.max(1,Math.sqrt(state.cost))||1))}
  if(gradient<tolerance)return{values,iterations,cost:state.cost,condition};
  let accepted=false;
  for(let trial=0;trial<24;trial++){
   const available=free.flatMap((at,j)=>values[at]<=lower[at]&&state.g[j]<0||values[at]>=upper[at]&&state.g[j]>0?[]:[j]),ma=available.length,R=new Float64Array(ma*ma),q=new Float64Array(ma),work=new Float64Array(ma);
   // Solve only the feasible free variables. Projecting an unconstrained step alone can stall at a bound.
   for(let r=0;r<m;r++){for(let j=0;j<ma;j++)work[j]=state.R[r*m+available[j]];insert(R,q,work,state.q[r],ma)}
   for(let j=0;j<ma;j++){work.fill(0);work[j]=Math.sqrt(lambda*Math.max(state.norm[available[j]],1e-30));insert(R,q,work,0,ma)}
   const step=new Float64Array(ma),delta=new Float64Array(m);for(let j=ma-1;j>=0;j--){let v=q[j];for(let h=j+1;h<ma;h++)v-=R[j*ma+h]*step[h];step[j]=v/R[j*ma+j];delta[available[j]]=step[j]}
   const candidate=[...values];let size=0;for(let j=0;j<m;j++){const at=free[j];candidate[at]=Math.max(lower[at],Math.min(upper[at],values[at]+delta[j]));delta[j]=candidate[at]-values[at];size=Math.max(size,Math.abs(delta[j])/(1+Math.abs(values[at])))}
   const cost=evaluate(candidate,false).cost;let predicted=0;for(let j=0;j<m;j++){predicted+=2*state.g[j]*delta[j];let v=0;for(let h=j;h<m;h++)v+=state.R[j*m+h]*delta[h];predicted-=v*v}
   const actual=state.cost-cost,gain=predicted>0?actual/predicted:-1;
   if(actual>0&&gain>1e-5){const prior=state.cost;values=candidate;state=evaluate(values,true);condition=conditionOf(state.R,m);if(condition>1e12)throw new MathError('PEAK_FIT_DEGENERATE');lambda=Math.max(1e-15,lambda*Math.max(1/3,1-(2*gain-1)**3));accepted=true;if(size<1e-11||actual<tolerance*1e-3*Math.max(1,prior))return{values,iterations:iterations+1,cost:state.cost,condition};break}
   if(size<1e-13&&gradient<tolerance*100)return{values,iterations,cost:state.cost,condition};lambda*=4;if(!Number.isFinite(lambda)||lambda>1e25)break;
  }
  if(!accepted)throw new MathError('PEAK_FIT_STALLED');
 }
 throw new MathError('PEAK_FIT_ITERATIONS',{iterations});
}
