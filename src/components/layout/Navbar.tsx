"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Rooms & Suites', href: '/rooms' },
    { name: 'Experiences', href: '/experiences' },
    { name: 'Dining', href: '/dining' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Offers', href: '/offers' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4',
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex flex-col">
          <span className={cn(
            "text-2xl font-headline font-bold leading-tight tracking-tight",
            scrolled ? "text-primary" : "text-white"
          )}>
            COASTAL SANDS
          </span>
          <span className={cn(
            "text-[10px] tracking-[0.3em] uppercase font-bold",
            scrolled ? "text-secondary" : "text-secondary"
          )}>
            Diani • Kenya
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-bold tracking-wide hover:text-secondary transition-colors",
                scrolled ? "text-foreground/80" : "text-white/90"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 shadow-lg">
            <Link href="/rooms#booking">Book Now</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          {isOpen ? (
            <X className={cn("h-8 w-8", scrolled ? "text-primary" : "text-white")} />
          ) : (
            <Menu className={cn("h-8 w-8", scrolled ? "text-primary" : "text-white")} />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 top-[80px] bg-background z-40 transition-transform duration-500 lg:hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col p-10 space-y-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-3xl font-headline font-bold text-foreground hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Button asChild className="w-full text-lg py-8 rounded-2xl" size="lg">
            <Link href="/rooms#booking" onClick={() => setIsOpen(false)}>Reserve Your Oasis</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;