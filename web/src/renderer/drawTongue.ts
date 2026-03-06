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

  // Gradient fill: slightly darker at edges
  const midX = (dorsal[7]?.[0] ?? cw / 2);
  const midY = (dorsal[7]?.[1] ?? ch / 2);
  const grad = ctx.createRadialGradient(midX, midY, 0, midX, midY, 60 * scale);
  grad.addColorStop(0, '#EEB0B0');
  grad.addColorStop(1, '#D08080');
  ctx.fillStyle = grad;
  ctx.fill();

  // Dorsal outline (heavier)
  ctx.beginPath();
  if (smoothDorsal.length > 0) {
    ctx.moveTo(smoothDorsal[0][0], smoothDorsal[0][1]);
    for (let i = 1; i < smoothDorsal.length; i++) {
      ctx.lineTo(smoothDorsal[i][0], smoothDorsal[i][1]);
    }
  }
  ctx.strokeStyle = COLORS.outline;
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Ventral outline (lighter)
  ctx.beginPath();
  if (smoothVentral.length > 0) {
    ctx.moveTo(smoothVentral[0][0], smoothVentral[0][1]);
    for (let i = 1; i < smoothVentral.length; i++) {
      ctx.lineTo(smoothVentral[i][0], smoothVentral[i][1]);
    }
  }
  ctx.strokeStyle = 'rgba(150,80,80,0.5)';
  ctx.lineWidth = scale;
  ctx.stroke();

  ctx.restore();
}
