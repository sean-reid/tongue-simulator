/// Draws the static and rigid anatomical structures of the vocal tract.

import { COLORS } from './colors';
import { sampleBezier } from '../utils/spline';
import type { RenderState } from '../types/simulation';

// Vocal tract coordinate space:
//   x: 0 (posterior/glottis) → 185 (past lips)
//   y: 0 (floor) → 100 (above nasal cavity)
// Canvas maps this with flipped y.

const TRACT_WIDTH = 185;
const TRACT_Y_MIN = -25;   // trachea extends below y=0
const TRACT_Y_RANGE = 107; // total: from -25 to +82

export interface Transform {
  toCanvas: (x: number, y: number) => [number, number];
  scale: number;
}

export function buildTransform(cw: number, ch: number): Transform {
  const scaleX = cw / TRACT_WIDTH;
  const scaleY = ch / TRACT_Y_RANGE;
  const scale = Math.min(scaleX, scaleY);
  const offsetX = (cw - TRACT_WIDTH * scale) / 2;
  const offsetY = (ch - TRACT_Y_RANGE * scale) / 2;
  return {
    scale,
    toCanvas: (x: number, y: number): [number, number] => [
      offsetX + x * scale,
      ch - offsetY - (y - TRACT_Y_MIN) * scale,
    ],
  };
}

/** Draw all static and velum/jaw anatomy. Called every frame. */
export function drawVocalTract(
  ctx: CanvasRenderingContext2D,
  cw: number,
  ch: number
) {
  const { toCanvas, scale } = buildTransform(cw, ch);

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // 1. Nasal cavity air space
  drawNasalCavity(ctx, toCanvas, scale);

  // 2. Pharyngeal wall
  drawPharyngealWall(ctx, toCanvas, scale);

  // 3. Trachea / subglottal
  drawTrachea(ctx, toCanvas, scale);

  // 4. Hard palate
  drawHardPalate(ctx, toCanvas, scale);

  // 5. Alveolar ridge
  drawAlveolarRidge(ctx, toCanvas, scale);

  // 6. Upper teeth
  drawUpperTeeth(ctx, toCanvas, scale);

  // 7. Face profile outline (drawn last so it sits on top of other structures)
  drawFaceProfile(ctx, toCanvas, scale);

  ctx.restore();
}

/** Draw just the mandible bone — exported so the animation loop can draw it
 *  before the tongue, keeping the tongue on top. */
export function drawMandibleBone(
  ctx: CanvasRenderingContext2D,
  jawAngle: number,
  cw: number,
  ch: number
) {
  const { toCanvas, scale } = buildTransform(cw, ch);
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  drawMandible(ctx, jawAngle, toCanvas, scale);
  ctx.restore();
}

/** Draw rigid bodies (jaw, lips, velum) based on current state. */
export function drawRigidBodies(
  ctx: CanvasRenderingContext2D,
  state: RenderState,
  cw: number,
  ch: number
) {
  const { toCanvas, scale } = buildTransform(cw, ch);

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // (Mandible is drawn before the tongue via drawMandibleBone — not here)

  // Lower teeth (move with jaw)
  drawLowerTeeth(ctx, state.jaw_angle, toCanvas, scale);

  // Velum
  drawVelum(ctx, state.velum_angle, state.velum_tip, toCanvas, scale);

  // Lips
  drawLips(ctx, state, toCanvas, scale);

  // Larynx / epiglottis
  drawLarynx(ctx, state, toCanvas, scale);

  ctx.restore();
}

