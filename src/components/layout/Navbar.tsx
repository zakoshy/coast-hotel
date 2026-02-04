
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, CalendarCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BookingForm from '@/components/booking/BookingForm';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

const PUBLIC_HOTEL_ID = 'coastal-sands-retreat';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isAdminPage = pathname?.startsWith('/admin');
  const db = useFirestore();

  const hotelRef = useMemoFirebase(() => doc(db, 'hotels', PUBLIC_HOTEL_ID), [db]);
  const { data: hotelData } = useDoc(hotelRef);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAdminPage) return null;

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Rooms & Suites', href: '/rooms' },
    { name: 'Experiences', href: '/experiences' },
    { name: 'Dining', href: '/dining' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Offers', href: '/offers' },
  ];

  const isSolid = scrolled || !isHomePage;
  const textColor = isSolid ? "text-foreground/80" : "text-white/90";
  const brandColor = isSolid ? "text-primary" : "text-white";

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4',
        isSolid ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex flex-col">
          <span className={cn(
            "text-2xl font-headline font-bold leading-tight tracking-tight uppercase",
            brandColor
          )}>
            {hotelData?.name || "COASTAL SANDS"}
          </span>
          <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-secondary">
            {hotelData?.location?.split(',')[0] || "Diani"} • Kenya
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-bold tracking-wide hover:text-secondary transition-colors",
                textColor,
                pathname === link.href && "text-secondary"
              )}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="flex items-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 shadow-lg font-bold gap-2">
                  <CalendarCheck className="h-4 w-4" />
                  Book Now
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] rounded-[2rem] p-10 border-none shadow-2xl">
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-3xl font-headline font-bold text-primary text-center">Reserve Your Sanctuary</DialogTitle>
                  <p className="text-center text-muted-foreground">Select your preferred dates and guest count below.</p>
                </DialogHeader>
                <BookingForm layout="vertical" />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <X className={cn("h-8 w-8", isSolid ? "text-primary" : "text-white")} />
          ) : (
            <Menu className={cn("h-8 w-8", isSolid ? "text-primary" : "text-white")} />
          )}
        </button>
      </div>

      <div className={cn("fixed inset-0 top-[70px] bg-background z-40 transition-transform duration-500 md:hidden", isOpen ? "translate-x-0" : "translate-x-full")}>
        <div className="flex flex-col p-10 space-y-8 h-full bg-white">
          <div className="flex flex-col gap-2 mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Coastal Sands Retreat</p>
            <h2 className="text-3xl font-headline font-bold">Menu</h2>
          </div>
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className={cn("text-3xl font-headline font-bold border-b border-muted pb-4", pathname === link.href ? "text-primary" : "text-foreground")}>
              {link.name}
            </Link>
          ))}
          <div className="pt-4 flex flex-col gap-6">
            <Button className="w-full text-lg py-8 rounded-2xl font-bold" size="lg">Reserve Your Oasis</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
