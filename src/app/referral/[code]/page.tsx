'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Gift, ArrowRight, Mail } from 'lucide-react';

export default function ReferralPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClaim = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referrerCode: code, referredEmail: email }),
      });

      if (!res.ok) {
        setError('Something went wrong');
        setLoading(false);
        return;
      }

      // Set cookie and redirect
      document.cookie = `hyph_email=${email};max-age=${30 * 24 * 60 * 60};path=/`;
      router.push('/browse');
    } catch {
      setError('Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2">You&apos;ve Been Invited!</h1>
          <p className="text-muted">
            A friend sent you a <span className="text-emerald-400 font-semibold">$4.99 free pack</span> on Hyph
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-border">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Gift className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-semibold">Your reward</span>
            </div>
            <p className="text-xs text-muted">
              $4.99 credit to spend on any stems. Plus your friend gets the same.
            </p>
          </div>

          <div className="relative mb-3">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleClaim()}
              placeholder="your@email.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border text-sm focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {error && <p className="text-xs text-red-400 mb-2">{error}</p>}

          <button
            onClick={handleClaim}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Claiming...' : 'Claim Your Free Pack'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
