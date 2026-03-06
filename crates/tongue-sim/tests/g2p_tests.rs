use tongue_sim::*;

// Note: integration tests for WASM crates are limited — these run in native mode.
// The g2p and phoneme modules must be pub for testing.

#[cfg(test)]
mod tests {
    // Basic smoke tests for the G2P pipeline

    #[test]
    fn test_phoneme_targets_load() {
        // This just verifies the JSON loads without panic
        let target = tongue_sim::phoneme::targets::get_target("IY");
        assert!(target.jaw_angle < 10.0, "IY should have nearly-closed jaw");
        assert!(target.voicing > 0.5, "IY should be voiced");
    }

    #[test]
    fn test_g2p_common_words() {
        // CMUdict lookup
        let hello = tongue_sim::g2p::cmudict::lookup("hello");
        assert!(hello.is_some(), "CMUdict should have 'hello'");
        let phones = hello.unwrap();
        assert!(!phones.is_empty(), "hello should have phonemes");
    }

    #[test]
    fn test_g2p_fallback() {
        // OOV word
        let phones = tongue_sim::g2p::fallback::convert("zarbix");
        assert!(!phones.is_empty(), "Fallback should produce phonemes");
    }

    #[test]
    fn test_timeline_building() {
        let timeline = tongue_sim::g2p::build_timeline("hello world", 1.0);
        assert!(!timeline.entries.is_empty(), "Timeline should have entries");
        assert!(timeline.total_duration_ms > 0.0, "Duration should be positive");
        // Verify timestamps are monotonically increasing
        let mut prev_end = 0.0f64;
        for entry in &timeline.entries {
            assert!(entry.start_ms >= prev_end - 0.01, "Timestamps should be monotone");
            assert!(entry.end_ms > entry.start_ms, "End > start");
            prev_end = entry.end_ms;
        }
    }

    #[test]
    fn test_word_sync_map() {
        let timeline = tongue_sim::g2p::build_timeline("hello world", 1.0);
        let sync = tongue_sim::g2p::build_word_sync_map("hello world", &timeline);
        assert_eq!(sync.len(), 2, "Should have 2 words");
        assert_eq!(sync[0].word, "hello");
        assert_eq!(sync[1].word, "world");
        assert!(sync[1].estimated_time_ms > sync[0].estimated_time_ms);
    }

    #[test]
    fn test_stress_stripping() {
        use tongue_sim::phoneme::{strip_stress, stress_of, Stress};
        assert_eq!(strip_stress("AE1"), "AE");
        assert_eq!(strip_stress("EH0"), "EH");
        assert_eq!(strip_stress("NG"), "NG");
        assert_eq!(stress_of("AE1"), Stress::Primary);
        assert_eq!(stress_of("EH0"), Stress::None);
        assert_eq!(stress_of("IH2"), Stress::Secondary);
    }

    #[test]
    fn test_speaking_rate_scaling() {
        let t1 = tongue_sim::g2p::build_timeline("hello", 1.0);
        let t2 = tongue_sim::g2p::build_timeline("hello", 2.0);
        // Faster rate should produce shorter duration
        assert!(t2.total_duration_ms < t1.total_duration_ms,
            "Faster rate should shorten duration");
    }
}
