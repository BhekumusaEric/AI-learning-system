// pyodide-worker.js
// Runs in a Web Worker outside of the Next.js Turbopack bundled environment

importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js");

let pyodideReadyPromise = null;

async function load() {
  self.pyodide = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
  });
  
  // Pre-load common data science libraries used in our curriculum
  await self.pyodide.loadPackage("numpy");
  
  return self.pyodide;
}

pyodideReadyPromise = load();

self.onmessage = async (event) => {
  await pyodideReadyPromise;
  
  const { id, code, tests } = event.data;
  
  let stdout = '';
  let stderr = '';
  
  self.pyodide.setStdout({ batched: (str) => { stdout += str + '\n'; } });
  self.pyodide.setStderr({ batched: (str) => { stderr += str + '\n'; } });

  try {
    // Run user code
    await self.pyodide.runPythonAsync(code);
    
    // Optionally run tests
    let testResult = null;
    if (tests) {
      // Expose the javascript captured stdout into Python globals
      self.pyodide.globals.set("__captured_stdout__", stdout);
      
      // Inject a shim for sys.stdout.getvalue() so existing testing scripts in .md files 
      // can seamlessly read the intercepted terminal output
      await self.pyodide.runPythonAsync(`
import sys
import io

if not hasattr(sys, '__original_stdout__'):
    sys.__original_stdout__ = sys.stdout

sys.stdout = io.StringIO(__captured_stdout__)
      `);
      
      try {
        testResult = await self.pyodide.runPythonAsync(tests);
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
