import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Waves, Trees, Palmtree, Wind } from 'lucide-react';
import BookingForm from '@/components/booking/BookingForm';
import Testimonials from '@/components/home/Testimonials';
import InteractiveMap from '@/components/home/InteractiveMap';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-beach');
  const poolImage = PlaceHolderImages.find(img => img.id === 'infinity-pool');
  const suiteImage = PlaceHolderImages.find(img => img.id === 'luxury-suite');

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover animate-in fade-in duration-1000"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <p className="text-secondary font-bold tracking-[0.4em] uppercase mb-4 animate-fade-in-up">
            Your Private Coastal Haven
          </p>
          <h1 className="text-5xl md:text-7xl font-headline font-bold mb-6 animate-fade-in-up [animation-delay:200ms]">
            Experience <span className="text-primary italic">Eternal</span> Summer
          </h1>
          <p className="text-lg md:text-xl font-body mb-10 max-w-2xl mx-auto opacity-90 animate-fade-in-up [animation-delay:400ms]">
            Immerse yourself in the golden warmth of the Indian Ocean and the soul of Swahili luxury in the heart of Diani.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:600ms]">
            <Button size="lg" className="px-10 py-7 text-lg shadow-[0_10px_20px_rgba(212,175,55,0.3)] bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <Link href="/rooms">Book Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="px-10 py-7 text-lg bg-white/5 backdrop-blur-sm border-primary/40 text-primary hover:bg-primary/20" asChild>
              <Link href="/experiences">The Experience</Link>
            </Button>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-primary animate-bounce">
          <Wind className="h-8 w-8 rotate-90 opacity-80" />
        </div>
      </section>

      {/* Floating Booking Quick Form */}
      <section className="relative z-20 -mt-16 px-4 md:px-0">
        <div className="max-w-6xl mx-auto glass rounded-2xl shadow-2xl p-6 md:p-8">
          <BookingForm layout="horizontal" />
        </div>
      </section>

      {/* Introduction */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl group border border-primary/20">
            {poolImage && (
              <Image
                src={poolImage.imageUrl}
                alt={poolImage.description}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                data-ai-hint={poolImage.imageHint}
              />
            )}
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors duration-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-secondary font-bold tracking-widest uppercase mb-4">The Retreat Heritage</span>
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-6 leading-tight">
              Where Gold Sands Meet <span className="text-white">Obsidian Nights</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Coastal Sands Retreat is a masterpiece of Swahili-inspired architecture, where every corner reflects the opulence of the coast's rich history. We offer a private sanctuary for those who seek the extraordinary.
            </p>
            <div className="grid grid-cols-2 gap-6 mt-6">
              {[
                { icon: <Waves />, label: "Private Beach" },
                { icon: <Palmtree />, label: "Exotic Gardens" },
                { icon: <Star />, label: "Bespoke Service" },
                { icon: <Trees />, label: "Eco Luxury" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    {React.cloneElement(item.icon as React.ReactElement, { className: "h-6 w-6" })}
                  </div>
                  <span className="font-medium text-white/90">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4 text-gold-gradient">Sovereign Suites</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Discover our curated selection of elegant rooms, each a private palace designed for deep restoration.</p>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { title: "Ocean Deluxe Room", price: "250", desc: "Private terrace with direct views of the gold-flecked ocean.", img: suiteImage },
            { title: "Swahili Villa", price: "450", desc: "Traditional ebony and ivory accents with a private garden path.", img: PlaceHolderImages.find(i => i.id === 'hotel-exterior') },
            { title: "Grand Presidential", price: "850", desc: "The pinnacle of Diani luxury with a private infinity plunge.", img: PlaceHolderImages.find(i => i.id['luxury-suite']) }
          ].map((item, idx) => (
            <div key={idx} className="group flex flex-col bg-card rounded-2xl overflow-hidden shadow-xl hover:shadow-primary/10 border border-primary/5 hover:border-primary/30 transition-all duration-500">
              <div className="relative aspect-[4/3] overflow-hidden">
                {item.img && (
                  <Image
                    src={item.img.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    data-ai-hint={item.img.imageHint}
                  />
                )}
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                  ${item.price}/night
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-headline font-bold mb-3 text-white">{item.title}</h3>
                <p className="text-muted-foreground mb-6 line-clamp-2">{item.desc}</p>
                <Button variant="outline" className="w-full border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground" asChild>
                  <Link href="/rooms">Explore Sanctuary</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Testimonials />

      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-secondary font-bold tracking-widest uppercase mb-4">Location</span>
            <h2 className="text-4xl font-headline font-bold text-primary mb-6">A Golden Address</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Coastal Sands Retreat is located on the most prestigious stretch of Diani Beach, where the sand is white and the hospitality is gold.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-white">The Address</p>
                  <p className="text-muted-foreground">Plot 1024, Prime Beach Road, Diani, Kenya</p>
                </div>
              </div>
            </div>
            <Button className="mt-10 bg-primary text-primary-foreground hover:bg-primary/90" size="lg" asChild>
              <Link href="/contact">Get Directions</Link>
            </Button>
          </div>
          <div className="h-[450px] rounded-2xl overflow-hidden shadow-2xl border border-primary/20">
            <InteractiveMap />
          </div>
        </div>
      </section>
    </div>
  );
}