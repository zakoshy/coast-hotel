
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

export default function ContactPage() {
  const { toast } = useToast();
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-beach');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Our concierge team will get back to you within 24 hours.",
    });
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt="Diani Beach Sunset"
            fill
            className="object-cover"
            priority
            data-ai-hint="luxury beach"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-background" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <Badge className="mb-6 bg-secondary text-white border-none px-6 py-2 uppercase tracking-widest font-bold text-sm">
            Contact Our Concierge
          </Badge>
          <h1 className="text-5xl md:text-7xl font-headline font-bold mb-6 drop-shadow-lg">
            Start Your <span className="text-secondary italic">Paradise Story</span>
          </h1>
          <p className="text-xl md:text-2xl opacity-90 leading-relaxed max-w-2xl mx-auto font-body drop-shadow">
            Our dedicated team is ready to curate your perfect Diani escape. Reach out to us for bookings, inquiries, or special requests.
          </p>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto -mt-20 relative z-20">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information Cards */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-3xl font-headline font-bold text-primary mb-8">Reach Us Directly</h2>
            
            <Card className="border-none shadow-lg bg-white overflow-hidden group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-lg mb-1">Our Sanctuary</p>
                  <p className="text-muted-foreground">Plot 1024, Prime Beach Road,<br />Diani, South Coast, Kenya</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white overflow-hidden group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="p-3 bg-secondary/10 rounded-2xl text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-lg mb-1">Talk to Us</p>
                  <p className="text-muted-foreground">Reception: +254 712 345 678</p>
                  <p className="text-muted-foreground">WhatsApp: +254 798 765 432</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white overflow-hidden group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-lg mb-1">Electronic Mail</p>
                  <p className="text-muted-foreground">Stay: stay@coastalsands.com</p>
                  <p className="text-muted-foreground">Events: events@coastalsands.com</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white overflow-hidden group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="p-3 bg-accent/10 rounded-2xl text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-lg mb-1">Concierge Hours</p>
                  <p className="text-muted-foreground">Front Desk: 24/7</p>
                  <p className="text-muted-foreground">Spa & Leisure: 08:00 - 20:00</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-primary/5">
              <h2 className="text-3xl font-headline font-bold text-primary mb-2">Send an Inquiry</h2>
              <p className="text-muted-foreground mb-10">We would love to hear about your travel plans.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="How shall we address you?" className="h-12 rounded-xl" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="email@example.com" className="h-12 rounded-xl" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">What are you planning?</Label>
                  <Input id="subject" placeholder="e.g. Honeymoon, Family Holiday, Corporate Event" className="h-12 rounded-xl" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea id="message" placeholder="Tell us more about your requirements..." className="min-h-[150px] rounded-2xl" required />
                </div>
                
                <Button type="submit" size="lg" className="w-full md:w-fit px-12 h-14 rounded-full text-lg font-bold bg-primary hover:bg-primary/90">
                  Send Message
                  <Send className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-headline font-bold text-primary mb-4">Find Us in Diani</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Nestled along the most pristine stretch of the Kenyan coast.
            </p>
          </div>
          
          <div className="h-[600px] w-full rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white relative">
            <InteractiveMap />
            {/* Location floating card */}
            <div className="absolute bottom-10 left-10 z-10 hidden md:block max-w-xs">
              <div className="glass p-6 rounded-3xl shadow-xl border border-white/50">
                <div className="flex items-center gap-3 text-primary mb-3">
                  <MessageCircle className="h-6 w-6" />
                  <span className="font-bold">Need a Pickup?</span>
                </div>
                <p className="text-sm text-foreground/80 mb-4 leading-relaxed">
                  We offer complimentary airport transfers from Ukunda Airstrip for all direct bookings.
                </p>
                <Button size="sm" className="w-full rounded-full">Book Transfer</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
