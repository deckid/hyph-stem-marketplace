'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import StemCard from './StemCard';
import EditorialCard, { getEditorialItems } from './EditorialCard';
import ChartCard from './ChartCard';
import type { Stem, Creator } from '@/data/types';

interface StemGridProps {
  stems: Stem[];
  creators: Record<string, Creator>;
}

type GridItem =
  | { type: 'stem'; stem: Stem }
  | { type: 'editorial'; index: number }
  | { type: 'chart'; title: string; stems: Stem[] };

export default function StemGrid({ stems, creators }: StemGridProps) {
  const editorials = getEditorialItems();

  const charts = useMemo(() => {
    const allStems = [...stems];
    const byDownloads = [...allStems].sort((a, b) => b.downloads - a.downloads);

    const drumStems = allStems
      .filter((s) => s.instrument === 'drums')
      .sort((a, b) => b.downloads - a.downloads);
    const bassStems = allStems
      .filter((s) => s.instrument === 'bass')
      .sort((a, b) => b.downloads - a.downloads);
    const vocalStems = allStems
      .filter((s) => s.instrument === 'vocals')
      .sort((a, b) => b.downloads - a.downloads);

    return [
      { title: 'Top 5 Overall', stems: byDownloads.slice(0, 5) },
      { title: 'Top 5 Drums', stems: drumStems.slice(0, 5) },
      { title: 'Top 5 Bass', stems: bassStems.slice(0, 5) },
      { title: 'Top 5 Vocals', stems: vocalStems.slice(0, 5) },
    ].filter((c) => c.stems.length >= 3);
  }, [stems]);

  if (stems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted">
        <p className="text-lg mb-2">No stems found</p>
        <p className="text-sm">Try adjusting your filters</p>
      </div>
    );
  }

  // Build interleaved grid items:
  // Pattern: 2 stems → 1 editorial (2-col) → 2 stems → repeat
  // Insert a chart card every ~8 items
  const items: GridItem[] = [];
  let stemIdx = 0;
  let edIdx = 0;
  let chartIdx = 0;
  let sinceLastChart = 0;

  while (stemIdx < stems.length) {
    // Add 2 stem cards
    for (let s = 0; s < 2 && stemIdx < stems.length; s++) {
      items.push({ type: 'stem', stem: stems[stemIdx] });
      stemIdx++;
      sinceLastChart++;
    }

    // Add 1 editorial card (spans 2 cols)
    if (editorials.length > 0) {
      items.push({ type: 'editorial', index: edIdx % editorials.length });
      edIdx++;
    }

    // Insert a chart every ~8 stem cards
    if (sinceLastChart >= 8 && chartIdx < charts.length) {
      items.push({ type: 'chart', title: charts[chartIdx].title, stems: charts[chartIdx].stems });
      chartIdx++;
      sinceLastChart = 0;
    }
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.04 } },
      }}
    >
      {items.map((item, i) => {
        if (item.type === 'stem') {
          return (
            <StemCard
              key={`stem-${item.stem.id}`}
              stem={item.stem}
              creator={creators[item.stem.creatorId]}
              index={i}
            />
          );
        }
        if (item.type === 'editorial') {
          return (
            <div
              key={`ed-${editorials[item.index].id}-${i}`}
              className="col-span-1 sm:col-span-2"
            >
              <EditorialCard item={editorials[item.index]} index={i} />
            </div>
          );
        }
        // chart
        return (
          <div
            key={`chart-${item.title}-${i}`}
            className="col-span-1 sm:col-span-2"
          >
            <ChartCard
              title={item.title}
              stems={item.stems}
              creators={creators}
              index={i}
            />
          </div>
        );
      })}
    </motion.div>
  );
}
