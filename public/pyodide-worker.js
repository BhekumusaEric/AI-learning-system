// pyodide-worker.js
// Runs in a Web Worker outside of the Next.js Turbopack bundled environment

importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js");

let pyodideReadyPromise = null;

async function load() {
  self.pyodide = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
  });

  // Load micropip first so we can install any extra packages
  await self.pyodide.loadPackage("micropip");

  // Pre-load all packages used across the full curriculum:
  // Part 1 – Python fundamentals, NumPy, Pandas, Matplotlib, Sklearn
  // Part 2 – Neural networks (numpy-based perceptron exercises)
  // Part 3 – Computer vision helpers
  // Part 4 – NLP helpers
  await self.pyodide.loadPackage([
    "numpy",
    "pandas",
    "matplotlib",
    "scipy",
    "scikit-learn",
  ]);

  // Packages not bundled in Pyodide — install via micropip
  const micropip = self.pyodide.pyimport("micropip");
  try {
    await micropip.install([
      "seaborn",
    ]);
  } catch (e) {
    // Non-fatal: seaborn is optional (only used in visualisation pages)
    console.warn("micropip install warning:", e);
  }

  // Matplotlib backend must be set to non-interactive before any import
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
});

// Transforms test code so each assert shows got vs expected on failure.
// Converts:  assert expr == expected, "msg"
// Into a try/except that evaluates both sides and raises a clear error.
function buildTestRunner(tests) {
  const lines = tests.split('\n');
  const out = [];
  for (const line of lines) {
    const trimmed = line.trim();
    // Match:  assert <lhs> == <rhs>  or  assert <lhs> == <rhs>, "msg"
    const m = trimmed.match(/^assert\s+(.+?)\s*==\s*(.+?)(?:,\s*(['"`].*['"`])\s*)?$/);
    if (m) {
      const indent = line.match(/^(\s*)/)[1];
      const lhs = m[1].trim();
      const rhs = m[2].trim();
      const msg = m[3] ? m[3].slice(1, -1) : '';
      out.push(`${indent}try:`);
      out.push(`${indent}  __got = ${lhs}`);
      out.push(`${indent}  __exp = ${rhs}`);
      out.push(`${indent}  assert __got == __exp`);
      out.push(`${indent}except AssertionError:`);
      const label = msg ? `"${msg} — " + ` : '""+';
      out.push(`${indent}  raise AssertionError(${label}f"\\nYour output:  {repr(__got)}\\nExpected:     {repr(__exp)}")`);
    } else {
      out.push(line);
    }
  }
  return out.join('\n');
}

self.onmessage = async (event) => {
  await pyodideReadyPromise;

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

    // Run user code
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
};
