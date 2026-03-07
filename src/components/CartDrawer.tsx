'use client';

import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import CheckoutProgress from './conversion/CheckoutProgress';

const instrumentColors: Record<string, string> = {
  drums: '#f97316',
  bass: '#3b82f6',
  guitar: '#f59e0b',
  keys: '#8b5cf6',
  synth: '#ec4899',
  vocals: '#f43f5e',
  strings: '#10b981',
  brass: '#eab308',
  woodwinds: '#14b8a6',
  percussion: '#ef4444',
  fx: '#7c3aed',
  pad: '#06b6d4',
};

export default function CartDrawer() {
  const { isOpen, setOpen, items, removeItem, clearCart, getTotal, getSubtotal, getDiscount, getTier } =
    useCartStore();

  const tier = getTier();
  const subtotal = getSubtotal();
  const discount = getDiscount();
  const total = getTotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 bg-surface border-l border-border flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-accent" />
                <h2 className="font-semibold">Cart ({items.length})</h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted">
                  <ShoppingBag className="w-12 h-12 mb-3 opacity-30" />
                  <p>Your cart is empty</p>
                  <Link
                    href="/browse"
                    onClick={() => setOpen(false)}
                    className="mt-3 text-sm text-accent hover:text-accent-hover transition-colors"
                  >
                    Browse stems
                  </Link>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.stemId}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-background"
                    >
                      <div
                        className="w-2 h-8 rounded-full"
                        style={{ backgroundColor: instrumentColors[item.instrument] || '#ec4899' }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.title}</p>
                        <p className="text-xs text-muted truncate">{item.creator}</p>
                      </div>
                      <span className="text-sm text-muted">{tier.perStem}</span>
                      <button
                        onClick={() => removeItem(item.stemId)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-red-400 hover:bg-red-400/10 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-4 space-y-3">
                <CheckoutProgress />
                {/* Tier info */}
                {discount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-emerald-400 font-medium">{tier.name}</span>
                    <span className="text-emerald-400">-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  {discount > 0 && (
                    <span className="text-sm text-muted line-through">${subtotal.toFixed(2)}</span>
                  )}
                  <span className="text-lg font-bold ml-auto">${total.toFixed(2)}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={clearCart}
                    className="px-4 py-2.5 rounded-lg text-sm text-muted hover:text-foreground border border-border hover:border-foreground/20 transition-all"
                  >
                    Clear
                  </button>
                  <Link
                    href="/checkout"
                    onClick={() => setOpen(false)}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white bg-accent hover:bg-accent-hover text-center transition-colors"
                  >
                    Checkout — ${total.toFixed(2)}
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
