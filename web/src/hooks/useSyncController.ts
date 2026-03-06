import { useState, useRef, useCallback } from 'react';
import type { WordSyncEntry } from '../types/simulation';
import { charIndexToWordIndex } from '../utils/timing';

export interface SyncControllerState {
  isActive: boolean;
  currentSimTimeMs: number;
  currentWordIndex: number;
  currentWord: string;
}

/**
 * Anchor-based TTS→simulation sync.
 *
 * Each word boundary event gives an exact (wallTime, simTime) anchor.
 * Between boundaries we interpolate forward at the locally measured rate.
 * No EMA — adapts in a single word boundary.
 *
 * wordStretch = wallMs_elapsed / simMs_elapsed for the most recent word.
 * Before the first boundary we use a conservative prior (1.6×).
 */
export function useSyncController(wordSyncMap: WordSyncEntry[]) {
  const [state, setState] = useState<SyncControllerState>({
    isActive: false,
    currentSimTimeMs: 0,
    currentWordIndex: 0,
    currentWord: '',
  });

  // Wall time (performance.now()) of the last boundary, or of onStart
  const anchorWallRef = useRef(0);
  // Sim time corresponding to that anchor
  const anchorSimRef  = useRef(0);
  // How many wall-ms correspond to 1 sim-ms (stretch > 1 = TTS is slower)
  const wordStretchRef = useRef(1.6);
  // Previous boundary for computing per-word stretch
  const prevBoundaryRef = useRef<{ wallMs: number; simMs: number } | null>(null);

  const onStart = useCallback((_totalDurationMs: number) => {
    const now = performance.now();
    anchorWallRef.current    = now;
    anchorSimRef.current     = 0;
    wordStretchRef.current   = 1.6;
    prevBoundaryRef.current  = null;

    setState({
      isActive: true,
      currentSimTimeMs: 0,
      currentWordIndex: 0,
      currentWord: wordSyncMap[0]?.word ?? '',
    });
  }, [wordSyncMap]);

  const onBoundary = useCallback(
    (charIndex: number, _elapsedTimeSec: number, _name: string) => {
      const wallMs   = performance.now();
      const wordIdx  = charIndexToWordIndex(charIndex, wordSyncMap);
      const entry    = wordSyncMap[wordIdx];
      if (!entry) return;

      const simMs = entry.estimated_time_ms;

      // Measure the stretch from consecutive boundaries
      if (prevBoundaryRef.current) {
        const wallDelta = wallMs - prevBoundaryRef.current.wallMs;
        const simDelta  = simMs  - prevBoundaryRef.current.simMs;
        if (simDelta > 20 && wallDelta > 20) {
          wordStretchRef.current = wallDelta / simDelta;
        }
      }

      // Snap anchor to this boundary
      anchorWallRef.current   = wallMs;
      anchorSimRef.current    = simMs;
      prevBoundaryRef.current = { wallMs, simMs };

      setState((s) => ({
        ...s,
        currentWordIndex: wordIdx,
        currentWord: entry.word,
      }));
    },
    [wordSyncMap]
  );

  const onEnd = useCallback(() => {
    setState((s) => ({ ...s, isActive: false }));
  }, []);

  // Call when TTS resumes after a pause — re-anchors wall time so the elapsed
  // calculation doesn't include the paused duration.
  const onResume = useCallback(() => {
    anchorWallRef.current = performance.now();
    // anchorSimRef stays the same — we just reset the wall-clock reference
  }, []);

  const getCurrentSimTimeMs = useCallback(
    (wallTimeMs: number): number => {
      if (!state.isActive && anchorSimRef.current === 0) return 0;
      const elapsed = wallTimeMs - anchorWallRef.current;
      return anchorSimRef.current + elapsed / Math.max(wordStretchRef.current, 0.1);
    },
    [state.isActive]
  );

  return { ...state, onStart, onBoundary, onEnd, onResume, getCurrentSimTimeMs };
}
