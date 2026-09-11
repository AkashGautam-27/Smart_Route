"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapLegend from './MapLegend';
import { MapViewProps, MapStop } from './MapView';

// Custom Map Bounds Fitter
const MapBoundsFitter = ({ stops }: { stops: MapStop[] }) => {
  const map = useMap();

  useEffect(() => {
    if (stops && stops.length > 0) {
      // Filter out invalid coordinates
      const validStops = stops.filter(
        (stop) => 
          stop.latitude !== undefined && 
          stop.longitude !== undefined && 
          !isNaN(stop.latitude) && 
          !isNaN(stop.longitude)
      );

      if (validStops.length > 0) {
        const bounds = L.latLngBounds(
          validStops.map((stop) => [stop.latitude, stop.longitude])
        );
        // Pad the bounds slightly so markers don't hit the very edge
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [stops, map]);

  return null;
};

// Create custom icons using divIcon for better styling
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `<div style="
      background-color: ${color};
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      transform: translate(-50%, -50%);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const sourceIcon = createCustomIcon('#22c55e'); // Green
const destinationIcon = createCustomIcon('#ef4444'); // Red
const stopIcon = createCustomIcon('#3b82f6'); // Blue

const MapViewInner: React.FC<MapViewProps> = ({ stops, className = '', zoom = 12, center, driverLocation }) => {
  const [hasInvalidCoordinates, setHasInvalidCoordinates] = useState(false);

  // Validate coordinates
  const validStops = stops.filter((stop) => {
    const isValid = stop.latitude != null && stop.longitude != null && !isNaN(stop.latitude) && !isNaN(stop.longitude);
    if (!isValid) {
      setHasInvalidCoordinates(true);
    }
    return isValid;
  });

  // Default center if no stops provided
  const mapCenter: [number, number] = center || 
    (validStops.length > 0 ? [validStops[0].latitude, validStops[0].longitude] : [24.6005, 80.8322]);

  // Order stops by sequence
  const orderedStops = [...validStops].sort((a, b) => a.sequence - b.sequence);
  const polylinePositions = orderedStops.map(stop => [stop.latitude, stop.longitude] as [number, number]);

  return (
    <div className={`relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden border border-gray-200 shadow-inner ${className}`}>
      {hasInvalidCoordinates && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-[1000] bg-amber-100 border border-amber-200 text-amber-800 px-4 py-2 rounded-md shadow-sm text-sm font-medium">
          Warning: Some stops have invalid map coordinates and are hidden.
        </div>
      )}
      
      <MapContainer 
        center={mapCenter} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {orderedStops.length > 0 && (
          <MapBoundsFitter stops={orderedStops} />
        )}

        {/* Route Path */}
        {polylinePositions.length > 1 && (
          <Polyline 
            positions={polylinePositions} 
            color="#2563eb" 
            weight={5} 
            opacity={0.8}
            lineCap="round"
            lineJoin="round"
          />
        )}

        {/* Markers */}
        {orderedStops.map((stop, index) => {
          let icon = stopIcon;
          let label = "Stop";
          
          if (index === 0) {
            icon = sourceIcon;
            label = "Source";
          } else if (index === orderedStops.length - 1) {
            icon = destinationIcon;
            label = "Destination";
          }

          return (
            <Marker 
              key={stop._id} 
              position={[stop.latitude, stop.longitude]}
              icon={icon}
            >
              <Popup className="rounded-lg shadow-md border-none">
                <div className="text-center p-1 min-w-[120px]">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</p>
                  <h3 className="text-lg font-extrabold text-gray-900 leading-tight">{stop.name}</h3>
                  {stop.code && (
                    <p className="text-sm font-medium text-gray-600 mt-1">Code: {stop.code}</p>
                  )}
                  <p className="text-sm font-medium text-gray-600">Sequence: {stop.sequence}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
        {/* Driver Location Marker */}
        {driverLocation && (
          <Marker 
            position={[driverLocation.latitude, driverLocation.longitude]}
            icon={createCustomIcon('#f59e0b')} // Amber for driver
            zIndexOffset={1000} // Ensure driver is on top
          >
            <Popup className="rounded-lg shadow-md border-none">
              <div className="text-center p-1 min-w-[150px]">
                <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Your Current Location</p>
                <div className="mt-2 text-sm text-gray-700">
                  <p><strong>Accuracy:</strong> {driverLocation.accuracy ? `${Math.round(driverLocation.accuracy)} m` : 'Unavailable'}</p>
                  {driverLocation.lastUpdated && (
                    <p><strong>Updated:</strong> {driverLocation.lastUpdated}</p>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      
      <MapLegend />
    </div>
  );
};

export default MapViewInner;
