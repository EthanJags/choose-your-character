"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type PolaroidProps = {
  image: string;
  title: string;
  photoAspectRatio?: `${number} / ${number}`;
  className?: string;
  style?: React.CSSProperties;
};

export default function Polaroid({
  image,
  title,
  photoAspectRatio = "613 / 540",
  className,
  style,
}: PolaroidProps) {
  const [resolvedAspectRatio, setResolvedAspectRatio] = useState(photoAspectRatio);

  useEffect(() => {
    setResolvedAspectRatio(photoAspectRatio);
  }, [image, photoAspectRatio]);

  return (
    <div className={`z-10 w-109.25 bg-white p-4 shadow-[0_28px_60px_rgba(0,0,0,0.35)] ${className ?? ""}`} style={style}>
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: resolvedAspectRatio }}>
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="340px"
          onLoad={(event) => {
            const { naturalWidth, naturalHeight } = event.currentTarget;
            if (naturalWidth > 0 && naturalHeight > 0) {
              setResolvedAspectRatio(`${naturalWidth} / ${naturalHeight}`);
            }
          }}
        />
      </div>
    </div>
  );
}
