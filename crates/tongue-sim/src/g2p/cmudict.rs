use std::collections::HashMap;
use std::sync::OnceLock;

static DICT: OnceLock<HashMap<String, Vec<String>>> = OnceLock::new();

fn load_dict() -> HashMap<String, Vec<String>> {
    let json = include_str!("../../data/cmudict_compact.json");
    serde_json::from_str(json).expect("Failed to parse cmudict_compact.json")
}

/// Look up a word in the CMU Pronouncing Dictionary.
/// Returns Some(phones) if found, None otherwise.
/// The word should already be lowercased.
pub fn lookup(word: &str) -> Option<Vec<String>> {
    let dict = DICT.get_or_init(load_dict);
    // Strip trailing apostrophe-s ('s) before lookup
    let cleaned = word.trim_end_matches("'s").trim_end_matches('\'');
    dict.get(cleaned).cloned()
}
