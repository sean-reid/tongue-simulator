/// Draws the static and rigid anatomical structures of the vocal tract.

import { COLORS } from './colors';
import { sampleBezier } from '../utils/spline';
import type { RenderState } from '../types/simulation';

// Vocal tract coordinate space:
//   x: glottis ≈ 15, lips ≈ 165, posterior neck at x ≈ -20
//   y: -25 (subglottal) → +82 (above nasal cavity)
// We show x from -22 to +185 to include the posterior neck/skull.
// Canvas maps this with flipped y (y increases upward in VTC, downward on canvas).

const VTC_X_MIN = -22;
const VTC_X_MAX = 185;
const TRACT_WIDTH = VTC_X_MAX - VTC_X_MIN; // 207
const TRACT_Y_MIN = -25;
const TRACT_Y_RANGE = 140; // -25 → +115

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
      offsetX + (x - VTC_X_MIN) * scale,
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

  // Draw back-to-front so posterior elements sit behind anterior ones

  // 1. Posterior neck / skull outline (behind everything)
  drawPosteriorNeck(ctx, toCanvas, scale);

  // 2. Posterior pharyngeal wall + prevertebral tissue band
  drawPharyngealWall(ctx, toCanvas, scale);

  // 3. Trachea — subglottal airway going downward
  drawTrachea(ctx, toCanvas, scale);

  // 4. Hard palate
  drawHardPalate(ctx, toCanvas, scale);

  // 5. Epiglottis
  drawEpiglottis(ctx, toCanvas, scale);

  // 6. Alveolar ridge
  drawAlveolarRidge(ctx, toCanvas, scale);

  // 7. Upper teeth
  drawUpperTeeth(ctx, toCanvas, scale);

  // 8. Face profile outline (on top so it overlaps correctly)
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

  ctx.restore();
}

export function drawVoicingIndicator(
  ctx: CanvasRenderingContext2D,
  state: RenderState,
  cw: number,
  ch: number
) {
  const { toCanvas, scale } = buildTransform(cw, ch);

  // Draw vocal folds as two angled lines forming a V at the glottis.
  // The gap between them reflects glottal_aperture; color reflects voicing.
  const aperture = state.glottal_aperture; // 0=closed, 1=open
  const voiced = state.voicing > 0.15;

  // Vocal folds drawn as a horizontal V inside the trachea column.
  // The glottis sits at x=15 (between trachea walls at x=12 and x=18).
  const [gx, gy] = toCanvas(15, 3);
  const halfSpan = 2.5 * scale;               // half the horizontal span of each fold
  const depth    = aperture * 3.5 * scale;    // how open the glottis is (vertical gap)

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineWidth = 1.8 * scale;
  ctx.strokeStyle = voiced ? '#C87010' : 'rgba(110, 85, 65, 0.55)';

  // Upper fold: left wall → centre (open by depth)
  ctx.beginPath();
  ctx.moveTo(gx - halfSpan, gy);
  ctx.lineTo(gx, gy - depth);
  ctx.stroke();

  // Lower fold: centre → right wall
  ctx.beginPath();
  ctx.moveTo(gx, gy - depth);
  ctx.lineTo(gx + halfSpan, gy);
  ctx.stroke();

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

  // ── Eye ──────────────────────────────────────────────────────────────────
  drawEye(ctx, toCanvas, scale);

  ctx.restore();
}

