import { NextResponse } from 'next/server';
import { issuePostPurchaseCredit } from '@/lib/credits';

export async function POST(request: Request) {
  const { items, sessionId: clientSessionId } = await request.json();

  // Mock Stripe checkout session
  const sessionId = 'mock_session_' + Math.random().toString(36).substring(7);

  // Calculate total with bundle pricing
  const count = items.length;
  let perStem = 1.00;
  if (count >= 20) perStem = 0.33;
  else if (count >= 10) perStem = 0.50;
  else if (count >= 5) perStem = 0.60;
  else if (count >= 3) perStem = 0.75;

  const total = (count * perStem).toFixed(2);

  // Issue post-purchase 99c credit (expires in 48h)
  if (clientSessionId) {
    await issuePostPurchaseCredit(clientSessionId);
  }

  return NextResponse.json({
    sessionId,
    url: `/success?session_id=${sessionId}`,
    total,
    itemCount: count,
  });
}