export function drawVoicingIndicator(
  ctx: CanvasRenderingContext2D,
  state: RenderState,
  cw: number,
  ch: number
) {
  if (state.voicing < 0.05) return;

  const { toCanvas, scale } = buildTransform(cw, ch);
  const [gx, gy] = toCanvas(15, 3);
  const r = 8 * scale;

  const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, r);
  const alpha = state.voicing * 0.4;
  grad.addColorStop(0, `rgba(255,200,100,${alpha})`);
  grad.addColorStop(1, 'rgba(255,200,100,0)');

  ctx.save();
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(gx, gy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawIPALabel(
  ctx: CanvasRenderingContext2D,
  ipa: string,
  cw: number,
  ch: number
) {
  if (!ipa) return;
  ctx.save();
  const fontSize = Math.max(14, Math.min(22, cw * 0.035));
  ctx.font = `${fontSize}px system-ui, sans-serif`;
  ctx.fillStyle = COLORS.ipaText;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillText(`/${ipa}/`, cw - 12, ch - 10);
  ctx.restore();
}

// ─────────────────────────────────────────────
// Static anatomy drawing helpers
// ─────────────────────────────────────────────

function drawFaceProfile(ctx: CanvasRenderingContext2D, toCanvas: Transform['toCanvas'], scale: number) {
  // Human face profile in midsagittal (right-facing) view.
  // Uses quadratic bezier curves for organic, realistic shape.
  // Reference landmarks: glabella → nasion → nasal dorsum → pronasale →
  //   columella → subnasale → philtrum → upper lip → stomion →
  //   lower lip → labiomental fold → pogonion → gnathion → neck.

  const tc = (x: number, y: number): [number, number] => toCanvas(x, y);
  const strokeColor = 'rgba(110, 78, 54, 0.55)';

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // ── Main profile contour ──────────────────────────────────────────────────
  ctx.beginPath();
  ctx.moveTo(...tc(162, 79));           // glabella

  // Forehead slightly forward, then nasion indentation at bridge
  ctx.quadraticCurveTo(...tc(163, 74), ...tc(164, 70));  // nasion (bridge concavity)

  // Nasal dorsum: slopes forward from bridge to tip
  ctx.quadraticCurveTo(...tc(171, 62), ...tc(175, 56));  // mid-dorsum
  ctx.quadraticCurveTo(...tc(177, 52), ...tc(176, 49));  // supra-tip / pronasale

  // Columella: curves back down from nasal tip to subnasale
  ctx.quadraticCurveTo(...tc(175, 45), ...tc(171, 43)); // columella / subnasale

  // Philtrum: gentle concave dip then lip protrudes
  ctx.quadraticCurveTo(...tc(169, 38), ...tc(172, 33)); // philtrum / upper lip peak
  ctx.quadraticCurveTo(...tc(173, 29), ...tc(171, 25)); // upper lip rolls back slightly

  // Stomion and lower lip
  ctx.quadraticCurveTo(...tc(170, 22), ...tc(170, 19)); // lower lip vermillion

  // Labiomental fold (concavity between lower lip and chin)
  ctx.quadraticCurveTo(...tc(168, 14), ...tc(167, 9));  // labiomental

  // Chin (pogonion protrudes, then gnathion)
  ctx.quadraticCurveTo(...tc(166, 4),  ...tc(164, 0));  // pogonion / gnathion

  // Submental and neck
  ctx.quadraticCurveTo(...tc(161, -5), ...tc(155, -10)); // submental to neck

  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2.5 * scale;
  ctx.stroke();

  // ── Nasal alar (wing of nose) ─────────────────────────────────────────────
  // A separate bezier tracing the alar rim from the nasal tip, sweeping out
  // around the nostril, and returning to the alar base near subnasale.
  ctx.beginPath();
  ctx.moveTo(...tc(176, 49));           // just below nasal tip
  ctx.bezierCurveTo(
    ...tc(178, 47),                     // alar rim swings outward
    ...tc(175, 43),                     // alar base curves back
    ...tc(171, 43)                      // alar base / subnasale
  );
  ctx.strokeStyle = 'rgba(110, 78, 54, 0.40)';
  ctx.lineWidth = 1.8 * scale;
  ctx.stroke();

  // ── Nostril ───────────────────────────────────────────────────────────────
  // Small filled ellipse inside the alar curve, tilted to suggest nostril opening.
  const [ncx, ncy] = tc(174, 46);
  ctx.beginPath();
  ctx.ellipse(ncx, ncy, 3.2 * scale, 2.0 * scale, Math.PI * 0.18, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(90, 55, 35, 0.40)';
  ctx.fill();

  ctx.restore();
}

function drawNasalCavity(ctx: CanvasRenderingContext2D, toCanvas: Transform['toCanvas'], scale: number) {
  // Nasal cavity polygon: above hard palate from x=55 to x=162, y=50..78
  const pts: [number, number][] = [
    [55, 50], [62, 52], [90, 54], [120, 53], [148, 48],
    [162, 50], [162, 78], [55, 78],
  ];

  ctx.beginPath();
  const [sx, sy] = toCanvas(pts[0][0], pts[0][1]);
  ctx.moveTo(sx, sy);
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = toCanvas(pts[i][0], pts[i][1]);
    ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = COLORS.nasalCavityFill;
  ctx.fill();
  ctx.strokeStyle = COLORS.nasalCavityStroke;
  ctx.lineWidth = 0.8 * scale;
  ctx.stroke();
}

function drawPharyngealWall(ctx: CanvasRenderingContext2D, toCanvas: Transform['toCanvas'], scale: number) {
  const pts: [number, number][] = [
    [15, -5], [15, 10], [14, 25], [13, 40], [14, 52], [18, 60],
  ];

  ctx.beginPath();
  const [sx, sy] = toCanvas(pts[0][0], pts[0][1]);
  ctx.moveTo(sx, sy);
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = toCanvas(pts[i][0], pts[i][1]);
    ctx.lineTo(px, py);
  }
  ctx.strokeStyle = COLORS.pharyngealWall;
  ctx.lineWidth = 2.5 * scale;
  ctx.stroke();
}

function drawTrachea(ctx: CanvasRenderingContext2D, toCanvas: Transform['toCanvas'], scale: number) {
  const [x1, y1] = toCanvas(12, 3);
  const [x2, y2] = toCanvas(18, 3);
  const [x3, y3] = toCanvas(18, -20);
  const [x4, y4] = toCanvas(12, -20);

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x4, y4);
  ctx.moveTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.strokeStyle = COLORS.trachea;
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();
}

