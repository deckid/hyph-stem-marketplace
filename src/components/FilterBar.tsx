'use client';

import { useState } from 'react';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Filters {
  instrument: string;
  genre: string;
  mood: string;
  bpmMin: number;
  bpmMax: number;
  key: string;
  sort: string;
}

interface FilterBarProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

const instruments = [
  'All', 'drums', 'bass', 'guitar', 'keys', 'synth',
  'vocals', 'strings', 'brass', 'woodwinds', 'percussion', 'fx', 'pad',
];

const genres = [
  'All', 'Hip Hop', 'Electronic', 'Pop', 'R&B', 'Jazz', 'Lo-fi',
  'Ambient', 'Rock', 'Latin', 'Afrobeat', 'Trap', 'House', 'Techno',
  'Funk', 'Soul', 'Reggae', 'DnB',
];

const moods = [
  'All', 'Chill', 'Energetic', 'Dark', 'Dreamy', 'Aggressive',
  'Groovy', 'Ethereal', 'Melancholic', 'Uplifting', 'Hypnotic',
];

const musicalKeys = [
  'All', 'C Major', 'C Minor', 'C# Major', 'C# Minor',
  'D Major', 'D Minor', 'Eb Major', 'Eb Minor',
  'E Major', 'E Minor', 'F Major', 'F Minor',
  'F# Major', 'F# Minor', 'G Major', 'G Minor',
  'Ab Major', 'Ab Minor', 'A Major', 'A Minor',
  'Bb Major', 'Bb Minor', 'B Major', 'B Minor',
];

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'bpm-asc', label: 'BPM: Low → High' },
  { value: 'bpm-desc', label: 'BPM: High → Low' },
  { value: 'name-asc', label: 'Name: A → Z' },
];

export const defaultFilters: Filters = {
  instrument: 'All',
  genre: 'All',
  mood: 'All',
  bpmMin: 60,
  bpmMax: 180,
  key: 'All',
  sort: 'newest',
};

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[] | { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-muted">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground pr-8 focus:outline-none focus:border-black transition-colors"
        >
          {options.map((opt) => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const lab = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={val} value={val}>
                {lab}
              </option>
            );
          })}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
      </div>
    </div>
  );
}

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const [expanded, setExpanded] = useState(false);

  const update = (key: keyof Filters, value: string | number) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const activeCount = Object.entries(filters).filter(([key, val]) => {
    if (key === 'sort') return false;
    if (key === 'bpmMin') return val !== 60;
    if (key === 'bpmMax') return val !== 180;
    return val !== 'All';
  }).length;

  const reset = () => onFilterChange(defaultFilters);

  return (
    <div className="space-y-3">
      {/* Toggle bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border hover:border-neutral-600 transition-all text-sm"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>

        {activeCount > 0 && (
          <button
            onClick={reset}
            className="flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors"
          >
            <X className="w-3 h-3" /> Clear all
          </button>
        )}

        <div className="ml-auto">
          <FilterSelect
            label=""
            value={filters.sort}
            options={sortOptions}
            onChange={(v) => update('sort', v)}
          />
        </div>
      </div>

      {/* Expanded filters */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 p-4 rounded-xl bg-surface border border-border">
              <FilterSelect
                label="Instrument"
                value={filters.instrument}
                options={instruments}
                onChange={(v) => update('instrument', v)}
              />
              <FilterSelect
                label="Genre"
                value={filters.genre}
                options={genres}
                onChange={(v) => update('genre', v)}
              />
              <FilterSelect
                label="Mood"
                value={filters.mood}
                options={moods}
                onChange={(v) => update('mood', v)}
              />
              <FilterSelect
                label="Key"
                value={filters.key}
                options={musicalKeys}
                onChange={(v) => update('key', v)}
              />
              <div className="space-y-1">
                <label className="text-xs text-muted">BPM Min ({filters.bpmMin})</label>
                <input
                  type="range"
                  min="60"
                  max="180"
                  value={filters.bpmMin}
                  onChange={(e) => update('bpmMin', parseInt(e.target.value))}
                  className="w-full accent-neutral-800"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted">BPM Max ({filters.bpmMax})</label>
                <input
                  type="range"
                  min="60"
                  max="180"
                  value={filters.bpmMax}
                  onChange={(e) => update('bpmMax', parseInt(e.target.value))}
                  className="w-full accent-neutral-800"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
