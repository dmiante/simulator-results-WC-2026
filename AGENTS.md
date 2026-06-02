# AGENTS.md - AI Agent Guidelines for World Cup 2026 Simulator

## Project Overview

FIFA World Cup 2026 Simulator. Next.js 16 App Router app that lets users enter scores for the 48-team group stage, resolve playoff placeholders, and watch the knockout bracket auto-fill through to the final. All state is client-side and persisted to `localStorage`.

## Tech Stack

- **Framework:** Next.js `16.1.7` (App Router, RSC)
- **Language:** TypeScript `5.9.3` (strict mode)
- **UI:** React `19.2.0`, shadcn/ui (new-york style, baseColor `neutral`, `iconLibrary: lucide`), Radix UI
- **Styling:** Tailwind CSS `4.1.9` via `@tailwindcss/postcss` (no `tailwind.config.*` exists; theme tokens live in `app/globals.css`)
- **Icons:** `lucide-react`
- **Theme:** `next-themes` (wrapper in `components/theme-provider.tsx`)
- **Analytics:** `@vercel/analytics`
- **Package manager:** pnpm
- **Package `name` in `package.json` is `my-v0-project`** — leftover v0.dev scaffolding, do not use as user-facing name.

## Commands

```bash
pnpm dev      # next dev
pnpm build    # next build  (WILL FAIL on TypeScript errors; no ignoreBuildErrors)
pnpm start    # next start
pnpm lint     # eslint .    (no eslint.config.* exists; Next 16 defaults apply)
```

- No `typecheck`, `test`, or `format` script. `pnpm build` is the de-facto typecheck.
- No test framework installed. `pnpm-workspace.yaml` is **not** a monorepo — it only declares `onlyBuiltDependencies: ['@tailwindcss/oxide', 'sharp']`.
- No CI: `.github/` is empty. The `TODO` file at the repo root is a personal Todo+ cheat sheet, not project tasks.

## Architecture

- **Root entrypoint:** `app/page.tsx` is an RSC that renders the client component `<WorldCupSimulator />` from `features/simulator/components/world-cup-simulator.tsx`.
- **Root layout:** `app/layout.tsx` (RSC) loads `Inter` and `Geist Mono` via `next/font/google` (CSS vars `--font-inter`, `--font-geist-mono`) and wraps children in `<ThemeProvider>`.
- **App Router extras in `app/`:** `error.tsx`, `global-error.tsx` (both client), `loading.tsx`, `not-found.tsx`, `opengraph-image.tsx`, `manifest.ts`, `robots.ts`, `sitemap.ts`.
- **Feature tabs** (rendered by `WorldCupSimulator`): `group-stage`, `knockout-stage`, `playoffs-stage`. Each is a self-contained module under `features/`.
- **State:** custom hooks (`features/simulator/hooks/use-tournament.ts`, `features/playoffs-stage/hooks/use-playoffs.ts`) own the state. State is loaded from and persisted to `localStorage` after hydration. Storage keys (do not rename without a migration):
  - `wc2026-group-matches`
  - `wc2026-knockout-matches`
  - `wc2026-playoffs-state`
  - `use-tournament.ts` already does a "migrate stale localStorage data" backfill (see lines ~313-336) — follow that pattern when adding a new persisted field.
- **Static data:** `db/tournament-data.ts` exports `teams`, `groups`, `officialMatches`, `THIRD_PLACE_COMBINATIONS`, `r32Placeholders`. `db/matches.ts` exports `generateGroupMatches` and `calculateStandings`. `db/playoffs-data.ts` exports `uefaPlayoffTeams`, `uefaPlayoffPaths`, `icPlayoffTeams`, `icPlayoffPaths`, `allPlayoffTeams`, `initialPlayoffsState`, and `getPlayoffTeam(id)`.
- **Playoff placeholders:** 6 group-stage slots are TBD — `uefaa`→Group B, `uefab`→Group F, `uefac`→Group D, `uefad`→Group A, `icp1`→Group K, `icp2`→Group I. See `lib/types.ts` `PlayoffSlotId` and `PlayoffWinners`.

## Directory Structure

```
app/                # App Router (RSC by default; mark interactive files "use client")
components/         # Shared components
  layout/           # App-shell pieces (tournament-header)
  ui/               # shadcn/ui primitives (badge, button, card, dropdown-menu, input, tabs)
db/                 # Static tournament data + pure helpers (no React)
features/           # Feature modules (group-stage, knockout-stage, playoffs-stage, simulator)
  <name>/
    components/     # React components, kebab-case
    hooks/          # Custom hooks, use-*.ts
    types/          # Feature-only types in index.ts
    utils/          # Pure helpers
lib/                # Shared types (lib/types.ts) and cn() (lib/utils.ts)
public/             # Static assets
```

