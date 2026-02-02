
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

  return (
    <div className="pt-24 min-h-screen bg-background">
      {/* Header */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 px-4 py-1 bg-secondary/10 text-secondary border-none font-bold">Visual Journey</Badge>
          <h1 className="text-5xl md:text-6xl font-headline font-bold text-primary mb-6">Our Coastal Sanctuary</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            A glimpse into the magic of Coastal Sands. From the golden sunrises to the intricate details of our Swahili-inspired architecture.
          </p>
        </div>
      </section>

      {/* Filter Controls */}
      <section className="pb-12 px-6">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={filter === cat ? "default" : "outline"}
              onClick={() => setFilter(cat)}
              className={cn(
                "rounded-full px-8 transition-all duration-300",
                filter === cat ? "bg-primary text-white shadow-lg scale-105" : "hover:bg-primary/5 border-primary/20"
              )}
            >
              {cat}
            </Button>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => {
            const imageData = PlaceHolderImages.find(img => img.id === item.id);
            if (!imageData) return null;

            return (
              <div 
                key={item.id} 
                className="group relative aspect-square overflow-hidden rounded-[2rem] bg-muted shadow-xl transition-all duration-500 hover:-translate-y-2"
              >
                <Image
                  src={imageData.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  data-ai-hint={imageData.imageHint}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-8 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                  <Badge className="w-fit mb-3 bg-secondary text-white border-none">
                    {item.category}
                  </Badge>
                  <h3 className="text-2xl font-headline font-bold text-white mb-2">{item.title}</h3>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <Camera className="h-4 w-4" />
                    <span>Coastal Sands Photography</span>
                  </div>
                </div>

                {/* Corner Icon */}
                <div className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="h-5 w-5" />
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No images found for this category.</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-primary text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-headline font-bold mb-6">Want to see it in person?</h2>
          <p className="text-xl opacity-80 mb-10">Experience the beauty of Diani Beach from our luxury retreat. Book your oasis today.</p>
          <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white px-10 h-14 text-lg rounded-full">
            Check Availability
          </Button>
        </div>
      </section>
    </div>
  );
}
