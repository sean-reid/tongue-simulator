/// Draws the tongue using Catmull-Rom spline smoothing.

import { COLORS } from './colors';
import { catmullRomSpline } from '../utils/spline';
import { buildTransform } from './drawTract';
import type { RenderState } from '../types/simulation';

export function drawTongue(
  ctx: CanvasRenderingContext2D,
  state: RenderState,
  cw: number,
  ch: number
) {
  const { toCanvas, scale } = buildTransform(cw, ch);

  if (state.tongue_dorsal.length < 2 || state.tongue_ventral.length < 2) return;

  // Convert from VTC coords to canvas coords
  const dorsal: [number, number][] = state.tongue_dorsal.map(
    ([x, y]) => toCanvas(x, y)
  );
  const ventral: [number, number][] = state.tongue_ventral.map(
    ([x, y]) => toCanvas(x, y)
  );

  // Smooth the dorsal and ventral curves
  const smoothDorsal = catmullRomSpline(dorsal, 6);
  const smoothVentral = catmullRomSpline(ventral, 6);

  // Build tongue outline: dorsal (root → tip) + ventral (tip → root)
  const tonguePath: [number, number][] = [
    ...smoothDorsal,
    ...smoothVentral.slice().reverse(),
  ];

  // Fill tongue body
  ctx.save();
  ctx.beginPath();
  if (tonguePath.length > 0) {
    ctx.moveTo(tonguePath[0][0], tonguePath[0][1]);
    for (let i = 1; i < tonguePath.length; i++) {
      ctx.lineTo(tonguePath[i][0], tonguePath[i][1]);
    }
    ctx.closePath();
  }

  // Flat fill — no gradient
  ctx.fillStyle = COLORS.tongue;
  ctx.fill();

  // Dorsal outline
  ctx.beginPath();
  if (smoothDorsal.length > 0) {
    ctx.moveTo(smoothDorsal[0][0], smoothDorsal[0][1]);
    for (let i = 1; i < smoothDorsal.length; i++) {
      ctx.lineTo(smoothDorsal[i][0], smoothDorsal[i][1]);
    }
  }
  ctx.strokeStyle = 'rgba(80, 30, 30, 0.75)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Ventral outline (lighter — interior surface)
  ctx.beginPath();
  if (smoothVentral.length > 0) {
    ctx.moveTo(smoothVentral[0][0], smoothVentral[0][1]);
    for (let i = 1; i < smoothVentral.length; i++) {
      ctx.lineTo(smoothVentral[i][0], smoothVentral[i][1]);
    }
  }
  ctx.strokeStyle = 'rgba(120, 55, 55, 0.4)';
  ctx.lineWidth = scale;
  ctx.stroke();

  ctx.restore();
}
