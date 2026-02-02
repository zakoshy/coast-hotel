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

  const heroImages = [
    PlaceHolderImages.find(img => img.id === 'hero-beach'),
    PlaceHolderImages.find(img => img.id === 'infinity-pool'),
    PlaceHolderImages.find(img => img.id === 'luxury-suite'),
    PlaceHolderImages.find(img => img.id === 'hotel-exterior'),
  ].filter(Boolean);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;

    api.on("select", onSelect);
    
    // Auto-play logic
    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 5000);

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
          duration: 50,
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
              {/* Overlay for text readability */}
              <div className="absolute inset-0 bg-black/30" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Slide Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-1.5 transition-all duration-300 rounded-full",
              current === index ? "w-8 bg-secondary" : "w-2 bg-white/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
