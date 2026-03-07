import { supabase } from './supabase';

export interface Credit {
  id: string;
  amount_cents: number;
  expires_at: string;
  used: boolean;
  reason: string;
}

export async function getActiveCredit(sessionId: string): Promise<Credit | null> {
  const { data, error } = await supabase
    .from('credits')
    .select('*')
    .eq('session_id', sessionId)
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .order('expires_at', { ascending: true })
    .limit(1)
    .single();

  if (error || !data) return null;
  return data as Credit;
}

export async function issuePostPurchaseCredit(sessionId: string): Promise<Credit | null> {
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('credits')
    .insert({
      session_id: sessionId,
      amount_cents: 99,
      expires_at: expiresAt,
      used: false,
      reason: 'purchase',
    })
    .select()
    .single();

  if (error || !data) return null;
  return data as Credit;
}

export async function markCreditUsed(creditId: string): Promise<boolean> {
  const { error } = await supabase
    .from('credits')
    .update({ used: true })
    .eq('id', creditId);

  return !error;
}
