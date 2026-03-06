import { RefObject, useEffect, useRef } from 'react';
import type { RenderState, Settings } from '../types/simulation';
import { drawVocalTract, drawMandibleBone, drawRigidBodies, drawVoicingIndicator, drawIPALabel } from '../renderer/drawTract';
import { drawTongue } from '../renderer/drawTongue';
import { drawAirflow } from '../renderer/drawAirflow';

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
        if (settings.showAirflow) {
          drawAirflow(ctx, state, canvas.width, canvas.height);
        }
        drawVoicingIndicator(ctx, state, canvas.width, canvas.height);
        if (settings.showLabels && state.current_phoneme_ipa) {
          drawIPALabel(ctx, state.current_phoneme_ipa, canvas.width, canvas.height);
        }
        if (settings.showMeshDebug) {
          drawMeshDebug(ctx, state, canvas.width, canvas.height);
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

function drawMeshDebug(
  ctx: CanvasRenderingContext2D,
  state: RenderState,
  w: number,
  h: number
) {
  const { toCanvas } = getTransform(w, h);

  ctx.save();
  ctx.strokeStyle = 'rgba(0,200,100,0.5)';
  ctx.lineWidth = 0.5;

  for (const pt of state.tongue_dorsal) {
    const [cx, cy] = toCanvas(pt[0], pt[1]);
    ctx.beginPath();
    ctx.arc(cx, cy, 2, 0, Math.PI * 2);
    ctx.stroke();
  }
  for (const pt of state.tongue_ventral) {
    const [cx, cy] = toCanvas(pt[0], pt[1]);
    ctx.beginPath();
    ctx.arc(cx, cy, 2, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

function getTransform(w: number, h: number) {
  const scaleX = w / 185;
  const scaleY = h / 100;
  const scale = Math.min(scaleX, scaleY);
  const offsetX = (w - 185 * scale) / 2;
  const offsetY = (h - 100 * scale) / 2;

  return {
    toCanvas: (x: number, y: number): [number, number] => [
      offsetX + x * scale,
      h - offsetY - y * scale,
    ],
  };
}
