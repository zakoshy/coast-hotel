
"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from '@/lib/utils';

const HeroCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // We ensure the leading image is the most cinematic one
  const heroImages = [
    PlaceHolderImages.find(img => img.id === 'hero-beach'),
    PlaceHolderImages.find(img => img.id === 'infinity-pool'),
    PlaceHolderImages.find(img => img.id === 'hotel-exterior'),
    PlaceHolderImages.find(img => img.id === 'luxury-suite'),
  ].filter(Boolean);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;

    api.on("select", onSelect);
    
    // Auto-play logic with a smooth duration
    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 6000);

    return () => {
      api.off("select", onSelect);
      clearInterval(intervalId);
    };
  }, [api, onSelect]);

  return (
    <div className="absolute inset-0 w-full h-full">
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
          duration: 40,
        }}
        className="w-full h-full"
      >
        <CarouselContent className="h-[90vh] ml-0">
          {heroImages.map((image, index) => (
            <CarouselItem key={index} className="pl-0 relative h-full w-full">
              {image && (
                <Image
                  src={image.imageUrl}
                  alt={image.description}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  data-ai-hint={image.imageHint}
                />
              )}
              {/* Sophisticated gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Modern Slide Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-2 transition-all duration-500 rounded-full",
              current === index ? "w-10 bg-secondary" : "w-3 bg-white/40 hover:bg-white/60"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
