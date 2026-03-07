import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const OUTCOMES = [
  { name: 'free_stem', label: 'Free Stem', weight: 30 },
  { name: '50off', label: '50% Off First Pack', weight: 25 },
  { name: '99c_credit', label: '$0.99 Credit', weight: 30 },
  { name: 'bundle_credit', label: 'Mystery Pack', weight: 15 },
] as const;

function pickOutcome(): (typeof OUTCOMES)[number] {
  const totalWeight = OUTCOMES.reduce((sum, o) => sum + o.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const outcome of OUTCOMES) {
    roll -= outcome.weight;
    if (roll <= 0) return outcome;
  }
  return OUTCOMES[0];
}

export async function POST(request: Request) {
  try {
    const { email, sessionId } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const outcome = pickOutcome();

    // Log the spin
    await supabase.from('wheel_spins').insert({
      session_id: sessionId || null,
      email,
      outcome: outcome.name,
    });

    // Issue credit for applicable outcomes
    if (outcome.name === '99c_credit' || outcome.name === 'free_stem') {
      const amountCents = outcome.name === 'free_stem' ? 100 : 99;
      await supabase.from('credits').insert({
        session_id: sessionId || email,
        amount_cents: amountCents,
        expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        used: false,
        reason: 'signup',
      });
    }

    return NextResponse.json({
      outcome: outcome.name,
      label: outcome.label,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