- **Path aliases** (from `tsconfig.json` `@/*`): `@/components`, `@/features`, `@/lib`, `@/db`, `@/hooks` (configured in `components.json` but no top-level `hooks/` directory exists — hooks live under `features/<name>/hooks/`).

## Conventions

### File naming
- Components and utils: **kebab-case** (`match-card.tsx`, `third-place-assignment.ts`).
- Hooks: **`use-*.ts`** (`use-tournament.ts`, `use-playoffs.ts`).
- Feature types: `features/<name>/types/index.ts`.

### Exports
- `app/*` files: use `export default` (Next.js requires it for `page`, `layout`, `error`, `loading`, `not-found`, `opengraph-image`).
- Features: prefer `export function` / `export const`. A few feature components use `export default` (`features/knockout-stage/components/zoom-control.tsx`, `features/simulator/components/button-simulator.tsx`) — match the surrounding file.
- `db/*` files use named exports for every symbol.

### React Server / Client boundary
- Mark interactive files with `"use client"` at the very top. Hooks that touch `localStorage`/`window` must be client. Pure helpers and data files stay RSC-compatible (no React imports).

### TypeScript
- `interface` for object shapes, `type` for unions/aliases.
- Avoid `any`. Prefer `unknown` + narrowing.
- Nullable values: `| null` (not `undefined`).
- Shared domain types live in `lib/types.ts` (`Team`, `Match`, `GroupStanding`, `PlayoffWinners`, etc.). Feature-only types go in `features/<name>/types/index.ts`.
- Match scores are `number | null` (`null` = not played). Knockout draws resolve via `match.penaltyWinnerId`; when both scores are equal and `penaltyWinnerId` is missing, the match is unresolved.

### Import order
1. External (`react`, `next`, …)
2. UI primitives (`@/components/ui/...`)
3. Feature (`@/features/...`)
4. Shared (`@/lib/...`, `@/db/...`)
5. Local (`./`, `../`)

### Styling
- Tailwind v4 utility classes with `cn(...)` from `@/lib/utils` for conditional classes.
- Theme tokens / CSS variables are defined in `app/globals.css`. Dark mode is toggled by the `.dark` class via `next-themes`.

### Comments
- Spanish comments are acceptable and present in business-logic sections (FIFA rules, tiebreakers). Keep them.
- No enforced JSDoc, no Prettier config, no EditorConfig in the repo.

## Domain Patterns

### Match score update

When a child updates a match, the parent hook remaps the array and replaces the targeted match immutably. The `team1Score`/`team2Score` slot is `number | null`; clear it with `null`, not `0`.

### Knockout winner

For group/match-up rendering, when scores are equal use `match.penaltyWinnerId` to decide the winner. For the "loser" branch, the loser is whichever team is **not** the penalty winner. Never invent a winner from equal scores without `penaltyWinnerId`.

### Third-place qualification

After group stage, eight third-placed teams are ranked and assigned to knockout slots via `assignThirdPlaceTeams` in `features/simulator/utils/third-place-assignment.ts`, using the official combinations in `THIRD_PLACE_COMBINATIONS` (`db/tournament-data.ts`).

## Common Tasks

### Add a shadcn primitive

```bash
pnpm dlx shadcn@latest add <name>
```

Lands in `components/ui/`. Existing primitives: `badge`, `button`, `card`, `dropdown-menu`, `input`, `tabs`.

### Add a new feature module

1. Create `features/<name>/` with `components/`, `hooks/`, `types/`, `utils/`.
2. Export a top-level component from `components/` and add it as a tab inside `WorldCupSimulator` if it should be a top-level view.
3. Put persistent state in a `use-*.ts` hook and persist under a new `wc2026-…` localStorage key (with a migration if changing an existing key's shape).

### Change tournament data

Edit `db/tournament-data.ts` (`teams`, `groups`, `officialMatches`, `THIRD_PLACE_COMBINATIONS`, `r32Placeholders`) or `db/playoffs-data.ts` (playoff paths/teams). If you add a new match field (e.g., referee), mirror it in `Match` (`lib/types.ts`), `generateGroupMatches` (`db/matches.ts`), and the migration in `use-tournament.ts` so existing localStorage data is backfilled.

### Allow a new external host

`next.config.mjs` ships a strict CSP and a `remotePatterns: [new URL("https://flagcdn.com/")]` for `next/image`. To load a new image host, add it to both the CSP `img-src` and `images.remotePatterns`. The same applies to any new analytics, font, or script origin (CSP `connect-src`, `font-src`, `script-src`).

## Testing

No test runner is installed. If you add one, prefer Vitest + React Testing Library, files adjacent to source as `*.test.ts(x)`, run with `pnpm vitest run <path>`. Do not assume any runner is present today.
