use wasm_bindgen::prelude::*;
use serde::Serialize;

use crate::anatomy::AnatomyConfig;
use crate::anatomy::defaults::default_anatomy;
use crate::g2p;
use crate::gestures::GesturalScore;
use crate::phoneme::{ArticulatoryState, PhonemeTimeline};
use crate::physics::{PhysicsEngine, Snapshot};
use crate::physics::rigid_bodies::RigidBodies;
use crate::physics::mesh::TongueMesh;

/// Serializable render state sent across the WASM ↔ JS boundary.
#[derive(Clone, Serialize)]
pub struct RenderState {
    pub tongue_dorsal: Vec<[f64; 2]>,
    pub tongue_ventral: Vec<[f64; 2]>,
    pub jaw_angle: f64,
    pub upper_lip: Vec<[f64; 2]>,
    pub lower_lip: Vec<[f64; 2]>,
    pub velum_angle: f64,
    pub velum_tip: [f64; 2],
    pub hyoid_y: f64,
    pub glottal_aperture: f64,
    pub voicing: f64,
    pub particles: Vec<ParticleData>,
    pub current_phoneme_ipa: String,
    pub current_phoneme_index: usize,
    pub is_turbulent: bool,
    pub min_area: f64,
}

#[derive(Clone, Serialize)]
pub struct ParticleData {
    pub x: f64,
    pub y: f64,
    pub velocity_magnitude: f64,
    pub turbulence: f64,
    pub opacity: f64,
}

/// Build a RenderState from current mesh/rigid state.
pub fn build_render_state(
    mesh: &TongueMesh,
    rigid: &RigidBodies,
    articulatory: &ArticulatoryState,
    ipa: &str,
) -> RenderState {
    let anatomy = default_anatomy();

    let tongue_dorsal: Vec<[f64; 2]> = mesh.dorsal.iter()
        .map(|n| [n.position.x, n.position.y])
        .collect();

    let tongue_ventral: Vec<[f64; 2]> = mesh.ventral.iter()
        .map(|n| [n.position.x, n.position.y])
        .collect();

    let upper_lip = rigid.upper_lip_points(&anatomy);
    let lower_lip = rigid.lower_lip_points(&anatomy);
    let velum_tip = rigid.velum_tip(&anatomy);

    RenderState {
        tongue_dorsal,
        tongue_ventral,
        jaw_angle: rigid.jaw_angle,
        upper_lip: upper_lip.iter().map(|p| [p.x, p.y]).collect(),
        lower_lip: lower_lip.iter().map(|p| [p.x, p.y]).collect(),
        velum_angle: rigid.velum_angle,
        velum_tip: [velum_tip.x, velum_tip.y],
        hyoid_y: rigid.hyoid_y,
        glottal_aperture: articulatory.glottal_aperture,
        voicing: articulatory.voicing,
        particles: Vec::new(),
        current_phoneme_ipa: ipa.to_string(),
        current_phoneme_index: 0,
        is_turbulent: false,
        min_area: 1.0,
    }
}

fn snapshot_to_render(snap: &Snapshot, anatomy: &AnatomyConfig) -> RenderState {
    let rigid = RigidBodies {
        jaw_angle: snap.jaw_angle,
        jaw_velocity: 0.0,
        velum_angle: snap.velum_angle,
        velum_velocity: 0.0,
        hyoid_y: snap.hyoid_y,
        hyoid_vy: 0.0,
        lip_protrusion: snap.lip_protrusion,
        lip_rounding: snap.lip_rounding,
        lip_spread: 0.0,
        lip_prot_vel: 0.0,
        lip_round_vel: 0.0,
        lip_spread_vel: 0.0,
        hyoid_rest_y: anatomy.hyoid_position.y,
    };

    let upper_lip = rigid.upper_lip_points(anatomy);
    let lower_lip = rigid.lower_lip_points(anatomy);
    let velum_tip = rigid.velum_tip(anatomy);

    let particles: Vec<ParticleData> = snap.particles.iter().map(|p| ParticleData {
        x: p.position.x,
        y: p.position.y,
        velocity_magnitude: (p.velocity.x * p.velocity.x + p.velocity.y * p.velocity.y).sqrt(),
        turbulence: p.turbulence,
        opacity: p.opacity,
    }).collect();

    RenderState {
        tongue_dorsal: snap.tongue_dorsal.iter().map(|p| [p.x, p.y]).collect(),
        tongue_ventral: snap.tongue_ventral.iter().map(|p| [p.x, p.y]).collect(),
        jaw_angle: snap.jaw_angle,
        upper_lip: upper_lip.iter().map(|p| [p.x, p.y]).collect(),
        lower_lip: lower_lip.iter().map(|p| [p.x, p.y]).collect(),
        velum_angle: snap.velum_angle,
        velum_tip: [velum_tip.x, velum_tip.y],
        hyoid_y: snap.hyoid_y,
        glottal_aperture: snap.glottal_aperture,
        voicing: snap.voicing,
        particles,
        current_phoneme_ipa: snap.phoneme_ipa.clone(),
        current_phoneme_index: snap.phoneme_index,
        is_turbulent: false,
        min_area: 1.0,
    }
}

