"use client";

import { useEffect, useState } from "react";
import api from "../../../../lib/axios";
import { useParams, useRouter } from "next/navigation";
import { FaUser, FaArrowLeft, FaExclamationTriangle, FaBus, FaRoute, FaMapMarkerAlt, FaCircle } from "react-icons/fa";
import Link from "next/link";
import MapView from "../../../../components/map/MapView";

export default function AdminDriverDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const res = await api.get(`/admin/drivers/${id}/location`);
        if (res.data.success) {
          setData(res.data.data);
        } else {
          setError("Failed to load driver details.");
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("Driver not found.");
        } else {
          setError("Unable to load driver information. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchDriverDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading driver data...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <FaExclamationTriangle className="text-6xl text-amber-500 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || "Driver not found"}</h2>
        <button 
          onClick={() => router.push('/admin/drivers')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Back to Drivers List
        </button>
      </div>
    );
  }

  const { driver, bus, route, lastLocation } = data;
  const assignedRouteStops = route?.stops ? [...route.stops].sort((a: any, b: any) => a.sequence - b.sequence) : [];
  
  const formattedLocation = lastLocation ? {
    latitude: lastLocation.latitude,
    longitude: lastLocation.longitude,
    accuracy: lastLocation.accuracy,
    lastUpdated: new Date(lastLocation.recordedAt).toLocaleString(),
  } : undefined;

  return (
    <div className="pb-10">
      <div className="mb-6">
        <Link href="/admin/drivers" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-4 transition-colors">
          <FaArrowLeft className="mr-2" /> Back to Drivers List
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaUser className="mr-3 text-blue-600" />
              {driver.name}
            </h2>
            <div className="flex items-center mt-2 space-x-4 text-sm">
              <span className="text-gray-600 font-medium">{driver.email}</span>
              {driver.mobileNumber && (
                <span className="text-gray-600 font-medium border-l border-gray-300 pl-4">{driver.mobileNumber}</span>
              )}
            </div>
          </div>
          <div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${driver.isLocationSharingActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
              <FaCircle className="mr-1 text-[8px]" />
              {driver.isLocationSharingActive ? 'Sharing Location' : 'Not Sharing'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Details */}
        <div className="xl:col-span-1 space-y-6">
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-md font-bold text-gray-900 flex items-center mb-4 border-b border-gray-100 pb-2">
              Current Assignment
            </h3>
            
            {bus ? (
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <FaBus className="text-blue-500 text-xl mr-3" />
                  <div>
                    <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider">Assigned Bus</p>
                    <p className="text-md font-bold text-blue-900">{bus.busNumber}</p>
                    <p className="text-xs text-blue-600">{bus.registrationNumber}</p>
                  </div>
                </div>

                {route ? (
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <FaRoute className="text-green-500 text-xl mr-3" />
                    <div>
                      <p className="text-xs font-semibold text-green-800 uppercase tracking-wider">Assigned Route</p>
                      <p className="text-md font-bold text-green-900">{route.name}</p>
                      <p className="text-xs text-green-600">{route.routeCode}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-500">
                    No active route assigned to this bus.
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">This driver is not currently assigned to any active bus.</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-md font-bold text-gray-900 flex items-center mb-4 border-b border-gray-100 pb-2">
              Latest Location Info
            </h3>
            
            {lastLocation ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Coordinates</p>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono text-sm">
                    {lastLocation.latitude.toFixed(6)}, {lastLocation.longitude.toFixed(6)}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">GPS Accuracy</p>
                  <p className="text-sm font-medium text-gray-900">
                    {lastLocation.accuracy ? `${Math.round(lastLocation.accuracy)} meters` : "Unavailable"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Last Update</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(lastLocation.recordedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No location history exists for this driver.</p>
            )}
          </div>

        </div>

        {/* Right Column: Map */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 h-[600px] flex flex-col relative z-0">
            {(formattedLocation || assignedRouteStops.length > 0) ? (
              <MapView 
                stops={assignedRouteStops} 
                driverLocation={formattedLocation} 
                center={formattedLocation ? [formattedLocation.latitude, formattedLocation.longitude] : undefined}
                zoom={formattedLocation ? 14 : undefined}
                className="w-full h-full rounded-lg" 
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 rounded-lg">
                <FaMapMarkerAlt className="text-6xl text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">No location or route data to display on map.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
