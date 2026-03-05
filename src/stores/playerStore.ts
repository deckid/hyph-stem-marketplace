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
let audioContext: AudioContext | null = null;

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

function playWatermarkTone() {
  if (typeof window === 'undefined') return;
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  const now = audioContext.currentTime;
  const gain = audioContext.createGain();
  gain.connect(audioContext.destination);
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

  // First tone
  const osc1 = audioContext.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(880, now);
  osc1.connect(gain);
  osc1.start(now);
  osc1.stop(now + 0.15);

  // Second tone (slight delay)
  const gain2 = audioContext.createGain();
  gain2.connect(audioContext.destination);
  gain2.gain.setValueAtTime(0.12, now + 0.18);
  gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

  const osc2 = audioContext.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(1320, now + 0.18);
  osc2.connect(gain2);
  osc2.start(now + 0.18);
  osc2.stop(now + 0.35);
}

function startWatermark() {
  clearWatermarkInterval();
  // Play immediately, then every 8 seconds
  playWatermarkTone();
  watermarkInterval = setInterval(playWatermarkTone, 8000);
}

function stopWatermark() {
  clearWatermarkInterval();
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
