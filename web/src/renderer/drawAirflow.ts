/// Draws airflow particles.

import { buildTransform } from './drawTract';
import type { RenderState } from '../types/simulation';

export function drawAirflow(
  ctx: CanvasRenderingContext2D,
  state: RenderState,
  cw: number,
  ch: number
) {
  if (state.particles.length === 0) return;

  const { toCanvas, scale } = buildTransform(cw, ch);

  ctx.save();

  for (const p of state.particles) {
    const [cx, cy] = toCanvas(p.x, p.y);
    const r = Math.max(1.5, (2 + p.turbulence * 2) * scale);

    // Lerp color based on turbulence
    const baseR = 100, baseG = 180, baseB = 255;
    const turbR = 255, turbG = 100, turbB = 100;
    const t = p.turbulence;
    const r_ = Math.round(baseR + (turbR - baseR) * t);
    const g_ = Math.round(baseG + (turbG - baseG) * t);
    const b_ = Math.round(baseB + (turbB - baseB) * t);
    const alpha = p.opacity * 0.6;

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r_},${g_},${b_},${alpha})`;
    ctx.fill();
  }

  ctx.restore();
}
