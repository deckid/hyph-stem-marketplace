'use client';

import { useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

interface WaveformVisualizerProps {
  waveformData: number[];
  progress?: number;
  isPlaying?: boolean;
  onSeek?: (position: number) => void;
  height?: number;
  barWidth?: number;
  gap?: number;
  activeColor?: string;
  inactiveColor?: string;
}

export default function WaveformVisualizer({
  waveformData,
  progress = 0,
  isPlaying = false,
  onSeek,
  height = 48,
  barWidth = 3,
  gap = 1,
  activeColor = '#ec4899',
  inactiveColor = '#2a2a3a',
}: WaveformVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!onSeek || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const position = (e.clientX - rect.left) / rect.width;
      onSeek(Math.max(0, Math.min(1, position)));
    },
    [onSeek]
  );

  const progressIndex = Math.floor(progress * waveformData.length);

  return (
    <div
      ref={containerRef}
      className="flex items-end cursor-pointer group"
      style={{ height, gap }}
      onClick={handleClick}
    >
      {waveformData.map((value, index) => {
        const isActive = index <= progressIndex;
        return (
          <motion.div
            key={index}
            className="rounded-full transition-colors duration-150"
            style={{
              width: barWidth,
              height: `${value * 100}%`,
              minHeight: 2,
              backgroundColor: isActive ? activeColor : inactiveColor,
            }}
            animate={
              isPlaying && isActive
                ? {
                    scaleY: [1, 1.2, 1],
                    transition: {
                      duration: 0.6,
                      repeat: Infinity,
                      delay: index * 0.02,
                    },
                  }
                : { scaleY: 1 }
            }
          />
        );
      })}
    </div>
  );
}
