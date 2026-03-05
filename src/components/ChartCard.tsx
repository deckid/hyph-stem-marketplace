'use client';

import { motion } from 'framer-motion';
import { Play, Pause, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { usePlayerStore } from '@/stores/playerStore';
import type { Stem, Creator } from '@/data/types';

interface ChartCardProps {
  title: string;
  stems: Stem[];
  creators: Record<string, Creator>;
  index?: number;
}

export default function ChartCard({ title, stems, creators, index = 0 }: ChartCardProps) {
  const { currentStem, isPlaying, play, pause, resume } = usePlayerStore();

  const handlePlayPause = (stem: Stem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isCurrent = currentStem?.id === stem.id;
    if (isCurrent && isPlaying) {
      pause();
    } else if (isCurrent) {
      resume();
    } else {
      const creator = creators[stem.creatorId];
      play({
        id: stem.id,
        title: stem.title,
        creator: creator?.name || 'Unknown',
        audioFile: stem.audioFile,
        waveformData: stem.waveformData,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="rounded-lg border-[3px] border-foreground bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#0A0A0A]"
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4" />
        <h3 className="font-[family-name:var(--font-display)] text-lg uppercase tracking-wide">
          {title}
        </h3>
      </div>

      <ol className="space-y-0">
        {stems.slice(0, 5).map((stem, i) => {
          const creator = creators[stem.creatorId];
          const isCurrent = currentStem?.id === stem.id;
          const isCurrentPlaying = isCurrent && isPlaying;

          return (
            <li
              key={stem.id}
              className={`flex items-center gap-3 py-2.5 ${
                i < 4 ? 'border-b border-warm-grey/40' : ''
              }`}
            >
              <span className="font-[family-name:var(--font-display)] text-2xl w-7 text-center text-muted">
                {i + 1}
              </span>

              <button
                onClick={(e) => handlePlayPause(stem, e)}
                className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-foreground flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
              >
                {isCurrentPlaying ? (
                  <Pause className="w-3 h-3" />
                ) : (
                  <Play className="w-3 h-3 ml-0.5" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/stem/${stem.slug}`}
                  className="text-sm font-medium truncate block hover:underline"
                >
                  {stem.title}
                </Link>
                <span className="text-xs text-muted truncate block">
                  {creator?.name}
                </span>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-xs text-muted">{stem.downloads.toLocaleString()} plays</span>
              </div>
            </li>
          );
        })}
      </ol>
    </motion.div>
  );
}
