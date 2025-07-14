"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface DynamicProductImageProps {
  query: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

const fallbackImage = 'https://placehold.co/400x400.png';

export function DynamicProductImage({ query, alt, className, width = 400, height = 400 }: DynamicProductImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setImageUrl(fallbackImage);
      return;
    }

    const fetchImage = async () => {
      try {
        const response = await fetch(`/api/pexels?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }
        const data = await response.json();
        setImageUrl(data.imageUrl || fallbackImage);
      } catch (error) {
        console.error(`Pexels fetch error for query "${query}":`, error);
        setImageUrl(fallbackImage);
      }
    };

    fetchImage();
  }, [query]);

  if (!imageUrl) {
    return <Skeleton className={cn("bg-muted", className)} style={{width: `${width}px`, height: `${height}px`}} />;
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={cn("opacity-0 transition-opacity duration-500", className)}
      data-ai-hint={query}
      loading="lazy"
      onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
    />
  );
}
