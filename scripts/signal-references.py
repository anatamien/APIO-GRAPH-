"""Optional scientific test oracle; never used by the desktop application.

Run with NumPy and SciPy installed. Uses SciPy sparse LU rather than the
application's banded Cholesky. All observations below are synthetic.
"""
import json
from pathlib import Path
import numpy as np
import scipy
from scipy.sparse import diags
from scipy.sparse.linalg import spsolve
from scipy.signal import find_peaks, peak_prominences, peak_widths


def asymmetry_reference(y, lam, p, iterations, tolerance):
    center = (y.min() + y.max()) / 2
    scale = max(abs(y.min() - center), abs(y.max() - center))
    normalized = (y - center) / scale
    difference = diags([np.ones(len(y)-2), -2*np.ones(len(y)-2),
                        np.ones(len(y)-2)], [0, 1, 2], shape=(len(y)-2, len(y)))
    penalty = lam * (difference.T @ difference)
    weights, previous = np.ones(len(y)), np.zeros(len(y))
    for iteration in range(iterations):
        baseline = spsolve((diags(weights) + penalty).tocsc(), weights * normalized)
        updated = np.where(normalized > baseline, p, 1-p)
        change = np.linalg.norm(baseline-previous) / max(np.linalg.norm(baseline), np.finfo(float).tiny)
        if np.array_equal(weights, updated) or (iteration > 0 and change <= tolerance):
            break
        previous, weights = baseline, updated
    return (center + scale*baseline).tolist()


x = np.linspace(-4, 6, 121)
y = 2 + .15*x + 3*np.exp(-((x-1)/.55)**2) + .04*np.sin(7*x)
options = dict(method='asls', output='baseline', **{'lambda':10000},
               asymmetry=.01, iterations=40, tolerance=1e-9)
cases = []
for name, xvalues, values in [
    ('plateau', np.array([0, .1, .4, .9, 1.4, 2, 2.5, 3, 4]), np.array([0, 2, 2, 0, 1, 0, 3, 0, 0.])),
    ('equal-height', np.arange(11.), np.array([0, 2, 0, 2, 0, 1, 0, 3, 0, 3, 0.])),
    ('gaussian', np.linspace(-6, 8, 701), None),
]:
    if values is None:
        values = 3*np.exp(-((xvalues+2)/.6)**2/2) + 2*np.exp(-((xvalues-3)/.9)**2/2)
    indices, _ = find_peaks(values)
    prominence = peak_prominences(values, indices)
    widths = peak_widths(values, indices, rel_height=.5, prominence_data=prominence)
    left = np.interp(widths[2], np.arange(len(xvalues)), xvalues)
    right = np.interp(widths[3], np.arange(len(xvalues)), xvalues)
    cases.append(dict(name=name, points=[dict(x=float(a),y=float(b)) for a,b in zip(xvalues,values)],
                      indices=indices.tolist(), prominence=prominence[0].tolist(),
                      left=left.tolist(), right=right.tolist()))

result = dict(provenance=dict(generator='scripts/signal-references.py', numpy=np.__version__,
                             scipy=scipy.__version__, data='synthetic',
                             baseline='AsLS second differences; independent sparse LU',
                             widths='half prominence; linear interpolation to original X'),
              asls=dict(points=[dict(x=float(a),y=float(b)) for a,b in zip(x,y)], parameters=options,
                        expected=asymmetry_reference(y,10000,.01,40,1e-9)), peaks=cases)
target = Path(__file__).resolve().parent.parent/'tests'/'fixtures'/'signal-reference.json'
target.write_text(json.dumps(result, indent=2, allow_nan=False)+'\n', encoding='utf8')
print(f'Wrote {target.name}; NumPy {np.__version__}, SciPy {scipy.__version__}')
