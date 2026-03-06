use crate::phoneme::{Stress, is_vowel};

/// TIMIT-derived mean phoneme durations in ms (base values).
pub fn base_duration_ms(arpabet: &str) -> f64 {
    match arpabet {
        // Vowels
        "IY" => 120.0, "IH" => 90.0, "EH" => 100.0, "AE" => 120.0,
        "AA" => 130.0, "AO" => 120.0, "OW" => 130.0, "UW" => 120.0,
        "UH" => 90.0, "AH" => 85.0, "AX" => 60.0, "ER" => 110.0,
        "AW" => 140.0, "AY" => 140.0, "EY" => 130.0, "OY" => 140.0,
        // Stops
        "P" => 100.0, "B" => 75.0, "T" => 90.0, "D" => 70.0,
        "K" => 100.0, "G" => 75.0,
        // Fricatives
        "F" => 100.0, "V" => 80.0, "TH" => 100.0, "DH" => 70.0,
        "S" => 120.0, "Z" => 90.0, "SH" => 120.0, "ZH" => 90.0,
        "HH" => 80.0,
        // Nasals
        "M" => 80.0, "N" => 75.0, "NG" => 80.0,
        // Affricates
        "CH" => 140.0, "JH" => 110.0,
        // Approximants
        "L" => 70.0, "R" => 70.0, "W" => 75.0, "Y" => 70.0,
        _ => 85.0,
    }
}

/// Compute the adjusted duration of a phoneme given its context.
pub fn adjusted_duration_ms(
    arpabet: &str,
    stress: Stress,
    pre_pausal: bool,
    in_cluster: bool,
    speaking_rate: f64,
) -> f64 {
    let mut dur = base_duration_ms(arpabet);

    // Stressed vowel lengthening
    if is_vowel(arpabet) && stress == Stress::Primary {
        dur *= 1.25;
    }

    // Pre-pausal lengthening
    if pre_pausal {
        dur *= 1.40;
    }

    // Consonant cluster shortening
    if in_cluster && !is_vowel(arpabet) {
        dur *= 0.85;
    }

    // Apply speaking rate (default 1.0)
    dur / speaking_rate.clamp(0.1, 4.0)
}

/// Pause durations.
pub fn comma_pause_ms() -> f64 {
    200.0
}

pub fn sentence_pause_ms() -> f64 {
    400.0
}
