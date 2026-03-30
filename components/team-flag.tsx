"use client"

import Image from "next/image"
import { useState } from "react"

export function TeamFlag({ code, name, width = 30, widthImg = 40 }: { code: string; name: string; width?: number; widthImg?: number }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div style={{ position: "relative", width: `${width}px`, height: `${width * 0.67}px` }}>
        <Image
          src={`/fifa_flag.svg`}
          alt={name}
          fill
          style={{ objectFit: "contain" }}
          unoptimized
        />
      </div>
    )
  }

  return (
    <div style={{ position: "relative", width: `${width}px`, height: `${width * 0.67}px` }}>
      <Image
        src={`https://flagcdn.com/w${widthImg}/${code.toLowerCase()}.png`}
        alt={name}
        fill
        style={{ objectFit: "contain" }}
        onError={() => setError(true)}
        unoptimized
      />
    </div>
  )
}
