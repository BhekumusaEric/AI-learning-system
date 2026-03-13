/**
 * Pyodide singleton service for executing Python code in the browser.
 */

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  result: any;
  error?: string;
}

let pyodideWorker: Worker | null = null;
let msgId = 0;
const resolvers: Record<number, { resolve: (val: any) => void; reject: (err: any) => void }> = {};

export async function getPyodide(): Promise<void> {
  if (typeof window === 'undefined') return;
  
  if (!pyodideWorker) {
    pyodideWorker = new Worker('/pyodide-worker.js');
    
    pyodideWorker.onmessage = (event) => {
      const { id, success, result, error, stdout, stderr } = event.data;
      if (resolvers[id]) {
        if (success) {
          resolvers[id].resolve({ stdout, stderr, result });
        } else {
          // Returning error in the success shape rather than throwing 
          // to match the previous graceful catch behavior
          resolvers[id].resolve({ stdout, stderr, result: null, error });
        }
        delete resolvers[id];
      }
    };
  }
}

export async function runPythonCode(code: string, tests: string = ''): Promise<ExecutionResult> {
  await getPyodide();
  
  return new Promise((resolve, reject) => {
    if (!pyodideWorker) return reject(new Error("Worker not initialized"));
    
    const id = msgId++;
    resolvers[id] = { resolve, reject };
    
    pyodideWorker.postMessage({ id, code, tests });
  });
}
