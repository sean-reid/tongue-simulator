/// Timing utilities for synchronization between TTS and simulation.

/**
 * Linear interpolation.
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Clamp a value between min and max.
 */
export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/**
 * Exponential moving average.
 */
export class EMA {
  private value: number;
  private alpha: number;

  constructor(initialValue = 0, halfLifeMs = 50, dtMs = 16.7) {
    this.value = initialValue;
    this.alpha = 1 - Math.exp(-Math.log(2) * dtMs / halfLifeMs);
  }

  update(newValue: number): number {
    this.value = this.alpha * newValue + (1 - this.alpha) * this.value;
    return this.value;
  }

  get(): number {
    return this.value;
  }
}

/**
 * Maps a character index to a word index in a word list.
 */
export function charIndexToWordIndex(
  charIndex: number,
  words: Array<{ char_index: number; word: string }>
): number {
  let best = 0;
  for (let i = 0; i < words.length; i++) {
    if (words[i].char_index <= charIndex) {
      best = i;
    }
  }
  return best;
}
