/// Rule-based grapheme-to-phoneme fallback for out-of-vocabulary words.
/// Implements common English phoneme correspondences in ARPAbet.

pub fn convert(word: &str) -> Vec<String> {
    let chars: Vec<char> = word.to_lowercase().chars().collect();
    let mut phones: Vec<String> = Vec::new();
    let n = chars.len();
    let mut i = 0;

    while i < n {
        let c = chars[i];
        let next = chars.get(i + 1).copied();
        let prev = if i > 0 { Some(chars[i - 1]) } else { None };
        let next2 = chars.get(i + 2).copied();

        match c {
            // === Digraph consonants ===
            'c' if next == Some('h') => {
                phones.push("CH".into());
                i += 2;
            }
            's' if next == Some('h') => {
                phones.push("SH".into());
                i += 2;
            }
            't' if next == Some('h') => {
                // "th" — voiced after vowel or at word start before vowel
                let voiced = prev.map(is_vowel_char).unwrap_or(false);
                phones.push(if voiced { "DH" } else { "TH" }.into());
                i += 2;
            }
            'p' if next == Some('h') => {
                phones.push("F".into());
                i += 2;
            }
            'n' if next == Some('g') => {
                // Could be NG or N+G; heuristic: use NG at syllable end
                phones.push("NG".into());
                i += 2;
            }
            'c' if next == Some('k') => {
                phones.push("K".into());
                i += 2;
            }
            'q' if next == Some('u') => {
                phones.push("K".into());
                phones.push("W".into());
                i += 2;
            }
            'w' if next == Some('r') => {
                // "wr" → R (silent w)
                phones.push("R".into());
                i += 2;
            }
            'k' if next == Some('n') => {
                // "kn" → N (silent k)
                phones.push("N".into());
                i += 2;
            }
            'g' if next == Some('h') => {
                // "gh" usually silent or /f/
                if next2 == Some('t') {
                    // "ght" → silent gh
                    i += 2; // skip gh, t will be handled next
                } else {
                    phones.push("F".into());
                    i += 2;
                }
            }
            // === Vowel digraphs ===
            'e' if next == Some('e') => {
                phones.push("IY1".into());
                i += 2;
            }
            'e' if next == Some('a') => {
                // "ea" usually /iː/ but can be /ɛ/ (head)
                phones.push("IY1".into());
                i += 2;
            }
            'a' if next == Some('i') => {
                phones.push("EY1".into());
                i += 2;
            }
            'a' if next == Some('y') => {
                phones.push("EY1".into());
                i += 2;
            }
            'o' if next == Some('a') => {
                phones.push("OW1".into());
                i += 2;
            }
            'o' if next == Some('u') => {
                // "ou" can be /aʊ/ or /uː/; default /aʊ/
                phones.push("AW1".into());
                i += 2;
            }
            'o' if next == Some('w') => {
                phones.push("OW1".into());
                i += 2;
            }
            'o' if next == Some('i') => {
                phones.push("OY1".into());
                i += 2;
            }
            'o' if next == Some('y') => {
                phones.push("OY1".into());
                i += 2;
            }
            'o' if next == Some('e') => {
                phones.push("OW1".into());
                i += 2;
            }
            'u' if next == Some('e') => {
                phones.push("UW1".into());
                i += 2;
            }
            'u' if next == Some('i') => {
                phones.push("IH1".into());
                i += 2;
            }
            'a' if next == Some('u') => {
                phones.push("AO1".into());
                i += 2;
            }
            'a' if next == Some('w') => {
                phones.push("AO1".into());
                i += 2;
            }
            'e' if next == Some('w') => {
                phones.push("Y".into());
                phones.push("UW1".into());
                i += 2;
            }
            'i' if next == Some('e') => {
                phones.push("IY1".into());
                i += 2;
            }
            'i' if next == Some('r') => {
                phones.push("AY1".into());
                phones.push("ER0".into());
                i += 2;
            }
            // === Vowel + final-e patterns ===
            // "a_e" → AY/EY, "i_e" → AY, "o_e" → OW, "u_e" → UW
            // These are handled by the vowel rules below + consonant rules
            // === Single vowels ===
            'a' => {
                // Magic-e: a + consonant(s) + e at end → EY
                if has_magic_e(&chars, i) {
                    phones.push("EY1".into());
                } else {
                    // Default: /æ/ in closed syllable, /eɪ/ at word end
                    if i == n - 1 || next == Some(' ') {
                        phones.push("EY1".into());
                    } else {
                        phones.push("AE1".into());
                    }
                }
                i += 1;
            }
            'e' => {
                // Final 'e' is silent
                if i == n - 1 {
                    i += 1;
                    continue;
                }
                if has_magic_e(&chars, i) {
                    phones.push("IY1".into());
                } else {
                    phones.push("EH1".into());
                }
                i += 1;
            }
            'i' => {
                if has_magic_e(&chars, i) {
                    phones.push("AY1".into());
                } else if i == n - 1 {
                    phones.push("IY0".into());
                } else {
                    phones.push("IH1".into());
                }
                i += 1;
            }
            'o' => {
                if has_magic_e(&chars, i) {
                    phones.push("OW1".into());
                } else if i == n - 1 {
                    phones.push("OW0".into());
                } else {
                    phones.push("AO1".into());
                }
                i += 1;
            }
            'u' => {
                if has_magic_e(&chars, i) {
                    phones.push("UW1".into());
                } else {
                    phones.push("AH1".into());
                }
                i += 1;
            }
            'y' => {
                if i == 0 {
                    // Word-initial y is /j/
                    phones.push("Y".into());
                } else if i == n - 1 {
                    // Word-final y is /iː/
                    phones.push("IY0".into());
                } else {
                    // Mid-word y is /ɪ/ or /j/
                    phones.push("IH0".into());
                }
                i += 1;
            }
            // === Single consonants ===
            'b' => { phones.push("B".into()); i += 1; }
            'c' => {
                // c before e, i, y → S; otherwise K
                if matches!(next, Some('e') | Some('i') | Some('y')) {
                    phones.push("S".into());
                } else {
                    phones.push("K".into());
                }
                i += 1;
            }
            'd' => { phones.push("D".into()); i += 1; }
            'f' => { phones.push("F".into()); i += 1; }
            'g' => {
                // g before e, i, y → JH; otherwise G
                if matches!(next, Some('e') | Some('i') | Some('y')) {
                    phones.push("JH".into());
                } else {
                    phones.push("G".into());
                }
                i += 1;
            }
            'h' => { phones.push("HH".into()); i += 1; }
            'j' => { phones.push("JH".into()); i += 1; }
            'k' => { phones.push("K".into()); i += 1; }
            'l' => { phones.push("L".into()); i += 1; }
            'm' => { phones.push("M".into()); i += 1; }
            'n' => { phones.push("N".into()); i += 1; }
            'p' => { phones.push("P".into()); i += 1; }
            'r' => { phones.push("R".into()); i += 1; }
            's' => {
                // s between vowels → Z; otherwise S
                let after_vowel = prev.map(is_vowel_char).unwrap_or(false);
                let before_vowel = next.map(is_vowel_char).unwrap_or(false);
                if after_vowel && before_vowel {
                    phones.push("Z".into());
                } else if i == n - 1 && after_vowel {
                    phones.push("Z".into());
                } else {
                    phones.push("S".into());
                }
                i += 1;
            }
            't' => { phones.push("T".into()); i += 1; }
            'v' => { phones.push("V".into()); i += 1; }
            'w' => { phones.push("W".into()); i += 1; }
            'x' => {
                // x usually /ks/
                phones.push("K".into());
                phones.push("S".into());
                i += 1;
            }
            'z' => { phones.push("Z".into()); i += 1; }
            // Apostrophe and other punctuation — skip
            _ => { i += 1; }
        }
    }

    // If no stress marks were emitted, add primary stress to first vowel
    let has_stress = phones.iter().any(|p| {
        p.ends_with('1') || p.ends_with('2')
    });
    if !has_stress {
        // Add primary stress to first vowel phoneme
        let mut stressed = false;
        for p in phones.iter_mut() {
            let base = p.trim_end_matches(|c: char| c.is_ascii_digit());
            if is_vowel_phone(base) && !stressed {
                *p = format!("{}1", base);
                stressed = true;
                break;
            }
        }
    }

    if phones.is_empty() {
        phones.push("AH0".into());
    }
    phones
}

fn is_vowel_char(c: char) -> bool {
    matches!(c, 'a' | 'e' | 'i' | 'o' | 'u')
}

fn is_vowel_phone(p: &str) -> bool {
    matches!(
        p,
        "AA" | "AE" | "AH" | "AO" | "AW" | "AY" | "EH" | "ER"
            | "EY" | "IH" | "IY" | "OW" | "OY" | "UH" | "UW" | "AX"
    )
}

/// Check if position `i` is followed by consonant(s) + final 'e' (magic-e pattern).
fn has_magic_e(chars: &[char], i: usize) -> bool {
    let n = chars.len();
    // Must not be at end
    if i >= n - 2 {
        return false;
    }
    // Find if there's a single 'e' at word end after 1-2 consonants
    let mut j = i + 1;
    let mut consonant_count = 0;
    while j < n - 1 {
        let c = chars[j];
        if is_vowel_char(c) {
            return false; // another vowel before the final e
        }
        consonant_count += 1;
        j += 1;
        if consonant_count >= 3 {
            return false;
        }
    }
    // Last char must be 'e'
    consonant_count >= 1 && chars[n - 1] == 'e'
}
