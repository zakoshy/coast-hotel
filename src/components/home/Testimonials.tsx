
"use client";

import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    name: "Sarah Jenkins",
    location: "London, UK",
    text: "Absolute paradise! The Swahili hospitality is unlike anything I've experienced. Waking up to the sound of the Indian Ocean was magical.",
    stars: 5,
    avatar: "https://picsum.photos/seed/sarah/100/100"
  },
  {
    name: "Omari Mwangi",
    location: "Nairobi, Kenya",
    text: "The perfect staycation. The local resident rates make this luxury accessible. Best seafood platter in Diani!",
    stars: 5,
    avatar: "https://picsum.photos/seed/omari/100/100"
  },
  {
    name: "Elena Rodriguez",
    location: "Madrid, Spain",
    text: "Beautiful architecture and impeccable service. The AI concierge recommended the perfect snorkeling trip for us.",
    stars: 4,
    avatar: "https://picsum.photos/seed/elena/100/100"
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 px-6 bg-secondary/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-secondary font-bold tracking-widest uppercase mb-4 block">Guest Stories</span>
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-primary">Loved by Guests Worldwide</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <Card key={i} className="border-none shadow-xl bg-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="h-16 w-16 text-primary" />
              </div>
              <CardContent className="pt-12 pb-8 px-8">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className={cn(
                      "h-5 w-5 fill-current",
                      idx < t.stars ? "text-yellow-400" : "text-gray-200"
                    )} />
                  ))}
                </div>
                <p className="text-lg text-muted-foreground italic mb-10 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-secondary">
                    <AvatarImage src={t.avatar} />
                    <AvatarFallback>{t.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-primary">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

import { cn } from '@/lib/utils';
export default Testimonials;
