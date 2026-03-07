import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('flash_packs')
      .select('*')
      .eq('active', true)
      .gt('expires_at', new Date().toISOString())
      .order('expires_at', { ascending: true });

    if (error) {
      return NextResponse.json({ packs: [] });
    }

    return NextResponse.json({ packs: data || [] });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, stem_ids, original_price_cents, sale_price_cents, expires_hours, admin_password } = body;

    if (admin_password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('flash_packs')
      .insert({
        title,
        stem_ids,
        original_price_cents,
        sale_price_cents,
        expires_at: new Date(Date.now() + expires_hours * 60 * 60 * 1000).toISOString(),
        active: true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ pack: data });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
