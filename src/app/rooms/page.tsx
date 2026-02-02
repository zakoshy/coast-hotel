
import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Waves, Wifi, Wind, Coffee, Tv, Bath } from 'lucide-react';
import BookingForm from '@/components/booking/BookingForm';

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
      id: 'swahili-villa',
      name: "Swahili Garden Villa",
      desc: "A standalone sanctuary surrounded by lush tropical gardens. Perfect for couples seeking privacy and direct garden access.",
      price: 450,
      size: "85 sqm",
      amenities: ["Garden View", "Private Terrace", "Outdoor Shower", "Kitchenette"],
      image: PlaceHolderImages.find(i => i.id === 'hotel-exterior')
    },
    {
      id: 'presidential',
      name: "Grand Presidential Suite",
      desc: "Our most exclusive accommodation featuring a sprawling living area, private infinity plunge pool, and panoramic 270-degree ocean views.",
      price: 850,
      size: "180 sqm",
      amenities: ["Infinity Pool", "2 Bedrooms", "Butler Service", "Gourmet Kitchen"],
      image: PlaceHolderImages.find(i => i.id === 'infinity-pool')
    }
  ];

  return (
    <div className="pt-24 bg-background">
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-headline font-bold text-primary mb-6">Refined Coastal Living</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Every room at Coastal Sands Retreat is a blend of Swahili soul and contemporary comfort, designed to be your private sanctuary by the sea.
          </p>
        </div>
      </section>

      <section className="pb-24 px-6 max-w-7xl mx-auto">
        <div className="space-y-24">
          {rooms.map((room, idx) => (
            <div key={room.id} className={cn(
              "flex flex-col gap-12 items-center",
              idx % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
            )}>
              <div className="w-full lg:w-1/2 relative aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl">
                {room.image && (
                  <Image
                    src={room.image.imageUrl}
                    alt={room.name}
                    fill
                    className="object-cover"
                    data-ai-hint={room.image.imageHint}
                  />
                )}
                <div className="absolute top-6 left-6">
                  <Badge className="bg-white/90 text-primary font-bold text-lg px-6 py-2">
                    ${room.price} <span className="text-xs opacity-70 font-normal">/ night</span>
                  </Badge>
                </div>
              </div>
              
              <div className="w-full lg:w-1/2">
                <h2 className="text-4xl font-headline font-bold text-primary mb-6">{room.name}</h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {room.desc}
                </p>
                <div className="grid grid-cols-2 gap-6 mb-10">
                  {room.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="p-2 bg-secondary/10 rounded-full text-secondary">
                        {i === 0 ? <Waves className="h-5 w-5" /> : i === 1 ? <Coffee className="h-5 w-5" /> : i === 2 ? <Bath className="h-5 w-5" /> : <Wind className="h-5 w-5" />}
                      </div>
                      <span className="font-medium text-foreground">{amenity}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="px-10 h-14 text-lg">Book Now</Button>
                  <Button variant="outline" size="lg" className="px-10 h-14 text-lg border-primary text-primary">Explore Details</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="booking" className="py-24 px-6 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-headline font-bold mb-12">Ready to Start Your Vacation?</h2>
          <div className="bg-white p-8 rounded-3xl shadow-2xl text-foreground">
            <BookingForm layout="vertical" />
          </div>
          <div className="mt-12 grid grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-4xl font-headline font-bold text-secondary mb-2">100%</p>
              <p className="text-sm opacity-70">Secure Payment</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-headline font-bold text-secondary mb-2">24h</p>
              <p className="text-sm opacity-70">Support Available</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-headline font-bold text-secondary mb-2">Free</p>
              <p className="text-sm opacity-70">Cancellation*</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { cn } from '@/lib/utils';
