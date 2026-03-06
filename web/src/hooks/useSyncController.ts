import { useState, useRef, useCallback, useEffect } from 'react';
import type { WordSyncEntry } from '../types/simulation';
import { EMA, charIndexToWordIndex } from '../utils/timing';

export interface SyncControllerState {
  isActive: boolean;
  currentSimTimeMs: number;
  currentWordIndex: number;
  currentWord: string;
}

/**
 * Bridges TTS boundary events to simulation time.
 * Implements two-phase adaptive sync (§3.3 of the architecture).
 */
export function useSyncController(wordSyncMap: WordSyncEntry[]) {
  const [state, setState] = useState<SyncControllerState>({
    isActive: false,
    currentSimTimeMs: 0,
    currentWordIndex: 0,
    currentWord: '',
  });

  // Wall-clock time at TTS start
  const startWallTimeRef = useRef<number>(0);
  // Last known actual word time (from boundary events)
  const lastActualTimeRef = useRef<number>(0);
  // Last known estimated word time
  const lastEstimatedTimeRef = useRef<number>(0);
  // Current time-stretch factor (actual / estimated)
  const stretchRef = useRef<number>(1.0);
  const stretchEmaRef = useRef(new EMA(1.0, 50));
  // Whether we've received any boundary events (to detect fallback mode)
  const gotBoundaryRef = useRef(false);
  const fallbackModeRef = useRef(false);
  const totalDurationRef = useRef<number>(0);

  const onStart = useCallback((totalDurationMs: number) => {
    startWallTimeRef.current = performance.now();
    lastActualTimeRef.current = 0;
    lastEstimatedTimeRef.current = 0;
    stretchRef.current = 1.0;
    stretchEmaRef.current = new EMA(1.0, 50);
    gotBoundaryRef.current = false;
    fallbackModeRef.current = false;
    totalDurationRef.current = totalDurationMs;

    setState({
      isActive: true,
      currentSimTimeMs: 0,
      currentWordIndex: 0,
      currentWord: wordSyncMap[0]?.word ?? '',
    });

    // Check for fallback mode after 600ms
    setTimeout(() => {
      if (!gotBoundaryRef.current) {
        fallbackModeRef.current = true;
      }
    }, 600);
  }, [wordSyncMap]);

  const onBoundary = useCallback(
    (charIndex: number, elapsedTimeSec: number, _name: string) => {
      gotBoundaryRef.current = true;
      const actualMs = elapsedTimeSec * 1000;

      // Find the matching word
      const wordIdx = charIndexToWordIndex(charIndex, wordSyncMap);
      const syncEntry = wordSyncMap[wordIdx];

      if (syncEntry) {
        const estimatedMs = syncEntry.estimated_time_ms;

        // Compute local stretch factor for this boundary
        if (estimatedMs > 0) {
          const localStretch = actualMs / estimatedMs;
          const smoothedStretch = stretchEmaRef.current.update(localStretch);
          stretchRef.current = smoothedStretch;
        }

        lastActualTimeRef.current = actualMs;
        lastEstimatedTimeRef.current = estimatedMs;

        setState((s) => ({
          ...s,
          currentWordIndex: wordIdx,
          currentWord: syncEntry.word,
        }));
      }
    },
    [wordSyncMap]
  );

  const onEnd = useCallback(() => {
    setState((s) => ({ ...s, isActive: false }));
  }, []);

  /**
   * Get the current simulation time in ms, called every animation frame.
   * Uses wall-clock time relative to TTS start, corrected by adaptive warp.
   */
  const getCurrentSimTimeMs = useCallback(
    (wallTimeMs: number): number => {
      if (!state.isActive && state.currentSimTimeMs === 0) return 0;

      const elapsed = wallTimeMs - startWallTimeRef.current;

      if (fallbackModeRef.current) {
        // Open-loop: directly use wall-clock time (no correction available)
        return elapsed;
      }

      // Adaptive warp: scale elapsed time by running stretch factor
      // to produce a simulation time that tracks the TTS pacing.
      const stretch = stretchRef.current;

      // Piecewise: from last actual word time to present
      const estimated =
        lastEstimatedTimeRef.current +
        (elapsed - lastActualTimeRef.current) / Math.max(stretch, 0.1);

      return Math.max(0, estimated);
    },
    [state.isActive, state.currentSimTimeMs]
  );

  return { ...state, onStart, onBoundary, onEnd, getCurrentSimTimeMs };
}
