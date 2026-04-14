import { redis } from '@/lib/redis';
import { NextRequest } from 'next/server';

const key = (slug: string) => `views:${slug}`;

// GET /api/views/[slug] — fetch current count
export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const views = (await redis.get<number>(key(params.slug))) ?? 0;
  return Response.json({ views });
}

// POST /api/views/[slug] — atomically increment and return new count
export async function POST(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const views = await redis.incr(key(params.slug));
  return Response.json({ views });
}
