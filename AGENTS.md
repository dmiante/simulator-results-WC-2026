# AGENTS.md - AI Agent Guidelines for World Cup 2026 Simulator

## Project Overview

FIFA World Cup 2026 Simulator - a Next.js 16 web app with React 19, TypeScript, and Tailwind CSS. Features group stage simulation, knockout bracket generation, and playoff management.

## Tech Stack

- **Framework:** Next.js 16.0.10 (App Router with RSC)
- **Language:** TypeScript (strict mode)
- **UI:** React 19.2.0, shadcn/ui (new-york style), Radix UI
- **Styling:** Tailwind CSS 4.1.9, CSS variables
- **Icons:** Lucide React
- **Package Manager:** pnpm

## Build/Lint/Test Commands

```bash
pnpm dev          # Development server
pnpm build        # Production build
pnpm lint         # ESLint (eslint .)
pnpm start        # Start production server
```

### Testing

No test framework configured. When adding tests:
- Use Vitest or Jest with React Testing Library
- Place tests as `*.test.ts(x)` or `*.spec.ts(x)` adjacent to source files
- Run single test: `pnpm vitest run path/to/file.test.ts` (after setup)

### Build Notes

- `next.config.mjs` has `typescript.ignoreBuildErrors: true` - TS errors won't fail builds
- Always run `pnpm lint` before committing

## Directory Structure

```
app/                    # Next.js App Router (pages, layouts)
components/
  layout/               # Layout components (headers, etc.)
  ui/                   # shadcn/ui components
db/                     # Data layer (tournament-data.ts, matches.ts, playoffs-data.ts)
features/               # Feature modules (group-stage, knockout-stage, playoffs-stage, simulator)
lib/                    # Shared utilities (utils.ts) and types (types.ts)
public/                 # Static assets
```

### Feature Module Structure

```
features/{feature-name}/
  components/           # React components
  hooks/                # Custom hooks (use-*.ts)
  types/                # TypeScript interfaces (index.ts)
  utils/                # Utility functions
```

## Code Style Guidelines

### File Naming

- **Components:** kebab-case (`match-card.tsx`, `knockout-bracket.tsx`)
- **Hooks:** `use-{name}.ts` (`use-tournament.ts`)
- **Types:** `index.ts` inside `/types` directories
- **Utilities:** kebab-case (`third-place-assignment.ts`)

### Import Order

1. External libraries (`react`, `next`, etc.)
2. UI components (`@/components/ui/...`)
3. Feature components (`@/features/...`)
4. Shared utilities (`@/lib/...`, `@/db/...`)
5. Local imports (`./`, `../`)

### Path Aliases (tsconfig.json)

- `@/components` - Shared components
- `@/features` - Feature modules
- `@/lib` - Utilities and types
- `@/db` - Data layer
- `@/hooks` - Shared hooks

### Component Patterns

```typescript
"use client"  // Required for client components

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Team } from "@/lib/types"

// Named exports only (no default exports)
export function MyComponent({ team, score }: { team: Team; score: number | null }) {
  // Implementation
}
```

### TypeScript Conventions

- Use `interface` for object shapes, `type` for unions/aliases
- Avoid `any` - use strict typing
- Nullable values: use `| null` (not `undefined`)
- Define shared types in `lib/types.ts`, feature-specific in `features/{name}/types/index.ts`

```typescript
// Scores are number | null (null = not played)
interface Match {
  team1Score: number | null
  team2Score: number | null
  penaltyWinnerId?: string  // For knockout draws
}
```

### Styling with Tailwind

Use `cn()` utility for conditional classes:

```typescript
import { cn } from "@/lib/utils"

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  variant === "primary" && "variant-classes"
)} />
```

- CSS variables for theming (defined in `app/globals.css`)
- Dark mode via `.dark` class (next-themes)

### React Hooks Pattern

```typescript
export function useFeature() {
  const [state, setState] = useState<Type[]>(() => generateInitial())
  
  const computed = useMemo(() => /* expensive calc */, [deps])

  const handleAction = (param: string) => {
    setState(prev => /* transform */)
  }

  return { state, computed, handleAction }
}
```

### Error Handling

- Use optional chaining (`?.`) for nullable access
- Use nullish coalescing (`??`) for defaults
- Return early for invalid states
- Log errors with `console.error()`

```typescript
if (!data || data.length === 0) return null
const value = possiblyNull?.property ?? "default"
```

### Comments

- Comment complex business logic (FIFA rules, tiebreakers)
- Spanish comments acceptable (existing codebase has some)
- JSDoc not required but welcome for public APIs

## Key Patterns

### Match Score Handling

```typescript
const handleScoreChange = (matchId: string, team: "team1" | "team2", score: number | null) => {
  setState(prev => prev.map(m => 
    m.id === matchId 
      ? { ...m, [team === "team1" ? "team1Score" : "team2Score"]: score }
      : m
  ))
}
```

### Knockout Winner Logic

```typescript
// For draws, use penaltyWinnerId
if (match.team1Score === match.team2Score) {
  return match.penaltyWinnerId || ""
}
```

## Common Tasks

### Adding a UI Component

```bash
pnpm dlx shadcn@latest add [component-name]
```

Components added to `components/ui/`. Config in `components.json` (new-york style, neutral base color).

### Adding a New Feature

1. Create `features/{feature-name}/` with `components/`, `hooks/`, `types/`, `utils/`
2. Export main component from `components/`
3. Use custom hook for state management

### Modifying Tournament Data

Data in `/db/`:
- `tournament-data.ts` - Teams, groups, placeholders
- `matches.ts` - Match generation, standings calculation
- `playoffs-data.ts` - Playoff bracket data
