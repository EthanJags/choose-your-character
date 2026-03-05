"use client";

import Image from "next/image";
import { characters } from "@/app/data/content";

export default function EthanPreloader() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: -9999,
        width: 1,
        height: 1,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {characters.map((c) => (
        <span key={c.id} style={{ display: "contents" }}>
          <Image src={c.image} alt="" width={431} height={721} priority />
          <Image src={c.banner} alt="" width={431} height={721} priority />
          <Image src={c.titleImage} alt="" width={431} height={721} priority />
        </span>
      ))}
    </div>
  );
}
