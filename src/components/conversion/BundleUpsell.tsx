'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Sparkles } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { stems } from '@/data/stems';
import { getCreatorById } from '@/data/creators';

export default function BundleUpsell() {
  const { items, addItem } = useCartStore();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (items.length === 1 && !dismissed) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [items.length, dismissed]);

  if (!show || items.length !== 1) return null;

  const cartItem = items[0];
  const cartStem = stems.find((s) => s.id === cartItem.stemId);
  const genre = cartStem?.genre;

  // Find 4 recommended stems in the same genre, not already in cart
  const recommended = stems
    .filter((s) => s.id !== cartItem.stemId && (!genre || s.genre === genre))
    .slice(0, 4);

  const handleDismiss = () => {
    setDismissed(true);
    setShow(false);
  };

  const handleAdd = (stem: (typeof stems)[number]) => {
    const creator = getCreatorById(stem.creatorId);
    addItem({
      stemId: stem.id,
      title: stem.title,
      creator: creator?.name || 'Unknown',
      instrument: stem.instrument,
      price: stem.price,
    });
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={handleDismiss}
          />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border rounded-t-2xl p-6 max-w-lg mx-auto"
          >
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background flex items-center justify-center text-muted hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="font-semibold text-sm">Unlock Bundle Pricing</h3>
            </div>
            <p className="text-xs text-muted mb-4">
              Add 4 more stems for just <span className="text-emerald-400 font-semibold">$1.99 total</span> — save 60%
            </p>

            <div className="space-y-2 mb-4">
              {recommended.map((stem) => {
                const creator = getCreatorById(stem.creatorId);
                const isInCart = items.some((i) => i.stemId === stem.id);
                return (
                  <div
                    key={stem.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-background"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{stem.title}</p>
                      <p className="text-xs text-muted truncate">
                        {creator?.name} &middot; {stem.instrument} &middot; {stem.bpm} BPM
                      </p>
                    </div>
                    <button
                      onClick={() => handleAdd(stem)}
                      disabled={isInCart}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                        isInCart
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-accent/20 text-accent hover:bg-accent/30'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleDismiss}
              className="w-full py-2.5 rounded-xl text-sm text-muted hover:text-foreground border border-border hover:border-foreground/20 transition-all"
            >
              No thanks, just one stem
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
