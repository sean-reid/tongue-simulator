/// TypeScript interfaces mirroring the Rust RenderState and related types.

export interface RenderState {
  tongue_dorsal: [number, number][];
  tongue_ventral: [number, number][];
  jaw_angle: number;
  upper_lip: [number, number][];
  lower_lip: [number, number][];
  velum_angle: number;
  velum_tip: [number, number];
  hyoid_y: number;
  glottal_aperture: number;
  voicing: number;
  particles: ParticleData[];
  current_phoneme_ipa: string;
  current_phoneme_index: number;
  is_turbulent: boolean;
  min_area: number;
}

export interface ParticleData {
  x: number;
  y: number;
  velocity_magnitude: number;
  turbulence: number;
  opacity: number;
}

export interface TimedPhoneme {
  arpabet: string;
  ipa: string;
  start_ms: number;
  end_ms: number;
  stress: 'None' | 'Secondary' | 'Primary';
}

export interface PhonemeTimeline {
  entries: TimedPhoneme[];
  total_duration_ms: number;
}

export interface WordSyncEntry {
  char_index: number;
  word: string;
  phoneme_start_index: number;
  estimated_time_ms: number;
}

export interface SyncState {
  currentSimTime: number;
  currentWord: string;
  currentWordIndex: number;
  currentPhoneme: string;
  currentPhonemeIndex: number;
  isActive: boolean;
}

export interface Settings {
  showAirflow: boolean;
  showLabels: boolean;
  showMeshDebug: boolean;
  pitch: number;
  voice: SpeechSynthesisVoice | null;
  rate: number;
}
