
"use client";

import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Waves, Coffee, Bath, Wind, Tv, Wifi, Utensils, Zap } from 'lucide-react';
import BookingForm from '@/components/booking/BookingForm';
import { cn } from '@/lib/utils';

export default function RoomsPage() {
  const rooms = [
    {
      id: 'ocean-deluxe',
      name: "Ocean Deluxe Room",
      desc: "Elegantly appointed room featuring local Swahili accents and a private balcony overlooking the turquoise waters of the Indian Ocean.",
      price: 250,
      size: "45 sqm",
      amenities: ["Ocean View", "King Bed", "Rain Shower", "Mini Bar"],
      image: PlaceHolderImages.find(i => i.id === 'luxury-suite')
    },
    {
      id: 'junior-suite',
      name: "Junior Garden Suite",
      desc: "A spacious suite offering a perfect blend of comfort and style, with a private garden terrace and cozy reading nook.",
      price: 350,
      size: "65 sqm",
      amenities: ["Garden View", "Lounge Area", "Soaking Tub", "Espresso Machine"],
      image: PlaceHolderImages.find(i => i.id === 'swahili-breakfast')
    },
    {
      id: 'swahili-villa',
      name: "Swahili Garden Villa",
      desc: "A standalone sanctuary surrounded by lush tropical gardens. Perfect for couples seeking privacy and direct garden access.",
      price: 450,
      size: "85 sqm",
      amenities: ["Garden View", "Private Terrace", "Outdoor Shower", "Kitchenette"],
      image: PlaceHolderImages.find(i => i.id === 'hotel-exterior')
    },
    {
      id: 'family-ocean',
      name: "Family Ocean Suite",
      desc: "Designed for families, this two-bedroom suite features separate living spaces and a large balcony for shared sunset moments.",
      price: 650,
      size: "120 sqm",
      amenities: ["2 Bedrooms", "Ocean View", "Dining Area", "Family Service"],
      image: PlaceHolderImages.find(i => i.id === 'hero-beach')
    },
    {
      id: 'presidential',
      name: "Grand Presidential Suite",
      desc: "Our most exclusive accommodation featuring a sprawling living area, private infinity plunge pool, and panoramic 270-degree ocean views.",
      price: 850,
      size: "180 sqm",
      amenities: ["Infinity Pool", "Butler Service", "Gourmet Kitchen", "Private Entrance"],
      image: PlaceHolderImages.find(i => i.id === 'infinity-pool')
    }
  ];

  return (
    <div className="bg-background min-h-screen">
      <section className="pt-32 pb-20 px-6 text-center bg-primary/5">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-secondary text-white border-none px-6 py-2 uppercase tracking-widest font-bold text-sm">
            Your Private Sanctuary
          </Badge>
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary mb-6">Refined Coastal Living</h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Every room at Coastal Sands Retreat is a blend of Swahili soul and contemporary comfort, designed to be your private sanctuary by the sea.
          </p>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="space-y-32">
          {rooms.map((room, idx) => (
            <div key={room.id} className={cn(
              "flex flex-col gap-16 items-center",
              idx % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
            )}>
              <div className="w-full lg:w-3/5 relative aspect-[16/10] rounded-[3rem] overflow-hidden shadow-2xl group">
                {room.image && (
                  <Image
                    src={room.image.imageUrl}
                    alt={room.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    data-ai-hint={room.image.imageHint}
                  />
                )}
                <div className="absolute top-8 left-8">
                  <Badge className="bg-white/95 text-primary font-bold text-2xl px-8 py-3 rounded-2xl shadow-xl backdrop-blur-md">
                    ${room.price} <span className="text-xs opacity-70 font-normal ml-1">/ night</span>
                  </Badge>
                </div>
              </div>
              
              <div className="w-full lg:w-2/5">
                <span className="text-secondary font-bold tracking-widest uppercase mb-4 block">{room.size}</span>
                <h2 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-6 leading-tight">{room.name}</h2>
                <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                  {room.desc}
                </p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-12">
                  {room.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="p-2 bg-secondary/10 rounded-xl text-secondary">
                        {i === 0 ? <Waves className="h-5 w-5" /> : i === 1 ? <Coffee className="h-5 w-5" /> : i === 2 ? <Bath className="h-5 w-5" /> : <Wind className="h-5 w-5" />}
                      </div>
                      <span className="font-bold text-primary/80">{amenity}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="px-10 h-16 text-lg rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold">
                    Reserve Now
                  </Button>
                  <Button variant="outline" size="lg" className="px-10 h-16 text-lg rounded-2xl border-primary/20 text-primary hover:bg-primary/5 font-bold">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="booking" className="py-24 px-6 bg-primary">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-headline font-bold mb-16 text-white leading-tight">Ready to Start Your <br /><span className="text-secondary italic">Vacation?</span></h2>
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl text-foreground">
            <BookingForm layout="vertical" />
          </div>
          <div className="mt-16 grid grid-cols-3 gap-8">
            {[
              { label: "Secure Payment", val: "100%", sub: "Guaranteed" },
              { label: "Support Available", val: "24h", sub: "Concierge" },
              { label: "Cancellation*", val: "Free", sub: "Flexible" }
            ].map((stat, i) => (
              <div key={i} className="text-center text-white">
                <p className="text-4xl md:text-6xl font-headline font-bold text-secondary mb-2">{stat.val}</p>
                <p className="text-sm font-bold uppercase tracking-widest opacity-80">{stat.label}</p>
                <p className="text-xs opacity-60 mt-1">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
