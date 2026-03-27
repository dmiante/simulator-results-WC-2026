import { WorldCupSimulator } from "@/features/simulator/components/world-cup-simulator"

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "FIFA World Cup 2026 Simulator",
  url: "https://wcsimulator2026.vercel.app",
  description:
    "Predict match results and simulate the FIFA World Cup 2026 tournament with 48 teams across group stages and knockout rounds.",
  applicationCategory: "SportsApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WorldCupSimulator />
    </main>
  )
}
