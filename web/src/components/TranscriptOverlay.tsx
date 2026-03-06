import React from 'react';
import type { WordSyncEntry } from '../types/simulation';

interface Props {
  text: string;
  wordSyncMap: WordSyncEntry[];
  currentWordIndex: number;
  isSpeaking: boolean;
  currentPhoneme: string;
}

export function TranscriptOverlay({
  text,
  wordSyncMap,
  currentWordIndex,
  isSpeaking,
  currentPhoneme,
}: Props) {
  if (!text || wordSyncMap.length === 0) return null;

  // Build highlighted words
  const words = wordSyncMap.map((entry, idx) => ({
    word: entry.word,
    active: isSpeaking && idx === currentWordIndex,
  }));

  // Render text with word highlights
  // We'll split the original text by the word positions
  const displayText = text;

  return (
    <div className="text-sm text-gray-700 min-h-[1.5rem]">
      <span className="font-mono">
        {wordSyncMap.map((entry, idx) => (
          <span key={idx}>
            <span
              className={
                isSpeaking && idx === currentWordIndex
                  ? 'text-blue-600 underline underline-offset-2 font-medium'
                  : ''
              }
            >
              {entry.word}
            </span>
            {/* Re-insert whitespace/punctuation between words */}
            {idx < wordSyncMap.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
      {currentPhoneme && isSpeaking && (
        <span className="ml-3 text-xs text-gray-400 font-mono">
          [{currentPhoneme}]
        </span>
      )}
    </div>
  );
}
