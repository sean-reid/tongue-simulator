/// Color palette for the vocal tract renderer.

export const COLORS = {
  background: '#FAFAFA',
  // Tissues
  tongue: '#E8A0A0',
  tongueDorsal: '#D08080',
  mucosa: '#E8A0A0',
  bone: '#F5E6D3',
  pharyngealWall: '#D4A0A0',
  // Hard / soft palate
  palate: '#F0D8C0',
  palateStroke: '#C8A880',
  // Jaw and teeth
  mandible: '#E8D8C0',
  teeth: '#FAFFF0',
  teethStroke: '#D0C8A0',
  // Lips
  upperLip: '#E8A0A0',
  lowerLip: '#E8A0A0',
  lipStroke: '#C07070',
  // Velum / soft palate
  velum: '#F0C8B0',
  velumStroke: '#C8906080',
  // Nasal cavity
  nasalCavityFill: 'rgba(210, 230, 255, 0.25)',
  nasalCavityStroke: 'rgba(150, 180, 220, 0.4)',
  // Trachea
  trachea: 'rgba(180, 200, 220, 0.4)',
  // Outline
  outline: '#555555',
  // Airflow particles
  particleBase: 'rgba(100, 180, 255, 0.5)',
  particleTurbulent: 'rgba(255, 100, 100, 0.65)',
  // Voicing glow
  voicingGlow: 'rgba(255, 200, 100, 0.3)',
  // IPA label
  ipaText: '#2563EB',
  // Active word
  wordHighlight: '#2563EB',
} as const;
