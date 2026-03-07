'use client';

import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface FlashPack {
  id: string;
  title: string;
  stem_ids: string[];
  original_price_cents: number;
  sale_price_cents: number;
  expires_at: string;
}

export default function FlashPackBanner() {
  const [pack, setPack] = useState<FlashPack | null>(null);
  const [expired, setExpired] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/flash-packs')
      .then((res) => res.json())
      .then((data) => {
        if (data.packs && data.packs.length > 0) {
          setPack(data.packs[0]);
        }
      })
      .catch(() => {});
  }, []);

  // Hide on checkout pages
  if (!pack || expired || pathname === '/checkout' || pathname === '/success') return null;

  const stemCount = pack.stem_ids?.length || 0;
  const originalPrice = (pack.original_price_cents / 100).toFixed(2);
  const salePrice = (pack.sale_price_cents / 100).toFixed(2);

  return (
    <Link
      href={`/browse`}
      className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-violet-900/95 to-pink-900/95 backdrop-blur-sm border-t border-pink-500/20 px-4 py-3"
    >
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-pink-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{pack.title}</p>
            <p className="text-xs text-white/70">
              {stemCount} stems &middot;{' '}
              <span className="line-through text-white/40">${originalPrice}</span>{' '}
              <span className="text-emerald-400 font-semibold">${salePrice}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <CountdownTimer expiresAt={pack.expires_at} onExpire={() => setExpired(true)} />
          <span className="px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-semibold">
            Grab It
          </span>
        </div>
      </div>
    </Link>
  );
}
