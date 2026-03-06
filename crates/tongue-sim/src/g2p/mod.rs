pub mod cmudict;
pub mod fallback;

use crate::phoneme::{stress_of, strip_stress, Stress, PhonemeTimeline, TimedPhoneme, WordSyncEntry};
use crate::phoneme::durations::adjusted_duration_ms;
use crate::phoneme::arpabet_to_ipa;

/// Split text into words, returning (word_text, char_start) pairs.
fn tokenize(text: &str) -> Vec<(String, usize)> {
    let mut words = Vec::new();
    let mut current_word = String::new();
    let mut word_start = 0usize;
    let mut char_idx = 0usize;

    for ch in text.chars() {
        if ch.is_alphabetic() || ch == '\'' {
            if current_word.is_empty() {
                word_start = char_idx;
            }
            current_word.push(ch.to_ascii_lowercase());
        } else {
            if !current_word.is_empty() {
                words.push((current_word.clone(), word_start));
                current_word.clear();
            }
        }
        char_idx += ch.len_utf8();
    }
    if !current_word.is_empty() {
        words.push((current_word, word_start));
    }
    words
}

/// Convert text to a flat list of (arpabet_with_stress, stress) phonemes.
pub fn text_to_phonemes(text: &str) -> Vec<(String, Stress)> {
    let words = tokenize(text);
    let mut phonemes = Vec::new();

    for (word, _) in &words {
        let phones = cmudict::lookup(word)
            .unwrap_or_else(|| fallback::convert(word));
        for ph in phones {
            let stress = stress_of(&ph);
            phonemes.push((ph, stress));
        }
    }
    phonemes
}

/// Build a PhonemeTimeline from text at a given speaking rate.
pub fn build_timeline(text: &str, speaking_rate: f64) -> PhonemeTimeline {
    let words = tokenize(text);
    let mut entries: Vec<TimedPhoneme> = Vec::new();
    let mut t = 0.0f64;

    // We'll also track whether we're at pre-pausal positions.
    // For now, treat each word boundary as a potential pause site.
    let chars: Vec<char> = text.chars().collect();

    for (wi, (word, _char_start)) in words.iter().enumerate() {
        let is_last = wi == words.len() - 1;

        let phones = cmudict::lookup(word)
            .unwrap_or_else(|| fallback::convert(word));

        let n = phones.len();
        for (pi, ph) in phones.iter().enumerate() {
            let stress = stress_of(ph);
            let base = strip_stress(ph).to_string();
            let pre_pausal = is_last && pi == n - 1;
            // Simple consonant-cluster detection: adjacent non-vowels
            let in_cluster = pi > 0
                && !crate::phoneme::is_vowel(strip_stress(&phones[pi - 1]))
                && !crate::phoneme::is_vowel(strip_stress(ph));

            let dur = adjusted_duration_ms(&base, stress, pre_pausal, in_cluster, speaking_rate);
            let ipa = arpabet_to_ipa(&base).to_string();

            entries.push(TimedPhoneme {
                arpabet: base,
                ipa,
                start_ms: t,
                end_ms: t + dur,
                stress,
            });
            t += dur;
        }

        // Add inter-word pause based on punctuation following this word
        if !is_last {
            // Find char just after this word in the original text
            let word_end = _char_start + word.len();
            let next_nonalpha: Option<char> = chars.get(word_end).copied();
            match next_nonalpha {
                Some(',') | Some(';') => t += crate::phoneme::durations::comma_pause_ms() / speaking_rate,
                Some('.') | Some('!') | Some('?') => t += crate::phoneme::durations::sentence_pause_ms() / speaking_rate,
                _ => {}
            }
        }
    }

    let total = t;
    PhonemeTimeline {
        entries,
        total_duration_ms: total,
    }
}

/// Build a WordSyncMap from text and a pre-computed timeline.
pub fn build_word_sync_map(text: &str, timeline: &PhonemeTimeline) -> Vec<WordSyncEntry> {
    let words = tokenize(text);
    let mut sync_map = Vec::new();
    let mut phoneme_cursor = 0usize;

    for (word, char_start) in &words {
        let phones = cmudict::lookup(word)
            .unwrap_or_else(|| fallback::convert(word));
        let n_phones = phones.len();

        let estimated_time = if phoneme_cursor < timeline.entries.len() {
            timeline.entries[phoneme_cursor].start_ms
        } else {
            timeline.total_duration_ms
        };

        sync_map.push(WordSyncEntry {
            char_index: *char_start,
            word: word.clone(),
            phoneme_start_index: phoneme_cursor,
            estimated_time_ms: estimated_time,
        });

        phoneme_cursor += n_phones;
    }
    sync_map
}
