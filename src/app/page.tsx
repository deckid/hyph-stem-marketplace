'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { stems } from '@/data/stems';
import { creators, getCreatorById } from '@/data/creators';
import StemCard from '@/components/StemCard';
import ChartCard from '@/components/ChartCard';
import EditorialCard, { getEditorialItems } from '@/components/EditorialCard';
import SearchBar from '@/components/SearchBar';

function Hero() {
  return (
    <section className="relative overflow-hidden border-b-[3px] border-foreground">
      <div className="relative max-w-7xl mx-auto px-4 pt-16 pb-14">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <span className="font-[family-name:var(--font-accent)] text-sm tracking-widest uppercase text-muted block mb-4 -rotate-1">
            Issue #01 — March 2026
          </span>
          <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] mb-6">
            STEMS FOR
            <br />
            THE COOL CATS
          </h1>
          <p className="text-lg md:text-xl text-muted max-w-xl mb-8">
            No label nonsense. Independent stems from real creators worldwide.
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link
              href="/browse"
              className="px-8 py-3 rounded-lg bg-foreground text-background font-bold text-sm uppercase tracking-wide transition-all hover:shadow-[4px_4px_0_#4A4540] hover:-translate-y-0.5 flex items-center gap-2"
            >
              Browse Stems <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="w-72">
              <SearchBar />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MagazineGrid() {
  const editorials = getEditorialItems();
  const featured = stems.slice(0, 4);
  const creatorsMap: Record<string, (typeof creators)[number]> = {};
  stems.forEach((s) => {
    const c = getCreatorById(s.creatorId);
    if (c) creatorsMap[s.creatorId] = c;
  });

  const charts = useMemo(() => {
    const byDownloads = [...stems].sort((a, b) => b.downloads - a.downloads);
    const drumStems = stems
      .filter((s) => s.instrument === 'drums')
      .sort((a, b) => b.downloads - a.downloads);
    const bassStems = stems
      .filter((s) => s.instrument === 'bass')
      .sort((a, b) => b.downloads - a.downloads);
    return {
      overall: byDownloads.slice(0, 5),
      drums: drumStems.slice(0, 5),
      bass: bassStems.slice(0, 5),
    };
  }, []);

  // ed-0 (feature with image), ed-1 (feature with image) = hero editorial row
  // ed-2 = quote
  // ed-3..7 = mixed articles
  const heroEd = editorials[0];
  const secondEd = editorials[1];
  const quoteEd = editorials[2];
  const midArticles = editorials.slice(3, 6);
  const bottomArticles = editorials.slice(6);
  const secondQuote = editorials[5];

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* ── Row 1: Lead story (2/3) + Second story (1/3) ── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 py-8 border-b-[3px] border-foreground">
        <div className="lg:col-span-2">
          <EditorialCard item={heroEd} index={0} size="large" />
        </div>
        <div>
          <EditorialCard item={secondEd} index={1} size="default" />
        </div>
      </section>

      {/* ── Row 2: Top 5 chart + Quote ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8 border-b-[3px] border-foreground">
        <ChartCard title="Top 5 Overall" stems={charts.overall} creators={creatorsMap} index={2} />
        <EditorialCard item={quoteEd} index={3} size="large" />
      </section>

      {/* ── Row 3: Featured Stems ── */}
      <section className="py-8 border-b-[3px] border-foreground">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl uppercase tracking-wide">
            Featured Stems
          </h2>
          <Link
            href="/browse"
            className="text-sm font-bold uppercase tracking-wide flex items-center gap-1 hover:gap-2 transition-all"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((stem, i) => (
            <StemCard key={stem.id} stem={stem} creator={creatorsMap[stem.creatorId]} index={i} />
          ))}
        </div>
      </section>

      {/* ── Row 4: Three mid-articles ── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8 border-b-[3px] border-foreground">
        {midArticles.map((ed, i) => (
          <EditorialCard key={ed.id} item={ed} index={i + 4} />
        ))}
      </section>

      {/* ── Row 5: Two charts side by side ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8 border-b-[3px] border-foreground">
        <ChartCard title="Top 5 Drums" stems={charts.drums} creators={creatorsMap} index={7} />
        <ChartCard title="Top 5 Bass" stems={charts.bass} creators={creatorsMap} index={8} />
      </section>

      {/* ── Row 6: Bottom articles + second quote ── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 py-8">
        {bottomArticles.map((ed, i) => (
          <EditorialCard key={ed.id} item={ed} index={i + 9} />
        ))}
        {secondQuote && secondQuote.variant !== 'quote' && (
          <EditorialCard item={secondQuote} index={11} />
        )}
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <MagazineGrid />
    </>
  );
}
