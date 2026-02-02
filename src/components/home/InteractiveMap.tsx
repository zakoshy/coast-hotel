
"use client";

import React from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

const InteractiveMap = () => {
  // Coastal Sands Retreat Coordinates (Example Diani Beach)
  const position = { lat: -4.2986, lng: 39.5898 };

  return (
    <div className="w-full h-full min-h-[400px]">
      {/* 
        Note: In a real app, the API key would be in .env 
        Using a placeholder here or potentially a free public key if available
      */}
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
        <Map
          defaultCenter={position}
          defaultZoom={14}
          mapId="hotel_map"
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
