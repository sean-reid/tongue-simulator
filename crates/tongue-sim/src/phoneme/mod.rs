pub mod durations;
pub mod targets;

use serde::{Deserialize, Serialize};

/// 18-parameter articulatory state vector.
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ArticulatoryState {
    /// Muscle activations: [GGa, GGp, SG, HG, PG, SL, IL, T, V]
    pub muscle_activations: [f64; 9],
    pub jaw_angle: f64,       // degrees, 0–35
    pub lip_protrusion: f64,  // -1..1
    pub lip_rounding: f64,    // 0..1
    pub lip_spread: f64,      // 0..1
    pub velum_angle: f64,     // degrees, 0=raised, 45=lowered
    pub hyoid_offset: f64,    // mm vertical from rest
    pub glottal_aperture: f64, // 0..1
    pub voicing: f64,         // 0..1
}

impl ArticulatoryState {
    /// Linearly interpolate between two states.
    pub fn lerp(&self, other: &ArticulatoryState, t: f64) -> ArticulatoryState {
        let mut acts = [0.0f64; 9];
        for i in 0..9 {
            acts[i] = self.muscle_activations[i]
                + (other.muscle_activations[i] - self.muscle_activations[i]) * t;
        }
        ArticulatoryState {
            muscle_activations: acts,
            jaw_angle: lerp_f(self.jaw_angle, other.jaw_angle, t),
            lip_protrusion: lerp_f(self.lip_protrusion, other.lip_protrusion, t),
            lip_rounding: lerp_f(self.lip_rounding, other.lip_rounding, t),
            lip_spread: lerp_f(self.lip_spread, other.lip_spread, t),
            velum_angle: lerp_f(self.velum_angle, other.velum_angle, t),
            hyoid_offset: lerp_f(self.hyoid_offset, other.hyoid_offset, t),
            glottal_aperture: lerp_f(self.glottal_aperture, other.glottal_aperture, t),
            voicing: lerp_f(self.voicing, other.voicing, t),
        }
    }

    pub fn rest() -> ArticulatoryState {
        targets::get_target("REST")
    }
}

fn lerp_f(a: f64, b: f64, t: f64) -> f64 {
    a + (b - a) * t
}

/// A single phoneme entry with IPA/ARPAbet info and its articulatory target.
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct PhonemeEntry {
    pub arpabet: String,
    pub ipa: String,
    pub target: ArticulatoryState,
    pub is_vowel: bool,
    pub is_voiced: bool,
    pub is_nasal: bool,
    pub place: &'static str, // "bilabial", "alveolar", "velar", etc.
}

/// Stress level on a phoneme.
#[derive(Clone, Copy, Debug, Serialize, Deserialize, PartialEq)]
pub enum Stress {
    None,
    Secondary,
    Primary,
}

/// One phoneme with its position in the timeline.
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct TimedPhoneme {
    pub arpabet: String,
    pub ipa: String,
    pub start_ms: f64,
    pub end_ms: f64,
    pub stress: Stress,
}

/// The full phoneme timeline for an utterance.
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct PhonemeTimeline {
    pub entries: Vec<TimedPhoneme>,
    pub total_duration_ms: f64,
}

/// Map from character index to phoneme index and estimated time.
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct WordSyncEntry {
    pub char_index: usize,
    pub word: String,
    pub phoneme_start_index: usize,
    pub estimated_time_ms: f64,
}

/// Helper: extract base ARPAbet (strip stress digit).
pub fn strip_stress(phoneme: &str) -> &str {
    phoneme.trim_end_matches(|c: char| c.is_ascii_digit())
}

/// Helper: extract stress digit from ARPAbet phoneme string.
pub fn stress_of(phoneme: &str) -> Stress {
    if phoneme.ends_with('1') {
        Stress::Primary
    } else if phoneme.ends_with('2') {
        Stress::Secondary
    } else {
        Stress::None
    }
}

/// IPA representations for ARPAbet phonemes.
pub fn arpabet_to_ipa(arp: &str) -> &'static str {
    match arp {
        "AA" => "ɑ", "AE" => "æ", "AH" => "ʌ", "AO" => "ɔ",
        "AW" => "aʊ", "AY" => "aɪ", "EH" => "ɛ", "ER" => "ɝ",
        "EY" => "eɪ", "IH" => "ɪ", "IY" => "iː", "OW" => "oʊ",
        "OY" => "ɔɪ", "UH" => "ʊ", "UW" => "uː",
        "B" => "b", "CH" => "tʃ", "D" => "d", "DH" => "ð",
        "F" => "f", "G" => "g", "HH" => "h", "JH" => "dʒ",
        "K" => "k", "L" => "l", "M" => "m", "N" => "n",
        "NG" => "ŋ", "P" => "p", "R" => "ɹ", "S" => "s",
        "SH" => "ʃ", "T" => "t", "TH" => "θ", "V" => "v",
        "W" => "w", "Y" => "j", "Z" => "z", "ZH" => "ʒ",
        "AX" => "ə",
        _ => "?",
    }
}

/// Is this ARPAbet phoneme a vowel?
pub fn is_vowel(arp: &str) -> bool {
    matches!(
        arp,
        "AA" | "AE" | "AH" | "AO" | "AW" | "AY" | "EH" | "ER"
            | "EY" | "IH" | "IY" | "OW" | "OY" | "UH" | "UW" | "AX"
    )
}

/// Is this ARPAbet phoneme voiced?
pub fn is_voiced(arp: &str) -> bool {
    !matches!(
        arp,
        "P" | "T" | "K" | "F" | "TH" | "S" | "SH" | "CH" | "HH"
    )
}
