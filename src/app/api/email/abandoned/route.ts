import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email, stemId, stemName, stemGenre, stemBpm, stemSlug, action } = await request.json();

    if (action === 'viewed') {
      // Track stem view for abandoned cart sequence
      await supabase.from('wheel_spins').insert({
        session_id: `view_${Date.now()}`,
        email: email || null,
        outcome: `viewed:${stemId}`,
      });

      return NextResponse.json({ tracked: true });
    }

    if (action === 'trigger') {
      // Manual trigger for testing abandoned cart emails
      const { sendAbandonedCart } = await import('@/lib/email');

      if (!email || !stemName) {
        return NextResponse.json({ error: 'Missing email or stem info' }, { status: 400 });
      }

      const result = await sendAbandonedCart(email, {
        name: stemName,
        genre: stemGenre || 'Unknown',
        bpm: stemBpm || 120,
        slug: stemSlug || 'unknown',
      }, 1);

      return NextResponse.json({ sent: result });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