/// The primary simulation session exposed to JavaScript.
#[wasm_bindgen]
pub struct SimulationSession {
    text: String,
    speaking_rate: f64,
    timeline: PhonemeTimeline,
    gestural_score: GesturalScore,
    snapshots: Vec<Snapshot>,
    anatomy: AnatomyConfig,
}

#[wasm_bindgen]
impl SimulationSession {
    /// Create a new simulation session for the given text and speaking rate.
    #[wasm_bindgen(constructor)]
    pub fn new(text: &str, speaking_rate: f64) -> SimulationSession {
        let rate = speaking_rate.clamp(0.1, 4.0);
        let timeline = g2p::build_timeline(text, rate);
        let gestural_score = GesturalScore::new(timeline.clone(), rate);
        let anatomy = default_anatomy();
        SimulationSession {
            text: text.to_string(),
            speaking_rate: rate,
            timeline,
            gestural_score,
            snapshots: Vec::new(),
            anatomy,
        }
    }

    /// Pre-compute physics for the entire utterance.
    /// Returns total duration in ms.
    pub fn precompute(&mut self) -> f64 {
        let dt = 1.0 / 240.0; // 240 Hz physics
        let total_ms = self.timeline.total_duration_ms;

        // Add some padding for return-to-rest
        let sim_duration_ms = total_ms + 500.0;
        let n_frames = (sim_duration_ms / 1000.0 * 240.0) as usize;

        let mut engine = PhysicsEngine::new(&self.anatomy);
        self.snapshots = Vec::with_capacity(n_frames);

        // Warm up the engine for 50 steps at rest position
        let rest = ArticulatoryState::rest();
        for _ in 0..50 {
            engine.step(&rest, dt);
        }

        for frame in 0..n_frames {
            let t_ms = frame as f64 / 240.0 * 1000.0;
            let articulatory = self.gestural_score.get_state_at(t_ms);
            let (ipa, pidx) = self.gestural_score.get_phoneme_info(t_ms);

            engine.step(&articulatory, dt);

            let snap = Snapshot {
                time_ms: t_ms,
                tongue_dorsal: engine.mesh.dorsal.iter().map(|n| n.position.clone()).collect(),
                tongue_ventral: engine.mesh.ventral.iter().map(|n| n.position.clone()).collect(),
                jaw_angle: engine.rigid.jaw_angle,
                hyoid_y: engine.rigid.hyoid_y,
                velum_angle: engine.rigid.velum_angle,
                glottal_aperture: articulatory.glottal_aperture,
                voicing: articulatory.voicing,
                lip_protrusion: engine.rigid.lip_protrusion,
                lip_rounding: engine.rigid.lip_rounding,
                particles: engine.particles.particles.clone(),
                phoneme_ipa: ipa,
                phoneme_index: pidx,
            };
            self.snapshots.push(snap);
        }

        total_ms
    }

    /// Get the render state at a given simulation time (ms).
    /// Interpolates between nearest precomputed snapshots.
    pub fn get_render_state(&self, time_ms: f64) -> JsValue {
        if self.snapshots.is_empty() {
            let rest = ArticulatoryState::rest();
            let anatomy = default_anatomy();
            let mesh = TongueMesh::new(&anatomy);
            let rigid = RigidBodies::new(&anatomy);
            let rs = build_render_state(&mesh, &rigid, &rest, "");
            return serde_wasm_bindgen::to_value(&rs).unwrap_or(JsValue::NULL);
        }

        // Find bracketing snapshots
        let n = self.snapshots.len();
        let idx = {
            let mut lo = 0usize;
            let mut hi = n;
            while lo + 1 < hi {
                let mid = (lo + hi) / 2;
                if self.snapshots[mid].time_ms <= time_ms { lo = mid; } else { hi = mid; }
            }
            lo.min(n - 1)
        };

        let rs = if idx + 1 < n {
            let a = &self.snapshots[idx];
            let b = &self.snapshots[idx + 1];
            let t = if (b.time_ms - a.time_ms).abs() < 1e-6 {
                0.0
            } else {
                (time_ms - a.time_ms) / (b.time_ms - a.time_ms)
            };
            interpolate_snapshots(a, b, t, &self.anatomy)
        } else {
            snapshot_to_render(&self.snapshots[idx], &self.anatomy)
        };

        serde_wasm_bindgen::to_value(&rs).unwrap_or(JsValue::NULL)
    }

