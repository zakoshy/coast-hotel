
"use client";

import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Waves, Compass, Utensils, Zap, Wind, Anchor, Sparkles, Map } from 'lucide-react';
import ExperiencePersonalizer from '@/components/experiences/ExperiencePersonalizer';

export default function ExperiencesPage() {
  const experiences = [
    {
      title: "Kisite Snorkeling",
      category: "Adventure",
      desc: "Venture to Kisite-Mpunguti Marine Park for world-class snorkeling with dolphins and sea turtles.",
      image: PlaceHolderImages.find(i => i.id === 'experience-snorkeling'),
      icon: <Waves className="h-5 w-5" />
    },
    {
      title: "Shimba Hills Safari",
      category: "Nature",
      desc: "A short drive to discover the rare sable antelope and magnificent Sheldrick Falls.",
      image: PlaceHolderImages.find(i => i.id === 'experience-safari'),
      icon: <Compass className="h-5 w-5" />
    },
    {
      title: "Swahili Cooking",
      category: "Culture",
      desc: "Learn the secrets of Kenyan coastal cuisine from our master chefs using local spices.",
      image: PlaceHolderImages.find(i => i.id === 'swahili-breakfast'),
      icon: <Utensils className="h-5 w-5" />
    },
    {
      title: "Sunset Dhow Cruise",
      category: "Relaxation",
      desc: "Sail traditional waters on a wooden dhow while enjoying live music and sunset cocktails.",
      image: PlaceHolderImages.find(i => i.id === 'hero-beach'),
      icon: <Wind className="h-5 w-5" />
    },
    {
      title: "Deep Sea Fishing",
      category: "Adventure",
      desc: "Battle the giants of the Indian Ocean, from Marlins to Kingfish, in a professional excursion.",
      image: PlaceHolderImages.find(i => i.id === 'experience-fishing'),
      icon: <Anchor className="h-5 w-5" />
    },
    {
      title: "Coastal Soul Spa",
      category: "Wellness",
      desc: "Holistic treatments using sea salt, coconut oil, and traditional Swahili healing techniques.",
      image: PlaceHolderImages.find(i => i.id === 'experience-spa'),
      icon: <Sparkles className="h-5 w-5" />
    },
    {
      title: "Village Walk",
      category: "Culture",
      desc: "Immerse yourself in local life with a guided tour through the vibrant Diani village communities.",
      image: PlaceHolderImages.find(i => i.id === 'hotel-exterior'),
      icon: <Map className="h-5 w-5" />
    },
    {
      title: "Beachfront Yoga",
      category: "Wellness",
      desc: "Align your spirit with the sound of the waves during our morning meditation sessions.",
      image: PlaceHolderImages.find(i => i.id === 'yoga-deck'),
      icon: <Zap className="h-5 w-5" />
    }
  ];

  const heroImage = PlaceHolderImages.find(img => img.id === 'experience-snorkeling');

  return (
    <div className="bg-background min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt="Adventure Awaits"
            fill
            className="object-cover"
            priority
            data-ai-hint="snorkeling adventure"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-background" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <Badge className="mb-6 bg-secondary text-white border-none px-6 py-2 uppercase tracking-widest font-bold text-sm">
            Curated Adventures
          </Badge>
          <h1 className="text-5xl md:text-8xl font-headline font-bold mb-6 drop-shadow-2xl">
            Discover <span className="text-secondary italic">The Magic</span>
          </h1>
          <p className="text-xl md:text-2xl opacity-90 leading-relaxed max-w-2xl mx-auto font-body drop-shadow-lg">
            From the deep blue of the Indian Ocean to the lush greens of the Kenyan hinterland, embark on journeys that stay with you forever.
          </p>
        </div>
      </section>

      {/* Grid of Experiences */}
      <section className="py-24 px-6 max-w-7xl mx-auto -mt-16 relative z-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {experiences.map((exp, idx) => (
            <Card key={idx} className="overflow-hidden border-none shadow-2xl group rounded-[2rem] transition-all duration-500 hover:-translate-y-2">
              <div className="relative aspect-[4/5]">
                {exp.image && (
                  <Image
                    src={exp.image.imageUrl}
                    alt={exp.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    data-ai-hint={exp.image.imageHint}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-secondary/90 text-white font-bold backdrop-blur-md">
                    {exp.category}
                  </Badge>
                </div>
                <div className="absolute bottom-8 left-6 right-6 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                      {exp.icon}
                    </div>
                    <h3 className="text-xl font-headline font-bold">{exp.title}</h3>
                  </div>
                  <p className="text-sm opacity-80 line-clamp-2 leading-relaxed">{exp.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* AI Personalizer Section */}
      <section id="ai-concierge" className="py-24 px-6 bg-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-bold text-sm mb-6">
                <Zap className="h-4 w-4" />
                <span>AI-Powered Concierge</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-headline font-bold text-primary mb-8 leading-tight">
                Designed for Your <br /><span className="text-foreground">Unique Journey</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                Tell us a little about your travel preferences, and our generative AI will curate a personalized list of experiences just for you.
              </p>
              <div className="grid sm:grid-cols-2 gap-8">
                {[
                  { title: "Personalized", text: "Tailored to your specific style and budget." },
                  { title: "Local Insight", text: "Discover hidden gems known only to locals." },
                  { title: "Instant", text: "Get recommendations and book immediately." },
                  { title: "Seamless", text: "Integrated with our hotel booking system." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0 mt-1">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-primary">{item.title}</p>
                      <p className="text-muted-foreground text-sm">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-primary/5">
              <ExperiencePersonalizer />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
