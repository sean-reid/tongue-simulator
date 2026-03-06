import React, { useState, useCallback, useEffect, useRef } from 'react';
import { VocalTractCanvas } from './components/VocalTractCanvas';
import { TextInput } from './components/TextInput';
import { TranscriptOverlay } from './components/TranscriptOverlay';
import { PlaybackControls } from './components/PlaybackControls';
import { SettingsPanel } from './components/SettingsPanel';
import { useSimulator } from './hooks/useSimulator';
import { useTTS } from './hooks/useTTS';
import { useSyncController } from './hooks/useSyncController';
import type { Settings } from './types/simulation';

const DEFAULT_SETTINGS: Settings = {
  showAirflow: true,
  showLabels: true,
  showMeshDebug: false,
  pitch: 1.0,
  voice: null,
  rate: 1.0,
};

export default function App() {
  const [inputText, setInputText] = useState('');
  const [spokenText, setSpokenText] = useState('');
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);

  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const {
    isReady,
    isPrecomputing,
    error,
    wordSyncMap,
    durationMs,
    createSession,
    getRenderState,
  } = useSimulator(inputText, settings.rate);

  const tts = useTTS();
  const ttsRef = useRef(tts);
  ttsRef.current = tts;

  const syncController = useSyncController(wordSyncMap);
  const syncRef = useRef(syncController);
  syncRef.current = syncController;

  // Register TTS → sync controller bridge (updates refs, safe to call in render)
  tts.onStart(() => {
    syncRef.current.onStart(durationMs);
  });
  tts.onBoundary((charIndex, elapsedTimeSec, name) => {
    syncRef.current.onBoundary(charIndex, elapsedTimeSec, name);
  });
  tts.onEnd(() => {
    syncRef.current.onEnd();
  });

  // When session becomes ready, start TTS
  const readyRef = useRef(false);
  useEffect(() => {
    if (isReady && !readyRef.current && spokenText) {
      readyRef.current = true;
      const { voice, rate, pitch } = settingsRef.current;
      setTimeout(() => {
        ttsRef.current.speak(spokenText, voice ?? undefined, rate, pitch);
      }, 50);
    }
    if (!isReady) {
      readyRef.current = false;
    }
  }, [isReady, spokenText]);

  const handleSpeak = useCallback(
    async (text: string) => {
      ttsRef.current.cancel();
      setInputText(text);
      setSpokenText(text);
      await createSession(text, settingsRef.current.rate);
    },
    [createSession]
  );

  const getCurrentSimTimeMs = useCallback(
    (wallTimeMs: number) => syncController.getCurrentSimTimeMs(wallTimeMs),
    [syncController]
  );

  const handleSettingsChange = useCallback((partial: Partial<Settings>) => {
    setSettings((s) => ({ ...s, ...partial }));
  }, []);

  const isAnimating = syncController.isActive || tts.isSpeaking;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-base font-medium text-gray-900">Tongue Simulator</h1>
          <button
            onClick={() => setShowSettings((v) => !v)}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded"
            title="Settings"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12
                       M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
            </svg>
          </button>
        </div>

        {/* Vocal Tract Canvas */}
        <div className="border border-gray-100 rounded overflow-hidden bg-[#FAFAFA] mb-3">
          <VocalTractCanvas
            getRenderState={getRenderState}
            getCurrentSimTimeMs={getCurrentSimTimeMs}
            isActive={isAnimating}
            settings={settings}
          />
        </div>

        {/* Transcript overlay */}
        {spokenText && wordSyncMap.length > 0 && (
          <div className="mb-3 px-1">
            <TranscriptOverlay
              text={spokenText}
              wordSyncMap={wordSyncMap}
              currentWordIndex={syncController.currentWordIndex}
              isSpeaking={tts.isSpeaking}
              currentPhoneme=""
            />
          </div>
        )}

        {/* Text input */}
        <div className="mb-3">
          <TextInput
            onSpeak={handleSpeak}
            isLoading={isPrecomputing}
            isSpeaking={tts.isSpeaking}
          />
        </div>

        {/* Playback controls */}
        <PlaybackControls
          isSpeaking={tts.isSpeaking}
          isPaused={tts.isPaused}
          rate={settings.rate}
          onPause={tts.pause}
          onResume={tts.resume}
          onCancel={tts.cancel}
          onRateChange={(r) => handleSettingsChange({ rate: r })}
        />

        {/* Error display */}
        {error && (
          <div className="mt-3 text-xs text-red-500 bg-red-50 rounded px-3 py-2">
            {error}
          </div>
        )}
      </div>

      {/* Settings panel */}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          voices={tts.availableVoices}
          onChange={handleSettingsChange}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
