'use client';

import { useState, useEffect } from 'react';
import { Share2, Copy, Check } from 'lucide-react';

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('hyph_session_id') || '';
}

export default function ReferralCard() {
  const [referralLink, setReferralLink] = useState('');
  const [referralCount, setReferralCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const sessionId = getSessionId();
    if (!sessionId) return;

    fetch(`/api/referral?sessionId=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.referralLink) setReferralLink(data.referralLink);
        if (data.referrals) setReferralCount(data.referrals.length);
      })
      .catch(() => {});
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = encodeURIComponent('Check out Hyph — premium audio stems for $1. Use my link for a free $4.99 pack!');
  const shareUrl = encodeURIComponent(referralLink);

  if (!referralLink) return null;

  return (
    <div className="p-4 rounded-xl bg-surface border border-border">
      <div className="flex items-center gap-2 mb-3">
        <Share2 className="w-4 h-4 text-accent" />
        <h3 className="text-sm font-semibold">Invite Friends, Get Free Stems</h3>
      </div>

      <p className="text-xs text-muted mb-3">
        Share your link. When a friend signs up, you both get a <span className="text-emerald-400">$4.99 pack FREE</span>.
      </p>

      {/* Progress */}
      <div className="text-xs text-muted mb-3">
        {referralCount === 0
          ? '1 friend away from your free pack'
          : `${referralCount} friend${referralCount > 1 ? 's' : ''} referred`}
      </div>

      {/* Copy link */}
      <div className="flex gap-2 mb-3">
        <input
          value={referralLink}
          readOnly
          className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-xs text-muted truncate"
        />
        <button
          onClick={handleCopy}
          className="px-3 py-2 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition-colors flex items-center gap-1 text-xs"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Share buttons */}
      <div className="flex gap-2">
        <a
          href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2 rounded-lg bg-emerald-600/20 text-emerald-400 text-xs font-medium text-center hover:bg-emerald-600/30 transition-colors"
        >
          WhatsApp
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2 rounded-lg bg-blue-600/20 text-blue-400 text-xs font-medium text-center hover:bg-blue-600/30 transition-colors"
        >
          Post on X
        </a>
      </div>
    </div>
  );
}
