/**
 * Pyodide singleton service for executing Python code in the browser.
 */

import { loadPyodide, PyodideInterface } from 'pyodide';

let pyodideInstance: PyodideInterface | null = null;
let pyodidePromise: Promise<PyodideInterface> | null = null;

export async function getPyodide(): Promise<PyodideInterface> {
  if (pyodideInstance) return pyodideInstance;
  
  if (!pyodidePromise) {
    pyodidePromise = loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
    }).then(async (pyodide) => {
      pyodideInstance = pyodide;
      return pyodide;
    });
  }
  
  return pyodidePromise;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  result: any;
  error?: string;
}

export async function runPythonCode(code: string, tests: string = ''): Promise<ExecutionResult> {
  const pyodide = await getPyodide();
  
  let stdout = '';
  let stderr = '';
  
  pyodide.setStdout({ batched: (str) => { stdout += str + '\\n'; } });
  pyodide.setStderr({ batched: (str) => { stderr += str + '\\n'; } });

  try {
    // Run user code
    await pyodide.runPythonAsync(code);
    
    // Optionally run tests
    let testResult = null;
    if (tests) {
      testResult = await pyodide.runPythonAsync(tests);
    }
    
    return {
      stdout,
      stderr,
      result: testResult,
    };
  } catch (err: any) {
    return {
      stdout,
      stderr,
      result: null,
      error: err.toString(),
    };
  }
}
