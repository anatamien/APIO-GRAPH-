"""Independent deterministic SciPy references for APIO GRAPH peak fitting (test data only)."""
import json, math
from pathlib import Path
import numpy as np
from scipy.optimize import least_squares

CG=2*math.sqrt(math.log(2)/math.pi); CL=2/math.pi
rng=np.random.default_rng(61304)
def param(v,lo=None,hi=None,fixed=False):return dict(value=float(v),min=lo,max=hi,fixed=fixed)
def run(name,models,truth,baseline='constant',offset=0.,scale=1.,noise=.003,fixed_center=False,bound_height=False):
    xn=np.linspace(-5,5,241); x=xn+offset; xn=x-offset
    # Independent area-normalized profiles, represented by actual height and FWHM.
    def predict(v):
        result=np.full_like(xn,v[-2]) if baseline!='none' else np.zeros_like(xn)
        if baseline=='linear':result=result+v[-1]*xn
        for i,model in enumerate(models):
            c,h,w,e=v[i*4:i*4+4];e=0 if model=='gaussian' else 1 if model=='lorentzian' else e
            g=np.exp(-4*np.log(2)*((xn-c)/w)**2);l=1/(1+4*((xn-c)/w)**2)
            result=result+h*((1-e)*CG*g+e*CL*l)/((1-e)*CG+e*CL)
        return result
    target=predict(np.array(truth))+rng.normal(0,noise,len(xn))
    initial=[];lo=[];hi=[];fixed=[];components=[]
    for i,model in enumerate(models):
        c,h,w,e=truth[i*4:i*4+4];start=[c+.13,h*.85,w*1.15,e if model!='pseudo-voigt' else .45]
        if fixed_center:start[0]=c
        bounds=[(-5,5),(-10,10),(.02,8),(0,1)]
        if bound_height:bounds[1]=(-10,h*.9)
        if model=='gaussian':start[3]=0
        if model=='lorentzian':start[3]=1
        f=[fixed_center,False,False,model!='pseudo-voigt']
        initial+=start;lo+=[a for a,b in bounds];hi+=[b for a,b in bounds];fixed+=f
        components.append(dict(model=model,center=param(start[0]+offset,offset-5,offset+5,f[0]),height=param(start[1]*scale,bounds[1][0]*scale,bounds[1][1]*scale),fwhm=param(start[2],.02,8),eta=param(start[3],0,1,f[3])))
    initial += [truth[-2]+.04 if baseline!='none' else 0,0];lo += [-10,-10];hi += [10,10];fixed += [baseline=='none',baseline!='linear']
    initial=np.array(initial);free=np.flatnonzero(np.logical_not(fixed))
    def full(v):
        f=initial.copy();f[free]=v;return f
    result=least_squares(lambda v:predict(full(v))-target,initial[free],bounds=(np.array(lo)[free],np.array(hi)[free]),method='trf',jac='3-point',ftol=1e-13,xtol=1e-13,gtol=1e-13,max_nfev=10000,x_scale='jac')
    if not result.success:raise RuntimeError(result.message)
    v=full(result.x);expected=[]
    for i,m in enumerate(models):
        c,h,w,e=v[i*4:i*4+4];expected.append(dict(model=m,center=float(c+offset),height=float(h*scale),fwhm=float(w),eta=float(e)))
    options=dict(range=[float(x[0]),float(x[-1])],components=components,baseline=dict(mode=baseline,referenceX=offset,intercept=param(initial[-2]*scale,-10*scale,10*scale,baseline=='none'),slope=param(0.,-10*scale,10*scale,baseline!='linear')),maxIterations=300,timeLimitMs=30000)
    return dict(name=name,points=[dict(x=float(a),y=float(b*scale)) for a,b in zip(x,target)],options=options,expected=dict(components=expected,intercept=float(v[-2]*scale),slope=float(v[-1]*scale),sse=float(np.dot(result.fun,result.fun)*scale*scale)),scipy=dict(version=__import__('scipy').__version__,method='trf',optimality=float(result.optimality)))
cases=[run('gaussian',['gaussian'],[.4,2.,1.1,0.,.2,0.]),run('lorentzian',['lorentzian'],[-.2,1.8,.9,1.,0.,0.],baseline='none'),run('pseudo-voigt',['pseudo-voigt'],[.3,2.3,1.4,.7,.1,0.]),run('overlapping',['gaussian','gaussian'],[-.5,2.,1.2,0.,.6,1.5,1.,0.,.2,.025],baseline='linear'),run('mixed',['lorentzian','pseudo-voigt'],[-.7,1.5,1.1,1.,.8,2.,1.5,.3,.2,-.03],baseline='linear'),run('fixed-center',['gaussian'],[.4,2.,1.1,0.,.2,0.],fixed_center=True),run('active-bound',['gaussian'],[.4,2.,1.1,0.,.2,0.],bound_height=True),run('negative-peak',['pseudo-voigt'],[.2,-2.,1.3,.4,.2,0.]),run('small-y',['gaussian'],[.4,2.,1.1,0.,.2,0.],scale=1e-12),run('large-x',['gaussian'],[.4,2.,1.1,0.,.2,0.],offset=1e12)]
Path('tests/fixtures/peak-fit-reference.json').write_text(json.dumps(dict(provenance='Independent SciPy scipy.optimize.least_squares bounded TRF; synthetic data seed61304; no product numerical code imported.',cases=cases),indent=2),encoding='utf-8')
print('Generated',len(cases),'independent references')
