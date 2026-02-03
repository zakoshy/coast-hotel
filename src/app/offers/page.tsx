
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, Calendar, Percent, CreditCard, ChevronRight, Tag } from 'lucide-react';

export default function OffersPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-beach');

  const offers = [
    {
      id: 'honeymoon-special',
      title: "Honeymoon Magic",
      badge: "Most Popular",
      desc: "Celebrate your love with a 30% discount on all suites, a private candlelit beach dinner, and a couple's spa treatment.",
      validity: "Valid until Dec 2025",
      discount: "30% OFF",
      image: PlaceHolderImages.find(i => i.id === 'luxury-suite'),
      icon: <Gift className="h-5 w-5" />
    },
    {
      id: 'resident-offer',
      title: "East African Resident Rate",
      badge: "Local Special",
      desc: "Exclusive rates for Kenyan and East African citizens. Experience international luxury right at your doorstep.",
      validity: "Ongoing",
      discount: "SPECIAL KES RATE",
      image: PlaceHolderImages.find(i => i.id === 'hotel-exterior'),
      icon: <CreditCard className="h-5 w-5" />
    },
    {
      id: 'early-bird',
      title: "Early Bird Escape",
      badge: "Best Value",
      desc: "Plan ahead and save. Book your stay 60 days in advance to enjoy our best available rates and a complimentary room upgrade.",
      validity: "All Year Round",
      discount: "20% OFF",
      image: PlaceHolderImages.find(i => i.id === 'infinity-pool'),
      icon: <Calendar className="h-5 w-5" />
    },
    {
      id: 'last-minute',
      title: "Spontaneous Sunset",
      badge: "Last Minute",
      desc: "Need a quick getaway? Book within 7 days of arrival and grab our remaining rooms at an unbeatable price.",
      validity: "Next 7 Days",
      discount: "15% OFF",
      image: PlaceHolderImages.find(i => i.id === 'hero-beach'),
      icon: <Percent className="h-5 w-5" />
    }
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Cinematic Hero Header */}
      <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt="Special Offers Hero"
            fill
            className="object-cover"
            priority
            data-ai-hint="luxury beach"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-background" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <Badge className="mb-6 px-6 py-2 bg-secondary text-white border-none font-bold uppercase tracking-widest text-sm rounded-full">
            Exclusive Deals
          </Badge>
          <h1 className="text-5xl md:text-7xl font-headline font-bold mb-8 drop-shadow-2xl">
            The Art of <span className="text-secondary italic">Getting Away</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/95 leading-relaxed max-w-3xl mx-auto drop-shadow-lg">
            Discover our curated collection of special offers and seasonal packages designed to make your Diani experience even more unforgettable.
          </p>
        </div>
      </section>

      {/* Offers Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative z-20 -mt-10">
        <div className="grid md:grid-cols-2 gap-12">
          {offers.map((offer) => (
            <Card key={offer.id} className="group overflow-hidden border-none shadow-2xl rounded-[2.5rem] flex flex-col lg:flex-row bg-white transition-all duration-500 hover:-translate-y-2">
              <div className="w-full lg:w-2/5 relative h-64 lg:h-auto overflow-hidden">
                {offer.image && (
                  <Image
                    src={offer.image.imageUrl}
                    alt={offer.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    data-ai-hint={offer.image.imageHint}
                  />
                )}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-secondary/90 text-white font-bold backdrop-blur-md border-none">
                    {offer.badge}
                  </Badge>
                </div>
              </div>
              
              <div className="w-full lg:w-3/5 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-secondary mb-4">
                    {offer.icon}
                    <span className="text-xs font-bold uppercase tracking-wider">Limited Time</span>
                  </div>
                  <h3 className="text-3xl font-headline font-bold text-primary mb-4">{offer.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {offer.desc}
                  </p>
                  
                  <div className="flex flex-col gap-2 mb-8">
                    <div className="flex items-center gap-2 text-sm">
                      <Tag className="h-4 w-4 text-primary" />
                      <span className="font-bold text-primary">{offer.discount}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{offer.validity}</span>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full lg:w-fit px-10 h-14 rounded-full text-lg font-bold shadow-lg" asChild>
                  <Link href="/rooms#booking">
                    Claim Offer
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Terms & CTA */}
      <section className="py-24 px-6 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-6 bg-primary/10 rounded-full text-primary mb-8">
            <Gift className="h-10 w-10" />
          </div>
          <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6">Bespoke Holiday Planning</h2>
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            Our concierge team can create tailored packages for corporate retreats, private events, or milestone celebrations. Let us design your perfect escape.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button size="lg" className="rounded-full px-12 h-16 bg-secondary hover:bg-secondary/90 text-lg shadow-xl">
              Inquire Now
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-12 h-16 border-primary text-primary hover:bg-primary/5 text-lg">
              View All Terms
            </Button>
          </div>
          <p className="mt-16 text-sm text-muted-foreground italic">
            * All offers are subject to availability and seasonal blackout dates. Prices exclude taxes and service charges unless specified.
          </p>
        </div>
      </section>
    </div>
  );
}