function drawHardPalate(ctx: CanvasRenderingContext2D, toCanvas: Transform['toCanvas'], scale: number) {
  // Cubic Bezier: (60,50) → (90,52) → (120,50) → (148,42)
  const p0: [number, number] = [60, 50];
  const p1: [number, number] = [90, 52];
  const p2: [number, number] = [120, 50];
  const p3: [number, number] = [148, 42];

  const pts = sampleBezier(p0, p1, p2, p3, 40);

  ctx.beginPath();
  const [sx, sy] = toCanvas(pts[0][0], pts[0][1]);
  ctx.moveTo(sx, sy);
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = toCanvas(pts[i][0], pts[i][1]);
    ctx.lineTo(px, py);
  }
  // Fill from the palate upward (create a thick band)
  const pts2 = [...pts].reverse().map(([x, y]) => toCanvas(x, y + 5));
  for (const [px, py] of pts2) {
    ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = COLORS.palate;
  ctx.fill();
  ctx.strokeStyle = COLORS.palateStroke;
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();
}

function drawAlveolarRidge(ctx: CanvasRenderingContext2D, toCanvas: Transform['toCanvas'], scale: number) {
  const pts: [number, number][] = [
    [145, 42], [148, 44], [152, 43], [155, 40], [157, 37],
  ];

  ctx.beginPath();
  const [sx, sy] = toCanvas(pts[0][0], pts[0][1]);
  ctx.moveTo(sx, sy);
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = toCanvas(pts[i][0], pts[i][1]);
    ctx.lineTo(px, py);
  }
  ctx.strokeStyle = COLORS.palateStroke;
  ctx.lineWidth = 2 * scale;
  ctx.stroke();
}

function drawUpperTeeth(ctx: CanvasRenderingContext2D, toCanvas: Transform['toCanvas'], scale: number) {
  const pts: [number, number][] = [
    [148, 42], [152, 43], [158, 38], [160, 32],
    [158, 28], [153, 26], [149, 28], [147, 32], [148, 38],
  ];

  ctx.beginPath();
  const [sx, sy] = toCanvas(pts[0][0], pts[0][1]);
  ctx.moveTo(sx, sy);
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = toCanvas(pts[i][0], pts[i][1]);
    ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = COLORS.teeth;
  ctx.fill();
  ctx.strokeStyle = COLORS.teethStroke;
  ctx.lineWidth = 1 * scale;
  ctx.stroke();
}

