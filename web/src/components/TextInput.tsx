import React, { useState, useRef, KeyboardEvent } from 'react';

interface Props {
  onSpeak: (text: string) => void;
  isLoading: boolean;
  isSpeaking: boolean;
}

const PLACEHOLDER_EXAMPLES = [
  'The quick brown fox jumps over the lazy dog.',
  'She sells seashells by the seashore.',
  'How much wood would a woodchuck chuck?',
  'Hello world, this is the tongue simulator.',
];

export function TextInput({ onSpeak, isLoading, isSpeaking }: Props) {
  const [text, setText] = useState('Hello world, this is the tongue simulator.');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSpeak = () => {
    if (text.trim() && !isLoading) {
      onSpeak(text.trim());
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSpeak();
    }
  };

  return (
    <div className="flex gap-2 items-end">
      <textarea
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={2}
        className="flex-1 resize-none border border-gray-200 rounded px-3 py-2 text-sm
                   focus:outline-none focus:border-blue-400 bg-white
                   text-gray-900 placeholder-gray-400"
        placeholder={PLACEHOLDER_EXAMPLES[0]}
        disabled={isLoading || isSpeaking}
      />
      <button
        onClick={handleSpeak}
        disabled={isLoading || isSpeaking || !text.trim()}
        className="flex-shrink-0 px-4 py-2 rounded bg-blue-600 text-white text-sm font-medium
                   hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors h-[52px]"
      >
        {isLoading ? (
          <span className="flex items-center gap-1">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Loading
          </span>
        ) : isSpeaking ? (
          'Speaking'
        ) : (
          'Speak ▶'
        )}
      </button>
    </div>
  );
}
