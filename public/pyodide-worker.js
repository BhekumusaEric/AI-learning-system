// pyodide-worker.js
// Runs in a Web Worker outside of the Next.js Turbopack bundled environment

importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js");

let pyodideReadyPromise = null;

async function load() {
  self.pyodide = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
  });
}

pyodideReadyPromise = load();

self.onmessage = async (event) => {
  await pyodideReadyPromise;
  
  const { id, code, tests } = event.data;
  
  let stdout = '';
  let stderr = '';
  
  self.pyodide.setStdout({ batched: (str) => { stdout += str + '\\n'; } });
  self.pyodide.setStderr({ batched: (str) => { stderr += str + '\\n'; } });

  try {
    // Run user code
    await self.pyodide.runPythonAsync(code);
    
    // Optionally run tests
    let testResult = null;
    if (tests) {
      testResult = await self.pyodide.runPythonAsync(tests);
    }
    
    self.postMessage({ id, success: true, result: testResult, stdout, stderr });
  } catch (err) {
    self.postMessage({ id, success: false, error: err.toString(), stdout, stderr });
  }
};
