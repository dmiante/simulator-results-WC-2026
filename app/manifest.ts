import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FIFA World Cup 2026 Simulator",
    short_name: "WC2026 Sim",
    description:
      "Predict match results and simulate the FIFA World Cup 2026 tournament with 48 teams across group stages and knockout rounds.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3b82f6",
    icons: [
      {
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/logo.png",
        sizes: "1254x1254",
        type: "image/png",
      },
    ],
  }
}
