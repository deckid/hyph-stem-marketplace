'use client';

import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, ShoppingCart, Clock, Music, Download, User, BadgeCheck } from 'lucide-react';
import { getStemBySlug, getStemsByCreator } from '@/data/stems';
import { getCreatorById } from '@/data/creators';
import WaveformVisualizer from '@/components/WaveformVisualizer';
import StemCard from '@/components/StemCard';
import { usePlayerStore } from '@/stores/playerStore';
import { useCartStore } from '@/stores/cartStore';

export default function StemDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const stem = useMemo(() => getStemBySlug(slug), [slug]);
  const creator = useMemo(() => (stem ? getCreatorById(stem.creatorId) : null), [stem]);
  const moreBySameCreator = useMemo(
    () => (stem ? getStemsByCreator(stem.creatorId).filter((s) => s.id !== stem.id).slice(0, 4) : []),
    [stem]
  );

  const { currentStem, isPlaying, progress, play, pause, resume, seek } = usePlayerStore();
  const { addItem, items } = useCartStore();

  if (!stem || !creator) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Stem not found</h1>
        <Link href="/browse" className="text-accent hover:text-accent-hover">
          Back to browse
        </Link>
      </div>
    );
  }

  const isCurrentStem = currentStem?.id === stem.id;
  const isInCart = items.some((item) => item.stemId === stem.id);

  const instrumentColors: Record<string, string> = {
    drums: '#f97316', bass: '#3b82f6', guitar: '#f59e0b', keys: '#8b5cf6',
    synth: '#4A4540', vocals: '#f43f5e', strings: '#10b981', brass: '#eab308',
    woodwinds: '#14b8a6', percussion: '#ef4444', fx: '#7c3aed', pad: '#06b6d4',
  };
  const color = instrumentColors[stem.instrument] || '#4A4540';

  const handlePlayPause = () => {
    if (isCurrentStem && isPlaying) pause();
    else if (isCurrentStem) resume();
    else play({ id: stem.id, title: stem.title, creator: creator.name, audioFile: stem.audioFile, waveformData: stem.waveformData });
  };

  const handleAddToCart = () => {
    if (!isInCart) {
      addItem({ stemId: stem.id, title: stem.title, creator: creator.name, instrument: stem.instrument, price: stem.price });
    }
  };

  const formatDuration = (s: number) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

  const creatorsMap = creator ? { [creator.id]: creator } : {};

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/browse" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to browse
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <div className="p-6 rounded-2xl bg-surface border border-border">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{stem.title}</h1>
                <div className="flex items-center gap-3 text-muted">
                  <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${color}15`, color }}>
                    {stem.instrument}
                  </span>
                  <span>{stem.genre}</span>
                  <span>{stem.mood}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-foreground">${stem.price.toFixed(2)}</div>
                <div className="text-xs text-muted">per stem</div>
              </div>
            </div>

            {/* Large waveform */}
            <div className="mb-6 p-4 rounded-xl bg-background">
              <WaveformVisualizer
                waveformData={stem.waveformData}
                progress={isCurrentStem ? progress : 0}
                isPlaying={isCurrentStem && isPlaying}
                onSeek={isCurrentStem ? seek : undefined}
                height={80}
                barWidth={4}
                gap={2}
                activeColor={color}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={handlePlayPause}
                className="px-6 py-3 rounded-xl font-medium text-white flex items-center gap-2 transition-all hover:shadow-lg"
                style={{ backgroundColor: color }}
              >
                {isCurrentStem && isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isCurrentStem && isPlaying ? 'Pause' : 'Play Preview'}
              </button>

              <button
                onClick={handleAddToCart}
                className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
                  isInCart ? 'bg-neutral-100 text-foreground border border-neutral-600' : 'bg-surface-hover border border-border hover:border-neutral-600'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                {isInCart ? 'In Cart' : 'Add to Cart'}
              </button>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: <Music className="w-4 h-4" />, label: 'Key', value: stem.key },
                { icon: <Clock className="w-4 h-4" />, label: 'Duration', value: formatDuration(stem.duration) },
                { icon: <Music className="w-4 h-4" />, label: 'BPM', value: `${stem.bpm}` },
                { icon: <Download className="w-4 h-4" />, label: 'Downloads', value: `${stem.downloads}` },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-lg bg-background">
                  <div className="flex items-center gap-2 text-muted text-xs mb-1">
                    {item.icon} {item.label}
                  </div>
                  <div className="font-medium">{item.value}</div>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-6">
              {stem.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-background text-xs text-muted border border-border">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Creator sidebar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Link
            href={`/creator/${creator.slug}`}
            className="block p-6 rounded-2xl bg-surface border border-border hover:border-neutral-600 transition-all group"
          >
            <div className="w-20 h-20 rounded-full bg-[#D4CFC5]/20 flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-foreground" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold">{creator.name}</h3>
              {creator.verified && <BadgeCheck className="w-4 h-4 text-foreground" />}
            </div>
            <p className="text-xs text-muted mb-3">{creator.location}</p>
            <p className="text-sm text-muted">{creator.bio}</p>
            <div className="flex flex-wrap gap-1 mt-3">
              {creator.genres.map((g) => (
                <span key={g} className="px-2 py-0.5 rounded-full bg-neutral-100 text-foreground text-[10px]">
                  {g}
                </span>
              ))}
            </div>
          </Link>
        </motion.div>
      </div>

      {/* More from creator */}
      {moreBySameCreator.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">More from {creator.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {moreBySameCreator.map((s, i) => (
              <StemCard key={s.id} stem={s} creator={creator} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
