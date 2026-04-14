import { NextRequest } from 'next/server';

// Simple in-memory rate limiter: max 3 submissions per IP per 10 minutes
const rateMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return false;
  }
  if (entry.count >= 3) return true;
  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';

  if (isRateLimited(ip)) {
    return Response.json(
      { error: 'too many requests — try again in a few minutes' },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'invalid request' }, { status: 400 });
  }

  const { name, email, message } = body as Record<string, string>;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return Response.json({ error: 'all fields are required' }, { status: 400 });
  }

  if (name.length > 100 || email.length > 254 || message.length > 2000) {
    return Response.json({ error: 'input too long' }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'invalid email address' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY is not set');
    return Response.json({ error: 'email service not configured' }, { status: 500 });
  }

  try {
    // Call Resend REST API directly — no SDK, no peer-dep issues
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Update 'from' to 'noreply@kylettran.com' once domain is verified in Resend
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: ['kyle7tran@gmail.com'],
        reply_to: email.trim(),
        subject: `new message from ${name.trim()} — kylettran.com`,
        text: [
          `Name:    ${name.trim()}`,
          `Email:   ${email.trim()}`,
          ``,
          `Message:`,
          message.trim(),
        ].join('\n'),
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('[contact] resend error:', err);
      return Response.json({ error: 'failed to send — try again' }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error('[contact] network error:', err);
    return Response.json({ error: 'failed to send — try again' }, { status: 500 });
  }
}
