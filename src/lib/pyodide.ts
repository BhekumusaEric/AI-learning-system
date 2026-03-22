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
const resolvers: Record<number, { resolve: (val: any) => void; reject: (err: any) => void }> = {};

let inputCallback: ((prompt: string) => Promise<string>) | null = null;

export function setInputCallback(cb: (prompt: string) => Promise<string>) {
  inputCallback = cb;
}

/** True once all packages have finished loading in the worker */
export function isPyodideReady() {
  return isReady;
}

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

      if (type === 'ready') {
        isReady = true;
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
  }
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
