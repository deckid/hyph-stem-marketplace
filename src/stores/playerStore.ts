import { create } from 'zustand';
import { Howl } from 'howler';

interface StemInfo {
  id: string;
  title: string;
  creator: string;
  audioFile: string;
  waveformData: number[];
}

interface PlayerStore {
  currentStem: StemInfo | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  howl: Howl | null;
  play: (stem: StemInfo) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  seek: (position: number) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
}

let progressInterval: ReturnType<typeof setInterval> | null = null;
let watermarkInterval: ReturnType<typeof setInterval> | null = null;

function clearProgressInterval() {
  if (progressInterval !== null) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
}

function clearWatermarkInterval() {
  if (watermarkInterval !== null) {
    clearInterval(watermarkInterval);
    watermarkInterval = null;
  }
}

function speakWatermark() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  // Cancel any in-progress speech to avoid overlap
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance('Kashkat');
  utterance.rate = 0.9;
  utterance.pitch = 0.6;
  utterance.volume = 0.5;

  // Prefer a robotic/English voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(
    (v) => v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Daniel')
  );
  if (preferred) utterance.voice = preferred;

  window.speechSynthesis.speak(utterance);
}

function startWatermark() {
  clearWatermarkInterval();
  // Speak immediately, then every 8 seconds
  speakWatermark();
  watermarkInterval = setInterval(speakWatermark, 8000);
}

function stopWatermark() {
  clearWatermarkInterval();
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

function startProgressInterval(get: () => PlayerStore, set: (partial: Partial<PlayerStore>) => void) {
  clearProgressInterval();
  progressInterval = setInterval(() => {
    const { howl, isPlaying } = get();
    if (howl && isPlaying) {
      const seek = howl.seek() as number;
      const duration = howl.duration();
      if (duration > 0) {
        set({ progress: seek / duration });
      }
    }
  }, 250);
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentStem: null,
  isPlaying: false,
  progress: 0,
  duration: 0,
  volume: 0.8,
  howl: null,

  play: (stem: StemInfo) => {
    const { howl: currentHowl, currentStem } = get();

    // If the same stem is already loaded, just resume
    if (currentStem && currentStem.id === stem.id && currentHowl) {
      currentHowl.play();
      set({ isPlaying: true });
      startProgressInterval(get, set);
      startWatermark();
      return;
    }

    // Clean up existing Howl instance
    if (currentHowl) {
      clearProgressInterval();
      currentHowl.stop();
      currentHowl.unload();
    }

    const audioPath = `/audio/stems/${stem.audioFile}`;

    const howl = new Howl({
      src: [audioPath],
      html5: true,
      volume: get().volume,
      onplay: () => {
        const duration = howl.duration();
        set({ isPlaying: true, duration });
        startProgressInterval(get, set);
        startWatermark();
      },
      onpause: () => {
        set({ isPlaying: false });
        clearProgressInterval();
        stopWatermark();
      },
      onstop: () => {
        set({ isPlaying: false, progress: 0 });
        clearProgressInterval();
        stopWatermark();
      },
      onend: () => {
        set({ isPlaying: false, progress: 1 });
        clearProgressInterval();
        stopWatermark();
      },
      onloaderror: (_id: number, error: unknown) => {
        console.error('Failed to load audio:', audioPath, error);
        set({ isPlaying: false });
        clearProgressInterval();
        stopWatermark();
      },
      onplayerror: (_id: number, error: unknown) => {
        console.error('Failed to play audio:', audioPath, error);
        set({ isPlaying: false });
        clearProgressInterval();
        stopWatermark();
      },
    });

    set({
      currentStem: stem,
      howl,
      progress: 0,
      duration: 0,
    });

    howl.play();
  },

  pause: () => {
    const { howl } = get();
    if (howl) {
      howl.pause();
    }
    stopWatermark();
  },

  resume: () => {
    const { howl } = get();
    if (howl) {
      howl.play();
    }
    startWatermark();
  },

  stop: () => {
    const { howl } = get();
    if (howl) {
      howl.stop();
      howl.unload();
    }
    clearProgressInterval();
    stopWatermark();
    set({
      currentStem: null,
      howl: null,
      isPlaying: false,
      progress: 0,
      duration: 0,
    });
  },

  seek: (position: number) => {
    const { howl } = get();
    if (howl) {
      const duration = howl.duration();
      howl.seek(position * duration);
      set({ progress: position });
    }
  },

  setVolume: (volume: number) => {
    const { howl } = get();
    const clamped = Math.max(0, Math.min(1, volume));
    if (howl) {
      howl.volume(clamped);
    }
    set({ volume: clamped });
  },

  setProgress: (progress: number) => {
    set({ progress: Math.max(0, Math.min(1, progress)) });
  },
}));
