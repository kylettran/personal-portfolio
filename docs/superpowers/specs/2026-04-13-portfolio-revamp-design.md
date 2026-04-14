# Portfolio Revamp Design Spec
**Date:** 2026-04-13
**Project:** Kyle Tran — Personal Portfolio
**Reference:** https://www.pszostak.pl/

---

## Overview

A full rebuild of kyletran.com as a single-page scroll site that positions Kyle as a **Founder, Builder, and Innovator** — with Lynx Combinator as the centerpiece. The design uses pszostak.pl as a structural blueprint but is distinctly Kyle: pure black/zinc minimal aesthetic, mobile-first from the ground up, and powered by Claude AI (fitting since Claude is Kyle's primary tool).

**Core identity statement:**
> "Founder. Builder. Shaping the next generation of AI creators."

---

## Architecture

### Stack
- **Keep:** Next.js App Router, Tailwind CSS, TypeScript
- **Add:** Anthropic SDK (AI chat), Framer Motion (animations)
- **Remove:** ContentLayer (replace with static TypeScript data files)
- **Remove:** Upstash Redis (view count tracking — unnecessary complexity)
- **Remove:** particles.tsx (replaced with intentional minimal aesthetic)

### Page Structure
Single `app/page.tsx` with 6 anchor sections:
```
#hero → #about → #projects → #skills → #more → footer
```

No sub-routes for the main experience. Existing `/projects/[slug]` detail pages can be preserved for deep links but are not linked from the main nav.

### Project Data
Replace ContentLayer MDX with a static `lib/projects.ts` TypeScript file exporting a typed array of project objects. Simpler, faster, no build step dependency.

---

## Navigation

### Desktop (sticky top)
- Left: `KT` logo (links to `#hero`)
- Center: `About` · `Projects` · `Skills` · `More`
- Right: `Let's Connect` CTA button (links to `#more`)
- Background: transparent → `zinc-900/80` backdrop-blur on scroll

### Mobile (floating bottom tab bar)
A fixed bottom bar pinned above the thumb zone — native app pattern, superior to hamburger menus on mobile.
- 4 tabs: Home · Projects · Skills · Connect
- Each tab: icon + label, `48px` tap target minimum
- Active state: white icon, inactive: zinc-500
- Background: `zinc-900/90` with `backdrop-blur`, `border-t border-zinc-800`

---

## Section 1: Hero

**Goal:** Immediately communicate who Kyle is and invite interaction.

### Layout
- Full viewport height (`100dvh`) — uses `dvh` not `vh` to handle mobile browser chrome correctly
- Background: pure black (`#000`) with very subtle CSS noise texture overlay
- No particles, no gradient blobs — intentional restraint

### Content (mobile-first, vertically centered)
```
        [Bitmoji avatar]     <- Kyle's personal Bitmoji, ~80px, centered above name
Hi, I'm
Kyle Tran                    <- white, animated fade-in, large

Founder. Builder. Shaping    <- zinc-400, smaller, fade-in delay
the next generation of
AI creators.

+----------------------------------+
|  Ask me anything about Kyle...   |
|                          [send]  |
+----------------------------------+

[ Lynx Combinator ] [ Kyle's story     ]
[ What has Kyle built? ] [ Let's connect ]

v scroll to explore
```

### Mobile UX Rules
- Bitmoji: `80px` on mobile, `96px` on desktop, displayed with `next/image`, no border/frame — floats clean above the name
- Name scales: `text-5xl` mobile → `text-8xl` desktop
- Chat input: full-width, `52px` height, `16px` font (prevents iOS auto-zoom on focus)
- Send button: `48px` min tap target
- Suggestion buttons: full-width pills, `48px` height, stacked 2x2 grid on mobile, single row on desktop
- When keyboard opens: layout scrolls naturally, chat input stays visible — no fixed positioning that breaks with keyboard
- Scroll indicator: subtle animated chevron, `zinc-600`

### AI Chat (Claude-powered)
- **Transport:** Next.js Server Action — Anthropic API key never sent to client
- **Model:** `claude-haiku-4-5-20251001` (fast, cost-efficient, ideal for chat)
- **Streaming:** Yes — responses stream token by token for perceived speed
- **System prompt context:** Full bio including mission, projects, background, contact info (see Appendix A)
- **Suggested buttons:** "Lynx Combinator" · "Kyle's story" · "What has Kyle built?" · "Let's connect"
- **Off-topic handling:** For questions outside the knowledge base, AI directs the user to reach out to Kyle directly via email, LinkedIn, or X DM
- **Personality:** Casual, all lowercase, like texting a friend. Never over-explains. Max 3-4 sentences always. Feels unique and personal — not like a corporate chatbot

### Security
- **Rate limiting:** 10 requests per IP per minute via Next.js middleware
- **Input validation:** Max 500 characters, stripped of any markup server-side before reaching the API
- **Prompt injection protection:** System prompt is server-side only. User message is passed as a separate `user` turn — never interpolated into the system prompt string
- **API key isolation:** Anthropic key in `.env.local` only, called via server action, never returned to the client
- **Timeout:** 10 second streaming timeout, aborts and returns a fallback message
- **Output rendering:** AI responses rendered as plain text strings only — no HTML parsing or raw HTML injection

---

## Section 2: About / Bento Grid

**Goal:** Give personality and context at a glance. Tap-to-expand on mobile instead of hover.

### Desktop Layout
Asymmetric bento grid (CSS Grid):
```
+----------------+------------+------------+
|                | Lynx       | Ikigai     |
|  Identity      | Combinator | App        |
|  (tall)        +------------+------------+
|                | Chess / Tennis / Tech   |
+----------------+-------------------------+
| Location       |                         |
+----------------+-------------------------+
```

### Mobile Layout
Full-width cards stacked vertically. Each card:
- Collapsed height: `~180px` — shows title and teaser text
- Expanded height: auto — full content revealed
- Tap anywhere on card to toggle expand/collapse
- Framer Motion `AnimatePresence` for smooth spring expand/collapse
- Visual cue: subtle chevron in bottom-right corner

### Card Specifications

**1. Identity Card**
- Content: "KYLE TRAN" (large, display font) + "AI-Native Founder & Builder" + "Irvine, CA · PST"
- Style: Slightly larger than other cards, always fully visible — no expand needed

**2. Lynx Combinator Card**
- Teaser: "Building the biggest youth incubator in existence"
- Expanded: SoCal's #1 youth AI program, 6-week bootcamp, students ship 3 AI products
- Link: Lynx Combinator site (opens in new tab)

**3. Ikigai App Card**
- Teaser: "Find your passion in life"
- Expanded: Passion project helping people discover their ikigai — currently in development
- Badge: `In Development` pill (zinc-700 bg, zinc-300 text)

**4. Chess · Tennis · Technology Card**
- Content: Three obsessions displayed with icons
- Chess · Tennis · Technology
- Subtext: "The three things I think about constantly"
- No expand needed — compact and self-contained

**5. Location Card**
- Content: "Irvine, California" + "33.6846° N, 117.8265° W" + "GMT-7 · PST"
- Background: Subtle dark map SVG or static image (no third-party map API needed)
- Text overlaid with slight backdrop blur for legibility

### Card Styling (all cards)
- Background: `zinc-900`
- Border: `1px solid zinc-800`
- Border radius: `rounded-2xl` (16px)
- Padding: `24px`
- No box shadows
- Hover (desktop only): border transitions to `zinc-700`

---

## Section 3: Featured Projects

**Goal:** Show the work clearly. Numbered like pszostak.pl. Mobile-first stacked layout.

### Structure
```
Portfolio
Featured Projects

01 · Youth AI Program
[Lynx Combinator card]

02 · In Development
[Ikigai App card]

03 · Interactive Experience
[Brain Project card]

04 · Design & Dev
[Personal Portfolio card]

[Explore all on GitHub ->]
```

### Project Card (mobile)
Stacked vertically, full-width:
```
+-----------------------------------+
| 01              Youth AI Program  |
|                                   |
| Lynx Combinator           [visit] |
|                                   |
| Building the biggest youth        |
| incubator in existence.           |
|                                   |
| [screenshot / logo]               |
|                                   |
| [AI] [Education] [Founders]       |
+-----------------------------------+
```

### Project Card (desktop)
Alternating left/right image layout:
- Odd (01, 03): text left, image right
- Even (02, 04): image left, text right

### Project Data (`lib/projects.ts`)
```typescript
export const projects = [
  {
    slug: 'lynx-combinator',
    number: '01',
    type: 'Youth AI Program',
    title: 'Lynx Combinator',
    description: "Building the biggest youth incubator in existence. A 6-week bootcamp that turns young leaders into AI builders — every student ships 3 real AI products.",
    url: 'https://ls-portfolio-page.vercel.app/',
    github: null,
    image: '/lynx-hero.png',
    tags: ['AI', 'Education', 'Founders'],
    status: 'live' as const,
  },
  {
    slug: 'ikigai-app',
    number: '02',
    type: 'In Development',
    title: 'Ikigai App',
    description: "A passion project that helps you find your passion in life — built around the Japanese concept of ikigai.",
    url: null,
    github: null,
    image: null,
    tags: ['Mobile', 'Wellness', 'AI'],
    status: 'in-development' as const,
  },
  {
    slug: 'brain-project',
    number: '03',
    type: 'Interactive Experience',
    title: 'Brain Project',
    description: "A living neural sculpture that shifts from silhouette to synaptic pathways. An interactive 3D experience.",
    url: null,
    github: null,
    image: '/planetfall.png',
    tags: ['3D', 'Interactive', 'Creative'],
    status: 'live' as const,
  },
  {
    slug: 'personal-portfolio',
    number: '04',
    type: 'Design & Dev',
    title: 'Personal Portfolio',
    description: "This site — designed and built with Claude, Next.js, and Tailwind. Mobile-first from the ground up.",
    url: 'https://kyletran.com',
    github: 'https://github.com/kylettran/personal-portfolio',
    image: null,
    tags: ['Next.js', 'Tailwind', 'Claude'],
    status: 'live' as const,
  },
];
```

---

## Section 4: Skills / Tools

**Goal:** Show Kyle's AI-native toolkit. Larger cards than typical icon grids since these are apps, not programming languages.

### Layout
- Desktop: 4×2 grid (7 tools — last row has 3 centered)
- Mobile: 2×4 grid

### Tools
| Tool | One-line description |
|------|---------------------|
| Claude | Primary AI model for building and thinking |
| Claude Code | Agentic coding in the terminal |
| Claude Cowork | Collaborative AI workspace |
| Codex | Code generation and automation |
| Figma | Design and prototyping |
| VS Code | Code editor |
| Cursor | AI-native IDE |

### Card Design
Each card: logo/icon + tool name + one-line usage description.
- Tap/click: subtle scale animation (Framer Motion)
- Consistent `zinc-900` card style with `zinc-800` border

---

## Section 5: More to Explore

**Goal:** Drive traffic to key destinations. 3 clean, tappable cards.

### Cards
1. **Lynx Combinator** — "SoCal's #1 youth AI incubator" → https://ls-portfolio-page.vercel.app/
2. **LinkedIn** — "Connect with me" → linkedin.com/in/kyletran01
3. **GitHub** — "See what I'm building" → github.com/kylettran

### Layout
- Desktop: 3 columns side-by-side
- Mobile: Stacked full-width
- Full card is tappable (not just the arrow link)
- All open in new tab (`target="_blank"` with `rel="noopener noreferrer"`)

---

## Footer

```
KT  ·  © 2026 Kyle Tran
Built with Claude & Next.js
[GitHub]  [LinkedIn]  [X]
```

- "Built with Claude & Next.js" — intentional and authentic since Claude is Kyle's primary tool
- Social links: GitHub (github.com/kylettran), LinkedIn (linkedin.com/in/kyletran01), X (@kyle_trxn)
- Text: `zinc-500`, small
- No heavy divider — bleeds naturally from the More section

---

## Mobile-First Design Rules (global)

Applied across every section without exception:

1. **Min tap target: 48×48px** on all interactive elements
2. **Font size min 16px on all inputs** — prevents iOS auto-zoom on focus
3. **Use `100dvh`** not `100vh` — accounts for mobile browser chrome correctly
4. **No hover-only interactions** — every hover state has a tap equivalent
5. **Touch-friendly spacing** — minimum 8px between adjacent tap targets
6. **Scroll performance** — Intersection Observer for reveal animations, no scroll listeners
7. **No horizontal overflow** — all sections constrained to viewport width, `overflow-x: hidden` on body
8. **Keyboard handling** — chat input layout is robust when software keyboard appears
9. **Responsive images** — `next/image` with proper `sizes` prop for bandwidth-appropriate loading
10. **Reduced motion** — `prefers-reduced-motion` respected, animations disabled for users who need it

---

## Color & Typography

### Colors
- Background: `#000000` (pure black)
- Surface: `zinc-900` (#18181b)
- Border: `zinc-800` (#27272a)
- Border hover: `zinc-700` (#3f3f46)
- Text primary: `white`
- Text secondary: `zinc-400` (#a1a1aa)
- Text muted: `zinc-500` (#71717a)
- Accent: `white` only — no color accent, restraint is the aesthetic

### Typography
- Display (name, headings): CalSans SemiBold (already in `/public/fonts/`)
- Body: Inter (already configured in `layout.tsx`)
- Labels/numbers: `font-mono` for numbered project labels (01, 02...)

### Animations (Framer Motion)
- Scroll reveal: `opacity: 0 → 1`, `y: 20 → 0`, `duration: 0.5s`
- Card expand: spring physics, `stiffness: 300`, `damping: 30`
- Chat streaming: token-by-token, renders naturally
- `prefers-reduced-motion`: all Framer Motion animations disabled via `useReducedMotion()`

---

## Appendix A: AI Chat System Prompt

```
you are kyle's personal ai on his portfolio site. you talk like a friend — all lowercase, casual, 
never stiff. keep every response to 3-4 sentences max. never over-explain.

about kyle:
- kyle tran is a founder, builder, and innovator based in irvine, california (pst)
- he founded lynx combinator — building the biggest youth incubator in existence.
  socal's #1 youth ai program: a 6-week bootcamp turning young leaders into ai builders.
  every student ships 3 real ai products ready for their portfolio.
- what drives kyle: the success of others and seeing great inventions hit the market.
  he wants to be a pioneer who revived the culture around building something real with real people.
- he's building the ikigai app — a passion project that helps people find their passion in life. 
  currently in development.
- his three obsessions: chess, tennis, and technology.
- his toolkit: claude, claude code, claude cowork, codex, figma, vs code, cursor — ai-native all the way.
- connect with kyle: linkedin (linkedin.com/in/kyletran01), github (github.com/kylettran), 
  x (@kyle_trxn), email: kyle7tran@gmail.com

rules:
- always respond in all lowercase
- max 3-4 sentences. no exceptions. never over-explain.
- be casual and warm — like a friend who knows kyle well
- only answer questions about kyle, his work, projects, and how to reach him
- if someone asks something you don't know or is outside this knowledge base, say something like:
  "honestly not sure about that one — best to reach out to kyle directly. 
   you can dm him on x (@kyle_trxn), hit him on linkedin, or shoot him an email."
- never make up information not listed above
- never sound like a corporate chatbot
```

---

## Out of Scope (v1)

- Blog / writing section
- Guestbook
- Achievements page
- Dark/light mode toggle
- CMS integration
- View count analytics
