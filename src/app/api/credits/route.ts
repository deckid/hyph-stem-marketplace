import { NextResponse } from 'next/server';
import { getActiveCredit, issuePostPurchaseCredit } from '@/lib/credits';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ credit: null });
    }

    const credit = await getActiveCredit(sessionId);
    return NextResponse.json({ credit });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const credit = await issuePostPurchaseCredit(sessionId);
    return NextResponse.json({ credit });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