function drawEye(ctx: CanvasRenderingContext2D, toCanvas: Transform['toCanvas'], scale: number) {
  // Eye socket / orbit — sits recessed in the face, slightly posterior to the forehead curve.
  // In VTC x-coords, the eye is roughly at x=161, y=70 (between glabella and nasion).
  const [ecx, ecy] = toCanvas(160, 70);
  const ew = 8 * scale;  // wider — anatomically the eye spans ~30mm
  const eh = 5 * scale;  // taller — orbital height

  // Blink: closed for ~150ms every ~4 seconds
  const t = performance.now() % 4200;
  const blinking = t < 150;

  ctx.save();

  // Eyelid shadow / orbit outline — slightly larger ellipse in dark tone
  ctx.beginPath();
  ctx.ellipse(ecx, ecy, ew + 1.5 * scale, eh + 1 * scale, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(140, 100, 75, 0.25)';
  ctx.fill();

  // Sclera
  ctx.beginPath();
  ctx.ellipse(ecx, ecy, ew, blinking ? 0.8 * scale : eh, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(245, 242, 235, 0.95)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(90, 60, 40, 0.55)';
  ctx.lineWidth = 1 * scale;
  ctx.stroke();

  if (!blinking) {
    // Iris — large, fills much of the eye
    const ir = 3.8 * scale;
    ctx.beginPath();
    ctx.arc(ecx, ecy, ir, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(85, 115, 75, 0.9)';
    ctx.fill();

    // Pupil
    ctx.beginPath();
    ctx.arc(ecx, ecy, 2 * scale, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(15, 10, 8, 0.95)';
    ctx.fill();

    // Specular glint
    ctx.beginPath();
    ctx.arc(ecx - 1.2 * scale, ecy - 1.2 * scale, 0.7 * scale, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fill();
  }

  ctx.restore();
}

function drawPosteriorNeck(ctx: CanvasRenderingContext2D, toCanvas: Transform['toCanvas'], scale: number) {
  // Complete head/neck outline on the posterior side.
  // Draws from the lower cervical, up through the occiput, across the forehead crown,
  // and ends at glabella (162, 79) — where the face profile begins.
  // Together these two paths form a closed, recognisable human head silhouette.

  const tc = (x: number, y: number): [number, number] => toCanvas(x, y);

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(110, 78, 54, 0.52)';
  ctx.lineWidth = 2.5 * scale;

  ctx.beginPath();
  ctx.moveTo(...tc(-5, -18));           // lower cervical spine / C7

  // Posterior cervical spine — curves slightly backward (lordosis)
  ctx.bezierCurveTo(
    ...tc(-13, 8),  ...tc(-16, 34),
    ...tc(-13, 56),                    // suboccipital / C1-C2
  );

  // Occiput → vertex (crown) — rises to the top of the skull
  ctx.bezierCurveTo(
    ...tc(-5,  78), ...tc(30, 115),
    ...tc(75,  110),                   // vertex / crown
  );

  // Crown → glabella — forehead slopes forward and downward
  ctx.bezierCurveTo(
    ...tc(120, 112), ...tc(158, 93),
    ...tc(162, 79),                    // glabella — joins the face profile
  );

  ctx.stroke();
  ctx.restore();
}

function drawPharyngealWall(ctx: CanvasRenderingContext2D, toCanvas: Transform['toCanvas'], scale: number) {
  // Anterior pharyngeal wall — the lumen-facing surface of the posterior pharynx.
  // This is the wall the tongue faces across the pharyngeal airspace.
  const pts: [number, number][] = [
    [14, -5], [14, 12], [13, 28], [12, 42], [14, 55], [18, 62],
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
  // Subglottal trachea — two short parallel lines going downward from the glottis.
  const [lx, ly] = toCanvas(12, 2);
  const [rx, ry] = toCanvas(18, 2);
  const [, by] = toCanvas(12, -22);

  ctx.beginPath();
  ctx.moveTo(lx, ly); ctx.lineTo(lx, by);
  ctx.moveTo(rx, ry); ctx.lineTo(rx, by);
  ctx.strokeStyle = 'rgba(140, 110, 90, 0.45)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();
}

function drawEpiglottis(ctx: CanvasRenderingContext2D, toCanvas: Transform['toCanvas'], scale: number) {
  // Epiglottis — the leaf-shaped cartilage at the entrance to the larynx.
  // Visible as a bent flap in the hypopharynx, roughly at x=20–30, y=18–32.
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(...toCanvas(20, 22));              // base (attached to thyroid cartilage)
  ctx.bezierCurveTo(
    ...toCanvas(22, 28), ...toCanvas(26, 32),  // sweeps up and forward
    ...toCanvas(28, 30),                       // tip
  );
  ctx.bezierCurveTo(
    ...toCanvas(28, 26), ...toCanvas(24, 22),  // curves back
    ...toCanvas(22, 20),                       // inferior surface
  );
  ctx.strokeStyle = 'rgba(165, 120, 90, 0.75)';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();
  ctx.fillStyle = 'rgba(200, 155, 120, 0.35)';
  ctx.fill();

  ctx.restore();
}

function drawHardPalate(ctx: CanvasRenderingContext2D, toCanvas: Transform['toCanvas'], scale: number) {
  // Cubic Bezier: (60,50) → (90,52) → (120,50) → (148,42) — single stroke line
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
  ctx.strokeStyle = COLORS.palateStroke;
  ctx.lineWidth = 2.5 * scale;
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
  // Upper incisors: two tooth shapes visible in side profile.
  // In midsagittal view, we see the profile of the incisors —
  // flat top attached to alveolar ridge, rounded bottom edge.
  const teeth: Array<{ x1: number; x2: number; top: number; bot: number }> = [
    { x1: 149, x2: 155, top: 42, bot: 27 }, // central incisor (broader)
    { x1: 155, x2: 160, top: 40, bot: 28 }, // lateral incisor
  ];

  for (const t of teeth) {
    const [lx, ty] = toCanvas(t.x1, t.top);
    const [rx, _] = toCanvas(t.x2, t.top);
    const [, by] = toCanvas(t.x1, t.bot);
    const w = rx - lx;
    const h = by - ty;
    const r = Math.min(Math.abs(w), Math.abs(h)) * 0.25;

    ctx.beginPath();
    ctx.moveTo(lx, ty);
    ctx.lineTo(rx, ty);
    ctx.lineTo(rx, by - r);
    ctx.quadraticCurveTo(rx, by, rx - r, by);
    ctx.lineTo(lx + r, by);
    ctx.quadraticCurveTo(lx, by, lx, by - r);
    ctx.lineTo(lx, ty);
    ctx.closePath();
    ctx.fillStyle = COLORS.teeth;
    ctx.fill();
    ctx.strokeStyle = COLORS.teethStroke;
    ctx.lineWidth = 0.8 * scale;
    ctx.stroke();
  }
}

function drawMandible(
  ctx: CanvasRenderingContext2D,
  jawAngle: number,
  toCanvas: Transform['toCanvas'],
  scale: number
) {
  const pivotX = 52, pivotY = 65;
  const angleRad = (jawAngle * Math.PI) / 180;

  // Key jaw landmarks — rotated around TMJ pivot
  const pts: [number, number][] = [
    [145, 33],   // alveolar crest (tooth-bearing region)
    [132, 12],   // chin / symphysis
    [100, -7],   // inferior border
    [65,  -4],   // gonion / jaw angle
    [48,  20],   // ascending ramus
    [44,  52],   // just below condyle
  ];

  const rot = pts.map(([x, y]) => rotatePt(x, y, pivotX, pivotY, -angleRad));
  const canvas = rot.map(([x, y]) => toCanvas(x, y));

  // Draw as a smooth open spline (Catmull-Rom style via bezier approximation)
  ctx.beginPath();
  ctx.moveTo(canvas[0][0], canvas[0][1]);

  for (let i = 0; i < canvas.length - 1; i++) {
    const p0 = canvas[Math.max(0, i - 1)];
    const p1 = canvas[i];
    const p2 = canvas[i + 1];
    const p3 = canvas[Math.min(canvas.length - 1, i + 2)];

    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2[0], p2[1]);
  }

  ctx.strokeStyle = COLORS.mandibleStroke;
  ctx.lineWidth = 2.5 * scale;
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

  // Lower incisors — two tooth shapes, rounded top edge, flat root.
  const lowerTeeth = [
    { x1: 149, x2: 155, top: 33, bot: 20 },
    { x1: 155, x2: 160, top: 31, bot: 21 },
  ];

  for (const t of lowerTeeth) {
    // Rotate all four corners
    const tl = rotatePt(t.x1, t.top, pivotX, pivotY, -angleRad);
    const tr = rotatePt(t.x2, t.top, pivotX, pivotY, -angleRad);
    const bl = rotatePt(t.x1, t.bot, pivotX, pivotY, -angleRad);
    const br = rotatePt(t.x2, t.bot, pivotX, pivotY, -angleRad);

    const [lx, ty] = toCanvas(bl[0], bl[1]); // bottom-left (root)
    const [rx, _by] = toCanvas(br[0], br[1]); // bottom-right
    const [, topY] = toCanvas(tl[0], tl[1]); // top (tip of tooth)
    const w = rx - lx;
    const h = Math.abs(topY - _by);
    const r = Math.min(Math.abs(w), h) * 0.25;

    // In canvas: lower y = higher on screen. Tooth tip is at topY (smaller canvas y = higher)
    ctx.beginPath();
    ctx.moveTo(lx, _by);
    ctx.lineTo(rx, _by);
    ctx.lineTo(rx, topY + r);
    ctx.quadraticCurveTo(rx, topY, rx - r, topY);
    ctx.lineTo(lx + r, topY);
    ctx.quadraticCurveTo(lx, topY, lx, topY + r);
    ctx.lineTo(lx, _by);
    ctx.closePath();
    ctx.fillStyle = COLORS.teeth;
    ctx.fill();
    ctx.strokeStyle = COLORS.teethStroke;
    ctx.lineWidth = 0.8 * scale;
    ctx.stroke();
  }
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
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Upper lip — thick rounded stroke showing lip profile from the side
  if (state.upper_lip.length >= 2) {
    const ul = state.upper_lip;
    ctx.beginPath();
    const [s0x, s0y] = toCanvas(ul[0][0], ul[0][1]);
    ctx.moveTo(s0x, s0y);
    for (let i = 1; i < ul.length; i++) {
      const [px, py] = toCanvas(ul[i][0], ul[i][1]);
      ctx.lineTo(px, py);
    }
    ctx.strokeStyle = COLORS.lipStroke;
    ctx.lineWidth = 8 * scale;
    ctx.stroke();
    ctx.strokeStyle = COLORS.upperLip;
    ctx.lineWidth = 6 * scale;
    ctx.stroke();
  }

  // Lower lip
  if (state.lower_lip.length >= 2) {
    const ll = state.lower_lip;
    ctx.beginPath();
    const [l0x, l0y] = toCanvas(ll[0][0], ll[0][1]);
    ctx.moveTo(l0x, l0y);
    for (let i = 1; i < ll.length; i++) {
      const [px, py] = toCanvas(ll[i][0], ll[i][1]);
      ctx.lineTo(px, py);
    }
    ctx.strokeStyle = COLORS.lipStroke;
    ctx.lineWidth = 8 * scale;
    ctx.stroke();
    ctx.strokeStyle = COLORS.lowerLip;
    ctx.lineWidth = 6 * scale;
    ctx.stroke();
  }

  ctx.restore();
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
