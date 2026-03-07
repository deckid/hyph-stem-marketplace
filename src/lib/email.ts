import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = 'Hyph <noreply@hyph.com>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://hyph.com';

interface StemInfo {
  name: string;
  genre: string;
  bpm: number;
  slug: string;
}

export async function sendAbandonedCart(
  email: string,
  stem: StemInfo,
  sequenceStep: 1 | 2 | 3
) {
  const stemUrl = `${APP_URL}/stem/${stem.slug}`;
  const buyUrl = `${APP_URL}/browse`;

  const subjects: Record<number, string> = {
    1: 'Your stem is still here',
    2: 'Someone else is eyeing this pack',
    3: 'Last chance — this drops tomorrow',
  };

  const bodies: Record<number, string> = {
    1: `
      <div style="font-family: sans-serif; background: #0A0A0F; color: #f0f0f5; padding: 40px; max-width: 500px; margin: 0 auto;">
        <h2 style="margin-bottom: 16px;">Hey, you left something behind</h2>
        <p style="color: #8888a0; margin-bottom: 24px;">You were checking out <strong style="color: #f0f0f5;">${stem.name}</strong> — it's still waiting for you.</p>
        <div style="background: #12121a; border: 1px solid #2a2a3a; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
          <p style="margin: 0 0 4px 0; font-weight: 600;">${stem.name}</p>
          <p style="margin: 0; color: #8888a0; font-size: 14px;">${stem.genre} &middot; ${stem.bpm} BPM</p>
        </div>
        <a href="${stemUrl}" style="display: inline-block; background: #ec4899; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 600;">Grab It — $0.99</a>
        <p style="color: #8888a0; font-size: 12px; margin-top: 24px;">Hyph — Premium Audio Stems</p>
      </div>
    `,
    2: `
      <div style="font-family: sans-serif; background: #0A0A0F; color: #f0f0f5; padding: 40px; max-width: 500px; margin: 0 auto;">
        <h2 style="margin-bottom: 16px;">47 producers bought stems today</h2>
        <p style="color: #8888a0; margin-bottom: 24px;"><strong style="color: #f0f0f5;">${stem.name}</strong> is getting attention. Don't miss out.</p>
        <div style="background: #12121a; border: 1px solid #2a2a3a; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
          <p style="margin: 0 0 4px 0; font-weight: 600;">${stem.name}</p>
          <p style="margin: 0; color: #8888a0; font-size: 14px;">${stem.genre} &middot; ${stem.bpm} BPM</p>
        </div>
        <a href="${buyUrl}" style="display: inline-block; background: #ec4899; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 600;">Browse Stems</a>
      </div>
    `,
    3: `
      <div style="font-family: sans-serif; background: #0A0A0F; color: #f0f0f5; padding: 40px; max-width: 500px; margin: 0 auto;">
        <h2 style="margin-bottom: 16px;">Last chance</h2>
        <p style="color: #8888a0; margin-bottom: 24px;"><strong style="color: #f0f0f5;">${stem.name}</strong> won't be here forever. Your credit is about to expire.</p>
        <a href="${buyUrl}" style="display: inline-block; background: #ec4899; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 600;">Use Your Credit Now</a>
        <p style="color: #8888a0; font-size: 12px; margin-top: 24px;">Hyph — Premium Audio Stems</p>
      </div>
    `,
  };

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: subjects[sequenceStep],
      html: bodies[sequenceStep],
    });
    return true;
  } catch (error) {
    console.error('Failed to send abandoned cart email:', error);
    return false;
  }
}
