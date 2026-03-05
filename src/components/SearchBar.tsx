'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, Music, User } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { stems } from '@/data/stems';
import { creators } from '@/data/creators';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (query.length < 2) return { stems: [], creators: [] };
    const q = query.toLowerCase();
    return {
      stems: stems.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.instrument.toLowerCase().includes(q) ||
          s.genre.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      ).slice(0, 5),
      creators: creators.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q)
      ).slice(0, 3),
    };
  }, [query]);

  const hasResults = results.stems.length > 0 || results.creators.length > 0;
  const showDropdown = isFocused && query.length >= 2;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search stems, creators..."
          className="w-full bg-surface border border-border rounded-lg pl-10 pr-8 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-black transition-colors"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full mt-2 left-0 right-0 bg-surface border border-border rounded-xl overflow-hidden shadow-xl z-50"
          >
            {!hasResults ? (
              <div className="p-4 text-sm text-muted text-center">No results for &quot;{query}&quot;</div>
            ) : (
              <>
                {results.creators.length > 0 && (
                  <div className="p-2">
                    <p className="text-xs text-muted px-2 py-1">Creators</p>
                    {results.creators.map((c) => (
                      <Link
                        key={c.id}
                        href={`/creator/${c.slug}`}
                        onClick={() => { setQuery(''); setIsFocused(false); }}
                        className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-surface-hover transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center">
                          <User className="w-4 h-4 text-neutral-800" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{c.name}</p>
                          <p className="text-xs text-muted">{c.location}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {results.stems.length > 0 && (
                  <div className="p-2 border-t border-border">
                    <p className="text-xs text-muted px-2 py-1">Stems</p>
                    {results.stems.map((s) => (
                      <Link
                        key={s.id}
                        href={`/stem/${s.slug}`}
                        onClick={() => { setQuery(''); setIsFocused(false); }}
                        className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-surface-hover transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center">
                          <Music className="w-4 h-4 text-muted" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{s.title}</p>
                          <p className="text-xs text-muted">{s.instrument} · {s.bpm} BPM · {s.key}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
