pub mod particles;

use crate::anatomy::AnatomyConfig;
use crate::physics::mesh::TongueMesh;
use crate::physics::rigid_bodies::RigidBodies;

const NUM_STATIONS: usize = 44;
const SUBGLOTTAL_PRESSURE: f64 = 800.0; // Pa
const AIR_DENSITY: f64 = 1.2;           // kg/m³

/// 1D area function sampled at 44 stations.
#[derive(Clone)]
pub struct AreaFunction {
    pub areas: [f64; NUM_STATIONS],        // cm²
    pub positions: [f64; NUM_STATIONS],    // distance from glottis (mm)
    pub min_area: f64,
    pub flow_velocity: f64,                // cm/s
    pub is_turbulent: bool,
}

impl Default for AreaFunction {
    fn default() -> Self {
        AreaFunction {
            areas: [3.0; NUM_STATIONS],
            positions: {
                let mut p = [0.0f64; NUM_STATIONS];
                for i in 0..NUM_STATIONS {
                    p[i] = i as f64 * 4.0;
                }
                p
            },
            min_area: 3.0,
            flow_velocity: 0.0,
            is_turbulent: false,
        }
    }
}

/// Compute the area function from the current mesh and rigid body state.
pub fn compute_area_function(
    mesh: &TongueMesh,
    rigid: &RigidBodies,
    anatomy: &AnatomyConfig,
) -> AreaFunction {
    let mut af = AreaFunction::default();

    let x_glottis = anatomy.larynx_position.x;
    let x_lips = 162.0f64;
    let tract_len = x_lips - x_glottis;

    for s in 0..NUM_STATIONS {
        let t = s as f64 / (NUM_STATIONS - 1) as f64;
        let x = x_glottis + t * tract_len;
        af.positions[s] = x - x_glottis;

        let tongue_y = tongue_dorsal_y_at_x(mesh, x);
        let ceil_y = palate_y_at_x_approx(x, anatomy);

        let gap_mm = (ceil_y - tongue_y).max(0.0);
        let width_mm = 20.0;
        af.areas[s] = (gap_mm * width_mm * 0.01).max(0.0);
    }

    // Jaw opening effect in anterior region
    let jaw_offset = rigid.jaw_angle * 0.3;
    for s in 30..NUM_STATIONS {
        let frac = (s - 30) as f64 / 14.0;
        af.areas[s] += frac * jaw_offset * 20.0 * 0.01;
    }

    // Glottal constriction
    af.areas[0] = (0.05 + rigid.jaw_angle * 0.001).max(0.01);

    af.min_area = af.areas.iter().cloned().fold(f64::MAX, f64::min);
    if af.min_area == f64::MAX {
        af.min_area = 0.0;
    }

    let a_min_m2 = af.min_area * 1e-4;
    let u_ms = a_min_m2 * (2.0 * SUBGLOTTAL_PRESSURE / AIR_DENSITY).sqrt();
    af.flow_velocity = u_ms * 100.0;
    af.is_turbulent = af.min_area <= 0.1;

    af
}

fn tongue_dorsal_y_at_x(mesh: &TongueMesh, x: f64) -> f64 {
    let n = mesh.dorsal.len();
    if n == 0 { return 15.0; }

    for i in 0..n - 1 {
        let x0 = mesh.dorsal[i].position.x;
        let x1 = mesh.dorsal[i + 1].position.x;
        if x >= x0 && x <= x1 {
            let t = if (x1 - x0).abs() < 1e-6 { 0.0 } else { (x - x0) / (x1 - x0) };
            return mesh.dorsal[i].position.y
                + t * (mesh.dorsal[i + 1].position.y - mesh.dorsal[i].position.y);
        }
    }

    if x < mesh.dorsal[0].position.x {
        return mesh.dorsal[0].position.y;
    }
    mesh.dorsal[n - 1].position.y
}

fn palate_y_at_x_approx(x: f64, anatomy: &AnatomyConfig) -> f64 {
    let [ref p0, ref p1, ref p2, ref p3] = anatomy.palate_bezier;

    if x < p0.x {
        return 40.0 + (x - 15.0) * 0.25;
    }
    if x > p3.x {
        return 35.0 - (x - p3.x) * 0.5;
    }

    let mut lo = 0.0f64;
    let mut hi = 1.0f64;
    for _ in 0..16 {
        let mid = (lo + hi) * 0.5;
        let u = 1.0 - mid;
        let bx = u*u*u*p0.x + 3.0*u*u*mid*p1.x + 3.0*u*mid*mid*p2.x + mid*mid*mid*p3.x;
        if bx < x { lo = mid; } else { hi = mid; }
    }
    let t = (lo + hi) * 0.5;
    let u = 1.0 - t;
    u*u*u*p0.y + 3.0*u*u*t*p1.y + 3.0*u*t*t*p2.y + t*t*t*p3.y
}
