import { RefObject, useEffect, useRef } from 'react';
import type { RenderState, Settings } from '../types/simulation';
import { drawVocalTract, drawMandibleBone, drawRigidBodies, drawVoicingIndicator, drawIPALabel } from '../renderer/drawTract';
import { drawTongue } from '../renderer/drawTongue';

interface AnimationLoopOptions {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  getRenderState: (timeMs: number) => RenderState | null;
  getCurrentSimTimeMs: (wallTimeMs: number) => number;
  isActive: boolean;
  settings: Settings;
}

export function useAnimationLoop({
  canvasRef,
  getRenderState,
  getCurrentSimTimeMs,
  isActive,
  settings,
}: AnimationLoopOptions) {
  const frameRef = useRef<number>(0);
  const activeRef = useRef(isActive);
  const lastStateRef = useRef<RenderState | null>(null);

  useEffect(() => {
    activeRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    const loop = (wallTime: DOMHighResTimeStamp) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        frameRef.current = requestAnimationFrame(loop);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        frameRef.current = requestAnimationFrame(loop);
        return;
      }

      // Get render state (use last if not active)
      let state: RenderState | null = null;
      if (activeRef.current) {
        const simTime = getCurrentSimTimeMs(wallTime);
        state = getRenderState(simTime);
        if (state) lastStateRef.current = state;
      } else {
        state = lastStateRef.current;
      }

      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (state) {
        // Draw in layer order (back → front)
        drawVocalTract(ctx, canvas.width, canvas.height);
        drawMandibleBone(ctx, state.jaw_angle, canvas.width, canvas.height); // behind tongue
        drawTongue(ctx, state, canvas.width, canvas.height);                 // tongue on top
        drawRigidBodies(ctx, state, canvas.width, canvas.height);            // teeth/velum/lips in front
        drawVoicingIndicator(ctx, state, canvas.width, canvas.height);
        if (settings.showLabels && state.current_phoneme_ipa) {
          drawIPALabel(ctx, state.current_phoneme_ipa, canvas.width, canvas.height);
        }
      } else {
        // Draw resting anatomy even when no session is loaded
        drawVocalTract(ctx, canvas.width, canvas.height);
      }

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [canvasRef, getRenderState, getCurrentSimTimeMs, settings]);
}

