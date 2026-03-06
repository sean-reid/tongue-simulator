/// Catmull-Rom spline interpolation for tongue contour smoothing.

type Point = [number, number];

/**
 * Evaluate a Catmull-Rom spline at parameter t (0..1) given four control points.
 */
export function catmullRom(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  t: number
): Point {
  const t2 = t * t;
  const t3 = t2 * t;

  const x =
    0.5 *
    (2 * p1[0] +
      (-p0[0] + p2[0]) * t +
      (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
      (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);

  const y =
    0.5 *
    (2 * p1[1] +
      (-p0[1] + p2[1]) * t +
      (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
      (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);

  return [x, y];
}

/**
 * Generate a smooth Catmull-Rom spline through the given control points.
 * Returns `resolution` interpolated points per segment.
 */
export function catmullRomSpline(
  points: Point[],
  resolution = 6
): Point[] {
  if (points.length < 2) return points;
  if (points.length === 2) return points;

  const result: Point[] = [];

  // Pad endpoints to create phantom control points
  const pts: Point[] = [
    [2 * points[0][0] - points[1][0], 2 * points[0][1] - points[1][1]],
    ...points,
    [
      2 * points[points.length - 1][0] - points[points.length - 2][0],
      2 * points[points.length - 1][1] - points[points.length - 2][1],
    ],
  ];

  for (let i = 1; i < pts.length - 2; i++) {
    for (let j = 0; j < resolution; j++) {
      const t = j / resolution;
      result.push(catmullRom(pts[i - 1], pts[i], pts[i + 1], pts[i + 2], t));
    }
  }

  // Add the last point
  result.push(points[points.length - 1]);

  return result;
}

/**
 * Cubic Bezier curve evaluation.
 */
export function cubicBezier(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  t: number
): Point {
  const u = 1 - t;
  const b0 = u * u * u;
  const b1 = 3 * u * u * t;
  const b2 = 3 * u * t * t;
  const b3 = t * t * t;
  return [
    b0 * p0[0] + b1 * p1[0] + b2 * p2[0] + b3 * p3[0],
    b0 * p0[1] + b1 * p1[1] + b2 * p2[1] + b3 * p3[1],
  ];
}

/**
 * Sample a cubic Bezier curve at `n` points.
 */
export function sampleBezier(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  n = 30
): Point[] {
  const pts: Point[] = [];
  for (let i = 0; i <= n; i++) {
    pts.push(cubicBezier(p0, p1, p2, p3, i / n));
  }
  return pts;
}