    /// Get the phoneme timeline as a JS array.
    pub fn get_phoneme_timeline(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self.timeline).unwrap_or(JsValue::NULL)
    }

    /// Get word boundary sync map.
    pub fn get_word_sync_map(&self) -> JsValue {
        let sync_map = g2p::build_word_sync_map(&self.text, &self.timeline);
        serde_wasm_bindgen::to_value(&sync_map).unwrap_or(JsValue::NULL)
    }

    /// Rebuild timeline at a new speaking rate.
    pub fn set_speaking_rate(&mut self, rate: f64) {
        let rate = rate.clamp(0.1, 4.0);
        self.speaking_rate = rate;
        self.timeline = g2p::build_timeline(&self.text, rate);
        self.gestural_score = GesturalScore::new(self.timeline.clone(), rate);
        self.snapshots.clear();
    }

    /// Total simulation duration in ms.
    pub fn duration_ms(&self) -> f64 {
        self.timeline.total_duration_ms
    }
}

/// Linearly interpolate between two snapshots.
fn interpolate_snapshots(a: &Snapshot, b: &Snapshot, t: f64, anatomy: &AnatomyConfig) -> RenderState {
    let n = a.tongue_dorsal.len();
    let dorsal: Vec<[f64; 2]> = (0..n).map(|i| {
        let pa = &a.tongue_dorsal[i];
        let pb = &b.tongue_dorsal[i];
        [pa.x + (pb.x - pa.x) * t, pa.y + (pb.y - pa.y) * t]
    }).collect();

    let ventral: Vec<[f64; 2]> = (0..n).map(|i| {
        let pa = &a.tongue_ventral[i];
        let pb = &b.tongue_ventral[i];
        [pa.x + (pb.x - pa.x) * t, pa.y + (pb.y - pa.y) * t]
    }).collect();

    // Use 'a' snapshot's rigid state interpolated
    let jaw = a.jaw_angle + (b.jaw_angle - a.jaw_angle) * t;
    let velum_a = a.velum_angle + (b.velum_angle - a.velum_angle) * t;
    let hyoid = a.hyoid_y + (b.hyoid_y - a.hyoid_y) * t;
    let lip_prot = a.lip_protrusion + (b.lip_protrusion - a.lip_protrusion) * t;
    let lip_round = a.lip_rounding + (b.lip_rounding - a.lip_rounding) * t;
    let glottal = a.glottal_aperture + (b.glottal_aperture - a.glottal_aperture) * t;
    let voicing = a.voicing + (b.voicing - a.voicing) * t;

    let rigid = RigidBodies {
        jaw_angle: jaw,
        jaw_velocity: 0.0,
        velum_angle: velum_a,
        velum_velocity: 0.0,
        hyoid_y: hyoid,
        hyoid_vy: 0.0,
        lip_protrusion: lip_prot,
        lip_rounding: lip_round,
        lip_spread: 0.0,
        lip_prot_vel: 0.0,
        lip_round_vel: 0.0,
        lip_spread_vel: 0.0,
        hyoid_rest_y: anatomy.hyoid_position.y,
    };

    let upper_lip = rigid.upper_lip_points(anatomy);
    let lower_lip = rigid.lower_lip_points(anatomy);
    let velum_tip = rigid.velum_tip(anatomy);

    // Use particles from a (simpler approach)
    let particles: Vec<ParticleData> = a.particles.iter().map(|p| ParticleData {
        x: p.position.x,
        y: p.position.y,
        velocity_magnitude: (p.velocity.x * p.velocity.x + p.velocity.y * p.velocity.y).sqrt(),
        turbulence: p.turbulence,
        opacity: p.opacity,
    }).collect();

    RenderState {
        tongue_dorsal: dorsal,
        tongue_ventral: ventral,
        jaw_angle: jaw,
        upper_lip: upper_lip.iter().map(|p| [p.x, p.y]).collect(),
        lower_lip: lower_lip.iter().map(|p| [p.x, p.y]).collect(),
        velum_angle: velum_a,
        velum_tip: [velum_tip.x, velum_tip.y],
        hyoid_y: hyoid,
        glottal_aperture: glottal,
        voicing,
        particles,
        current_phoneme_ipa: a.phoneme_ipa.clone(),
        current_phoneme_index: a.phoneme_index,
        is_turbulent: false,
        min_area: 1.0,
    }
}
