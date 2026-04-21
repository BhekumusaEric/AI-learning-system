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
const runStates: Record<number, { isWaitingForInput: boolean }> = {};

let inputCallback: ((prompt: string) => Promise<string>) | null = null;

export function setInputCallback(cb: (prompt: string) => Promise<string>) {
  inputCallback = cb;
}

export function isPyodideReady() { return isReady; }
export function getPyodideError() { return loadError; }
export function getPyodideStatus() { return loadingStatus; }

function resolveAllPending(errorMsg: string) {
  const allIds = Object.keys(resolvers);
  for (const rId of allIds) {
    const id = Number(rId);
    if (resolvers[id]) {
      resolvers[id].resolve({
        stdout: "",
        stderr: "",
        result: null,
        error: errorMsg
      });
      delete resolvers[id];
    }
  }
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
        
        if (runStates[id]) runStates[id].isWaitingForInput = true;
        const value = inputCallback ? await inputCallback(prompt) : '';
        if (runStates[id]) runStates[id].isWaitingForInput = false;

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
        resolveAllPending(loadError || 'Failed to load Python environment');
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
      resolveAllPending(loadError);
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
  resolveAllPending("Execution cancelled because the completely IDE was reset.");
}

export async function runPythonCode(code: string, tests: string = '', timeoutMs: number = 30000): Promise<ExecutionResult> {
  await getPyodide();

  // Wait for the environment to finish loading before starting the execution timeout clock
  while (pyodideWorker && !isReady && !loadError) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return new Promise((resolve, reject) => {
    if (!pyodideWorker) return reject(new Error("Worker not initialized"));
    if (loadError) return reject(new Error("Python Environment failed to load: " + loadError));

    const id = msgId++;
    runStates[id] = { isWaitingForInput: false };

    let cpuTimeSpent = 0;
    const intervalId = setInterval(() => {
      if (!runStates[id]?.isWaitingForInput) {
        cpuTimeSpent += 500;
      }
      if (cpuTimeSpent >= timeoutMs) {
        clearInterval(intervalId);
        
        // Timeout completely freezes current queue. We must clear and reconstruct
        if (pyodideWorker) {
            pyodideWorker.terminate();
            pyodideWorker = null;
        }
        isReady = false;
        
        // Reject all since the single thread worker queue is dead
        const targetIds = Object.keys(resolvers);
        for (const rId of targetIds) {
          const numId = Number(rId);
          if (numId === id) {
             resolvers[numId]?.resolve({
               stdout: "", stderr: "", result: null, error: "TimeoutError: Code execution took too long (> 30s).\nDid you write an infinite loop?"
             });
          } else {
             resolvers[numId]?.resolve({
                stdout: "", stderr: "", result: null, error: "Execution cancelled because another program timed out."
             });
          }
          delete resolvers[numId];
        }
      }
    }, 500);

    resolvers[id] = {
      resolve: (val) => { clearInterval(intervalId); delete runStates[id]; resolve(val); },
      reject:  (err) => { clearInterval(intervalId); delete runStates[id]; reject(err); }
    };

    pyodideWorker.postMessage({ id, code, tests });
  });
}
