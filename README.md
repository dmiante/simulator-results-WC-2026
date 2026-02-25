# FIFA World Cup 2026 Simulator

A comprehensive web application to simulate the FIFA World Cup 2026 tournament. Features group stage simulations, knockout bracket generation, and playoff management with real-time standings calculations.

## About

This simulator allows you to:

- **Group Stage Simulation** - Manage all 48 teams across 12 groups with automatic standings calculation
- **Knockout Bracket** - Generate and track the complete knockout stage from Round of 32 to the Final
- **Playoff Management** - Handle third-place playoffs and tiebreaker scenarios
- **Real-time Updates** - See standings and bracket updates as you enter match scores

## Tech Stack

### Core Framework

| Technology | Version | Description |
|------------|---------|-------------|
| [Next.js](https://nextjs.org/) | 16.0.10 | React framework with App Router and RSC |
| [React](https://react.dev/) | 19.2.0 | UI library with latest concurrent features |
| [TypeScript](https://www.typescriptlang.org/) | 5.9.3 | Strict type-safe JavaScript |

### Styling

| Technology | Version | Description |
|------------|---------|-------------|
| [Tailwind CSS](https://tailwindcss.com/) | 4.1.9 | Utility-first CSS framework |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | 3.3.1 | Merge Tailwind classes without conflicts |
| [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate) | 1.0.7 | Animation utilities for Tailwind |
| [tw-animate-css](https://github.com/Wombosvideo/tw-animate-css) | 1.3.3 | CSS animations for Tailwind |

### UI Components

| Technology | Version | Description |
|------------|---------|-------------|
| [shadcn/ui](https://ui.shadcn.com/) | - | Beautifully designed components |
| [Radix UI](https://www.radix-ui.com/) | 1.4.3 | Unstyled, accessible UI primitives |
| [Lucide React](https://lucide.dev/) | 0.454.0 | Beautiful & consistent icons |
| [cmdk](https://cmdk.paco.me/) | 1.0.4 | Command menu component |
| [Sonner](https://sonner.emilkowal.ski/) | 1.7.4 | Toast notifications |
| [Vaul](https://vaul.emilkowal.ski/) | 1.1.2 | Drawer component |

### Forms & Validation

| Technology | Version | Description |
|------------|---------|-------------|
| [React Hook Form](https://react-hook-form.com/) | 7.60.0 | Performant form handling |
| [Zod](https://zod.dev/) | 3.25.76 | TypeScript-first schema validation |
| [@hookform/resolvers](https://github.com/react-hook-form/resolvers) | 3.10.0 | Validation resolvers |

### Data Visualization & UI Enhancements

| Technology | Version | Description |
|------------|---------|-------------|
| [Recharts](https://recharts.org/) | 2.15.4 | Composable charting library |
| [Embla Carousel](https://www.embla-carousel.com/) | 8.5.1 | Lightweight carousel |
| [React Day Picker](https://react-day-picker.js.org/) | 9.8.0 | Date picker component |
| [date-fns](https://date-fns.org/) | 4.1.0 | Date utility library |
| [react-resizable-panels](https://github.com/bvaughn/react-resizable-panels) | 2.1.7 | Resizable panel layouts |

### Theming & Utilities

| Technology | Version | Description |
|------------|---------|-------------|
| [next-themes](https://github.com/pacocoursey/next-themes) | 0.4.6 | Theme management for Next.js |
| [class-variance-authority](https://cva.style/) | 0.7.1 | UI component variants |
| [clsx](https://github.com/lukeed/clsx) | 2.1.1 | Conditional class utility |

### Analytics & Deployment

| Technology | Version | Description |
|------------|---------|-------------|
| [Vercel Analytics](https://vercel.com/analytics) | 1.3.1 | Web analytics |
| [Vercel](https://vercel.com/) | - | Deployment platform |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/simulator-results-WC-2026.git

# Navigate to project directory
cd simulator-results-WC-2026

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Available Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Project Structure

```
app/                    # Next.js App Router (pages, layouts)
components/
  layout/               # Layout components (headers, etc.)
  ui/                   # shadcn/ui components
db/                     # Data layer (tournament-data, matches, playoffs)
features/               # Feature modules
  group-stage/          # Group stage simulation
  knockout-stage/       # Knockout bracket management
  playoffs-stage/       # Playoff handling
  simulator/            # Core simulation logic
lib/                    # Shared utilities and types
public/                 # Static assets
```

## Deployment

The project is deployed on Vercel:

**[Live Demo](https://vercel.com/dmiantes-projects/v0-fifa-world-cup-simulator)**

## License

This project is private and not licensed for public distribution.
