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
      <section className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center">
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
            Escape to Paradise
          </p>
          <h1 className="text-5xl md:text-7xl font-headline font-bold mb-6 animate-fade-in-up [animation-delay:200ms] text-white">
            Your Sanctuary <span className="text-secondary italic">By The Sea</span>
          </h1>
          <p className="text-lg md:text-xl font-body mb-10 max-w-2xl mx-auto opacity-95 animate-fade-in-up [animation-delay:400ms]">
            Discover the perfect blend of modern luxury and Swahili soul on the pristine shores of Diani Beach.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:600ms]">
            <Button size="lg" className="px-10 py-7 text-lg shadow-xl bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <Link href="/rooms">Book Your Stay</Link>
            </Button>
            <Button size="lg" variant="outline" className="px-10 py-7 text-lg bg-white/10 backdrop-blur-md border-white/40 text-white hover:bg-white/20" asChild>
              <Link href="/experiences">Explore Experiences</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Floating Booking Quick Form */}
      <section className="relative z-20 -mt-12 px-4 md:px-0">
        <div className="max-w-6xl mx-auto glass rounded-3xl shadow-2xl p-6 md:p-10 border border-white/50">
          <BookingForm layout="horizontal" />
        </div>
      </section>

      {/* Introduction */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl group border-8 border-white">
            {poolImage && (
              <Image
                src={poolImage.imageUrl}
                alt={poolImage.description}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                data-ai-hint={poolImage.imageHint}
              />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-secondary font-bold tracking-widest uppercase mb-4">The Coastal Sands Heritage</span>
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-6 leading-tight">
              Where Turquoise Waves Meet <span className="text-foreground">Sun-Kissed Sands</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Coastal Sands Retreat is more than a hotel; it's a celebration of the Kenyan coast. Our architecture honors Swahili traditions while offering the breezy, light-filled spaces of a modern tropical paradise.
            </p>
            <div className="grid grid-cols-2 gap-8 mt-4">
              {[
                { icon: <Waves />, label: "Private Beach" },
                { icon: <Palmtree />, label: "Tropical Gardens" },
                { icon: <Star />, label: "Bespoke Service" },
                { icon: <Trees />, label: "Eco-Conscious" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    {React.cloneElement(item.icon as React.ReactElement, { className: "h-6 w-6" })}
                  </div>
                  <span className="font-bold text-foreground/80">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-24 px-6 bg-muted/50">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4">Luxury Sanctuary</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Each room is a masterpiece of coastal design, offering peace, privacy, and panoramic views.</p>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          {[
            { title: "Ocean Deluxe Room", price: "250", desc: "Private terrace with direct views of the turquoise ocean.", img: suiteImage },
            { title: "Swahili Garden Villa", price: "450", desc: "Secluded villa surrounded by lush bougainvillea and palm trees.", img: PlaceHolderImages.find(i => i.id === 'hotel-exterior') },
            { title: "Grand Presidential", price: "850", desc: "The pinnacle of coastal luxury with a private infinity plunge pool.", img: PlaceHolderImages.find(i => i.id === 'infinity-pool') }
          ].map((item, idx) => (
            <div key={idx} className="group flex flex-col bg-card rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-primary/5">
              <div className="relative aspect-[4/3] overflow-hidden">
                {item.img && (
                  <Image
                    src={item.img.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    data-ai-hint={item.img.imageHint}
                  />
                )}
                <div className="absolute top-6 right-6 bg-secondary text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  from ${item.price}/night
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-headline font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground mb-6 line-clamp-2">{item.desc}</p>
                <Button variant="outline" className="w-full rounded-xl border-primary/30 text-primary hover:bg-primary hover:text-white" asChild>
                  <Link href="/rooms">View Details</Link>
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
            <span className="text-secondary font-bold tracking-widest uppercase mb-4">Our Location</span>
            <h2 className="text-4xl font-headline font-bold text-primary mb-6">A Tropical Paradise</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Located on the most scenic stretch of Diani Beach, where the sand is like powder and the water is always warm.
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <MapPin className="h-6 w-6 text-primary shrink-0" />
                </div>
                <div>
                  <p className="font-bold text-foreground">The Address</p>
                  <p className="text-muted-foreground">Plot 1024, Prime Beach Road, Diani, Kenya</p>
                </div>
              </div>
            </div>
            <Button className="mt-10 bg-primary text-white hover:bg-primary/90 rounded-xl" size="lg" asChild>
              <Link href="/contact">Get Directions</Link>
            </Button>
          </div>
          <div className="h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white relative">
            <InteractiveMap />
          </div>
        </div>
      </section>
    </div>
  );
}