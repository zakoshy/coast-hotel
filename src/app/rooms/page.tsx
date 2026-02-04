"use client";

import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Waves, Coffee, Bath, Wind } from 'lucide-react';
import BookingForm from '@/components/booking/BookingForm';
import { cn } from '@/lib/utils';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

const PUBLIC_HOTEL_ID = 'coastal-sands-retreat';

export default function RoomsPage() {
  const db = useFirestore();
  
  // Real-time synchronization with the collection managed in Admin Dashboard
  const roomsQuery = useMemoFirebase(() => {
    const colRef = collection(db, 'hotels', PUBLIC_HOTEL_ID, 'rooms');
    // For guests, we only show rooms that aren't marked as "out_of_order"
    return query(colRef, where('status', '!=', 'out_of_order'));
  }, [db]);
  
  const { data: rooms, isLoading } = useCollection(roomsQuery);

  return (
    <div className="bg-background min-h-screen">
      <section className="pt-32 pb-20 px-6 text-center bg-primary/5">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-secondary text-white border-none px-6 py-2 uppercase tracking-widest font-bold text-sm">Your Private Sanctuary</Badge>
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary mb-6">Refined Coastal Living</h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">Every room is a blend of Swahili soul and contemporary comfort, designed to be your private sanctuary by the sea.</p>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="space-y-32">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <p className="text-muted-foreground italic text-xl animate-pulse">Fetching our finest collection...</p>
            </div>
          ) : !rooms || rooms.length === 0 ? (
            <div className="text-center py-20 space-y-6">
              <p className="text-muted-foreground italic text-xl">No rooms currently available for online booking. Please check back soon or contact our concierge.</p>
              <Button size="lg" className="rounded-2xl h-16 px-10 bg-primary font-bold">Contact Concierge Directly</Button>
            </div>
          ) : (
            rooms.map((room, idx) => (
              <div key={room.id} className={cn("flex flex-col gap-16 items-center", idx % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row")}>
                <div className="w-full lg:w-3/5 relative aspect-[16/10] rounded-[3rem] overflow-hidden shadow-2xl group">
                  <Image
                    src={room.imageUrls?.[0] || `https://picsum.photos/seed/${room.id}/800/600`}
                    alt={room.roomType}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-8 left-8">
                    <Badge className="bg-white/95 text-primary font-bold text-2xl px-8 py-3 rounded-2xl shadow-xl backdrop-blur-md">
                      ${room.seasonalRate || room.price} <span className="text-xs opacity-70 font-normal ml-1">/ night</span>
                    </Badge>
                  </div>
                </div>
                <div className="w-full lg:w-2/5">
                  <span className="text-secondary font-bold tracking-widest uppercase mb-4 block">Refined Comfort</span>
                  <h2 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-6 leading-tight">{room.roomType}</h2>
                  <p className="text-lg text-muted-foreground mb-10 leading-relaxed">{room.description || "A luxurious escape tailored for your comfort."}</p>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-12">
                    {room.amenities?.split(',').slice(0, 4).map((amenity: string, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="p-2 bg-secondary/10 rounded-xl text-secondary">
                          {i === 0 ? <Waves className="h-5 w-5" /> : i === 1 ? <Coffee className="h-5 w-5" /> : i === 2 ? <Bath className="h-5 w-5" /> : <Wind className="h-5 w-5" />}
                        </div>
                        <span className="font-bold text-primary/80 truncate">{amenity.trim()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="px-10 h-16 text-lg rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold" onClick={() => {
                       const bookingSection = document.getElementById('booking');
                       if (bookingSection) bookingSection.scrollIntoView({ behavior: 'smooth' });
                    }}>Reserve Now</Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section id="booking" className="py-24 px-6 bg-primary">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-headline font-bold mb-16 text-white leading-tight">Ready to Start Your <br /><span className="text-secondary italic">Vacation?</span></h2>
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl text-foreground"><BookingForm layout="vertical" /></div>
        </div>
      </section>
    </div>
  );
}
