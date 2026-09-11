import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import the inner map component with SSR disabled
const MapViewInner = dynamic(() => import('./MapViewInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
        <p className="text-gray-500 font-medium">Loading map...</p>
      </div>
    </div>
  )
});

export interface MapStop {
  _id: string;
  name: string;
  code?: string;
  latitude: number;
  longitude: number;
  sequence: number;
}

export interface MapViewProps {
  stops: MapStop[];
  className?: string;
  zoom?: number;
  center?: [number, number];
  driverLocation?: { latitude: number; longitude: number; accuracy?: number; lastUpdated?: string };
}

const MapView: React.FC<MapViewProps> = (props) => {
  return <MapViewInner {...props} />;
};

export default MapView;
