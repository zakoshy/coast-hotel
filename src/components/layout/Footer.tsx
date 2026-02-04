'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

const PUBLIC_HOTEL_ID = 'coastal-sands-retreat';

const Footer = () => {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  const db = useFirestore();

  const hotelRef = useMemoFirebase(() => doc(db, 'hotels', PUBLIC_HOTEL_ID), [db]);
  const { data: hotelData } = useDoc(hotelRef);

  if (isAdminPage) return null;

  return (
    <footer className="bg-primary text-white py-20 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="flex flex-col mb-8">
            <span className="text-3xl font-headline font-bold leading-tight uppercase">{hotelData?.name || "COASTAL SANDS"}</span>
            <span className="text-xs tracking-[0.2em] uppercase font-body text-secondary">Retreat • {hotelData?.location?.split(',')[0] || "Diani"}</span>
          </Link>
          <p className="text-white/70 mb-8 leading-relaxed">
            {hotelData?.description?.slice(0, 150)}...
          </p>
          <div className="flex gap-4">
            <Link href="#" className="p-2 bg-white/10 rounded-full hover:bg-secondary transition-colors"><Instagram className="h-5 w-5" /></Link>
            <Link href="#" className="p-2 bg-white/10 rounded-full hover:bg-secondary transition-colors"><Facebook className="h-5 w-5" /></Link>
            <Link href="#" className="p-2 bg-white/10 rounded-full hover:bg-secondary transition-colors"><Twitter className="h-5 w-5" /></Link>
          </div>
        </div>

        <div>
          <h4 className="text-xl font-headline font-bold mb-6 text-secondary">Quick Links</h4>
          <ul className="space-y-4 text-white/70">
            <li><Link href="/rooms" className="hover:text-white transition-colors">Rooms & Suites</Link></li>
            <li><Link href="/experiences" className="hover:text-white transition-colors">Experiences</Link></li>
            <li><Link href="/dining" className="hover:text-white transition-colors">Dining & Bars</Link></li>
            <li><Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
            <li><Link href="/offers" className="hover:text-white transition-colors">Special Offers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xl font-headline font-bold mb-6 text-secondary">Contact Us</h4>
          <ul className="space-y-4 text-white/70">
            <li className="flex items-start gap-3">
              <MapPin className="h-5 w-5 shrink-0 text-secondary" />
              <span>{hotelData?.location || "Diani Beach Road, Kenya"}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-5 w-5 shrink-0 text-secondary" />
              <span>{hotelData?.contactNumber || "+254 712 345 678"}</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-5 w-5 shrink-0 text-secondary" />
              <span>{hotelData?.email || "info@coastalsandsretreat.com"}</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xl font-headline font-bold mb-6 text-secondary">Newsletter</h4>
          <p className="text-white/70 mb-6">Subscribe to receive seasonal offers and news from Diani.</p>
          <form className="flex gap-2">
            <input type="email" placeholder="Your email" className="bg-white/10 border-white/20 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-secondary text-white" />
            <button className="bg-secondary text-primary px-4 py-2 rounded-lg font-bold hover:bg-secondary/90 transition-colors">Join</button>
          </form>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-white/50">
        <p>© {new Date().getFullYear()} {hotelData?.name || "Coastal Sands Retreat"}. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;