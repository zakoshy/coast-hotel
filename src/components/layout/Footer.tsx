
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Palmtree, ShieldCheck } from 'lucide-react';
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
    <footer className="bg-[#0f172a] text-white pt-24 pb-12 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          <div className="space-y-8">
            <Link href="/" className="flex flex-col group">
              <div className="flex items-center gap-3 mb-2">
                <Palmtree className="h-6 w-6 text-secondary" />
                <span className="text-2xl font-headline font-bold leading-tight uppercase tracking-tight group-hover:text-secondary transition-colors">
                  {hotelData?.name || "COASTAL SANDS"}
                </span>
              </div>
              <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-secondary/70">
                Luxury Retreat • {hotelData?.location?.split(',')[0] || "Diani"}
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Experience the perfect blend of modern luxury and Swahili soul on the pristine shores of Diani Beach.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <Link key={i} href="#" className="p-3 bg-white/5 rounded-2xl hover:bg-secondary hover:text-white transition-all transform hover:-translate-y-1">
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.3em] text-secondary mb-8">Navigation</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              {[
                { name: 'Rooms & Suites', href: '/rooms' },
                { name: 'Culinary Experiences', href: '/dining' },
                { name: 'Guest Activities', href: '/experiences' },
                { name: 'Visual Gallery', href: '/gallery' },
                { name: 'Special Offers', href: '/offers' }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="h-px w-0 bg-secondary transition-all group-hover:w-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.3em] text-secondary mb-8">Get In Touch</h4>
            <ul className="space-y-6 text-slate-400 text-sm">
              <li className="flex items-start gap-4">
                <MapPin className="h-5 w-5 shrink-0 text-secondary" />
                <span className="leading-relaxed">{hotelData?.location || "Prime Beach Road, Diani Beach, Kenya"}</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="h-5 w-5 shrink-0 text-secondary" />
                <span>{hotelData?.contactNumber || "+254 712 345 678"}</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="h-5 w-5 shrink-0 text-secondary" />
                <span className="truncate">{hotelData?.email || "stay@coastalsands.com"}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.3em] text-secondary mb-8">The Collection</h4>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Subscribe to receive exclusive seasonal offers and news from the Kenyan coast.
            </p>
            <form className="space-y-3">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-secondary transition-all" 
              />
              <button className="w-full bg-secondary text-white py-4 rounded-xl font-bold text-sm hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/10">
                Join the Circle
              </button>
            </form>
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          <p>© {new Date().getFullYear()} {hotelData?.name || "Coastal Sands Retreat"}. Crafted for Paradise.</p>
          <div className="flex items-center gap-8">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <Link href="/admin/login" className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg hover:bg-white/10 hover:text-white transition-all text-secondary">
              <ShieldCheck className="h-3 w-3" />
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
