import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Use session-based streak tracking (no auth required)
    const today = new Date().toISOString().split('T')[0];

    const { data: existing } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', sessionId)
      .single();

    if (!existing) {
      // First visit — create streak
      const { data } = await supabase
        .from('streaks')
        .insert({
          user_id: sessionId,
          streak_days: 1,
          last_login: today,
        })
        .select()
        .single();

      return NextResponse.json({ streak: data, reward: null });
    }

    if (existing.last_login === today) {
      // Already visited today
      return NextResponse.json({ streak: existing, reward: null });
    }

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const newStreak = existing.last_login === yesterday ? existing.streak_days + 1 : 1;

    const { data: updated } = await supabase
      .from('streaks')
      .update({
        streak_days: newStreak,
        last_login: today,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', sessionId)
      .select()
      .single();

    // Check milestone rewards
    let reward = null;
    if (newStreak === 3) {
      // Day 3: free stem credit
      await supabase.from('credits').insert({
        session_id: sessionId,
        amount_cents: 99,
        expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        used: false,
        reason: 'streak',
      });
      reward = { type: 'credit', label: 'Free stem credit unlocked!' };
    } else if (newStreak === 7) {
      reward = { type: 'vault_pack', label: 'Vault Pack unlocked!' };
    }

    return NextResponse.json({ streak: updated, reward });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
