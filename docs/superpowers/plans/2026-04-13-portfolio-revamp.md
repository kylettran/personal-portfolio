# Portfolio Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild kyletran.com as a single-page scroll site with Claude-powered AI chat, mobile-first bottom tab navigation, and a bento-grid about section — inspired by pszostak.pl but distinctly minimal black/zinc.

**Architecture:** Single `app/page.tsx` assembles 6 section components (`#hero`, `#about`, `#projects`, `#skills`, `#more`, footer). AI chat runs through a Next.js Route Handler (`app/api/chat/route.ts`) that calls the Anthropic API server-side — API key never reaches the client. Static TypeScript data files replace ContentLayer.

**Tech Stack:** Next.js 13 App Router, TypeScript, Tailwind CSS, Framer Motion (already installed v10), @anthropic-ai/sdk (to add), Lucide React

**Design reference:** `docs/superpowers/specs/2026-04-13-portfolio-revamp-design.md`

**Important global CSS note:** `global.css` has `* { text-transform: lowercase; }` — all text renders lowercase by CSS regardless of source casing. This is intentional and on-brand. Keep it.

---

## File Map

### Create
- `lib/projects.ts` — typed project data array
- `lib/tools.ts` — typed tools/skills data array
- `lib/links.ts` — "more to explore" links data
- `app/api/chat/route.ts` — streaming AI chat route handler
- `app/components/nav-desktop.tsx` — sticky top nav (desktop)
- `app/components/nav-mobile.tsx` — fixed bottom tab bar (mobile)
- `app/components/hero.tsx` — hero section (memoji + name + chat)
- `app/components/chat-box.tsx` — AI chat UI (client component)
- `app/components/bento-card.tsx` — tap-to-expand card (client component)
- `app/components/about-section.tsx` — bento grid section
- `app/components/project-card.tsx` — single project card (client component)
- `app/components/projects-section.tsx` — numbered projects section
- `app/components/skills-section.tsx` — tools/skills grid section
- `app/components/more-section.tsx` — "more to explore" cards section
- `app/components/footer.tsx` — footer

### Modify
- `package.json` — add `@anthropic-ai/sdk`, remove `contentlayer`, `next-contentlayer`, `@upstash/redis`
- `next.config.mjs` — remove `withContentlayer` wrapper
- `tailwind.config.js` — remove unused animations, remove `content/**/*.mdx`
- `global.css` — remove home-lock-scroll styles, keep lowercase rule
- `app/layout.tsx` — remove Analytics import, update metadata
- `app/page.tsx` — full rewrite assembling all sections
- `.env.example` — add `ANTHROPIC_API_KEY`

### Delete
- `contentlayer.config.js`
- `pages/api/incr.ts`
- `app/projects/page.tsx`
- `app/contact/page.tsx`
- `app/components/particles.tsx`
- `app/components/analytics.tsx`
- `app/components/brain-orb.tsx`
- `app/components/brain-project-layout.tsx`
- `app/components/lynx-carousel.tsx`
- `app/components/skeleton.tsx`
- `content/` directory (all MDX files)

---

## Task 1: Cleanup & Dependencies

**Files:**
- Modify: `package.json`
- Modify: `next.config.mjs`
- Modify: `.env.example`
- Delete: `contentlayer.config.js`, `pages/api/incr.ts`

- [ ] **Step 1: Install @anthropic-ai/sdk and remove unused deps**

```bash
cd "/Users/kyletran/Desktop/Projects I Built/personal-portfolio"
pnpm add @anthropic-ai/sdk
pnpm remove contentlayer next-contentlayer @upstash/redis @next/mdx markdown-wasm rehype-autolink-headings rehype-pretty-code rehype-slug remark-gfm @react-three/fiber @react-three/drei three embla-carousel-react react-wrap-balancer
```

Expected output: packages removed from `node_modules` and `pnpm-lock.yaml` updated.

- [ ] **Step 2: Remove ContentLayer path alias from tsconfig.json**

Edit `tsconfig.json` — remove the `contentlayer/generated` entry from `paths`:

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Rewrite next.config.mjs**

Replace the entire file:

```js
// next.config.mjs
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 5: Update .env.example**

```bash
# .env.example
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

- [ ] **Step 6: Delete files that are no longer needed**

```bash
cd "/Users/kyletran/Desktop/Projects I Built/personal-portfolio"
rm contentlayer.config.js
rm pages/api/incr.ts
rm -rf content/
rm app/components/particles.tsx
rm app/components/analytics.tsx
rm app/components/brain-orb.tsx 2>/dev/null || true
rm app/components/brain-project-layout.tsx 2>/dev/null || true
rm app/components/lynx-carousel.tsx 2>/dev/null || true
rm app/components/skeleton.tsx 2>/dev/null || true
rm -rf app/projects/
rm -rf app/contact/
rm mdx-components.tsx 2>/dev/null || true
```

