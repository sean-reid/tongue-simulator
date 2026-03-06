use std::collections::HashMap;
use std::sync::OnceLock;
use crate::phoneme::ArticulatoryState;

static TARGETS: OnceLock<HashMap<String, ArticulatoryState>> = OnceLock::new();

fn load_targets() -> HashMap<String, ArticulatoryState> {
    let json = include_str!("../../data/phoneme_targets.json");

    #[derive(serde::Deserialize)]
    struct RawTarget {
        muscle_activations: [f64; 9],
        jaw_angle: f64,
        lip_protrusion: f64,
        lip_rounding: f64,
        lip_spread: f64,
        velum_angle: f64,
        hyoid_offset: f64,
        glottal_aperture: f64,
        voicing: f64,
    }

    let raw: HashMap<String, RawTarget> = serde_json::from_str(json)
        .expect("Failed to parse phoneme_targets.json");

    raw.into_iter()
        .map(|(k, v)| {
            (
                k,
                ArticulatoryState {
                    muscle_activations: v.muscle_activations,
                    jaw_angle: v.jaw_angle,
                    lip_protrusion: v.lip_protrusion,
                    lip_rounding: v.lip_rounding,
                    lip_spread: v.lip_spread,
                    velum_angle: v.velum_angle,
                    hyoid_offset: v.hyoid_offset,
                    glottal_aperture: v.glottal_aperture,
                    voicing: v.voicing,
                },
            )
        })
        .collect()
}

pub fn get_target(arpabet: &str) -> ArticulatoryState {
    let targets = TARGETS.get_or_init(load_targets);
    // Try base phoneme (strip stress digit)
    let base = arpabet.trim_end_matches(|c: char| c.is_ascii_digit());
    if let Some(t) = targets.get(base) {
        return t.clone();
    }
    // Fallback to AX (schwa) for unknown phonemes
    targets
        .get("AX")
        .or_else(|| targets.get("AH"))
        .cloned()
        .unwrap_or_else(|| ArticulatoryState {
            muscle_activations: [0.0; 9],
            jaw_angle: 10.0,
            lip_protrusion: 0.0,
            lip_rounding: 0.0,
            lip_spread: 0.0,
            velum_angle: 2.0,
            hyoid_offset: 0.0,
            glottal_aperture: 0.3,
            voicing: 0.0,
        })
}
