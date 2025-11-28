'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

type AppImageProps = Omit<ImageProps, 'src' | 'alt'> & {
  src: string;
  alt: string;
  fallbackSrc?: string;
};

export default function AppImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  fill = false,
  sizes = '100vw',
  fallbackSrc = '/assets/images/no_image.png',
  onClick,
  ...props
}: AppImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const isExternal =
    imageSrc?.startsWith('http://') || imageSrc?.startsWith('https://');

  const handleError = () => {
    if (!hasError && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setHasError(true);
    }
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const commonClassName = `
      ${className} 
      ${isLoading ? 'animate-pulse bg-gray-200' : ''} 
      ${onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}
    `.trim();

  // --------------------------------------------
  // 🔹 CASE 1: External image → use <img> fallback
  // --------------------------------------------
  if (isExternal) {
    return (
      <img
        src={imageSrc}
        alt={alt}
        width={typeof width === 'number' ? width : undefined}
        height={typeof height === 'number' ? height : undefined}
        className={commonClassName}
        onError={handleError}
        onLoad={handleLoad}
        onClick={onClick as any}
      />
    );
  }

  // --------------------------------------------
  // 🔹 CASE 2: Local image → use Next.js <Image>
  // --------------------------------------------
  const nextImageProps: ImageProps = {
    src: imageSrc,
    alt,
    className: commonClassName,
    priority,
    quality,
    placeholder, // ✔️ TS safe: only "blur" | "empty"
    blurDataURL,
    onError: handleError,
    onLoadingComplete: handleLoad,
    onClick,
    unoptimized: true,
    ...props,
  };

  if (fill) {
    return (
      <div className={`relative ${className}`}>
        <Image {...nextImageProps} fill sizes={sizes} style={{ objectFit: 'cover' }} />
      </div>
    );
  }

  return (
    <Image
      {...nextImageProps}
      width={typeof width === 'number' ? width : 400}
      height={typeof height === 'number' ? height : 300}
    />
  );
}
