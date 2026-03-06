/// Timeline utilities — warp a PhonemeTimeline given a time-stretch factor.
use crate::phoneme::PhonemeTimeline;

/// Warp all phoneme timestamps by a linear factor (to match TTS actual rate).
/// `stretch` > 1 means slower, < 1 means faster.
pub fn warp_timeline(timeline: &mut PhonemeTimeline, stretch: f64) {
    let s = stretch.clamp(0.25, 4.0);
    for entry in timeline.entries.iter_mut() {
        entry.start_ms *= s;
        entry.end_ms *= s;
    }
    timeline.total_duration_ms *= s;
}

/// Piecewise-linear warp between two word boundaries.
/// `word_start_ms` and `word_end_ms` are estimated times.
/// `actual_start_ms` and `actual_end_ms` are from TTS boundary events.
pub fn warp_segment(
    timeline: &mut PhonemeTimeline,
    phoneme_start: usize,
    phoneme_end: usize,
    est_start: f64,
    est_end: f64,
    actual_start: f64,
    actual_end: f64,
) {
    let est_dur = (est_end - est_start).max(1.0);
    let actual_dur = (actual_end - actual_start).max(1.0);

    for entry in timeline.entries.iter_mut().take(phoneme_end).skip(phoneme_start) {
        let t_norm = (entry.start_ms - est_start) / est_dur;
        let new_start = actual_start + t_norm * actual_dur;
        let dur = entry.end_ms - entry.start_ms;
        let scale = actual_dur / est_dur;
        entry.start_ms = new_start;
        entry.end_ms = new_start + dur * scale;
    }

    // Update total duration if we warped the last segment
    if phoneme_end >= timeline.entries.len() {
        if let Some(last) = timeline.entries.last() {
            timeline.total_duration_ms = last.end_ms;
        }
    }
}
