
"use client";

import React from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import Image from 'next/image';

const InteractiveMap = () => {
  // Coordinates for Mombasa, Kenya
  const position = { lat: -4.0435, lng: 39.6682 };
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="relative w-full h-full min-h-[400px] bg-muted flex flex-col items-center justify-center p-8 text-center overflow-hidden">
        <Image
          src="https://picsum.photos/seed/mombasa-map/800/600"
          alt="Mombasa Map Placeholder"
          fill
          className="object-cover opacity-20 grayscale"
          data-ai-hint="city map"
        />
        <div className="relative z-10">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-primary/10 max-w-sm">
            <p className="text-primary font-bold mb-2">Location: Mombasa</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Google Maps is currently in preview mode. Our resort is conveniently located with easy access to the historic city of <strong>Mombasa</strong> and its vibrant coastal culture.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[400px]">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={position}
          defaultZoom={12}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          <Marker position={position} title="Mombasa, Kenya" />
        </Map>
      </APIProvider>
    </div>
  );
};

export default InteractiveMap;
