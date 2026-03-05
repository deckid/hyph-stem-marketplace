'use client';

import { motion } from 'framer-motion';
import StemCard from './StemCard';
import EditorialCard, { getEditorialItems } from './EditorialCard';
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

  const editorials = getEditorialItems();

  // Interleave: 1 editorial after every 1 stem card (50/50 ratio)
  const items: { type: 'stem' | 'editorial'; index: number }[] = [];
  let stemIdx = 0;
  let edIdx = 0;

  while (stemIdx < stems.length) {
    items.push({ type: 'stem', index: stemIdx });
    stemIdx++;

    // Insert an editorial card after each stem (if we have editorial content left, cycle through)
    if (edIdx < editorials.length || editorials.length > 0) {
      items.push({ type: 'editorial', index: edIdx % editorials.length });
      edIdx++;
    }
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
      {items.map((item, i) =>
        item.type === 'stem' ? (
          <StemCard
            key={`stem-${stems[item.index].id}`}
            stem={stems[item.index]}
            creator={creators[stems[item.index].creatorId]}
            index={i}
          />
        ) : (
          <EditorialCard
            key={`ed-${editorials[item.index].id}-${i}`}
            item={editorials[item.index]}
            index={i}
          />
        )
      )}
    </motion.div>
  );
}
