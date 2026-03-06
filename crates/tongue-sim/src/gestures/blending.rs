use crate::phoneme::{ArticulatoryState, TimedPhoneme, is_vowel, strip_stress};
use crate::phoneme::targets::get_target;

/// Blend the current phoneme's articulatory state with neighboring phonemes
/// to produce natural coarticulation effects.
///
/// Rules implemented:
/// - V-to-V carryover: tongue body of next vowel bleeds into intervening consonant
/// - Anticipatory lip rounding: /u/, /o/ rounding bleeds back through 1 consonant
/// - Carryover nasalization: velum lag ~50ms after nasals
pub fn blend_with_neighbors(
    entries: &[TimedPhoneme],
    idx: usize,
    local_t: f64,  // 0..1 within current phoneme
    current: &ArticulatoryState,
) -> ArticulatoryState {
    let n = entries.len();

    // Get adjacent phoneme targets
    let prev = if idx > 0 { Some(get_target(&entries[idx - 1].arpabet)) } else { None };
    let next = if idx + 1 < n { Some(get_target(&entries[idx + 1].arpabet)) } else { None };

    let current_arp = strip_stress(&entries[idx].arpabet);
    let prev_arp = if idx > 0 { Some(strip_stress(&entries[idx - 1].arpabet)) } else { None };
    let next_arp = if idx + 1 < n { Some(strip_stress(&entries[idx + 1].arpabet)) } else { None };

    // --- Interpolation weights ---
    // Forward blend (toward next phoneme) increases in the second half
    let forward_blend = smooth_step(local_t, 0.5, 1.0);
    // Backward carryover from previous phoneme decreases in the first half
    let backward_carry = smooth_step(1.0 - local_t, 0.5, 1.0);

    let mut result = current.clone();

    // --- Tongue body coarticulation ---
    // During consonants, blend tongue body position toward nearest vowel
    if !is_vowel(current_arp) {
        // Look back for preceding vowel
        if let (Some(ref prev_state), Some(prev_a)) = (&prev, prev_arp) {
            if is_vowel(prev_a) {
                let w = backward_carry * 0.4;
                for i in 0..9 {
                    result.muscle_activations[i] = result.muscle_activations[i] * (1.0 - w)
                        + prev_state.muscle_activations[i] * w;
                }
            }
        }
        // Look ahead for following vowel
        if let (Some(ref next_state), Some(next_a)) = (&next, next_arp) {
            if is_vowel(next_a) {
                let w = forward_blend * 0.5;
                for i in 0..9 {
                    result.muscle_activations[i] = result.muscle_activations[i] * (1.0 - w)
                        + next_state.muscle_activations[i] * w;
                }
            }
        }
    }

    // --- Anticipatory lip rounding for /u/ and /o/ ---
    // Rounding bleeds back through up to 1 preceding consonant
    if let (Some(ref next_state), Some(next_a)) = (&next, next_arp) {
        if matches!(next_a, "UW" | "OW" | "UH" | "AO" | "OY") {
            let w = forward_blend * 0.6;
            result.lip_rounding = result.lip_rounding * (1.0 - w) + next_state.lip_rounding * w;
            result.lip_protrusion = result.lip_protrusion * (1.0 - w) + next_state.lip_protrusion * w;
        }
    }

    // --- Carryover nasalization: velum lag after nasals ---
    if let (Some(ref prev_state), Some(prev_a)) = (&prev, prev_arp) {
        if matches!(prev_a, "M" | "N" | "NG") {
            // Velum continues to be partially lowered at the start of the next phoneme
            let lag_factor = (1.0 - local_t * 3.0).max(0.0);
            result.velum_angle = result.velum_angle * (1.0 - lag_factor * 0.5)
                + prev_state.velum_angle * (lag_factor * 0.5);
        }
    }

    // --- Smooth jaw transitions ---
    if let Some(ref next_state) = next {
        let w = forward_blend * 0.3;
        result.jaw_angle = result.jaw_angle * (1.0 - w) + next_state.jaw_angle * w;
    }

    result
}

/// Smooth step from 0 to 1 as x goes from edge0 to edge1.
fn smooth_step(x: f64, edge0: f64, edge1: f64) -> f64 {
    let t = ((x - edge0) / (edge1 - edge0)).clamp(0.0, 1.0);
    t * t * (3.0 - 2.0 * t)
}
