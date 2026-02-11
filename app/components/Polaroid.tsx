"use client";

import Image from "next/image";

type PolaroidProps = {
  image: string;
  title: string;
  description: string;
  titleFontSize?: string;
  descriptionFontSize?: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function Polaroid({ image, title, description, className, style }: PolaroidProps) {
  return (
    <div className={`z-10 h-[490px] w-[437px] bg-white p-4 shadow-[0_28px_60px_rgba(0,0,0,0.35)] ${className ?? ""}`} style={style}>
      <div className="relative aspect-613/540 w-full overflow-hidden bg-neutral-100">
        <Image src={image} alt={title} fill className="object-cover" sizes="340px" />
      </div>

      <div className="mt-5">
        <h1 className="-mb-1 uppercase leading-none tracking-tight text-black" style={{ fontSize: "42px" }}>{title}</h1>
        <p className="font-londrina-solid font-semibold text-black" style={{ fontSize: "17px" }}>{description}</p>
      </div>
    </div>
  );
}
