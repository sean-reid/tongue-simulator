import { RefObject, useEffect, useRef } from 'react';
import type { RenderState, Settings } from '../types/simulation';
import { drawVocalTract, drawMandibleBone, drawRigidBodies, drawVoicingIndicator, drawIPALabel } from '../renderer/drawTract';
import { drawTongue } from '../renderer/drawTongue';

// Anatomy at rest — used on first load before any session is created.
// Values derived from anatomy/defaults.rs rest positions.
const REST_STATE: RenderState = {
  tongue_dorsal: [
    [30, 22], [44, 29], [59, 34], [73, 37],
    [87, 37], [101, 35], [116, 30], [130, 26],
  ],
  tongue_ventral: [
    [30, 16], [44, 19], [59, 22], [73, 23],
    [87, 23], [101, 22], [116, 20], [130, 19],
  ],
  jaw_angle: 0,
  upper_lip: [[155, 31], [158, 32], [162, 33], [164, 32], [163, 30]],
  lower_lip: [[155, 20], [158, 21], [162, 22], [164, 21], [163, 19]],
  velum_angle: 0,
  velum_tip: [64, 38],
  hyoid_y: 8,
  glottal_aperture: 0.1,
  voicing: 0,
  current_phoneme_ipa: '',
  current_phoneme_index: -1,
  is_turbulent: false,
  min_area: 1,
};

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
        // Draw resting anatomy when no session is loaded
        drawVocalTract(ctx, canvas.width, canvas.height);
        drawMandibleBone(ctx, 0, canvas.width, canvas.height);
        drawTongue(ctx, REST_STATE, canvas.width, canvas.height);
        drawRigidBodies(ctx, REST_STATE, canvas.width, canvas.height);
        drawVoicingIndicator(ctx, REST_STATE, canvas.width, canvas.height);
      }

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [canvasRef, getRenderState, getCurrentSimTimeMs, settings]);
}

