import { useState, useEffect, useRef, useCallback } from 'react';

export interface TTSState {
  isSpeaking: boolean;
  isPaused: boolean;
  currentCharIndex: number;
  elapsedTime: number;
  availableVoices: SpeechSynthesisVoice[];
  error: string | null;
}

export interface TTSController {
  speak: (text: string, voice?: SpeechSynthesisVoice, rate?: number, pitch?: number) => void;
  pause: () => void;
  resume: () => void;
  cancel: () => void;
  onBoundary: (cb: BoundaryCallback) => void;
  onStart: (cb: StartCallback) => void;
  onEnd: (cb: EndCallback) => void;
}

type BoundaryCallback = (charIndex: number, elapsedTimeSeconds: number, name: string) => void;
type StartCallback = () => void;
type EndCallback = () => void;

export function useTTS(): TTSState & TTSController {
  const [state, setState] = useState<TTSState>({
    isSpeaking: false,
    isPaused: false,
    currentCharIndex: 0,
    elapsedTime: 0,
    availableVoices: [],
    error: null,
  });

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const boundaryCallbackRef = useRef<BoundaryCallback | null>(null);
  const startCallbackRef = useRef<StartCallback | null>(null);
  const endCallbackRef = useRef<EndCallback | null>(null);

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis
        .getVoices()
        .filter((v) => v.lang.startsWith('en'));
      if (voices.length > 0) {
        setState((s) => ({ ...s, availableVoices: voices }));
      }
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, []);

  const speak = useCallback(
    (
      text: string,
      voice?: SpeechSynthesisVoice,
      rate = 1.0,
      pitch = 1.0
    ) => {
      speechSynthesis.cancel();

      const utter = new SpeechSynthesisUtterance(text);
      if (voice) utter.voice = voice;
      utter.rate = rate;
      utter.pitch = pitch;
      utter.lang = 'en-US';

      utter.onstart = () => {
        setState((s) => ({ ...s, isSpeaking: true, isPaused: false, elapsedTime: 0 }));
        startCallbackRef.current?.();
      };

      utter.onboundary = (e: SpeechSynthesisEvent) => {
        const charIndex = e.charIndex;
        const elapsedSec = e.elapsedTime / 1000;
        setState((s) => ({ ...s, currentCharIndex: charIndex, elapsedTime: elapsedSec }));
        boundaryCallbackRef.current?.(charIndex, elapsedSec, e.name);
      };

      utter.onend = () => {
        setState((s) => ({ ...s, isSpeaking: false, isPaused: false }));
        endCallbackRef.current?.();
      };

      utter.onerror = (e) => {
        const msg = e.error;
        if (msg === 'interrupted' || msg === 'canceled') return;
        setState((s) => ({ ...s, isSpeaking: false, error: msg }));
        endCallbackRef.current?.();
      };

      utteranceRef.current = utter;
      speechSynthesis.speak(utter);
    },
    []
  );

  const pause = useCallback(() => {
    speechSynthesis.pause();
    setState((s) => ({ ...s, isPaused: true }));
  }, []);

  const resume = useCallback(() => {
    speechSynthesis.resume();
    setState((s) => ({ ...s, isPaused: false }));
  }, []);

  const cancel = useCallback(() => {
    speechSynthesis.cancel();
    setState((s) => ({ ...s, isSpeaking: false, isPaused: false }));
    endCallbackRef.current?.();
  }, []);

  const onBoundary = useCallback((cb: BoundaryCallback) => {
    boundaryCallbackRef.current = cb;
  }, []);

  const onStart = useCallback((cb: StartCallback) => {
    startCallbackRef.current = cb;
  }, []);

  const onEnd = useCallback((cb: EndCallback) => {
    endCallbackRef.current = cb;
  }, []);

  return { ...state, speak, pause, resume, cancel, onBoundary, onStart, onEnd };
}
