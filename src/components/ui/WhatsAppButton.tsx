
"use client";

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = "254123456789"; // Replace with actual Kenyan hotel number
    const message = encodeURIComponent("Jambo! I would like to inquire about a booking at Coastal Sands Retreat.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleWhatsAppClick}
        size="icon"
        className="h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#128C7E] shadow-2xl transition-transform hover:scale-110 active:scale-95 border-none"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="h-8 w-8 text-white fill-white" />
      </Button>
    </div>
  );
};

export default WhatsAppButton;
