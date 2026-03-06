import { useState, useEffect, useRef, useCallback } from 'react';
import { initWasm, WasmSimulationSession } from '../wasm/loader';
import type { RenderState, PhonemeTimeline, WordSyncEntry } from '../types/simulation';

export interface SimulatorState {
  session: WasmSimulationSession | null;
  isReady: boolean;
  isPrecomputing: boolean;
  error: string | null;
  timeline: PhonemeTimeline | null;
  wordSyncMap: WordSyncEntry[];
  durationMs: number;
}

export function useSimulator(text: string, rate: number) {
  const [state, setState] = useState<SimulatorState>({
    session: null,
    isReady: false,
    isPrecomputing: false,
    error: null,
    timeline: null,
    wordSyncMap: [],
    durationMs: 0,
  });

  const sessionRef = useRef<WasmSimulationSession | null>(null);

  // Initialize WASM on mount
  useEffect(() => {
    initWasm().catch((e) => {
      setState((s) => ({ ...s, error: String(e) }));
    });
  }, []);

  const createSession = useCallback(async (inputText: string, inputRate: number) => {
    if (!inputText.trim()) return;

    setState((s) => ({ ...s, isPrecomputing: true, isReady: false, error: null }));

    try {
      await initWasm();

      // Free old session
      if (sessionRef.current) {
        sessionRef.current.free();
        sessionRef.current = null;
      }

      const session = WasmSimulationSession.create(inputText, inputRate);

      // Precompute runs synchronously in WASM — wrap in setTimeout to avoid
      // blocking the UI thread for the initial "loading" render.
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          session.precompute();
          resolve();
        }, 0);
      });

      const timeline = session.getPhonemeTimeline();
      const wordSyncMap = session.getWordSyncMap();
      const durationMs = session.durationMs();

      sessionRef.current = session;
      setState({
        session,
        isReady: true,
        isPrecomputing: false,
        error: null,
        timeline,
        wordSyncMap,
        durationMs,
      });
    } catch (e) {
      setState((s) => ({
        ...s,
        isPrecomputing: false,
        error: String(e),
      }));
    }
  }, []);

  const getRenderState = useCallback((timeMs: number): RenderState | null => {
    if (!sessionRef.current) return null;
    try {
      return sessionRef.current.getRenderState(timeMs);
    } catch {
      return null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sessionRef.current) {
        sessionRef.current.free();
        sessionRef.current = null;
      }
    };
  }, []);

  return { ...state, createSession, getRenderState };
}
