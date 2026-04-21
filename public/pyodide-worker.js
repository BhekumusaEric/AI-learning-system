try {
  importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js");
} catch (e) {
  self.postMessage({ type: 'load_error', error: "Failed to import Pyodide script from CDN. Please check your internet connection." });
}

let pyodideReadyPromise = null;

async function load() {
  self.postMessage({ type: 'status', result: 'Initializing Pyodide...' });
  self.pyodide = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
  });

  self.postMessage({ type: 'status', result: 'Loading micropip...' });
  await self.pyodide.loadPackage("micropip");

  const corePackages = ["numpy", "pandas", "matplotlib", "scipy", "scikit-learn"];
  for (const pkg of corePackages) {
    self.postMessage({ type: 'status', result: `Loading ${pkg}...` });
    try {
      await self.pyodide.loadPackage(pkg);
    } catch (e) {
      console.error(`Failed to load package ${pkg}:`, e);
      // If it's the first package (numpy), it's critical. Others might be okay to fail but we should report.
      if (pkg === "numpy") throw new Error(`Critical package load failure (${pkg}): ${e.message || e}`);
      else console.warn(`Non-critical package ${pkg} failed to load.`);
    }
  }

  self.postMessage({ type: 'status', result: 'Installing extra visualization tools...' });
  const micropip = self.pyodide.pyimport("micropip");
  try {
    await micropip.install(["seaborn"]);
  } catch (e) {
    console.warn("micropip install warning:", e);
  }

  self.postMessage({ type: 'status', result: 'Finalizing environment...' });
  await self.pyodide.runPythonAsync(`
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.metrics import accuracy_score, mean_squared_error
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score
import io, sys, json, math, random, collections, itertools, functools
  `);

  return self.pyodide;
}

pyodideReadyPromise = load().then(() => {
  // Tell the main thread all packages are loaded and the IDE is ready
  self.postMessage({ type: 'ready' });
}).catch((err) => {
  self.postMessage({ type: 'load_error', error: err?.message || String(err) });
  throw err; // Re-throw to ensure pyodideReadyPromise rejects properly
});

// Transforms test code so each assert shows got vs expected on failure.
// Converts:  assert expr == expected, "msg"
// Into a try/except that evaluates both sides and raises a clear error.
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

    // Skip transformation for complex assertions containing boolean operators or other comparators
    if (eqIdx === -1 ||
      body.match(/\b(and|or|not|in|is)\b/) ||
      body.indexOf(' == ', eqIdx + 4) !== -1 ||
      body.includes('!=') || body.includes('<') || body.includes('>')) {
      out.push(line);
      continue;
    }

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
// SharedArrayBuffer for blocking input(): index 0 = status (0=waiting,1=ready), rest = UTF-8 bytes
let inputBuffer = null;

let currentExecution = Promise.resolve();

self.onmessage = async (event) => {
  currentExecution = currentExecution.then(async () => {
    try {
      await pyodideReadyPromise;
    } catch (e) {
      // If initialization failed completely, respond with an error.
      self.postMessage({ id: event.data.id, success: false, error: "Python Environment Failed to Load. Please refresh or retry.", stdout: "", stderr: "" });
      return;
    }

    const { id, code, tests } = event.data;

    let stdout = '';
    let stderr = '';

    self.pyodide.setStdout({ batched: (str) => { stdout += str + '\n'; } });
    self.pyodide.setStderr({ batched: (str) => { stderr += str + '\n'; } });

    try {
      // Reset matplotlib state between runs so figures don't bleed across submissions
      await self.pyodide.runPythonAsync(`
import matplotlib.pyplot as plt
plt.close('all')
      `);

      // Run user code — override input() to request from main thread
      if (typeof SharedArrayBuffer !== 'undefined') {
        inputBuffer = new SharedArrayBuffer(4 + 1024);
        new Int32Array(inputBuffer)[0] = 0;

        // Expose a JS-level input function that blocks the worker via Atomics.wait
        self.pyodide.globals.set('__input_sab__', inputBuffer);
        self.pyodide.globals.set('__input_request_fn__', (prompt) => {
          new Int32Array(inputBuffer)[0] = 0;
          self.postMessage({ type: 'input_request', id, prompt: prompt || '', buffer: inputBuffer });
          Atomics.wait(new Int32Array(inputBuffer), 0, 0);
          const n = new Int32Array(inputBuffer)[0];
          const bytes = new Uint8Array(inputBuffer, 4, n - 1);
          new Int32Array(inputBuffer)[0] = 0;
          return new TextDecoder().decode(bytes);
        });

        await self.pyodide.runPythonAsync(`
import builtins, js
def _browser_input(prompt=''):
    if prompt:
        print(prompt, end='', flush=True)
    return js.globalThis.__input_request_fn__(prompt)
builtins.input = _browser_input
        `);
      } else {
        // Fallback: input() will just return empty string or raise error, no blocking support
        await self.pyodide.runPythonAsync(`
import builtins
def _no_input(prompt=''):
    if prompt:
        print(prompt, end='', flush=True)
    return "" # Cannot block without SharedArrayBuffer
builtins.input = _no_input
        `);
      }
      await self.pyodide.runPythonAsync(code);

      // Optionally run tests
      let testResult = null;
      if (tests) {
        // Expose the javascript captured stdout into Python globals
        self.pyodide.globals.set("__captured_stdout__", stdout);

        // Inject a shim for sys.stdout.getvalue() so existing testing scripts
        // in .md files can seamlessly read the intercepted terminal output
        await self.pyodide.runPythonAsync(`
import sys, io
if not hasattr(sys, '__original_stdout__'):
    sys.__original_stdout__ = sys.stdout
sys.stdout = io.StringIO(__captured_stdout__)
        `);

        try {
          testResult = await self.pyodide.runPythonAsync(buildTestRunner(tests));
        } finally {
          await self.pyodide.runPythonAsync(`
import sys
sys.stdout = sys.__original_stdout__
          `);
        }
      }

      self.postMessage({ id, success: true, result: testResult, stdout, stderr });
    } catch (err) {
      self.postMessage({ id, success: false, error: err.toString(), stdout, stderr });
    }
  });
};
