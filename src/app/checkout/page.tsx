'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingBag, CreditCard, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, getTier, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  const total = getTotal();
  const tier = getTier();

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      clearCart();
      router.push(data.url);
    } catch {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-muted mx-auto mb-4 opacity-30" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted mb-6">Add some stems to get started</p>
        <Link
          href="/browse"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent-hover transition-colors"
        >
          Browse Stems
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href="/browse"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Continue Shopping
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Order summary */}
        <div className="p-6 rounded-2xl bg-surface border border-border mb-6">
          <h2 className="font-semibold mb-4">Order Summary</h2>

          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.stemId} className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium">{item.title}</span>
                  <span className="text-muted ml-2">by {item.creator}</span>
                </div>
                <span className="text-muted">{tier.perStem}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted">{items.length} stems</span>
              <span className="text-muted">${(items.length * 1).toFixed(2)}</span>
            </div>
            {tier.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-emerald-400">{tier.name}</span>
                <span className="text-emerald-400">
                  -${(items.length * 1 - total).toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
              <span>Total</span>
              <span className="text-foreground font-bold">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Mock payment */}
        <div className="p-6 rounded-2xl bg-surface border border-border mb-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-muted" />
            <h2 className="font-semibold">Payment</h2>
          </div>
          <p className="text-sm text-muted mb-4">
            This is a demo checkout. No real payment will be processed.
          </p>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Card number"
              defaultValue="4242 4242 4242 4242"
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-600"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="MM/YY"
                defaultValue="12/28"
                className="bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-600"
              />
              <input
                type="text"
                placeholder="CVC"
                defaultValue="123"
                className="bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-600"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full py-4 rounded-xl bg-accent hover:bg-accent-hover text-white font-medium transition-all hover:shadow-[4px_4px_0_#0A0A0A] flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Lock className="w-4 h-4" />
          {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
        </button>

        <p className="text-xs text-muted text-center mt-4">
          Secured by Stripe. Your payment info is never stored on our servers.
        </p>
      </motion.div>
    </div>
  );
}
