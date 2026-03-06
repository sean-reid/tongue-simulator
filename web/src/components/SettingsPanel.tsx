import React from 'react';
import { VoiceSelector } from './VoiceSelector';
import type { Settings } from '../types/simulation';

interface Props {
  settings: Settings;
  voices: SpeechSynthesisVoice[];
  onChange: (partial: Partial<Settings>) => void;
  onClose: () => void;
}

export function SettingsPanel({ settings, voices, onChange, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="mt-10 mr-4 w-72 bg-white border border-gray-200 rounded shadow-lg p-4 text-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="font-medium text-gray-800">Settings</span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Voice */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Voice</label>
            <VoiceSelector
              voices={voices}
              selected={settings.voice}
              onChange={(v) => onChange({ voice: v })}
            />
          </div>

          {/* Pitch */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Pitch — {settings.pitch.toFixed(1)}
            </label>
            <input
              type="range"
              min={0.5}
              max={2.0}
              step={0.05}
              value={settings.pitch}
              onChange={(e) => onChange({ pitch: parseFloat(e.target.value) })}
              className="w-full accent-blue-600"
            />
          </div>

          {/* Toggles */}
          <ToggleRow
            label="Show IPA labels"
            value={settings.showLabels}
            onChange={(v) => onChange({ showLabels: v })}
          />
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-700">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-10 h-5 rounded-full transition-colors ${
          value ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow
                       transition-transform ${value ? 'translate-x-5' : ''}`}
        />
      </button>
    </div>
  );
}
