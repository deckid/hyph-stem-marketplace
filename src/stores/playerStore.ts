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

function clearProgressInterval() {
  if (progressInterval !== null) {
    clearInterval(progressInterval);
    progressInterval = null;
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
      },
      onpause: () => {
        set({ isPlaying: false });
        clearProgressInterval();
      },
      onstop: () => {
        set({ isPlaying: false, progress: 0 });
        clearProgressInterval();
      },
      onend: () => {
        set({ isPlaying: false, progress: 1 });
        clearProgressInterval();
      },
      onloaderror: (_id: number, error: unknown) => {
        console.error('Failed to load audio:', audioPath, error);
        set({ isPlaying: false });
        clearProgressInterval();
      },
      onplayerror: (_id: number, error: unknown) => {
        console.error('Failed to play audio:', audioPath, error);
        set({ isPlaying: false });
        clearProgressInterval();
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
  },

  resume: () => {
    const { howl } = get();
    if (howl) {
      howl.play();
    }
  },

  stop: () => {
    const { howl } = get();
    if (howl) {
      howl.stop();
      howl.unload();
    }
    clearProgressInterval();
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
