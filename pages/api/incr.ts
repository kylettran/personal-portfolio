import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = Redis.fromEnv();
export const config = {
  runtime: "edge",
};

// Only allow slugs matching the ContentLayer filenames: lowercase letters,
// digits, and hyphens. Max 100 chars.
const SLUG_RE = /^[a-z0-9-]+$/;

export default async function incr(req: NextRequest): Promise<NextResponse> {
  if (req.method !== "POST") {
    return new NextResponse("use POST", { status: 405 });
  }
  if (req.headers.get("Content-Type") !== "application/json") {
    return new NextResponse("must be json", { status: 400 });
  }

  const body = await req.json();
  let slug: string | undefined = undefined;
  if ("slug" in body) {
    slug = body.slug;
  }
  if (!slug) {
    return new NextResponse("Slug not found", { status: 400 });
  }

  // Validate slug before it reaches Redis key construction.
  if (!SLUG_RE.test(slug) || slug.length > 100) {
    return new NextResponse("Invalid slug", { status: 400 });
  }

  const ip = req.ip ?? req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "anonymous";

  // Hash the IP so it is never stored in plain text.
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(ip),
  );
  const hash = Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Rate limit: max 10 view increments per IP per minute across all slugs.
  const rateLimitKey = ["ratelimit", hash, "minute"].join(":");
  const callCount = await redis.incr(rateLimitKey);
  if (callCount === 1) {
    await redis.expire(rateLimitKey, 60);
  }
  if (callCount > 10) {
    return new NextResponse("Too many requests", { status: 429 });
  }

  // Deduplicate: one view per IP per slug per 24 hours.
  // Bug fix: was missing `return`, so the counter always incremented even for
  // returning visitors within the dedup window.
  const isNew = await redis.set(["deduplicate", hash, slug].join(":"), true, {
    nx: true,
    ex: 24 * 60 * 60,
  });
  if (!isNew) {
    return new NextResponse(null, { status: 202 });
  }

  await redis.incr(["pageviews", "projects", slug].join(":"));
  return new NextResponse(null, { status: 202 });
}
