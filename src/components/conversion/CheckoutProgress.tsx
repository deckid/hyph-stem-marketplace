'use client';

import { Gift } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';

const BONUS_THRESHOLD = 2.0;

export default function CheckoutProgress() {
  const { getTotal, items } = useCartStore();

  if (items.length === 0) return null;

  const total = getTotal();
  const remaining = BONUS_THRESHOLD - total;
  const progress = Math.min(total / BONUS_THRESHOLD, 1);

  if (remaining <= 0) {
    return (
      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
        <Gift className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <p className="text-xs text-emerald-400 font-medium">
          You unlocked a free bonus stem!
        </p>
      </div>
    );
  }

  return (
    <div className="p-3 rounded-lg bg-background">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-muted">Free bonus stem</span>
        <span className="text-xs text-accent font-medium">${remaining.toFixed(2)} away</span>
      </div>
      <div className="h-1.5 rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
