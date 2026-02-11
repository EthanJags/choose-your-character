"use client";

import Image from "next/image";

type PolaroidProps = {
  image: string;
  title: string;
  description: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function Polaroid({
  image,
  title,
  description,
  className = "",
  style,
}: PolaroidProps) {
  return (
    <div
      className={`bg-white p-4 pb-12 shadow-lg ${className}`}
      style={style}
    >
      <Image
        src={image}
        alt={title}
        width={300}
        height={300}
        className="w-full h-auto block"
      />
      <h3 className="mt-4 font-bold text-lg text-center">{title}</h3>
      <p className="mt-1 text-sm text-center text-gray-600">{description}</p>
    </div>
  );
}
