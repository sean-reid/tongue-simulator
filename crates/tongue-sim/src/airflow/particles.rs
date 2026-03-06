use crate::anatomy::Vec2;
use crate::airflow::AreaFunction;

const MAX_PARTICLES: usize = 100;
const PARTICLE_LIFETIME_MS: f64 = 300.0;
const GLOTTIS_X: f64 = 15.0;
const GLOTTIS_Y: f64 = 3.0;

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
        let flow_v = area_fn.flow_velocity;

        // Emit new particles
        if glottal_aperture > 0.1 || voicing > 0.1 {
            self.emit_timer += dt_ms;
            while self.emit_timer >= self.emit_interval_ms
                && self.particles.len() < MAX_PARTICLES
            {
                let rand_y = self.rand_f(-1.0, 1.0);
                let rand_vx = flow_v * 0.05 * glottal_aperture;
                let rand_vy = self.rand_f(-0.5, 0.5);
                self.particles.push(Particle {
                    position: Vec2::new(GLOTTIS_X, GLOTTIS_Y + rand_y),
                    velocity: Vec2::new(rand_vx, rand_vy),
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
            let local_speed = if area > 0.01 { flow_v / area.max(0.5) } else { flow_v };

            p.velocity.x = local_speed.min(500.0) * 0.1;
            p.velocity.y += randoms[i] * (1.0 / area.max(0.1)).min(3.0);
            p.velocity.y *= 0.95;

            p.position.x += p.velocity.x * dt;
            p.position.y += p.velocity.y * dt;

            p.turbulence = if area < 0.2 { 1.0 } else { (0.2 / area).min(1.0) };
            p.opacity = (1.0 - p.age_ms / PARTICLE_LIFETIME_MS).max(0.0);

            if p.age_ms >= PARTICLE_LIFETIME_MS || p.position.x > 165.0 {
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

fn area_at_x(area_fn: &AreaFunction, x: f64) -> f64 {
    let dist = (x - GLOTTIS_X).max(0.0);
    let total = area_fn.positions[43];
    if total < 1.0 { return 3.0; }

    let t = dist / total;
    let idx = ((t * 43.0) as usize).min(43);
    area_fn.areas[idx]
}
