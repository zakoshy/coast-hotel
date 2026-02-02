
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
          <p className="text-secondary font-medium tracking-[0.3em] uppercase mb-4 animate-fade-in-up">
            Your Coastal Paradise Awaits
          </p>
          <h1 className="text-5xl md:text-7xl font-headline font-bold mb-6 animate-fade-in-up [animation-delay:200ms]">
            Escape to Eternal Summer
          </h1>
          <p className="text-lg md:text-xl font-body mb-10 max-w-2xl mx-auto opacity-90 animate-fade-in-up [animation-delay:400ms]">
            Experience the warmth of the Indian Ocean and the soul of Swahili culture in the heart of Diani, Kenya.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:600ms]">
            <Button size="lg" className="px-10 py-7 text-lg shadow-xl" asChild>
              <Link href="/rooms">Book Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="px-10 py-7 text-lg bg-white/10 backdrop-blur-sm border-white/40 text-white hover:bg-white/20" asChild>
              <Link href="/experiences">Discover More</Link>
            </Button>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white animate-bounce">
          <Wind className="h-8 w-8 rotate-90 opacity-50" />
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
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl group">
            {poolImage && (
              <Image
                src={poolImage.imageUrl}
                alt={poolImage.description}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                data-ai-hint={poolImage.imageHint}
              />
            )}
            <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-secondary font-bold tracking-widest uppercase mb-4">The Coastal Sands Experience</span>
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-6 leading-tight">
              Where the Ocean Whispers and the Palms Sway
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Nestled on the pristine shores of Diani Beach, Coastal Sands Retreat offers a sanctuary of tranquility. Our architecture blends modern luxury with authentic Swahili craftsmanship, creating a space that feels both world-class and deeply rooted in local heritage.
            </p>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              From our infinity pool that seems to spill into the Indian Ocean to our curated dining experiences featuring the freshest catch of the day, every moment here is designed to reconnect you with nature and yourself.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-full">
                  <Waves className="h-6 w-6 text-secondary" />
                </div>
                <span className="font-medium">Private Beach Access</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-full">
                  <Palmtree className="h-6 w-6 text-secondary" />
                </div>
                <span className="font-medium">Tropical Gardens</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-full">
                  <Star className="h-6 w-6 text-secondary" />
                </div>
                <span className="font-medium">5-Star Hospitality</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-full">
                  <Trees className="h-6 w-6 text-secondary" />
                </div>
                <span className="font-medium">Sustainable Luxury</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-24 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4">Your Private Sanctuary</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Discover our collection of elegant rooms and suites, each offering breathtaking views and unparalleled comfort.</p>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { title: "Ocean Deluxe Room", price: "250", desc: "Private balcony with stunning direct ocean views.", img: suiteImage },
            { title: "Swahili Villa", price: "450", desc: "Traditional architecture meets modern luxury.", img: PlaceHolderImages.find(i => i.id === 'hotel-exterior') },
            { title: "Presidential Suite", price: "800", desc: "The pinnacle of coastal luxury with a private pool.", img: PlaceHolderImages.find(i => i.id === 'luxury-suite') }
          ].map((item, idx) => (
            <div key={idx} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
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
                <div className="absolute top-4 right-4 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold">
                  From ${item.price}/night
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-headline font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground mb-6">{item.desc}</p>
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white" asChild>
                  <Link href="/rooms">View Details</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Personalizer Teaser */}
      <section className="py-24 px-6 bg-primary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-10 -translate-y-1/4 translate-x-1/4">
          <Palmtree className="h-[600px] w-[600px]" />
        </div>
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-headline font-bold mb-8">Personalize Your Coastal Adventure</h2>
          <p className="text-xl opacity-90 mb-12 leading-relaxed max-w-3xl mx-auto">
            Our AI-powered travel concierge is ready to craft the perfect itinerary based on your style, interests, and budget. Whether you seek adrenaline or absolute stillness, let us guide you.
          </p>
          <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-primary-foreground font-bold px-10 py-8 rounded-full shadow-2xl transition-transform hover:scale-105" asChild>
            <Link href="/experiences#ai-concierge">Try the Experience Designer</Link>
          </Button>
        </div>
      </section>

      <Testimonials />

      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-secondary font-bold tracking-widest uppercase mb-4">Location</span>
            <h2 className="text-4xl font-headline font-bold text-primary mb-6">In the Heart of Paradise</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Coastal Sands Retreat is located on the South Coast of Kenya, just 45km from Mombasa and a short 10-minute drive from Ukunda Airstrip. We are perfectly positioned for both relaxation and exploration.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-secondary shrink-0 mt-1" />
                <div>
                  <p className="font-bold">Address</p>
                  <p className="text-muted-foreground">Plot 1024, Beach Road, Diani, Kwale County, Kenya</p>
                </div>
              </div>
            </div>
            <Button className="mt-10" size="lg" asChild>
              <Link href="/contact">Get Directions</Link>
            </Button>
          </div>
          <div className="h-[450px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
            <InteractiveMap />
          </div>
        </div>
      </section>
    </div>
  );
}
