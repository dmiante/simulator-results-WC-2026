import Image from "next/image";
import { useState } from "react";

export function TeamFlag({ code, name, width = 30, height = 30, widthImg = 40 }: { code: string; name: string; width?: number; height?: number; widthImg?: number }) {
  const [error, setError] = useState(false);
  
  if (error) {
    return (
      <Image 
        src={`/fifa_flag.svg`}
        alt={name}
        width={width}
        height={height}
        unoptimized
      />
    )
  }

  return (
      <Image 
        src={`https://flagcdn.com/${`w${widthImg}`}/${code.toLowerCase()}.png`}
        alt={name}
        width={width}
        height={height}
        onError={() => setError(true)}
        unoptimized
      />
  )
}