- [ ] **Step 7: Verify build still starts (will have errors but shouldn't crash on import)**

```bash
cd "/Users/kyletran/Desktop/Projects I Built/personal-portfolio"
pnpm dev &
sleep 5
kill %1 2>/dev/null || true
```

Expected: Next.js starts, may show errors about missing ContentLayer types — that's OK, will be fixed in Task 13.

- [ ] **Step 8: Commit**

```bash
cd "/Users/kyletran/Desktop/Projects I Built/personal-portfolio"
git add -A
git commit -m "chore: remove contentlayer, upstash, three.js; add anthropic sdk"
```

---

## Task 2: Static Data Layer

**Files:**
- Create: `lib/projects.ts`
- Create: `lib/tools.ts`
- Create: `lib/links.ts`

- [ ] **Step 1: Create lib/projects.ts**

```bash
mkdir -p "/Users/kyletran/Desktop/Projects I Built/personal-portfolio/lib"
```

```typescript
// lib/projects.ts
export interface Project {
  slug: string;
  number: string;
  type: string;
  title: string;
  description: string;
  url: string | null;
  github: string | null;
  image: string | null;
  tags: string[];
  status: 'live' | 'in-development';
}

export const projects: Project[] = [
  {
    slug: 'lynx-combinator',
    number: '01',
    type: 'Youth AI Program',
    title: 'Lynx Combinator',
    description:
      "Building the biggest youth incubator in existence. A 6-week bootcamp that turns young leaders into AI builders — every student ships 3 real AI products ready for their portfolio.",
    url: 'https://ls-portfolio-page.vercel.app/',
    github: null,
    image: '/lynx-hero.png',
    tags: ['AI', 'Education', 'Founders'],
    status: 'live',
  },
  {
    slug: 'ikigai-app',
    number: '02',
    type: 'In Development',
    title: 'Ikigai App',
    description:
      "A passion project that helps you find your passion in life — built around the Japanese concept of ikigai.",
    url: null,
    github: null,
    image: null,
    tags: ['Mobile', 'Wellness', 'AI'],
    status: 'in-development',
  },
  {
    slug: 'brain-project',
    number: '03',
    type: 'Interactive Experience',
    title: 'Brain Project',
    description:
      "A living neural sculpture that shifts from silhouette to synaptic pathways. An interactive 3D experience.",
    url: null,
    github: null,
    image: '/planetfall.png',
    tags: ['3D', 'Interactive', 'Creative'],
    status: 'live',
  },
  {
    slug: 'personal-portfolio',
    number: '04',
    type: 'Design & Dev',
    title: 'Personal Portfolio',
    description:
      "This site — designed and built with Claude, Next.js, and Tailwind. Mobile-first from the ground up.",
    url: 'https://kyletran.com',
    github: 'https://github.com/kylettran/personal-portfolio',
    image: null,
    tags: ['Next.js', 'Tailwind', 'Claude'],
    status: 'live',
  },
];
```

- [ ] **Step 2: Create lib/tools.ts**

```typescript
// lib/tools.ts
export interface Tool {
  name: string;
  description: string;
  emoji: string;
}

export const tools: Tool[] = [
  { name: 'Claude', description: 'Primary AI model for building and thinking', emoji: '🤖' },
  { name: 'Claude Code', description: 'Agentic coding in the terminal', emoji: '💻' },
  { name: 'Claude Cowork', description: 'Collaborative AI workspace', emoji: '🤝' },
  { name: 'Codex', description: 'Code generation and automation', emoji: '⚡' },
  { name: 'Figma', description: 'Design and prototyping', emoji: '🎨' },
  { name: 'VS Code', description: 'Code editor', emoji: '📝' },
  { name: 'Cursor', description: 'AI-native IDE', emoji: '🖱️' },
];
```

- [ ] **Step 3: Create lib/links.ts**

```typescript
// lib/links.ts
export interface ExploreLink {
  title: string;
  description: string;
  url: string;
  emoji: string;
}

export const exploreLinks: ExploreLink[] = [
  {
    title: 'Lynx Combinator',
    description: "SoCal's #1 youth AI incubator",
    url: 'https://ls-portfolio-page.vercel.app/',
    emoji: '🏗',
  },
  {
    title: 'LinkedIn',
    description: 'Connect with me',
    url: 'https://www.linkedin.com/in/kyletran01/',
    emoji: '🔗',
  },
  {
    title: 'GitHub',
    description: "See what I'm building",
    url: 'https://github.com/kylettran',
    emoji: '⌥',
  },
];
```

- [ ] **Step 4: Verify TypeScript compiles cleanly**

```bash
cd "/Users/kyletran/Desktop/Projects I Built/personal-portfolio"
npx tsc --noEmit --skipLibCheck 2>&1 | grep "lib/" || echo "lib/ files OK"
```

Expected: no errors from `lib/` files.

- [ ] **Step 5: Commit**

```bash
cd "/Users/kyletran/Desktop/Projects I Built/personal-portfolio"
git add lib/
git commit -m "feat: add static data layer (projects, tools, links)"
```

---

## Task 3: Global Styles & Layout

**Files:**
- Modify: `global.css`
- Modify: `tailwind.config.js`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Rewrite global.css**

```css
/* global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  text-transform: lowercase;
}

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    background-color: #000;
    color: white;
    overflow-x: hidden;
  }

  /* Safe area inset for mobile bottom nav */
  .pb-safe {
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }
}
```

- [ ] **Step 2: Rewrite tailwind.config.js**

Remove unused animations, keep fonts, remove MDX content path:

```js
// tailwind.config.js
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
        display: ["var(--font-calsans)"],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 3: Update app/layout.tsx**

Remove Analytics import and ContentLayer types. Update metadata:

```typescript
// app/layout.tsx
import "../global.css";
import { Inter } from "@next/font/google";
import LocalFont from "@next/font/local";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Kyle Tran",
    template: "%s | Kyle Tran",
  },
  description: "Founder. Builder. Shaping the next generation of AI creators.",
  openGraph: {
    title: "Kyle Tran",
    description: "Founder. Builder. Shaping the next generation of AI creators.",
    url: "https://kyletran.com",
    siteName: "Kyle Tran",
    locale: "en-US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Kyle Tran",
    card: "summary_large_image",
  },
  icons: {
    shortcut: "/favicon.png",
  },
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const calSans = LocalFont({
  src: "../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={[inter.variable, calSans.variable].join(" ")}>
      <body className="bg-black">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Commit**

```bash
cd "/Users/kyletran/Desktop/Projects I Built/personal-portfolio"
git add global.css tailwind.config.js app/layout.tsx
git commit -m "feat: update global styles and layout for revamp"
```

---

## Task 4: AI Chat API Route

**Files:**
- Create: `app/api/chat/route.ts`

This is the most security-sensitive file. Rate limiting, input validation, and prompt injection protection all live here.

- [ ] **Step 1: Create .env.local with your API key**

```bash
# In terminal (replace with your real key):
echo "ANTHROPIC_API_KEY=your_key_here" >> "/Users/kyletran/Desktop/Projects I Built/personal-portfolio/.env.local"
```

Get your API key from: https://console.anthropic.com/

- [ ] **Step 2: Create the API route**

```bash
mkdir -p "/Users/kyletran/Desktop/Projects I Built/personal-portfolio/app/api/chat"
```

```typescript
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
```

- [ ] **Step 3: Test the API route manually**

Start dev server in one terminal:
```bash
cd "/Users/kyletran/Desktop/Projects I Built/personal-portfolio" && pnpm dev
```

In another terminal:
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "what is lynx combinator?"}' \
  --no-buffer
```

Expected: Streaming text response in all lowercase, 3-4 sentences about Lynx Combinator.

- [ ] **Step 4: Test rate limiting**

```bash
for i in {1..12}; do
  curl -s -o /dev/null -w "%{http_code}\n" \
    -X POST http://localhost:3000/api/chat \
    -H "Content-Type: application/json" \
    -d '{"message": "hi"}';
done
```

Expected: First 10 return `200`, requests 11 and 12 return `429`.

- [ ] **Step 5: Test input validation**

```bash
# Empty message
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": ""}' -w "\n%{http_code}"

# No message field
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{}' -w "\n%{http_code}"
```

Expected: Both return `400`.

- [ ] **Step 6: Commit**

```bash
cd "/Users/kyletran/Desktop/Projects I Built/personal-portfolio"
git add app/api/
git commit -m "feat: add streaming AI chat route with rate limiting"
```

---

## Task 5: ChatBox Component

**Files:**
- Create: `app/components/chat-box.tsx`

- [ ] **Step 1: Create chat-box.tsx**

```typescript
// app/components/chat-box.tsx
'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  'Lynx Combinator',
  "Kyle's story",
  'What has Kyle built?',
  "Let's connect",
];

