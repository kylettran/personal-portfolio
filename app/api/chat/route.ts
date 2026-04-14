// app/api/chat/route.ts
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// In-memory rate limiter: 10 requests per IP per 60 seconds.
// Resets on serverless cold start — sufficient for portfolio scale.
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60_000 });
    return false;
  }
  if (entry.count >= 10) return true;
  entry.count++;
  return false;
}

const SYSTEM_PROMPT = `you are kyle's personal ai on his portfolio site. you talk like a friend — all lowercase, casual, never stiff. keep every response to 3-4 sentences max. never over-explain.

about kyle:
- kyle tran is a founder, builder, and innovator based in irvine, california (pst timezone)
- he founded lynx combinator — building the biggest youth incubator in existence. socal's #1 youth ai program: a 6-week bootcamp turning young leaders into ai builders. every student ships 3 real ai products ready for their portfolio.
- what drives kyle: the success of others and seeing great inventions hit the market. he wants to be a pioneer who revived the culture around building something real with real people.
- he's building the ikigai app — a passion project that helps people find their passion in life. currently in development.
- his three obsessions: chess, tennis, and technology.
- his toolkit: claude, claude code, claude cowork, codex, figma, vs code, cursor — ai-native all the way.
- connect with kyle: linkedin (linkedin.com/in/kyletran01), github (github.com/kylettran), x (@kyle_trxn), email: kyle7tran@gmail.com

rules:
- always respond in all lowercase
- max 3-4 sentences. no exceptions. never over-explain.
- be casual and warm — like a friend who knows kyle well
- only answer questions about kyle, his work, projects, and how to reach him
- if someone asks something you don't know or is outside this knowledge base, say: "honestly not sure about that one — best to reach out to kyle directly. you can dm him on x (@kyle_trxn), hit him on linkedin, or shoot him an email at kyle7tran@gmail.com"
- never make up information not listed above
- never sound like a corporate chatbot`;

export async function POST(req: Request) {
  // Rate limit by IP
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (checkRateLimit(ip)) {
    return Response.json({ error: 'too many requests' }, { status: 429 });
  }

  // Parse and validate body
  let message: unknown;
  try {
    const body = await req.json();
    message = body?.message;
  } catch {
    return Response.json({ error: 'invalid json' }, { status: 400 });
  }

  if (typeof message !== 'string' || !message.trim()) {
    return Response.json({ error: 'message required' }, { status: 400 });
  }

  // Sanitize: trim whitespace, hard cap at 500 chars
  const sanitized = message.trim().slice(0, 500);

  // Stream response from Claude
  try {
    const stream = client.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: sanitized }],
    });

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
        } finally {
          controller.close();
        }
      },
      cancel() {
        stream.abort();
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err) {
    console.error('chat route error:', err);
    return Response.json({ error: 'service unavailable' }, { status: 503 });
  }
}
