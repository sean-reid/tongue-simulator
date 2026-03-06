/// Async WASM initialization and typed wrapper.
/// Imports from the 'tongue-sim' workspace package (wasm-pack output).

import type { RenderState, WordSyncEntry, PhonemeTimeline } from '../types/simulation';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let wasmModule: any = null;

export async function initWasm(): Promise<void> {
  if (wasmModule) return;
  const mod = await import('tongue-sim');
  await mod.default();
  wasmModule = mod;
}

export function isWasmReady(): boolean {
  return wasmModule !== null;
}

export class WasmSimulationSession {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private inner: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private constructor(inner: any) {
    this.inner = inner;
  }

  static create(text: string, speakingRate: number): WasmSimulationSession {
    if (!wasmModule) throw new Error('WASM not initialized');
    const inner = new wasmModule.SimulationSession(text, speakingRate);
    return new WasmSimulationSession(inner);
  }

  precompute(): number {
    return this.inner.precompute() as number;
  }

  getRenderState(timeMs: number): RenderState {
    return this.inner.get_render_state(timeMs) as RenderState;
  }

  getPhonemeTimeline(): PhonemeTimeline {
    return this.inner.get_phoneme_timeline() as PhonemeTimeline;
  }

  getWordSyncMap(): WordSyncEntry[] {
    return this.inner.get_word_sync_map() as WordSyncEntry[];
  }

  setRate(rate: number): void {
    this.inner.set_speaking_rate(rate);
  }

  durationMs(): number {
    return this.inner.duration_ms() as number;
  }

  free(): void {
    if (this.inner && typeof this.inner.free === 'function') {
      this.inner.free();
    }
  }
}

export async function solveStaticPosture(arpabet: string): Promise<RenderState> {
  if (!wasmModule) await initWasm();
  return wasmModule.solve_static_posture(arpabet) as RenderState;
}

export async function getPhonemeList(): Promise<string[]> {
  if (!wasmModule) await initWasm();
  return wasmModule.get_phoneme_list() as string[];
}
