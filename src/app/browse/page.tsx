'use client';

import { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { stems } from '@/data/stems';
import { creators } from '@/data/creators';
import type { Creator } from '@/data/types';
import StemGrid from '@/components/StemGrid';
import FilterBar, { type Filters, defaultFilters } from '@/components/FilterBar';
import SearchBar from '@/components/SearchBar';

function BrowseContent() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<Filters>(() => ({
    ...defaultFilters,
    instrument: searchParams.get('instrument') || 'All',
    genre: searchParams.get('genre') || 'All',
  }));

  const creatorsMap = useMemo(() => {
    const map: Record<string, Creator> = {};
    creators.forEach((c) => {
      map[c.id] = c;
    });
    return map;
  }, []);

  const filteredStems = useMemo(() => {
    let result = [...stems];

    if (filters.instrument !== 'All') {
      result = result.filter((s) => s.instrument === filters.instrument);
    }
    if (filters.genre !== 'All') {
      result = result.filter((s) => s.genre === filters.genre);
    }
    if (filters.mood !== 'All') {
      result = result.filter((s) => s.mood === filters.mood);
    }
    if (filters.key !== 'All') {
      result = result.filter((s) => s.key === filters.key);
    }
    result = result.filter((s) => s.bpm >= filters.bpmMin && s.bpm <= filters.bpmMax);

    switch (filters.sort) {
      case 'popular':
        result.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'bpm-asc':
        result.sort((a, b) => a.bpm - b.bpm);
        break;
      case 'bpm-desc':
        result.sort((a, b) => b.bpm - a.bpm);
        break;
      case 'name-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'newest':
      default:
        break;
    }

    return result;
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Browse Stems</h1>
          <p className="text-muted mt-1">
            {filteredStems.length} stem{filteredStems.length !== 1 ? 's' : ''} available
          </p>
        </div>
        <SearchBar />
      </div>

      <div className="mb-6">
        <FilterBar filters={filters} onFilterChange={setFilters} />
      </div>

      <StemGrid stems={filteredStems} creators={creatorsMap} />
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4">Browse Stems</h1>
          <div className="text-muted">Loading...</div>
        </div>
      }
    >
      <BrowseContent />
    </Suspense>
  );
}
