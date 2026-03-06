pub mod collisions;
pub mod mesh;
pub mod muscles;
pub mod pbd;
pub mod rigid_bodies;

use crate::anatomy::{AnatomyConfig, Vec2};
use crate::phoneme::ArticulatoryState;

pub struct PhysicsEngine {
    pub mesh: mesh::TongueMesh,
    pub rigid: rigid_bodies::RigidBodies,
    pub anatomy: AnatomyConfig,
}

impl PhysicsEngine {
    pub fn new(anatomy: &AnatomyConfig) -> Self {
        PhysicsEngine {
            mesh: mesh::TongueMesh::new(anatomy),
            rigid: rigid_bodies::RigidBodies::new(anatomy),
            anatomy: anatomy.clone(),
        }
    }

    /// Advance the simulation by one fixed timestep.
    pub fn step(&mut self, target: &ArticulatoryState, dt: f64) {
        pbd::step_mesh(&mut self.mesh, target, &self.anatomy, dt);
        self.rigid.step(target, dt);
    }
}

/// A snapshot of the full simulation state at one time step.
#[derive(Clone)]
pub struct Snapshot {
    pub time_ms: f64,
    pub tongue_dorsal: Vec<Vec2>,
    pub tongue_ventral: Vec<Vec2>,
    pub jaw_angle: f64,
    pub hyoid_y: f64,
    pub velum_angle: f64,
    pub glottal_aperture: f64,
    pub voicing: f64,
    pub lip_protrusion: f64,
    pub lip_rounding: f64,
    pub phoneme_ipa: String,
    pub phoneme_index: usize,
}
