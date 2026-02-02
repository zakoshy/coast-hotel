
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, Calendar, Percent, CreditCard, ChevronRight, Tag } from 'lucide-react';

export default function OffersPage() {
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
    <div className="pt-24 bg-background min-h-screen">
      {/* Hero Header */}
      <section className="bg-primary py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-secondary rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Badge className="mb-6 px-4 py-1 bg-secondary text-white border-none font-bold uppercase tracking-widest">
            Exclusive Deals
          </Badge>
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-white mb-8">
            The Art of <span className="text-secondary italic">Getting Away</span>
          </h1>
          <p className="text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
            Discover our curated collection of special offers and seasonal packages designed to make your Diani experience even more unforgettable.
          </p>
        </div>
      </section>

      {/* Offers Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {offers.map((offer) => (
            <Card key={offer.id} className="group overflow-hidden border-none shadow-2xl rounded-[2.5rem] flex flex-col lg:flex-row bg-white">
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
                    <span className="text-sm font-bold uppercase tracking-wider">Limited Time</span>
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
                
                <Button className="w-full lg:w-fit px-10 h-14 rounded-full text-lg font-bold" asChild>
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
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full text-primary mb-8">
            <Gift className="h-10 w-10" />
          </div>
          <h2 className="text-4xl font-headline font-bold mb-6">Didn't find what you were looking for?</h2>
          <p className="text-lg text-muted-foreground mb-12">
            Our concierge team can create bespoke packages tailored to your specific needs, whether it's for a corporate retreat, a group event, or a personalized milestone celebration.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="rounded-full px-12 h-14 bg-secondary hover:bg-secondary/90">
              Inquire Now
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-12 h-14 border-primary text-primary">
              View All Terms
            </Button>
          </div>
          <p className="mt-12 text-sm text-muted-foreground italic">
            * All offers are subject to availability and seasonal blackout dates. Prices exclude taxes and service charges unless specified.
          </p>
        </div>
      </section>
    </div>
  );
}
