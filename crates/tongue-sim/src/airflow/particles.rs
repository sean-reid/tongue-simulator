use crate::anatomy::Vec2;
use crate::airflow::AreaFunction;

const MAX_PARTICLES: usize = 120;
const PARTICLE_LIFETIME_MS: f64 = 900.0;
// Emit from the oropharynx (oral cavity entry) — above the tongue body.
// This avoids showing particles below the tongue in the subglottal region.
const EMIT_X: f64 = 52.0;
const EMIT_Y: f64 = 35.0;

/// A single airflow particle.
#[derive(Clone, Debug)]
pub struct Particle {
    pub position: Vec2,
    pub velocity: Vec2,
    pub age_ms: f64,
    pub turbulence: f64,
    pub opacity: f64,
}

pub struct ParticleSystem {
    pub particles: Vec<Particle>,
    emit_timer: f64,
    emit_interval_ms: f64,
    rng_state: u64,
}

impl ParticleSystem {
    pub fn new() -> Self {
        ParticleSystem {
            particles: Vec::with_capacity(MAX_PARTICLES),
            emit_timer: 0.0,
            emit_interval_ms: 5.0,
            rng_state: 12345678,
        }
    }

    pub fn update(
        &mut self,
        area_fn: &AreaFunction,
        glottal_aperture: f64,
        voicing: f64,
        dt: f64,
    ) {
        let dt_ms = dt * 1000.0;

        // Emit new particles
        if glottal_aperture > 0.1 || voicing > 0.1 {
            self.emit_timer += dt_ms;
            while self.emit_timer >= self.emit_interval_ms
                && self.particles.len() < MAX_PARTICLES
            {
                let rand_y = self.rand_f(-1.5, 1.5);
                let init_vx = 60.0 + glottal_aperture * 100.0;
                let rand_vy = self.rand_f(-0.3, 0.3);
                self.particles.push(Particle {
                    position: Vec2::new(EMIT_X, EMIT_Y + rand_y),
                    velocity: Vec2::new(init_vx, rand_vy * 4.0),
                    age_ms: 0.0,
                    turbulence: 0.0,
                    opacity: 1.0,
                });
                self.emit_timer -= self.emit_interval_ms;
            }
        }

        // Update existing particles — separate RNG calls from iteration
        // to avoid borrow conflicts: precompute random values
        let n = self.particles.len();
        let mut randoms: Vec<f64> = (0..n).map(|_| self.rand_f(-0.5, 0.5)).collect();

        let mut to_remove: Vec<usize> = Vec::new();

        for i in 0..n {
            let p = &mut self.particles[i];
            p.age_ms += dt_ms;

            let area = area_at_x(area_fn, p.position.x);

            // Drive x-velocity by conservation of flow: narrower area → faster.
            let area_cm2 = area.max(0.05);
            let flow_drive = 120.0 * glottal_aperture.max(0.2);
            p.velocity.x = (flow_drive * 3.0 / area_cm2).min(500.0);

            // Guide particle toward the vocal tract centreline (pharynx curves up,
            // oral cavity is roughly flat).  Without this, particles scatter randomly.
            let target_y = tract_centerline_y(p.position.x);
            p.velocity.y += (target_y - p.position.y) * 3.0
                + randoms[i] * (0.5 / area.max(0.1)).min(1.5);
            p.velocity.y *= 0.85; // stronger damping keeps particles on-path

            p.position.x += p.velocity.x * dt;
            p.position.y += p.velocity.y * dt;

            p.turbulence = if area < 0.2 { 1.0 } else { (0.2 / area).min(1.0) };
            // Stay fully opaque for first 50% of life, then fade out
            let fade_t = ((p.age_ms / PARTICLE_LIFETIME_MS - 0.5) / 0.5).max(0.0);
            p.opacity = (1.0 - fade_t).max(0.0);

            if p.age_ms >= PARTICLE_LIFETIME_MS || p.position.x > 190.0 {
                to_remove.push(i);
            }
        }

        for &i in to_remove.iter().rev() {
            self.particles.swap_remove(i);
        }
    }

    fn rand_u64(&mut self) -> u64 {
        self.rng_state = self.rng_state
            .wrapping_mul(6364136223846793005)
            .wrapping_add(1442695040888963407);
        self.rng_state
    }

    fn rand_f(&mut self, lo: f64, hi: f64) -> f64 {
        let r = (self.rand_u64() >> 11) as f64 / (1u64 << 53) as f64;
        lo + r * (hi - lo)
    }
}

/// Approximate vocal-tract centreline y-coordinate at a given x (mm).
/// Air flows ABOVE the tongue dorsum and BELOW the palate.
///
/// Key landmarks:
///   Glottis       x=15,  y=3   (subglottal)
///   Laryngopharynx x=35, y=16  (rising through pharynx)
///   Oropharynx    x=52,  y=35  (bends from vertical to horizontal)
///   Mid oral      x=80,  y=40  (between tongue body ~36 and palate ~48)
///   Alveolar      x=130, y=38  (above tongue tip ~26, below alveolus ~42)
///   Lip exit      x=162, y=28  (oral opening)
fn tract_centerline_y(x: f64) -> f64 {
    // Piecewise linear through named landmarks
    let stops: [(f64, f64); 7] = [
        (15.0,  3.0),
        (35.0, 16.0),
        (52.0, 35.0),
        (80.0, 40.0),
        (130.0, 38.0),
        (155.0, 30.0),
        (165.0, 27.0),
    ];

    if x <= stops[0].0 { return stops[0].1; }
    let last = stops.len() - 1;
    if x >= stops[last].0 { return stops[last].1; }

    for i in 0..last {
        if x >= stops[i].0 && x < stops[i + 1].0 {
            let t = (x - stops[i].0) / (stops[i + 1].0 - stops[i].0);
            return stops[i].1 + t * (stops[i + 1].1 - stops[i].1);
        }
    }
    stops[last].1
}

fn area_at_x(area_fn: &AreaFunction, x: f64) -> f64 {
    let dist = (x - 15.0).max(0.0);
    let total = area_fn.positions[43];
    if total < 1.0 { return 3.0; }

    let t = dist / total;
    let idx = ((t * 43.0) as usize).min(43);
    area_fn.areas[idx]
}
