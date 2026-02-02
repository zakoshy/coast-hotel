
"use client";

import React from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import Image from 'next/image';

const InteractiveMap = () => {
  // Coastal Sands Retreat Coordinates (Example Diani Beach)
  const position = { lat: -4.2986, lng: 39.5898 };
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="relative w-full h-full min-h-[400px] bg-muted flex flex-col items-center justify-center p-8 text-center overflow-hidden">
        <Image
          src="https://picsum.photos/seed/map/800/600"
          alt="Map Placeholder"
          fill
          className="object-cover opacity-20 grayscale"
        />
        <div className="relative z-10">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-primary/10 max-w-sm">
            <p className="text-primary font-bold mb-2">Map Preview</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Google Maps is currently unavailable because the API key is not configured in the environment. 
              Please add <strong>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</strong> to your environment variables.
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
          defaultZoom={14}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          <Marker position={position} title="Coastal Sands Retreat" />
        </Map>
      </APIProvider>
    </div>
  );
};

export default InteractiveMap;
