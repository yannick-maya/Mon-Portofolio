"use client";

import { useState } from "react";
import Image from "next/image";

type ImagePlaceholderProps = {
  src: string | null;
  alt: string;
  className?: string;
};

export function ImagePlaceholder({
  src,
  alt,
  className,
}: ImagePlaceholderProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const isLoaded = src !== null && loadedSrc === src;

  return (
    <div
      className={["image-frame", isLoaded ? "image-frame--loaded" : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      {src ? (
        <Image
          alt={alt}
          className="image-frame__image"
          fill
          onError={() => setLoadedSrc(null)}
          onLoad={() => setLoadedSrc(src)}
          sizes="(max-width: 768px) 100vw, 50vw"
          src={src}
        />
      ) : null}
      <div
        aria-hidden={isLoaded}
        className="image-placeholder"
        role={isLoaded ? undefined : "img"}
        aria-label={isLoaded ? undefined : alt}
      >
        <svg aria-hidden="true" viewBox="0 0 480 300" fill="none">
          <path d="M-30 215c79-94 145-94 224 0s145 94 224 0 145-94 224 0" />
          <path d="M-30 185c79-94 145-94 224 0s145 94 224 0 145-94 224 0" />
          <path d="M-30 155c79-94 145-94 224 0s145 94 224 0 145-94 224 0" />
          <path d="M-30 125c79-94 145-94 224 0s145 94 224 0 145-94 224 0" />
          <circle cx="240" cy="150" r="5" />
        </svg>
        <span>{alt}</span>
      </div>
    </div>
  );
}
