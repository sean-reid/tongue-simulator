import React, { useRef, useEffect } from 'react';
import { useAnimationLoop } from '../hooks/useAnimationLoop';
import type { RenderState, Settings } from '../types/simulation';

interface Props {
  getRenderState: (timeMs: number) => RenderState | null;
  getCurrentSimTimeMs: (wallTimeMs: number) => number;
  isActive: boolean;
  settings: Settings;
}

export function VocalTractCanvas({
  getRenderState,
  getCurrentSimTimeMs,
  isActive,
  settings,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Resize canvas to match container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ro = new ResizeObserver(() => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = Math.round(w * (165 / 215)); // match coordinate space aspect ratio
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    });

    const parent = canvas.parentElement;
    if (parent) ro.observe(parent);
    return () => ro.disconnect();
  }, []);

  useAnimationLoop({
    canvasRef,
    getRenderState,
    getCurrentSimTimeMs,
    isActive,
    settings,
  });

  return (
    <canvas
      ref={canvasRef}
      className="w-full block rounded bg-[#FAFAFA]"
      style={{ aspectRatio: '215/165' }}
    />
  );
}
