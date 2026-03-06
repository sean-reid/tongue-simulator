import React from 'react';

interface Props {
  isSpeaking: boolean;
  isPaused: boolean;
  rate: number;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
  onRateChange: (rate: number) => void;
}

export function PlaybackControls({
  isSpeaking,
  isPaused,
  rate,
  onPause,
  onResume,
  onCancel,
  onRateChange,
}: Props) {
  return (
    <div className="flex items-center gap-4 text-sm text-gray-600">
      <div className="flex items-center gap-1">
        <button
          onClick={onCancel}
          disabled={!isSpeaking}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100
                     disabled:opacity-30 disabled:cursor-default transition-colors"
          title="Stop"
        >
          ■
        </button>

        <button
          onClick={isPaused ? onResume : onPause}
          disabled={!isSpeaking}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100
                     disabled:opacity-30 disabled:cursor-default transition-colors"
          title={isPaused ? 'Resume' : 'Pause'}
        >
          {isPaused ? '▶' : '❚❚'}
        </button>
      </div>

      <div className="flex items-center gap-2 flex-1">
        <span className="text-xs text-gray-400 w-6 text-right">
          {rate.toFixed(1)}×
        </span>
        <input
          type="range"
          min={0.5}
          max={2.0}
          step={0.1}
          value={rate}
          onChange={(e) => onRateChange(parseFloat(e.target.value))}
          className="flex-1 accent-blue-600"
          title="Speaking rate"
        />
        <span className="text-xs text-gray-400 w-6">spd</span>
      </div>
    </div>
  );
}