export function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setIsStreaming(true);

    // Placeholder assistant message that we'll fill via streaming
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`status ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          return [
            ...prev.slice(0, -1),
            { ...last, content: last.content + chunk },
          ];
        });
      }
    } catch {
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        return [
          ...prev.slice(0, -1),
          {
            ...last,
            content:
              "something went wrong — dm kyle on x (@kyle_trxn) if this keeps happening.",
          },
        ];
      });
    } finally {
      setIsStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') sendMessage(input);
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Message thread */}
      {messages.length > 0 && (
        <div className="mb-3 max-h-52 overflow-y-auto space-y-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <span
                className={`inline-block max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-white text-black'
                    : 'bg-zinc-800 text-zinc-200'
                }`}
              >
                {msg.content || (
                  <span className="opacity-40">
                    <span className="animate-pulse">...</span>
                  </span>
                )}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input row */}
      <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about Kyle..."
          className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none"
          style={{ fontSize: '16px' }} // prevents iOS auto-zoom on focus
          disabled={isStreaming}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={isStreaming || !input.trim()}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-black transition-opacity disabled:opacity-30"
          aria-label="Send message"
        >
          ↑
        </button>
      </div>

      {/* Suggestion buttons — only shown before any messages */}
      {messages.length === 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="min-h-[48px] rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-left text-sm text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify no TypeScript errors in the file**

```bash
cd "/Users/kyletran/Desktop/Projects I Built/personal-portfolio"
npx tsc --noEmit --skipLibCheck 2>&1 | grep "chat-box" || echo "chat-box.tsx OK"
```

Expected: no errors from `chat-box.tsx`.

- [ ] **Step 3: Commit**

```bash
cd "/Users/kyletran/Desktop/Projects I Built/personal-portfolio"
git add app/components/chat-box.tsx
git commit -m "feat: add ChatBox component with streaming and suggestion buttons"
```

---

## Task 6: Hero Section

**Files:**
- Create: `app/components/hero.tsx`

- [ ] **Step 1: Create hero.tsx**

```typescript
// app/components/hero.tsx
'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ChatBox } from './chat-box';

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = (delay: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay },
        };

  return (
    <section
      id="hero"
      className="flex min-h-[100dvh] flex-col items-center justify-center px-6 py-24"
    >
      <div className="flex w-full max-w-2xl flex-col items-center gap-6 text-center">
        {/* Memoji */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Image
            src="/memoji.jpg"
            alt="Kyle Tran"
            width={96}
            height={96}
            className="rounded-full"
            priority
          />
        </motion.div>

        {/* Name */}
        <motion.div {...fadeUp(0.1)}>
          <p className="text-zinc-500 text-sm tracking-wide">Hi, I&apos;m</p>
          <h1 className="font-display text-5xl text-white sm:text-7xl md:text-8xl">
            Kyle Tran
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="max-w-sm text-zinc-400 text-base sm:text-lg"
          {...fadeUp(0.2)}
        >
          Founder. Builder. Shaping the next generation of AI creators.
        </motion.p>

        {/* AI Chat */}
        <motion.div className="w-full" {...fadeUp(0.3)}>
          <ChatBox />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="flex flex-col items-center gap-1 text-zinc-600 text-xs"
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <span>scroll to explore</span>
          <motion.span
            animate={shouldReduceMotion ? {} : { y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            ↓
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
cd "/Users/kyletran/Desktop/Projects I Built/personal-portfolio"
npx tsc --noEmit --skipLibCheck 2>&1 | grep "hero" || echo "hero.tsx OK"
```

- [ ] **Step 3: Commit**

```bash
cd "/Users/kyletran/Desktop/Projects I Built/personal-portfolio"
git add app/components/hero.tsx
git commit -m "feat: add Hero section with memoji and tagline"
```

---

## Task 7: Navigation Components

**Files:**
- Create: `app/components/nav-desktop.tsx`
- Create: `app/components/nav-mobile.tsx`

- [ ] **Step 1: Create nav-desktop.tsx**

```typescript
// app/components/nav-desktop.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'More', href: '#more' },
];

export function NavDesktop() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'border-b border-zinc-800 bg-black/80 backdrop-blur-md'
          : ''
      }`}
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="#hero"
          className="font-display text-lg text-white hover:opacity-70 transition-opacity"
        >
          KT
        </Link>

        {/* Center nav links — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-zinc-400 hover:text-white transition-colors duration-150"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA — hidden on mobile */}
        <Link
          href="#more"
          className="hidden md:flex h-9 items-center gap-2 rounded-xl border border-zinc-700 px-4 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
        >
          Let&apos;s Connect
        </Link>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Create nav-mobile.tsx**

```typescript
// app/components/nav-mobile.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, FolderOpen, Wrench, ExternalLink } from 'lucide-react';

const tabs = [
  { label: 'Home', href: '#hero', icon: Home, section: 'hero' },
  { label: 'Projects', href: '#projects', icon: FolderOpen, section: 'projects' },
  { label: 'Skills', href: '#skills', icon: Wrench, section: 'skills' },
  { label: 'Connect', href: '#more', icon: ExternalLink, section: 'more' },
];

export function NavMobile() {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const sectionIds = ['hero', 'about', 'projects', 'skills', 'more'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.4 }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Map 'about' section back to 'hero' tab (no dedicated about tab)
  const resolvedSection =
    activeSection === 'about' ? 'hero' : activeSection;

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-zinc-800 bg-zinc-900/90 backdrop-blur-md pb-safe">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = resolvedSection === tab.section;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex min-h-[48px] min-w-[48px] flex-col items-center justify-center gap-1 px-3"
            >
              <Icon
                size={20}
                className={`transition-colors ${isActive ? 'text-white' : 'text-zinc-500'}`}
              />
              <span
                className={`text-[10px] transition-colors ${isActive ? 'text-white' : 'text-zinc-500'}`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

- [ ] **Step 3: Verify no TypeScript errors**

```bash
cd "/Users/kyletran/Desktop/Projects I Built/personal-portfolio"
npx tsc --noEmit --skipLibCheck 2>&1 | grep "nav-" || echo "nav components OK"
```

- [ ] **Step 4: Commit**

```bash
cd "/Users/kyletran/Desktop/Projects I Built/personal-portfolio"
git add app/components/nav-desktop.tsx app/components/nav-mobile.tsx
git commit -m "feat: add desktop sticky nav and mobile bottom tab bar"
```

---

## Task 8: BentoCard Component

**Files:**
- Create: `app/components/bento-card.tsx`

- [ ] **Step 1: Create bento-card.tsx**

```typescript
// app/components/bento-card.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface BentoCardProps {
  title: string;
  teaser: string;
  children: React.ReactNode;
  expandable?: boolean;
  badge?: string;
  emoji?: string;
  link?: string;
  className?: string;
}

export function BentoCard({
  title,
  teaser,
  children,
  expandable = true,
  badge,
  emoji,
  link,
  className = '',
}: BentoCardProps) {
  const [expanded, setExpanded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const cardContent = (
    <div
      className={`group relative rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-zinc-700 ${
        expandable ? 'cursor-pointer select-none' : ''
      } ${className}`}
      onClick={() => expandable && setExpanded((v) => !v)}
      role={expandable ? 'button' : undefined}
      tabIndex={expandable ? 0 : undefined}
      onKeyDown={(e) => {
        if (expandable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          setExpanded((v) => !v);
        }
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {emoji && (
            <span className="mb-2 block text-2xl" aria-hidden="true">
              {emoji}
            </span>
          )}
          {badge && (
            <span className="mb-2 inline-block rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">
              {badge}
            </span>
          )}
          <h3 className="font-medium text-white">{title}</h3>
          {!expanded && (
            <p className="mt-1 text-sm text-zinc-400 line-clamp-2">{teaser}</p>
          )}
        </div>
        {expandable && (
          <motion.span
            className="mt-1 shrink-0 text-zinc-500"
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          >
            <ChevronDown size={16} />
          </motion.span>
        )}
      </div>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {(expanded || !expandable) && (
          <motion.div
            key="content"
            initial={
              shouldReduceMotion || !expandable
                ? {}
                : { opacity: 0, height: 0 }
            }
            animate={{ opacity: 1, height: 'auto' }}
            exit={
              shouldReduceMotion ? {} : { opacity: 0, height: 0 }
            }
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-3 text-sm text-zinc-400 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className="block">
        {cardContent}
      </a>
    );
  }

  return cardContent;
}
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
cd "/Users/kyletran/Desktop/Projects I Built/personal-portfolio"
npx tsc --noEmit --skipLibCheck 2>&1 | grep "bento" || echo "bento-card.tsx OK"
```

- [ ] **Step 3: Commit**

```bash
cd "/Users/kyletran/Desktop/Projects I Built/personal-portfolio"
git add app/components/bento-card.tsx
git commit -m "feat: add BentoCard with tap-to-expand and reduced motion support"
```

---

## Task 9: About Section

**Files:**
- Create: `app/components/about-section.tsx`

- [ ] **Step 1: Create about-section.tsx**

```typescript
// app/components/about-section.tsx
import { BentoCard } from './bento-card';

export function AboutSection() {
  return (
    <section id="about" className="w-full px-6 py-24">
      <div className="mx-auto max-w-5xl">
        {/* Section header */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-zinc-500">
            About
          </p>
          <h2 className="mt-1 font-display text-3xl text-white sm:text-4xl">
            The person behind the screen
          </h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Identity — spans 2 rows on desktop */}
          <BentoCard
            title="Kyle Tran"
            teaser="AI-Native Founder & Builder · Irvine, CA"
            expandable={false}
            className="md:row-span-2"
          >
            <div className="mt-2 space-y-3">
              <p className="text-zinc-300 font-medium">
                AI-Native Founder & Builder
              </p>
              <p className="text-zinc-500 text-xs font-mono">
                Irvine, CA · PST
              </p>
              <p className="text-zinc-400 leading-relaxed pt-2">
                Building the future by empowering others to build. Founded
                Lynx Combinator — reviving the culture around building
                something real with real people.
              </p>
            </div>
          </BentoCard>

          {/* Lynx Combinator */}
          <BentoCard
            title="Lynx Combinator"
            teaser="Building the biggest youth incubator in existence"
            emoji="🏗"
            link="https://ls-portfolio-page.vercel.app/"
            expandable={false}
          >
            <p>
              SoCal&apos;s #1 youth AI program — a 6-week bootcamp turning
              young leaders into real builders. Every student ships 3 AI
              products ready for their portfolio.
            </p>
          </BentoCard>

          {/* Ikigai App */}
          <BentoCard
            title="Ikigai App"
            teaser="Find your passion in life"
            emoji="💡"
            badge="In Development"
          >
            <p>
              A passion project built around the Japanese concept of ikigai —
              helping people find the intersection of what they love, what
              they&apos;re good at, and what the world needs.
            </p>
          </BentoCard>

          {/* Chess / Tennis / Tech — full width */}
          <BentoCard
            title="Chess · Tennis · Technology"
            teaser="The three things I think about constantly"
            expandable={false}
            className="md:col-span-2"
          >
            <div className="mt-2 flex gap-8">
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl" aria-hidden="true">♟</span>
                <span className="text-xs text-zinc-500">Chess</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl" aria-hidden="true">🎾</span>
                <span className="text-xs text-zinc-500">Tennis</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl" aria-hidden="true">💻</span>
                <span className="text-xs text-zinc-500">Technology</span>
              </div>
            </div>
          </BentoCard>

          {/* Location — full width */}
          <BentoCard
            title="Irvine, California"
            teaser="33.6846° N, 117.8265° W · PST"
            expandable={false}
            className="md:col-span-2"
          >
            <p className="font-mono text-zinc-500">
              33.6846° N, 117.8265° W · GMT-7 · PST
            </p>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
cd "/Users/kyletran/Desktop/Projects I Built/personal-portfolio"
npx tsc --noEmit --skipLibCheck 2>&1 | grep "about" || echo "about-section.tsx OK"
```

- [ ] **Step 3: Commit**

```bash
cd "/Users/kyletran/Desktop/Projects I Built/personal-portfolio"
git add app/components/about-section.tsx
git commit -m "feat: add About bento grid section"
```

---

## Task 10: Projects Section

**Files:**
- Create: `app/components/project-card.tsx`
- Create: `app/components/projects-section.tsx`

- [ ] **Step 1: Create project-card.tsx**

```typescript
// app/components/project-card.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import type { Project } from '@/lib/projects';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const isEven = index % 2 === 1; // 0-indexed: 1 and 3 flip layout

  return (
    <motion.article
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col gap-8 border-b border-zinc-800 py-12 last:border-0 md:items-center ${
        isEven ? 'md:flex-row-reverse' : 'md:flex-row'
      }`}
    >
      {/* Text content */}
      <div className="flex-1 space-y-4">
        {/* Number + type row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm text-zinc-600">
            {project.number}
          </span>
          <span className="text-zinc-700">·</span>
          <span className="text-sm text-zinc-500">{project.type}</span>
          {project.status === 'in-development' && (
            <span className="rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">
              In Development
            </span>
          )}
        </div>

        {/* Title + external link */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl text-white sm:text-3xl">
            {project.title}
          </h3>
          {project.url && (
            <Link
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-white"
            >
              <ExternalLink size={14} />
              <span>visit</span>
            </Link>
          )}
        </div>

        {/* Description */}
        <p className="leading-relaxed text-zinc-400">{project.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-500"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Project image */}
      {project.image && (
        <div className="w-full overflow-hidden rounded-xl border border-zinc-800 md:w-72 shrink-0">
          <Image
            src={project.image}
            alt={`${project.title} screenshot`}
            width={288}
            height={180}
            className="h-44 w-full object-cover"
          />
        </div>
      )}
    </motion.article>
  );
}
```

- [ ] **Step 2: Create projects-section.tsx**

```typescript
// app/components/projects-section.tsx
import Link from 'next/link';
import { projects } from '@/lib/projects';
import { ProjectCard } from './project-card';

export function ProjectsSection() {
  return (
    <section id="projects" className="w-full px-6 py-24">
      <div className="mx-auto max-w-5xl">
        {/* Section header */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-zinc-500">
            Portfolio
          </p>
          <h2 className="mt-1 font-display text-3xl text-white sm:text-4xl">
            Featured Projects
          </h2>
          <p className="mt-3 text-zinc-400">
            A selection of things I&apos;ve built and shipped.
          </p>
        </div>

        {/* Project list */}
        <div>
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>

        {/* GitHub CTA */}
        <div className="mt-12 flex justify-center">
          <Link
            href="https://github.com/kylettran"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-zinc-800 px-6 py-3 text-sm text-zinc-400 transition-colors hover:border-zinc-700 hover:text-white"
          >
            Explore all on GitHub →
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify no TypeScript errors**

```bash
cd "/Users/kyletran/Desktop/Projects I Built/personal-portfolio"
npx tsc --noEmit --skipLibCheck 2>&1 | grep "project" || echo "project components OK"
```

- [ ] **Step 4: Commit**

```bash
cd "/Users/kyletran/Desktop/Projects I Built/personal-portfolio"
git add app/components/project-card.tsx app/components/projects-section.tsx
git commit -m "feat: add Projects section with numbered alternating layout"
```

---

## Task 11: Skills Section

**Files:**
- Create: `app/components/skills-section.tsx`

- [ ] **Step 1: Create skills-section.tsx**

```typescript
// app/components/skills-section.tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { tools } from '@/lib/tools';

export function SkillsSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="skills" className="w-full px-6 py-24">
      <div className="mx-auto max-w-5xl">
        {/* Section header */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-zinc-500">
            Tech Stack
          </p>
          <h2 className="mt-1 font-display text-3xl text-white sm:text-4xl">
            My Tools
          </h2>
          <p className="mt-3 text-zinc-400">
            The AI-native toolkit I use to build every day.
          </p>
        </div>

        {/* Tools grid: 2 cols mobile, 4 cols desktop */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.name}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.97 }}
              className="flex flex-col gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-zinc-700"
            >
              <span className="text-2xl" aria-hidden="true">
                {tool.emoji}
              </span>
              <span className="font-medium text-white text-sm">
                {tool.name}
              </span>
              <span className="text-xs text-zinc-500 leading-relaxed">
                {tool.description}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
cd "/Users/kyletran/Desktop/Projects I Built/personal-portfolio"
npx tsc --noEmit --skipLibCheck 2>&1 | grep "skills" || echo "skills-section.tsx OK"
```

- [ ] **Step 3: Commit**

```bash
cd "/Users/kyletran/Desktop/Projects I Built/personal-portfolio"
git add app/components/skills-section.tsx
git commit -m "feat: add Skills section with AI tools grid"
```

---

## Task 12: More to Explore & Footer

**Files:**
- Create: `app/components/more-section.tsx`
- Create: `app/components/footer.tsx`

- [ ] **Step 1: Create more-section.tsx**

```typescript
// app/components/more-section.tsx
import Link from 'next/link';
import { exploreLinks } from '@/lib/links';

export function MoreSection() {
  return (
    <section id="more" className="w-full px-6 py-24">
      <div className="mx-auto max-w-5xl">
        {/* Section header */}
        <div className="mb-10">
          <h2 className="font-display text-3xl text-white sm:text-4xl">
            More to Explore
          </h2>
          <p className="mt-3 text-zinc-400">
            Check out these additional resources and connect with me.
          </p>
        </div>

        {/* Cards: stacked on mobile, 3-col on desktop */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {exploreLinks.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-zinc-700"
            >
              <span className="text-2xl" aria-hidden="true">
                {item.emoji}
              </span>
              <div className="flex-1">
                <h3 className="font-medium text-white">{item.title}</h3>
                <p className="mt-1 text-sm text-zinc-400">{item.description}</p>
              </div>
              <span className="text-sm text-zinc-500 transition-colors group-hover:text-zinc-300">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create footer.tsx**

```typescript
// app/components/footer.tsx
import Link from 'next/link';
import { Github, Linkedin } from 'lucide-react';

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 px-6 py-8 mb-16 md:mb-0">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
        {/* Left: identity + credit */}
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <span className="text-sm text-zinc-500">
            KT · © 2026 Kyle Tran
          </span>
          <span className="text-xs text-zinc-600">
            Built with Claude & Next.js
          </span>
        </div>

        {/* Right: social links */}
        <div className="flex items-center gap-5">
          <Link
            href="https://github.com/kylettran"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 transition-colors hover:text-white"
            aria-label="GitHub"
          >
            <Github size={18} />
          </Link>
          <Link
            href="https://www.linkedin.com/in/kyletran01/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 transition-colors hover:text-white"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} />
          </Link>
          <Link
            href="https://twitter.com/kylettran"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 transition-colors hover:text-white"
            aria-label="X (Twitter)"
          >
            <XIcon />
          </Link>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Verify no TypeScript errors**

```bash
cd "/Users/kyletran/Desktop/Projects I Built/personal-portfolio"
npx tsc --noEmit --skipLibCheck 2>&1 | grep -E "(more|footer)" || echo "more-section and footer OK"
```

- [ ] **Step 4: Commit**

```bash
cd "/Users/kyletran/Desktop/Projects I Built/personal-portfolio"
git add app/components/more-section.tsx app/components/footer.tsx
git commit -m "feat: add More to Explore section and Footer"
```

---

## Task 13: Main Page Assembly

**Files:**
- Modify: `app/page.tsx`

This task wires everything together into the single-page experience.

- [ ] **Step 1: Rewrite app/page.tsx**

```typescript
// app/page.tsx
import { NavDesktop } from './components/nav-desktop';
import { NavMobile } from './components/nav-mobile';
import { Hero } from './components/hero';
import { AboutSection } from './components/about-section';
import { ProjectsSection } from './components/projects-section';
import { SkillsSection } from './components/skills-section';
import { MoreSection } from './components/more-section';
import { Footer } from './components/footer';

export default function Home() {
  return (
    <>
      <NavDesktop />
      <NavMobile />
      <main className="pb-16 md:pb-0">
        {/* pb-16 reserves space for the mobile bottom nav bar */}
        <Hero />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <MoreSection />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Delete old page files that reference ContentLayer**

```bash
cd "/Users/kyletran/Desktop/Projects I Built/personal-portfolio"
# Remove old multi-page routes (contact and projects removed in Task 1,
# but double-check pages directory is clean)
rm -rf pages/api/ 2>/dev/null || true
# If pages/ dir is now empty, remove it
rmdir pages/ 2>/dev/null || true
```

- [ ] **Step 3: Full TypeScript check**

```bash
cd "/Users/kyletran/Desktop/Projects I Built/personal-portfolio"
npx tsc --noEmit --skipLibCheck 2>&1
```

Expected: Zero errors (or only harmless warnings from `@next/font` types).

- [ ] **Step 4: Start dev server and verify the site loads**

```bash
cd "/Users/kyletran/Desktop/Projects I Built/personal-portfolio"
pnpm dev
```

Open http://localhost:3000 in a browser. Verify:
- Hero section loads with memoji, name, tagline, and chat input
- Scrolling reveals About, Projects, Skills, More, Footer sections
- No console errors about missing modules

- [ ] **Step 5: Commit**

```bash
cd "/Users/kyletran/Desktop/Projects I Built/personal-portfolio"
git add app/page.tsx
git add -A  # catch any leftover deleted files
git commit -m "feat: assemble single-page portfolio with all sections"
```

---

## Task 14: Mobile QA Pass

**Goal:** Verify the full mobile experience — no clunky interactions, all tap targets meet 48px minimum, keyboard doesn't break layout.

- [ ] **Step 1: Open Chrome DevTools mobile emulation**

In Chrome at http://localhost:3000:
1. Open DevTools → Toggle device toolbar (Cmd+Shift+M)
2. Select iPhone 14 Pro (393×852)
3. Scroll through every section

Check each section:
- **Hero:** Memoji centered, name readable at 5xl, chat input full-width with 16px font, suggestion buttons are 2×2 grid and easy to tap
- **About:** Cards stack full-width, tap any expandable card and verify it expands smoothly
- **Projects:** Cards stack vertically, images appear below text, tags wrap cleanly
- **Skills:** 2-col grid, cards don't overflow
- **More:** Stacked full-width, whole card is tappable
- **Footer:** Content is centered, above the bottom nav
- **Bottom nav:** Fixed at bottom, 4 tabs visible, icons and labels legible

- [ ] **Step 2: Test the AI chat on mobile viewport**

In the mobile emulator:
1. Tap the chat input — verify the keyboard opens and the input stays visible (no layout jump)
2. Type a message and hit send
3. Verify the streaming response appears
4. Tap each suggestion button individually

Expected: Chat works smoothly, no layout breaking when keyboard opens.

- [ ] **Step 3: Check scroll behavior**

Scroll slowly through all sections:
- Nav highlight updates as you pass each section
- Mobile bottom tab bar updates active tab correctly
- No sections have horizontal scroll or content clipping

- [ ] **Step 4: Fix any issues found**

Common fixes to check:
- If chat input jumps when keyboard opens: add `position: relative` to the hero section and remove any `fixed` or `sticky` positioning on the input container
- If bottom nav overlaps footer: ensure `mb-16 md:mb-0` is on `<main>` (already in Task 13)
- If text overflows on small screens: add `overflow-hidden` or `break-words` to offending elements

- [ ] **Step 5: Final commit**

```bash
cd "/Users/kyletran/Desktop/Projects I Built/personal-portfolio"
git add -A
git commit -m "fix: mobile QA pass — layout, tap targets, keyboard behavior"
```

---

## Post-Implementation Checklist

Before considering this done:

- [ ] `pnpm build` completes with no errors
- [ ] AI chat responds correctly in production build (test with `pnpm start`)
- [ ] All 4 suggestion buttons work
- [ ] Rate limiting returns 429 after 10 requests from same IP
- [ ] All external links open in new tab
- [ ] Memoji displays correctly at `/memoji.jpg`
- [ ] `ANTHROPIC_API_KEY` is set in Vercel environment variables (when deploying)
- [ ] Mobile bottom nav is hidden on `md:` and above
- [ ] Desktop nav is hidden on mobile (below `md:`)
