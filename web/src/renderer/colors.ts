/// Color palette for the vocal tract renderer.
/// Palette designed to resemble a midsagittal anatomical diagram.

export const COLORS = {
  background: '#F7F4EF',
  // Outer head silhouette
  headSkin: 'rgba(224, 195, 165, 0.35)',
  headSkinStroke: 'rgba(150, 110, 80, 0.3)',
  // Posterior tissue (prevertebral / pharyngeal constrictor mass)
  pharyngealTissueFill: 'rgba(165, 118, 98, 0.35)',
  // Cranium / skull / maxilla region
  craniumFill: '#EDE6D8',
  craniumStroke: 'rgba(180, 160, 130, 0.5)',
  // Mucosa / tissue
  tongue: '#CC6666',
  tongueDorsal: '#AA4444',
  tongueHighlight: '#E88888',
  mucosa: '#C85858',
  // Soft tissue (floor of mouth, gum)
  softTissue: 'rgba(195, 115, 105, 0.55)',
  gum: '#C07070',
  // Hard / soft palate
  palate: '#ECD8B8',
  palateStroke: '#B89860',
  palateInner: 'rgba(210, 155, 125, 0.6)',
  // Pharyngeal wall
  pharyngealWall: '#A07060',
  // Jaw bone
  mandible: '#E8DCC8',
  mandibleStroke: '#A89060',
  // Teeth
  teeth: '#F8FFF2',
  teethStroke: '#C0B888',
  // Lips (flesh-toned, slightly darker than skin)
  upperLip: '#D48878',
  lowerLip: '#D48878',
  lipStroke: '#A05050',
  // Velum / soft palate
  velum: '#DDB898',
  velumStroke: '#A07050',
  // Nasal cavity air space
  nasalCavityFill: 'rgba(195, 220, 245, 0.45)',
  nasalCavityStroke: 'rgba(130, 165, 205, 0.5)',
  // Trachea
  trachea: 'rgba(160, 190, 215, 0.5)',
  // Bone generic
  bone: '#EDE6D8',
  // Outline (dark but not pure black — like ink illustration)
  outline: '#3A3028',
  // Airflow particles
  particleBase: 'rgba(80, 160, 240, 0.55)',
  particleTurbulent: 'rgba(240, 90, 90, 0.7)',
  // Voicing glow
  voicingGlow: 'rgba(255, 195, 80, 0.35)',
  // IPA label
  ipaText: '#2563EB',
  // Active word
  wordHighlight: '#2563EB',
} as const;
