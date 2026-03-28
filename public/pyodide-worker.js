// pyodide-worker.js

let pyodideInstance = null;
let packagesLoaded = false;
let coreReadyResolve = null;
const coreReady = new Promise(resolve => { coreReadyResolve = resolve; });

async function load() {
  try {
    const response = await fetch('https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js');
    if (!response.ok) throw new Error(`Failed to fetch pyodide.js: ${response.status}`);
    eval(await response.text());

    pyodideInstance = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
    });

    // Core ready — unlock editor immediately
    coreReadyResolve();
    self.postMessage({ type: 'ready' });

    // Load ML packages in background
    try {
      await pyodideInstance.loadPackage('micropip');
      await pyodideInstance.loadPackage(['numpy', 'pandas', 'matplotlib', 'scipy', 'scikit-learn']);
      const micropip = pyodideInstance.pyimport('micropip');
      try { await micropip.install(['seaborn']); } catch (e) { console.warn('seaborn:', e); }
      await pyodideInstance.runPythonAsync(`
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np, pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.metrics import accuracy_score, mean_squared_error
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import io, sys, json, math, random, collections, itertools, functools
      `);
      packagesLoaded = true;
    } catch (e) {
      console.warn('Background packages:', e);
      packagesLoaded = true;
    }
  } catch (err) {
    coreReadyResolve();
    self.postMessage({ type: 'load_error', error: err?.message || String(err) });
  }
}

load();

function buildTestRunner(tests) {
  function stripMessage(body) {
    let depth = 0, lastMsgIdx = -1;
    for (let i = 0; i < body.length; i++) {
      const c = body[i];
      if (c === '(' || c === '[') depth++;
      else if (c === ')' || c === ']') depth--;
      else if (depth === 0 && c === ',' && i + 1 < body.length) {
        if (/^\s*f?["']/.test(body.slice(i + 1))) lastMsgIdx = i;
      }
    }
    return lastMsgIdx !== -1 ? body.slice(0, lastMsgIdx).trim() : body;
  }
  const lines = tests.split('\n');
  const out = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('assert ')) { out.push(line); continue; }
    const body = stripMessage(trimmed.slice(7));
    const eqIdx = body.indexOf(' == ');
    if (eqIdx === -1) { out.push(line); continue; }
    const lhs = body.slice(0, eqIdx).trim();
    const rhs = body.slice(eqIdx + 4).trim();
    const indent = line.match(/^(\s*)/)[1];
    out.push(indent + 'try:');
    out.push(indent + '  __got = ' + lhs);
    out.push(indent + '  __exp = ' + rhs);
    out.push(indent + '  assert __got == __exp');
    out.push(indent + 'except AssertionError:');
    out.push(indent + "  raise AssertionError(f'\\nYour output:  {repr(__got)}\\nExpected:     {repr(__exp)}')");
  }
  return out.join('\n');
}

self.onmessage = async (event) => {
  await coreReady;

  const { id, code, tests } = event.data;
  let stdout = '';
  let stderr = '';

  pyodideInstance.setStdout({ batched: (str) => { stdout += str + '\n'; } });
  pyodideInstance.setStderr({ batched: (str) => { stderr += str + '\n'; } });

  try {
    // Only reset matplotlib if packages are already loaded
    if (packagesLoaded) {
      await pyodideInstance.runPythonAsync(`
import matplotlib.pyplot as plt
plt.close('all')
      `);
    }

    const inputBuffer = new SharedArrayBuffer(4 + 1024);
    new Int32Array(inputBuffer)[0] = 0;

    pyodideInstance.globals.set('__input_request_fn__', (prompt) => {
      new Int32Array(inputBuffer)[0] = 0;
      self.postMessage({ type: 'input_request', id, prompt: prompt || '', buffer: inputBuffer });
      Atomics.wait(new Int32Array(inputBuffer), 0, 0);
      const n = new Int32Array(inputBuffer)[0];
      const bytes = new Uint8Array(inputBuffer, 4, n - 1);
      new Int32Array(inputBuffer)[0] = 0;
      return new TextDecoder().decode(bytes);
    });

    await pyodideInstance.runPythonAsync(`
import builtins, js
def _browser_input(prompt=''):
    if prompt:
        print(prompt, end='', flush=True)
    return js.globalThis.__input_request_fn__(prompt)
builtins.input = _browser_input
    `);

    await pyodideInstance.runPythonAsync(code);

    let testResult = null;
    if (tests) {
      pyodideInstance.globals.set('__captured_stdout__', stdout);
      await pyodideInstance.runPythonAsync(`
import sys, io
if not hasattr(sys, '__original_stdout__'):
    sys.__original_stdout__ = sys.stdout
sys.stdout = io.StringIO(__captured_stdout__)
      `);
      try {
        testResult = await pyodideInstance.runPythonAsync(buildTestRunner(tests));
      } finally {
        await pyodideInstance.runPythonAsync(`
import sys
sys.stdout = sys.__original_stdout__
        `);
      }
    }

    self.postMessage({ id, success: true, result: testResult, stdout, stderr });
  } catch (err) {
    self.postMessage({ id, success: false, error: err.toString(), stdout, stderr });
  }
};
