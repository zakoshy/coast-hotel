
"use client";

import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Utensils, Wine, Clock, Star, Flame } from 'lucide-react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

const PUBLIC_HOTEL_ID = 'coastal-sands-retreat';

export default function DiningPage() {
  const db = useFirestore();
  const pageRef = useMemoFirebase(() => doc(db, 'hotels', PUBLIC_HOTEL_ID, 'pages', 'dining'), [db]);
  const { data: pageContent } = useDoc(pageRef);

  const restaurants = [
    {
      id: 'blue-marlin',
      name: "The Blue Marlin Grill",
      category: "Signature Seafood",
      desc: "Our flagship restaurant perched right above the waves. Enjoy the catch of the day, prepared with international flair and local spices.",
      hours: "12:00 - 22:30",
      image: PlaceHolderImages.find(i => i.id === 'dining-seafood'),
      tag: "Oceanfront"
    },
    {
      id: 'saffron-spice',
      name: "Saffron Spice Lounge",
      category: "Authentic Swahili",
      desc: "A journey through the rich history of the Kenyan coast. Experience traditional biryanis, coconut curries, and hand-crafted mahamri.",
      hours: "07:00 - 22:00",
      image: PlaceHolderImages.find(i => i.id === 'swahili-breakfast'),
      tag: "Cultural"
    },
    {
      id: 'reef-bar',
      name: "The Reef Bar & Terrace",
      category: "Cocktails & Tapas",
      desc: "The perfect spot for sundowners. Signature tropical cocktails, local craft beers, and light bites with a panoramic view of Diani.",
      hours: "10:00 - 00:00",
      image: PlaceHolderImages.find(i => i.id === 'hero-beach'),
      tag: "Sunset Views"
    }
  ];

  const heroImage = PlaceHolderImages.find(img => img.id === 'dining-seafood');

  return (
    <div className="bg-background min-h-screen">
      <section className="relative h-[70vh] w-full flex items-center justify-center overflow-hidden">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt="Luxury Dining"
            fill
            className="object-cover"
            priority
            data-ai-hint="gourmet seafood"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-background" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <Badge className="mb-6 bg-secondary text-white border-none px-6 py-2 uppercase tracking-widest font-bold text-sm">
            A Culinary Journey
          </Badge>
          <h1 className="text-5xl md:text-7xl font-headline font-bold mb-6 drop-shadow-lg">
            {pageContent?.heroTitle || "Savor the"} <span className="text-secondary italic">{pageContent?.heroSubtitle || "Spirit of Diani"}</span>
          </h1>
          <p className="text-xl md:text-2xl opacity-90 leading-relaxed max-w-2xl mx-auto font-body drop-shadow">
            {pageContent?.bodyText || "From the freshest catch of the Indian Ocean to the vibrant spices of Swahili tradition, our dining experiences are a celebration of flavor and location."}
          </p>
        </div>
      </section>

      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-headline font-bold text-primary mb-8">Elegance in Every Bite</h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          At Coastal Sands Retreat, we believe that dining is an essential part of the vacation experience. Our chefs combine locally sourced ingredients with world-class techniques to create dishes that are as visually stunning as they are delicious.
        </p>
      </section>

      <section className="pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-10">
          {restaurants.map((res) => (
            <Card key={res.id} className="group overflow-hidden border-none shadow-xl bg-white rounded-[2rem] transition-all duration-500 hover:-translate-y-2">
              <div className="relative h-72 overflow-hidden">
                {res.image && (
                  <Image
                    src={res.image.imageUrl}
                    alt={res.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-primary font-bold backdrop-blur-md border-none px-4 py-1">
                    {res.tag}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-8">
                <span className="text-secondary font-bold text-xs uppercase tracking-widest mb-2 block">{res.category}</span>
                <h3 className="text-2xl font-headline font-bold text-primary mb-4">{res.name}</h3>
                <p className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed">{res.desc}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
                  <div className="flex items-center gap-1"><Clock className="h-4 w-4 text-secondary" /><span>{res.hours}</span></div>
                  <div className="flex items-center gap-1"><Star className="h-4 w-4 text-accent" /><span>4.9/5</span></div>
                </div>
                <Button className="w-full rounded-xl bg-primary hover:bg-primary/90">View Menu</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
