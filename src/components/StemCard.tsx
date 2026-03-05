'use client';

import { motion } from 'framer-motion';
import { Play, Pause, ShoppingCart, Clock, Music } from 'lucide-react';
import Link from 'next/link';
import WaveformVisualizer from './WaveformVisualizer';
import { usePlayerStore } from '@/stores/playerStore';
import { useCartStore } from '@/stores/cartStore';
import type { Stem, Creator } from '@/data/types';

interface StemCardProps {
  stem: Stem;
  creator: Creator;
  index?: number;
}

const instrumentColors: Record<string, string> = {
  drums: '#f97316',
  bass: '#3b82f6',
  guitar: '#f59e0b',
  keys: '#8b5cf6',
  synth: '#4A4540',
  vocals: '#f43f5e',
  strings: '#10b981',
  brass: '#eab308',
  woodwinds: '#14b8a6',
  percussion: '#ef4444',
  fx: '#7c3aed',
  pad: '#06b6d4',
};

export default function StemCard({ stem, creator, index = 0 }: StemCardProps) {
  const { currentStem, isPlaying, progress, play, pause, resume, seek } =
    usePlayerStore();
  const { addItem, items } = useCartStore();

  const isCurrentStem = currentStem?.id === stem.id;
  const isInCart = items.some((item) => item.stemId === stem.id);
  const color = instrumentColors[stem.instrument] || '#4A4540';

  const handlePlayPause = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCurrentStem && isPlaying) {
      pause();
    } else if (isCurrentStem) {
      resume();
    } else {
      play({
        id: stem.id,
        title: stem.title,
        creator: creator.name,
        audioFile: stem.audioFile,
        waveformData: stem.waveformData,
      });
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isInCart) {
      addItem({
        stemId: stem.id,
        title: stem.title,
        creator: creator.name,
        instrument: stem.instrument,
        price: stem.price,
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative bg-surface rounded-xl border border-border p-4 hover:border-neutral-600 hover:bg-surface-hover transition-all duration-300"
    >
      {isCurrentStem && isPlaying && (
        <div className="absolute inset-0 rounded-xl animate-glow-pulse pointer-events-none" />
      )}

      <div className="flex items-start gap-3 mb-3">
        <button
          onClick={handlePlayPause}
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {isCurrentStem && isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <Link
            href={`/stem/${stem.slug}`}
            className="text-sm font-medium text-foreground hover:text-accent transition-colors truncate block"
          >
            {stem.title}
          </Link>
          <Link
            href={`/creator/${creator.slug}`}
            className="text-xs text-muted hover:text-foreground transition-colors truncate block"
          >
            {creator.name}
          </Link>
        </div>

        <button
          onClick={handleAddToCart}
          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
            isInCart
              ? 'bg-neutral-200 text-neutral-800'
              : 'bg-surface-hover text-muted hover:text-foreground hover:bg-border'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mb-3">
        <WaveformVisualizer
          waveformData={stem.waveformData}
          progress={isCurrentStem ? progress : 0}
          isPlaying={isCurrentStem && isPlaying}
          onSeek={isCurrentStem ? seek : undefined}
          height={32}
          activeColor={color}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-muted">
        <div className="flex items-center gap-3">
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-medium"
            style={{ backgroundColor: `${color}15`, color }}
          >
            {stem.instrument}
          </span>
          <span className="flex items-center gap-1">
            <Music className="w-3 h-3" />
            {stem.key}
          </span>
          <span>{stem.bpm} BPM</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDuration(stem.duration)}
          </span>
          <span className="text-foreground font-bold">${stem.price.toFixed(2)}</span>
        </div>
      </div>
    </motion.div>
  );
}
