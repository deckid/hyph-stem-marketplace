import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ referral: null });
    }

    const { data } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_user_id', sessionId);

    return NextResponse.json({
      referrals: data || [],
      referralLink: `${process.env.NEXT_PUBLIC_APP_URL || ''}/referral/${sessionId}`,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { referrerCode, referredEmail } = await request.json();

    if (!referrerCode || !referredEmail) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Create referral record
    const { error: insertError } = await supabase.from('referrals').insert({
      referrer_user_id: referrerCode,
      referred_email: referredEmail,
      reward_unlocked: true,
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Issue credit to referrer
    await supabase.from('credits').insert({
      session_id: referrerCode,
      amount_cents: 499,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      used: false,
      reason: 'referral',
    });

    // Issue credit to referred user
    await supabase.from('credits').insert({
      session_id: referredEmail,
      amount_cents: 499,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      used: false,
      reason: 'referral',
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
