use crate::anatomy::{AnatomyConfig, Vec2};
use crate::phoneme::ArticulatoryState;

/// Rigid body state for all non-tongue articulators.
pub struct RigidBodies {
    pub jaw_angle: f64,        // degrees
    pub jaw_velocity: f64,     // deg/s
    pub velum_angle: f64,      // degrees
    pub velum_velocity: f64,
    pub hyoid_y: f64,          // mm offset from rest
    pub hyoid_vy: f64,
    pub lip_protrusion: f64,
    pub lip_rounding: f64,
    pub lip_spread: f64,
    pub lip_prot_vel: f64,
    pub lip_round_vel: f64,
    pub lip_spread_vel: f64,

    // Rest positions from anatomy
    pub hyoid_rest_y: f64,
}

// PD controller gains (from architecture §13.1)
const KP_JAW: f64 = 100.0;
const KD_JAW: f64 = 15.0;
const KP_VELUM: f64 = 80.0;
const KD_VELUM: f64 = 12.0;
const KP_HYOID: f64 = 120.0;
const KD_HYOID: f64 = 18.0;
const KP_LIP: f64 = 150.0;
const KD_LIP: f64 = 22.0;

impl RigidBodies {
    pub fn new(anatomy: &AnatomyConfig) -> Self {
        RigidBodies {
            jaw_angle: 8.0,
            jaw_velocity: 0.0,
            velum_angle: 2.0,
            velum_velocity: 0.0,
            hyoid_y: 0.0,
            hyoid_vy: 0.0,
            lip_protrusion: 0.0,
            lip_rounding: 0.0,
            lip_spread: 0.0,
            lip_prot_vel: 0.0,
            lip_round_vel: 0.0,
            lip_spread_vel: 0.0,
            hyoid_rest_y: anatomy.hyoid_position.y,
        }
    }

    /// Advance all rigid bodies by dt seconds using PD control.
    pub fn step(&mut self, target: &ArticulatoryState, dt: f64) {
        self.jaw_angle = pd_step(
            self.jaw_angle, self.jaw_velocity, target.jaw_angle,
            KP_JAW, KD_JAW, dt, 0.0, 35.0, &mut self.jaw_velocity,
        );

        self.velum_angle = pd_step(
            self.velum_angle, self.velum_velocity, target.velum_angle,
            KP_VELUM, KD_VELUM, dt, 0.0, 45.0, &mut self.velum_velocity,
        );

        self.hyoid_y = pd_step(
            self.hyoid_y, self.hyoid_vy, target.hyoid_offset,
            KP_HYOID, KD_HYOID, dt, -6.0, 4.0, &mut self.hyoid_vy,
        );

        self.lip_protrusion = pd_step(
            self.lip_protrusion, self.lip_prot_vel, target.lip_protrusion,
            KP_LIP, KD_LIP, dt, -1.0, 1.0, &mut self.lip_prot_vel,
        );

        self.lip_rounding = pd_step(
            self.lip_rounding, self.lip_round_vel, target.lip_rounding,
            KP_LIP, KD_LIP, dt, 0.0, 1.0, &mut self.lip_round_vel,
        );

        self.lip_spread = pd_step(
            self.lip_spread, self.lip_spread_vel, target.lip_spread,
            KP_LIP, KD_LIP, dt, 0.0, 1.0, &mut self.lip_spread_vel,
        );
    }

    /// Compute the current upper lip curve (5 points) based on rigid body state.
    pub fn upper_lip_points(&self, anatomy: &AnatomyConfig) -> Vec<Vec2> {
        let base = &anatomy.upper_lip;
        let prot = self.lip_protrusion;  // -1..1
        let round = self.lip_rounding;   // 0..1
        let spread = self.lip_spread;    // 0..1

        base.iter().map(|p| {
            Vec2::new(
                p.x + prot * 6.0 + round * 3.0,
                p.y + round * 2.0 - spread * 2.0,
            )
        }).collect()
    }

    /// Compute the current lower lip curve (5 points).
    pub fn lower_lip_points(&self, anatomy: &AnatomyConfig) -> Vec<Vec2> {
        let base = &anatomy.lower_lip;
        let jaw_offset_y = self.jaw_angle * (-0.4); // jaw opening lowers lower lip
        let prot = self.lip_protrusion;
        let round = self.lip_rounding;

        base.iter().map(|p| {
            Vec2::new(
                p.x + prot * 6.0 + round * 3.0,
                p.y + jaw_offset_y + round * (-1.0),
            )
        }).collect()
    }

    /// Compute the velum tip position given current velum_angle.
    /// Hinge is at anatomy.velum_hinge, velum hangs downward.
    pub fn velum_tip(&self, anatomy: &AnatomyConfig) -> Vec2 {
        let hinge = &anatomy.velum_hinge;
        let angle_rad = self.velum_angle.to_radians();
        // Velum hangs down at angle from vertical; 0° = vertical (raised), 45° = swung out
        let x = hinge.x + anatomy.velum_length * angle_rad.sin();
        let y = hinge.y - anatomy.velum_length * angle_rad.cos();
        Vec2::new(x, y)
    }
}

/// Simple PD controller step for a scalar DOF.
fn pd_step(
    current: f64,
    velocity: f64,
    target: f64,
    kp: f64,
    kd: f64,
    dt: f64,
    min: f64,
    max: f64,
    vel_out: &mut f64,
) -> f64 {
    let error = target - current;
    let accel = kp * error - kd * velocity;
    let new_vel = (velocity + accel * dt).clamp(-200.0, 200.0);
    let new_pos = (current + new_vel * dt).clamp(min, max);
    *vel_out = new_vel;
    new_pos
}
