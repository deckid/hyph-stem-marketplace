'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Sparkles, Mail } from 'lucide-react';

const SEGMENTS = [
  { name: 'free_stem', label: 'Free Stem', color: '#10b981', emoji: '🎵' },
  { name: '50off', label: '50% Off', color: '#ec4899', emoji: '🔥' },
  { name: '99c_credit', label: '$0.99 Credit', color: '#8b5cf6', emoji: '💰' },
  { name: 'bundle_credit', label: 'Mystery Pack', color: '#f59e0b', emoji: '🎁' },
];

interface SpinWheelProps {
  onClose: () => void;
}

export default function SpinWheel({ onClose }: SpinWheelProps) {
  const [email, setEmail] = useState('');
  const [phase, setPhase] = useState<'email' | 'spinning' | 'result'>('email');
  const [result, setResult] = useState<{ outcome: string; label: string } | null>(null);
  const [rotation, setRotation] = useState(0);
  const [error, setError] = useState('');
  const wheelRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    setError('');
    setPhase('spinning');

    try {
      const res = await fetch('/api/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          sessionId: getSessionId(),
        }),
      });

      const data = await res.json();
      const segmentIndex = SEGMENTS.findIndex((s) => s.name === data.outcome);
      const segmentAngle = 360 / SEGMENTS.length;
      const targetAngle = 360 * 5 + (360 - segmentIndex * segmentAngle - segmentAngle / 2);

      setRotation(targetAngle);

      // Set cookie
      document.cookie = `hyph_email=${email};max-age=${30 * 24 * 60 * 60};path=/`;

      setTimeout(() => {
        setResult(data);
        setPhase('result');
      }, 3200);
    } catch {
      setPhase('email');
      setError('Something went wrong. Try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="relative w-full max-w-md bg-surface border border-border rounded-2xl overflow-hidden"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-background/50 flex items-center justify-center text-muted hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs mb-3">
              <Gift className="w-3 h-3" />
              New visitor reward
            </div>
            <h2 className="text-2xl font-bold mb-1">Spin to Win</h2>
            <p className="text-sm text-muted">Enter your email for a chance to win free stems</p>
          </div>

          {/* Wheel */}
          <div className="relative w-64 h-64 mx-auto mb-6">
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
              <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[16px] border-t-white" />
            </div>

            {/* Wheel */}
            <div
              ref={wheelRef}
              className="w-full h-full rounded-full border-4 border-border overflow-hidden"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: phase === 'spinning' ? 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
              }}
            >
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {SEGMENTS.map((seg, i) => {
                  const angle = 360 / SEGMENTS.length;
                  const startAngle = i * angle - 90;
                  const endAngle = startAngle + angle;
                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;
                  const x1 = 100 + 100 * Math.cos(startRad);
                  const y1 = 100 + 100 * Math.sin(startRad);
                  const x2 = 100 + 100 * Math.cos(endRad);
                  const y2 = 100 + 100 * Math.sin(endRad);
                  const largeArc = angle > 180 ? 1 : 0;
                  const midAngle = ((startAngle + endAngle) / 2) * (Math.PI / 180);
                  const textX = 100 + 60 * Math.cos(midAngle);
                  const textY = 100 + 60 * Math.sin(midAngle);
                  const textRotation = (startAngle + endAngle) / 2 + 90;

                  return (
                    <g key={seg.name}>
                      <path
                        d={`M100,100 L${x1},${y1} A100,100 0 ${largeArc},1 ${x2},${y2} Z`}
                        fill={seg.color}
                        stroke="#0a0a0f"
                        strokeWidth="1"
                      />
                      <text
                        x={textX}
                        y={textY}
                        fill="white"
                        fontSize="9"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                      >
                        {seg.emoji} {seg.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {phase === 'email' && (
              <motion.div
                key="email"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="relative mb-3">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border text-sm focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                {error && <p className="text-xs text-red-400 mb-2">{error}</p>}
                <button
                  onClick={handleSubmit}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Spin the Wheel
                </button>
                <p className="text-[10px] text-muted text-center mt-2">
                  No spam. Unsubscribe anytime.
                </p>
              </motion.div>
            )}

            {phase === 'spinning' && (
              <motion.div
                key="spinning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-4"
              >
                <p className="text-sm text-muted animate-pulse">Spinning...</p>
              </motion.div>
            )}

            {phase === 'result' && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
                  <p className="text-emerald-400 font-bold text-lg mb-1">
                    You won: {result.label}!
                  </p>
                  <p className="text-xs text-muted">
                    Your reward has been applied to your account.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold text-sm transition-colors"
                >
                  Start Exploring
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sid = localStorage.getItem('hyph_session_id');
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('hyph_session_id', sid);
  }
  return sid;
}
