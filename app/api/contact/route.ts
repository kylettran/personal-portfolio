import { Resend } from 'resend';
import { NextRequest } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

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

  // Validate presence
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return Response.json({ error: 'all fields are required' }, { status: 400 });
  }

  // Validate lengths
  if (name.length > 100 || email.length > 254 || message.length > 2000) {
    return Response.json({ error: 'input too long' }, { status: 400 });
  }

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'invalid email address' }, { status: 400 });
  }

  try {
    await resend.emails.send({
      // Update 'from' to 'noreply@kylettran.com' once you verify the domain in Resend
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'kyle7tran@gmail.com',
      replyTo: email,
      subject: `new message from ${name.trim()} — kylettran.com`,
      text: [
        `Name:    ${name.trim()}`,
        `Email:   ${email.trim()}`,
        ``,
        `Message:`,
        message.trim(),
      ].join('\n'),
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error('[contact] resend error:', err);
    return Response.json({ error: 'failed to send — try again' }, { status: 500 });
  }
}
