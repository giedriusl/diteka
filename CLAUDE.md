# CLAUDE.md

Diteka — landing page for an AI consulting business. Helps clients adopt AI without stress.

## Commands

```bash
pnpm dev          # start dev server
pnpm build        # production build
pnpm typecheck    # TypeScript check
pnpm lint         # ESLint
```

## Stack

- **Next.js 16** (App Router) — single-app, no monorepo
- **Tailwind CSS v4** + **shadcn/ui** — styling and primitives
- **TypeScript** — strict mode

## Structure

```
src/
├── app/                  # Next.js App Router (page.tsx, layout.tsx, globals.css)
├── components/
│   ├── hero/             # Hero section components
│   ├── sections/         # Landing page sections (HowItWorks, Services, Testimonials, CTA)
│   ├── layout/           # SiteHeader, SiteFooter
│   └── ui/               # shadcn/ui primitives
├── hooks/                # Custom React hooks
├── lib/                  # Utilities (utils.ts from shadcn)
└── styles/               # Additional CSS (design tokens, typography)
```

## UI Components

UI styling and components come from v0. When the user provides v0 output:
1. Drop the component into the appropriate directory under `src/components/`
2. Update the section file (e.g. `HeroSection.tsx`) to use the new component
3. Run `pnpm typecheck` and `pnpm build` to verify

## Content Language

Copy is in Lithuanian (lt). Keep all user-facing strings in Lithuanian.
