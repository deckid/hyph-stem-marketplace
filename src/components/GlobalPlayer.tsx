'use client';

import { Play, Pause, SkipBack, Volume2, VolumeX, X } from 'lucide-react';
import { usePlayerStore } from '@/stores/playerStore';
import WaveformVisualizer from './WaveformVisualizer';
import { motion, AnimatePresence } from 'framer-motion';

export default function GlobalPlayer() {
  const {
    currentStem,
    isPlaying,
    progress,
    volume,
    pause,
    resume,
    stop,
    seek,
    setVolume,
  } = usePlayerStore();

  if (!currentStem) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={stop}
              className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-foreground transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={isPlaying ? pause : resume}
              className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white hover:bg-accent-hover transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </button>
          </div>

          {/* Track Info */}
          <div className="flex-shrink-0 min-w-0 w-40">
            <p className="text-sm font-medium truncate">{currentStem.title}</p>
            <p className="text-xs text-muted truncate">{currentStem.creator}</p>
          </div>

          {/* Waveform */}
          <div className="flex-1 hidden sm:block">
            <WaveformVisualizer
              waveformData={currentStem.waveformData}
              progress={progress}
              isPlaying={isPlaying}
              onSeek={seek}
              height={32}
            />
          </div>

          {/* Volume */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
              className="text-muted hover:text-foreground transition-colors"
            >
              {volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 accent-neutral-800"
            />
          </div>

          {/* Close */}
          <button
            onClick={stop}
            className="text-muted hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
