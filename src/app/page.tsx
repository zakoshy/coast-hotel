'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Waves, Trees, Palmtree } from 'lucide-react';
import BookingForm from '@/components/booking/BookingForm';
import Testimonials from '@/components/home/Testimonials';
import InteractiveMap from '@/components/home/InteractiveMap';
import HeroCarousel from '@/components/home/HeroCarousel';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

const PUBLIC_HOTEL_ID = 'coastal-sands-retreat';

export default function Home() {
  const db = useFirestore();
  const hotelRef = useMemoFirebase(() => doc(db, 'hotels', PUBLIC_HOTEL_ID), [db]);
  const { data: hotelData } = useDoc(hotelRef);

  const poolImage = PlaceHolderImages.find(img => img.id === 'infinity-pool');
  const suiteImage = PlaceHolderImages.find(img => img.id === 'luxury-suite');

  return (
    <div className="flex flex-col w-full">
      <section className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center">
        <HeroCarousel />
        <div className="absolute inset-0 hero-gradient pointer-events-none" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <p className="text-secondary font-bold tracking-[0.4em] uppercase mb-4 animate-fade-in-up">Escape to Paradise</p>
          <h1 className="text-5xl md:text-7xl font-headline font-bold mb-6 animate-fade-in-up [animation-delay:200ms] text-white">
            {hotelData?.name?.split(' ').slice(0, -1).join(' ') || "Your Sanctuary"} <span className="text-secondary italic">{hotelData?.name?.split(' ').pop() || "By The Sea"}</span>
          </h1>
          <p className="text-lg md:text-xl font-body mb-10 max-w-2xl mx-auto opacity-95 animate-fade-in-up [animation-delay:400ms]">
            Experience the perfect blend of modern luxury and Swahili soul on the pristine shores of {hotelData?.location?.split(',')[0] || "Diani Beach"}.
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

      <section className="relative z-20 -mt-12 px-4 md:px-0">
        <div className="max-w-6xl mx-auto glass rounded-3xl shadow-2xl p-6 md:p-10 border border-white/50">
          <BookingForm layout="horizontal" />
        </div>
      </section>

      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl group border-8 border-white">
            {poolImage && <Image src={poolImage.imageUrl} alt={poolImage.description} fill className="object-cover transition-transform duration-700 group-hover:scale-105" data-ai-hint={poolImage.imageHint} />}
          </div>
          <div className="flex flex-col">
            <span className="text-secondary font-bold tracking-widest uppercase mb-4">The {hotelData?.name || "Coastal Sands"} Heritage</span>
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-6 leading-tight">Where Turquoise Waves Meet <span className="text-foreground">Sun-Kissed Sands</span></h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {hotelData?.description || "Coastal Sands Retreat is more than a hotel; it's a celebration of the Kenyan coast. Our architecture honors Swahili traditions while offering the breezy, light-filled spaces of a modern tropical paradise."}
            </p>
            <div className="grid grid-cols-2 gap-8 mt-4">
              {[{ icon: <Waves />, label: "Private Beach" }, { icon: <Palmtree />, label: "Tropical Gardens" }, { icon: <Star />, label: "Bespoke Service" }, { icon: <Trees />, label: "Eco-Conscious" }].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary">{React.cloneElement(item.icon as React.ReactElement, { className: "h-6 w-6" })}</div>
                  <span className="font-bold text-foreground/80">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-secondary font-bold tracking-widest uppercase mb-4">Our Location</span>
            <h2 className="text-4xl font-headline font-bold text-primary mb-6">A Tropical Paradise</h2>
            <p className="text-muted-foreground mb-8 text-lg">Located on the most scenic stretch of {hotelData?.location?.split(',')[0] || "Diani Beach"}, where the sand is like powder.</p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl"><MapPin className="h-6 w-6 text-primary shrink-0" /></div>
                <div>
                  <p className="font-bold text-foreground">The Address</p>
                  <p className="text-muted-foreground">{hotelData?.location || "Plot 1024, Prime Beach Road, Diani, Kenya"}</p>
                </div>
              </div>
            </div>
            <Button className="mt-10 bg-primary text-white hover:bg-primary/90 rounded-xl" size="lg" asChild><Link href="/contact">Get Directions</Link></Button>
          </div>
          <div className="h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white relative"><InteractiveMap /></div>
        </div>
      </section>
    </div>
  );
}