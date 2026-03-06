pub mod blending;
pub mod tiers;
pub mod timeline;

use crate::phoneme::{ArticulatoryState, PhonemeTimeline, TimedPhoneme};
use crate::phoneme::targets::get_target;

/// A gestural score is the full time-parameterized articulatory state sequence.
/// We pre-sample it at a fixed rate for fast lookup during rendering.
pub struct GesturalScore {
    pub timeline: PhonemeTimeline,
    /// Speaking rate used when building this score.
    pub speaking_rate: f64,
}

impl GesturalScore {
    pub fn new(timeline: PhonemeTimeline, speaking_rate: f64) -> Self {
        GesturalScore { timeline, speaking_rate }
    }

    /// Get the interpolated articulatory state at time `t_ms`.
    /// Applies coarticulation blending across phoneme boundaries.
    pub fn get_state_at(&self, t_ms: f64) -> ArticulatoryState {
        let entries = &self.timeline.entries;

        if entries.is_empty() {
            return ArticulatoryState::rest();
        }

        // Handle time outside utterance
        if t_ms <= 0.0 {
            return get_target(&entries[0].arpabet);
        }
        if t_ms >= self.timeline.total_duration_ms {
            return ArticulatoryState::rest();
        }

        // Find current phoneme
        let idx = find_phoneme_at(entries, t_ms);
        let entry = &entries[idx];

        // Local time within this phoneme (0..1)
        let dur = (entry.end_ms - entry.start_ms).max(1.0);
        let local_t = (t_ms - entry.start_ms) / dur;

        let current_target = get_target(&entry.arpabet);

        // Blend with neighboring phonemes for coarticulation
        blending::blend_with_neighbors(entries, idx, local_t, &current_target)
    }

    /// Get the IPA string and phoneme index at time `t_ms`.
    pub fn get_phoneme_info(&self, t_ms: f64) -> (String, usize) {
        let entries = &self.timeline.entries;
        if entries.is_empty() {
            return ("".into(), 0);
        }
        let idx = find_phoneme_at(&entries, t_ms);
        (entries[idx].ipa.clone(), idx)
    }
}

fn find_phoneme_at(entries: &[TimedPhoneme], t_ms: f64) -> usize {
    // Binary search for the phoneme containing t_ms
    let mut lo = 0usize;
    let mut hi = entries.len();
    while lo + 1 < hi {
        let mid = (lo + hi) / 2;
        if entries[mid].start_ms <= t_ms {
            lo = mid;
        } else {
            hi = mid;
        }
    }
    lo
}
