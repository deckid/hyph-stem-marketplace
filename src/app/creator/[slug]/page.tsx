'use client';

import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, User, BadgeCheck, MapPin, Music } from 'lucide-react';
import { getCreatorBySlug } from '@/data/creators';
import { getStemsByCreator } from '@/data/stems';
import StemGrid from '@/components/StemGrid';

export default function CreatorPage() {
  const params = useParams();
  const slug = params.slug as string;

  const creator = useMemo(() => getCreatorBySlug(slug), [slug]);
  const creatorStems = useMemo(
    () => (creator ? getStemsByCreator(creator.id) : []),
    [creator]
  );

  if (!creator) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Creator not found</h1>
        <Link href="/browse" className="text-accent hover:text-accent-hover">
          Back to browse
        </Link>
      </div>
    );
  }

  const creatorsMap = { [creator.id]: creator };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link
        href="/browse"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back to browse
      </Link>

      {/* Creator header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-2xl bg-surface border border-border mb-8"
      >
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500/20 to-violet-500/20 flex items-center justify-center flex-shrink-0">
            <User className="w-12 h-12 text-pink-400" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">{creator.name}</h1>
              {creator.verified && <BadgeCheck className="w-5 h-5 text-pink-400" />}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted mb-4">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {creator.location}
              </span>
              <span className="flex items-center gap-1">
                <Music className="w-4 h-4" /> {creatorStems.length} stems
              </span>
            </div>

            <p className="text-muted max-w-2xl mb-4">{creator.bio}</p>

            <div className="flex flex-wrap gap-2">
              {creator.genres.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-sm"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Creator stems */}
      <div className="mb-4">
        <h2 className="text-xl font-bold">
          Stems by {creator.name}{' '}
          <span className="text-muted font-normal">({creatorStems.length})</span>
        </h2>
      </div>

      <StemGrid stems={creatorStems} creators={creatorsMap} />
    </div>
  );
}