function drawMandible(
  ctx: CanvasRenderingContext2D,
  jawAngle: number,
  toCanvas: Transform['toCanvas'],
  scale: number
) {
  // Jaw rotates around TMJ pivot (52, 65) — posterior and superior (anatomically correct).
  const pivotX = 52, pivotY = 65;
  const angleRad = (jawAngle * Math.PI) / 180;

  const mandible: [number, number][] = [
    [145, 35],   // lower alveolar crest
    [138, 18],   // symphysis menti (chin)
    [118, -6],   // inferior border, anterior body
    [88,  -8],   // inferior border, mid-body
    [60,  -4],   // angle of jaw (gonion)
    [50,  15],   // ascending ramus, lower
    [46,  38],   // ascending ramus, mid
    [44,  58],   // just below condyle (TMJ at 52,65)
  ];

  const rotated = mandible.map(([x, y]) => rotatePt(x, y, pivotX, pivotY, -angleRad));

  ctx.beginPath();
  const start = toCanvas(rotated[0][0], rotated[0][1]);
  ctx.moveTo(start[0], start[1]);
  for (let i = 1; i < rotated.length; i++) {
    const [px, py] = toCanvas(rotated[i][0], rotated[i][1]);
    ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = COLORS.mandible;
  ctx.fill();
  ctx.strokeStyle = COLORS.mandibleStroke;
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();
}

function drawLowerTeeth(
  ctx: CanvasRenderingContext2D,
  jawAngle: number,
  toCanvas: Transform['toCanvas'],
  scale: number
) {
  const pivotX = 52, pivotY = 65;
  const angleRad = (jawAngle * Math.PI) / 180;

  // Lower incisors sit on the alveolar crest (~y=33) with tips at ~y=22.
  const teeth: [number, number][] = [
    [146, 33], [152, 33], [157, 30], [159, 25],
    [156, 21], [150, 20], [146, 22], [145, 27], [145, 33],
  ];

  const rotated = teeth.map(([x, y]) => rotatePt(x, y, pivotX, pivotY, -angleRad));

  ctx.beginPath();
  const start = toCanvas(rotated[0][0], rotated[0][1]);
  ctx.moveTo(start[0], start[1]);
  for (let i = 1; i < rotated.length; i++) {
    const [px, py] = toCanvas(rotated[i][0], rotated[i][1]);
    ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = COLORS.teeth;
  ctx.fill();
  ctx.strokeStyle = COLORS.teethStroke;
  ctx.lineWidth = scale;
  ctx.stroke();
}

function drawVelum(
  ctx: CanvasRenderingContext2D,
  velumAngle: number,
  velumTip: [number, number],
  toCanvas: Transform['toCanvas'],
  scale: number
) {
  // Velum hinge at (52, 50), tip computed by WASM rigid body
  const hingeX = 52, hingeY = 50;
  const [hx, hy] = toCanvas(hingeX, hingeY);
  const [tx, ty] = toCanvas(velumTip[0], velumTip[1]);

  // Draw velum as a thick line from hinge to tip
  ctx.beginPath();
  ctx.moveTo(hx, hy);
  ctx.lineTo(tx, ty);
  ctx.strokeStyle = COLORS.velum;
  ctx.lineWidth = 5 * scale;
  ctx.stroke();
  ctx.strokeStyle = COLORS.velumStroke;
  ctx.lineWidth = 1 * scale;
  ctx.stroke();
}

function drawLips(
  ctx: CanvasRenderingContext2D,
  state: RenderState,
  toCanvas: Transform['toCanvas'],
  scale: number
) {
  // Upper lip
  if (state.upper_lip.length >= 2) {
    ctx.beginPath();
    const [sx, sy] = toCanvas(state.upper_lip[0][0], state.upper_lip[0][1]);
    ctx.moveTo(sx, sy);
    for (let i = 1; i < state.upper_lip.length; i++) {
      const [px, py] = toCanvas(state.upper_lip[i][0], state.upper_lip[i][1]);
      ctx.lineTo(px, py);
    }
    ctx.strokeStyle = COLORS.lipStroke;
    ctx.lineWidth = 4 * scale;
    ctx.stroke();
    ctx.strokeStyle = COLORS.upperLip;
    ctx.lineWidth = 3 * scale;
    ctx.stroke();
  }

  // Lower lip
  if (state.lower_lip.length >= 2) {
    ctx.beginPath();
    const [sx, sy] = toCanvas(state.lower_lip[0][0], state.lower_lip[0][1]);
    ctx.moveTo(sx, sy);
    for (let i = 1; i < state.lower_lip.length; i++) {
      const [px, py] = toCanvas(state.lower_lip[i][0], state.lower_lip[i][1]);
      ctx.lineTo(px, py);
    }
    ctx.strokeStyle = COLORS.lipStroke;
    ctx.lineWidth = 4 * scale;
    ctx.stroke();
    ctx.strokeStyle = COLORS.lowerLip;
    ctx.lineWidth = 3 * scale;
    ctx.stroke();
  }
}

function drawLarynx(
  ctx: CanvasRenderingContext2D,
  state: RenderState,
  toCanvas: Transform['toCanvas'],
  scale: number
) {
  // Draw epiglottis as a short arc from (20, 22)
  const [ex, ey] = toCanvas(20, 22);
  const [lx, ly] = toCanvas(15, 8);

  ctx.beginPath();
  ctx.moveTo(lx, ly);
  ctx.quadraticCurveTo(ex - 2 * scale, ey - 3 * scale, ex, ey);
  ctx.strokeStyle = 'rgba(180,140,120,0.8)';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  // Glottis mark
  const glottalY = 3 + state.glottal_aperture * 2;
  const [gx1, gy1] = toCanvas(13, glottalY + 1);
  const [gx2, gy2] = toCanvas(17, glottalY - 1);
  ctx.beginPath();
  ctx.moveTo(gx1, gy1);
  ctx.lineTo(gx2, gy2);
  ctx.strokeStyle = state.voicing > 0.1 ? '#ffcc44' : '#aaa';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();
}

function rotatePt(
  x: number,
  y: number,
  cx: number,
  cy: number,
  angle: number
): [number, number] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dx = x - cx;
  const dy = y - cy;
  return [cx + dx * cos - dy * sin, cy + dx * sin + dy * cos];
}
