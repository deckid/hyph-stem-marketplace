import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.text();

  // Mock webhook handler
  // In production, verify Stripe signature here
  console.log('Webhook received:', body.substring(0, 100));

  return NextResponse.json({ received: true });
}
