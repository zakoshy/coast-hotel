"use client";

import React from 'react';
import Image from 'next/image';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import InteractiveMap from '@/components/home/InteractiveMap';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

const PUBLIC_HOTEL_ID = 'coastal-sands-retreat';

export default function ContactPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const hotelRef = useMemoFirebase(() => doc(db, 'hotels', PUBLIC_HOTEL_ID), [db]);
  const { data: hotelData } = useDoc(hotelRef);

  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-beach');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message Sent!", description: "Our concierge team will get back to you within 24 hours." });
  };

  return (
    <div className="bg-background min-h-screen">
      <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
        {heroImage && <Image src={heroImage.imageUrl} alt="Hero" fill className="object-cover" priority data-ai-hint="luxury beach" />}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-background" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <Badge className="mb-6 bg-secondary text-white border-none px-6 py-2 uppercase tracking-widest font-bold text-sm">Contact Our Concierge</Badge>
          <h1 className="text-5xl md:text-7xl font-headline font-bold mb-6 drop-shadow-lg">Start Your <span className="text-secondary italic">Paradise Story</span></h1>
          <p className="text-xl md:text-2xl opacity-90 leading-relaxed max-w-2xl mx-auto drop-shadow">Our dedicated team is ready to curate your perfect {hotelData?.location?.split(',')[0] || "Diani"} escape.</p>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto -mt-20 relative z-20">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-3xl font-headline font-bold text-primary mb-8">Reach Us Directly</h2>
            <Card className="border-none shadow-lg bg-white overflow-hidden group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-colors"><MapPin className="h-6 w-6" /></div>
                <div><p className="font-bold text-lg mb-1">Our Sanctuary</p><p className="text-muted-foreground">{hotelData?.location || "Prime Beach Road, Diani, Kenya"}</p></div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg bg-white overflow-hidden group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="p-3 bg-secondary/10 rounded-2xl text-secondary group-hover:bg-secondary group-hover:text-white transition-colors"><Phone className="h-6 w-6" /></div>
                <div><p className="font-bold text-lg mb-1">Talk to Us</p><p className="text-muted-foreground">Mobile: {hotelData?.contactNumber || "+254 712 345 678"}</p></div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg bg-white overflow-hidden group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-colors"><Mail className="h-6 w-6" /></div>
                <div><p className="font-bold text-lg mb-1">Email</p><p className="text-muted-foreground">{hotelData?.email || "stay@coastalsands.com"}</p></div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-primary/5">
              <h2 className="text-3xl font-headline font-bold text-primary mb-2">Send an Inquiry</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2"><Label htmlFor="name">Full Name</Label><Input id="name" placeholder="How shall we address you?" className="h-12 rounded-xl" required /></div>
                  <div className="space-y-2"><Label htmlFor="email">Email Address</Label><Input id="email" type="email" placeholder="email@example.com" className="h-12 rounded-xl" required /></div>
                </div>
                <div className="space-y-2"><Label htmlFor="message">Your Message</Label><Textarea id="message" placeholder="Tell us more about your requirements..." className="min-h-[150px] rounded-2xl" required /></div>
                <Button type="submit" size="lg" className="w-full md:w-fit px-12 h-14 rounded-full text-lg font-bold bg-primary">Send Message<Send className="ml-2 h-5 w-5" /></Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}