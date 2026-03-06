import React from 'react';

interface Props {
  voices: SpeechSynthesisVoice[];
  selected: SpeechSynthesisVoice | null;
  onChange: (voice: SpeechSynthesisVoice) => void;
}

export function VoiceSelector({ voices, selected, onChange }: Props) {
  if (voices.length === 0) {
    return <span className="text-xs text-gray-400">No English voices found</span>;
  }

  return (
    <select
      value={selected?.name ?? ''}
      onChange={(e) => {
        const voice = voices.find((v) => v.name === e.target.value);
        if (voice) onChange(voice);
      }}
      className="text-sm border border-gray-200 rounded px-2 py-1 bg-white text-gray-800
                 focus:outline-none focus:border-blue-400 w-full"
    >
      {voices.map((v) => (
        <option key={v.name} value={v.name}>
          {v.name} ({v.lang})
        </option>
      ))}
    </select>
  );
}
