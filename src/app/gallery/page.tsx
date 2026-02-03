
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function GalleryPage() {
  const [filter, setFilter] = useState('All');

  const galleryItems = [
    { id: 'hero-beach', category: 'Beach', title: 'Pristine Diani Shore' },
    { id: 'luxury-suite', category: 'Rooms', title: 'Ocean Deluxe Suite' },
    { id: 'infinity-pool', category: 'Resort', title: 'Infinity Horizon Pool' },
    { id: 'dining-seafood', category: 'Dining', title: 'Coastal Gourmet' },
    { id: 'experience-snorkeling', category: 'Experiences', title: 'Marine Life' },
    { id: 'experience-safari', category: 'Experiences', title: 'Wild Safari' },
    { id: 'hotel-exterior', category: 'Resort', title: 'Swahili Architecture' },
    { id: 'swahili-breakfast', category: 'Dining', title: 'Morning Flavors' },
    { id: 'yoga-deck', category: 'Wellness', title: 'Zen Sunrise' },
  ];

  const categories = ['All', 'Rooms', 'Dining', 'Experiences', 'Resort'];

  const filteredItems = filter === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter || (filter === 'Resort' && (item.category === 'Beach' || item.category === 'Resort' || item.category === 'Wellness')));

  const heroImage = PlaceHolderImages.find(img => img.id === 'hotel-exterior');

  return (
    <div className="min-h-screen bg-background">
      {/* Cinematic Hero Header */}
      <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt="Gallery Hero"
            fill
            className="object-cover"
            priority
            data-ai-hint="coastal architecture"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-background" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <Badge className="mb-6 bg-secondary text-white border-none px-6 py-2 uppercase tracking-widest font-bold text-sm">
            Visual Journey
          </Badge>
          <h1 className="text-5xl md:text-7xl font-headline font-bold mb-6 drop-shadow-2xl">
            Our <span className="text-secondary italic">Coastal Sanctuary</span>
          </h1>
          <p className="text-xl md:text-2xl opacity-90 leading-relaxed max-w-2xl mx-auto font-body drop-shadow-lg">
            A glimpse into the magic of Coastal Sands. From golden sunrises to the intricate details of our Swahili-inspired architecture.
          </p>
        </div>
      </section>

      {/* Filter Controls */}
      <section className="py-16 px-6 relative z-20 -mt-10">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl p-4 rounded-full shadow-2xl border border-white/50 flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={filter === cat ? "default" : "ghost"}
              onClick={() => setFilter(cat)}
              className={cn(
                "rounded-full px-8 transition-all duration-300 font-bold",
                filter === cat ? "bg-primary text-white shadow-lg scale-105" : "text-primary hover:bg-primary/5"
              )}
            >
              {cat}
            </Button>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredItems.map((item) => {
            const imageData = PlaceHolderImages.find(img => img.id === item.id);
            if (!imageData) return null;

            return (
              <div 
                key={item.id} 
                className="group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-muted shadow-2xl transition-all duration-500 hover:-translate-y-3"
              >
                <Image
                  src={imageData.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  data-ai-hint={imageData.imageHint}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Content */}
                <div className="absolute inset-0 p-10 flex flex-col justify-end translate-y-12 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                  <Badge className="w-fit mb-4 bg-secondary text-white border-none px-4 py-1">
                    {item.category}
                  </Badge>
                  <h3 className="text-3xl font-headline font-bold text-white mb-2">{item.title}</h3>
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <Camera className="h-4 w-4" />
                    <span className="tracking-wide">Coastal Sands Exclusive</span>
                  </div>
                </div>

                {/* Corner Icon */}
                <div className="absolute top-8 right-8 p-4 bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100">
                  <Maximize2 className="h-6 w-6" />
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="text-center py-32">
            <p className="text-muted-foreground text-xl font-headline italic">No images found for this category.</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-primary text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full -mr-48 -mt-48 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48 blur-3xl" />
        
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-6xl font-headline font-bold mb-8">Ready to see it in person?</h2>
          <p className="text-xl md:text-2xl opacity-80 mb-12 font-body leading-relaxed">
            Experience the unfiltered beauty of Diani Beach from our luxury retreat. Your oasis is waiting for you.
          </p>
          <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white px-12 h-16 text-xl rounded-full shadow-2xl transition-transform hover:scale-105 active:scale-95">
            Check Availability
          </Button>
        </div>
      </section>
    </div>
  );
}
