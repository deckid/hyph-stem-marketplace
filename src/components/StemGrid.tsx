'use client';

import { motion } from 'framer-motion';
import StemCard from './StemCard';
import type { Stem, Creator } from '@/data/types';

interface StemGridProps {
  stems: Stem[];
  creators: Record<string, Creator>;
}

export default function StemGrid({ stems, creators }: StemGridProps) {
  if (stems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted">
        <p className="text-lg mb-2">No stems found</p>
        <p className="text-sm">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.05 } },
      }}
    >
      {stems.map((stem, index) => (
        <StemCard
          key={stem.id}
          stem={stem}
          creator={creators[stem.creatorId]}
          index={index}
        />
      ))}
    </motion.div>
  );
}
