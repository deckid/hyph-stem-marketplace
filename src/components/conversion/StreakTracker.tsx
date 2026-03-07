'use client';

import { useState, useEffect } from 'react';
import { Flame, Gift } from 'lucide-react';
import { useConversionStore } from '@/stores/conversionStore';

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('hyph_session_id') || '';
}

const MILESTONES = [
  { day: 3, label: 'Free stem credit', icon: '🎵' },
  { day: 7, label: 'Vault Pack', icon: '🎁' },
];

export default function StreakTracker() {
  const { streakDays, setStreakDays } = useConversionStore();
  const [reward, setReward] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const sessionId = getSessionId();
    if (!sessionId) return;

    fetch('/api/streak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.streak) {
          setStreakDays(data.streak.streak_days);
        }
        if (data.reward) {
          setReward(data.reward.label);
        }
      })
      .catch(() => {});
  }, [setStreakDays]);

  if (streakDays === 0) return null;

  const nextMilestone = MILESTONES.find((m) => m.day > streakDays);
  const daysToNext = nextMilestone ? nextMilestone.day - streakDays : 0;

  return (
    <div className="relative">
      {/* Collapsed: icon in navbar */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-surface-hover transition-colors"
        title={`${streakDays} day streak`}
      >
        <Flame className="w-4 h-4 text-orange-400" />
        <span className="text-xs font-semibold text-orange-400">{streakDays}</span>
      </button>

      {/* Expanded dropdown */}
      {expanded && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setExpanded(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 w-64 p-4 rounded-xl bg-surface border border-border shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="font-semibold text-sm">{streakDays}-day streak</span>
            </div>

            {reward && (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mb-3">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-emerald-400 font-medium">{reward}</span>
                </div>
              </div>
            )}

            {/* Milestones */}
            <div className="space-y-2 mb-3">
              {MILESTONES.map((m) => (
                <div
                  key={m.day}
                  className={`flex items-center gap-2 text-xs ${
                    streakDays >= m.day ? 'text-foreground' : 'text-muted'
                  }`}
                >
                  <span>{m.icon}</span>
                  <span>Day {m.day}: {m.label}</span>
                  {streakDays >= m.day && (
                    <span className="ml-auto text-emerald-400 text-[10px]">Unlocked</span>
                  )}
                </div>
              ))}
            </div>

            {nextMilestone && (
              <p className="text-[10px] text-muted">
                Come back {daysToNext === 1 ? 'tomorrow' : `${daysToNext} more days`} for{' '}
                {nextMilestone.label}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
