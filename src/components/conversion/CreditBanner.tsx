'use client';

import { useState, useEffect } from 'react';
import { useConversionStore } from '@/stores/conversionStore';
import { Coins } from 'lucide-react';
import Link from 'next/link';

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('hyph_session_id') || '';
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return 'Expired';
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export default function CreditBanner() {
  const { activeCredit, setActiveCredit } = useConversionStore();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Fetch active credit on mount
  useEffect(() => {
    const sessionId = getSessionId();
    if (!sessionId) return;

    fetch(`/api/credits?sessionId=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.credit) {
          setActiveCredit({
            amountCents: data.credit.amount_cents,
            expiresAt: new Date(data.credit.expires_at),
          });
        }
      })
      .catch(() => {});
  }, [setActiveCredit]);

  // Countdown timer
  useEffect(() => {
    if (!activeCredit) return;

    const update = () => {
      const remaining = activeCredit.expiresAt.getTime() - Date.now();
      if (remaining <= 0) {
        setActiveCredit(null);
        setTimeLeft(null);
      } else {
        setTimeLeft(remaining);
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [activeCredit, setActiveCredit]);

  if (!activeCredit || timeLeft === null || timeLeft <= 0) return null;

  const isUrgent = timeLeft < 6 * 60 * 60 * 1000; // < 6 hours
  const amountDisplay = (activeCredit.amountCents / 100).toFixed(2);

  return (
    <Link
      href="/browse"
      className={`block w-full text-center py-2 px-4 text-sm font-medium transition-colors ${
        isUrgent
          ? 'bg-red-600 text-white hover:bg-red-500'
          : 'bg-emerald-600 text-white hover:bg-emerald-500'
      }`}
    >
      <span className="inline-flex items-center gap-2">
        <Coins className="w-3.5 h-3.5" />
        You have ${amountDisplay} expiring in {formatCountdown(timeLeft)}
        <span className="hidden sm:inline">— click to use it</span>
      </span>
    </Link>
  );
}
