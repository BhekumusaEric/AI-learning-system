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
let isReady = false;
let loadError: string | null = null;
let loadingStatus: string = 'Initializing...';
const resolvers: Record<number, { resolve: (val: any) => void; reject: (err: any) => void }> = {};

let inputCallback: ((prompt: string) => Promise<string>) | null = null;

export function setInputCallback(cb: (prompt: string) => Promise<string>) {
  inputCallback = cb;
}

export function isPyodideReady() { return isReady; }
export function getPyodideError() { return loadError; }
export function getPyodideStatus() { return loadingStatus; }

export async function getPyodide(): Promise<void> {
  if (typeof window === 'undefined') return;

  if (!pyodideWorker) {
    isReady = false;
    pyodideWorker = new Worker('/pyodide-worker.js');

    pyodideWorker.onmessage = async (event) => {
      const { id, success, result, error, stdout, stderr, type } = event.data;

      if (type === 'input_request') {
        const prompt = event.data.prompt || '';
        const sab: SharedArrayBuffer = event.data.buffer;
        const value = inputCallback ? await inputCallback(prompt) : '';
        const encoded = new TextEncoder().encode(value + '\n');
        const view = new Uint8Array(sab, 4);
        for (let i = 0; i < Math.min(encoded.length, view.length - 1); i++) view[i] = encoded[i];
        Atomics.store(new Int32Array(sab), 0, encoded.length + 1);
        Atomics.notify(new Int32Array(sab), 0);
        return;
      }

      if (type === 'status') {
        loadingStatus = result || 'Loading...';
        return;
      }

      if (type === 'ready') {
        isReady = true;
        loadingStatus = 'Ready';
        return;
      }

      if (type === 'load_error') {
        loadError = error || 'Failed to load Python environment';
        isReady = false;
        loadingStatus = 'Error';
        console.error('Pyodide load error:', loadError);
        return;
      }

      if (resolvers[id]) {
        if (success) {
          resolvers[id].resolve({ stdout, stderr, result });
        } else {
          resolvers[id].resolve({ stdout, stderr, result: null, error });
        }
        delete resolvers[id];
      }
    };

    pyodideWorker.onerror = (err) => {
      console.error('Pyodide worker error:', err);
      loadError = 'The Python worker failed to start. This can happen if the browser blocks the script or if the network is disconnected.';
      isReady = false;
      loadingStatus = 'Error';
    };
  }
}

export function clearPyodideWorker() {
  if (pyodideWorker) {
    pyodideWorker.terminate();
    pyodideWorker = null;
  }
  isReady = false;
  loadError = null;
}

export async function runPythonCode(code: string, tests: string = '', timeoutMs: number = 30000): Promise<ExecutionResult> {
  await getPyodide();

  return new Promise((resolve, reject) => {
    if (!pyodideWorker) return reject(new Error("Worker not initialized"));

    const id = msgId++;

    const timeoutId = setTimeout(() => {
      if (resolvers[id]) {
        pyodideWorker?.terminate();
        pyodideWorker = null;
        isReady = false;
        delete resolvers[id];
        resolve({
          stdout: "",
          stderr: "",
          result: null,
          error: "TimeoutError: Code execution took too long (> 30s).\\nDid you write an infinite loop?"
        });
      }
    }, timeoutMs);

    resolvers[id] = {
      resolve: (val) => { clearTimeout(timeoutId); resolve(val); },
      reject:  (err) => { clearTimeout(timeoutId); reject(err); }
    };

    pyodideWorker.postMessage({ id, code, tests });
  });
}
