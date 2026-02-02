
import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Waves, Camera, Compass, Utensils, Zap, Wind } from 'lucide-react';
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
      title: "Swahili Cooking Class",
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
    }
  ];

  return (
    <div className="pt-24">
      {/* Header */}
      <section className="bg-primary py-20 px-6 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-headline font-bold mb-6">Discover Diani</h1>
          <p className="text-xl opacity-90 leading-relaxed">
            From the deep blue of the Indian Ocean to the lush greens of the Kenyan hinterland, embark on journeys that stay with you forever.
          </p>
        </div>
      </section>

      {/* Grid of Experiences */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {experiences.map((exp, idx) => (
            <Card key={idx} className="overflow-hidden border-none shadow-lg group">
              <div className="relative aspect-[4/5]">
                {exp.image && (
                  <Image
                    src={exp.image.imageUrl}
                    alt={exp.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    data-ai-hint={exp.image.imageHint}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-secondary text-primary font-bold">
                    {exp.category}
                  </Badge>
                </div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    {exp.icon}
                    <h3 className="text-xl font-headline font-bold">{exp.title}</h3>
                  </div>
                  <p className="text-sm opacity-90 line-clamp-2">{exp.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* AI Personalizer Section */}
      <section id="ai-concierge" className="py-24 px-6 bg-secondary/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-bold text-sm mb-6">
                <Zap className="h-4 w-4" />
                <span>AI-Powered Concierge</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-8">
                Designed for Your Unique Journey
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Tell us a little about your travel preferences, and our generative AI will curate a personalized list of experiences just for you. Whether you're a thrill-seeker or looking for the ultimate romantic escape, we have the perfect recommendation.
              </p>
              <div className="space-y-6">
                {[
                  { title: "Personalized", text: "Tailored to your specific travel style and budget." },
                  { title: "Local Insight", text: "Discover hidden gems only known to coastal locals." },
                  { title: "Instant", text: "Get recommendations immediately and book on the spot." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-6 w-6 rounded-full bg-secondary shrink-0 mt-1" />
                    <div>
                      <p className="font-bold">{item.title}</p>
                      <p className="text-muted-foreground">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-2xl border border-primary/10">
              <ExperiencePersonalizer />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
