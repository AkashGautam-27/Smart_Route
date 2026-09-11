"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/axios";
import { useParams, useRouter } from "next/navigation";
import { FaRoute, FaMapMarkerAlt, FaClock, FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import Link from "next/link";
import MapView from "../../../components/map/MapView";

export default function RouteDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [route, setRoute] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const res = await api.get(`/routes/${id}`);
        if (res.data.success) {
          setRoute(res.data.route);
        } else {
          setError("Failed to load route details.");
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("Route not found.");
        } else {
          setError("Unable to load route information. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchRoute();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-4 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading route information...</p>
      </div>
    );
  }

  if (error || !route) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 px-4 flex flex-col items-center">
        <FaExclamationTriangle className="text-6xl text-amber-500 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || "Route not found"}</h2>
        <button 
          onClick={() => router.push('/routes')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Back to Routes
        </button>
      </div>
    );
  }

  // Ensure stops are ordered
  const orderedStops = [...(route.stops || [])].sort((a: any, b: any) => a.sequence - b.sequence);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/routes" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-6 transition-colors">
            <FaArrowLeft className="mr-2" /> Back to Routes
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {route.routeCode}
                </span>
                <span className={`flex items-center text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  route.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {route.status === 'active' ? <><FaCheckCircle className="mr-1" /> Active</> : 'Inactive'}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                {route.name}
              </h1>
            </div>
            
            <div className="mt-6 md:mt-0 flex space-x-6">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Distance</span>
                <span className="text-lg font-bold text-gray-900 flex items-center">
                  <FaRoute className="text-blue-500 mr-2" /> {route.distance} km
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Duration</span>
                <span className="text-lg font-bold text-gray-900 flex items-center">
                  <FaClock className="text-purple-500 mr-2" /> {route.estimatedDuration} mins
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stops List */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <FaMapMarkerAlt className="text-blue-600 mr-2" />
                Route Stops
              </h3>
            </div>
            <div className="p-6">
              <div className="relative">
                {/* Vertical line connecting stops */}
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200"></div>
                
                <ul className="space-y-6 relative">
                  {orderedStops.map((stop: any, index: number) => {
                    const isFirst = index === 0;
                    const isLast = index === orderedStops.length - 1;
                    
                    return (
                      <li key={stop._id} className="relative flex items-start">
                        <div className={`absolute left-0 mt-1 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-sm z-10 ${
                          isFirst ? 'bg-green-500' : isLast ? 'bg-red-500' : 'bg-blue-500'
                        }`}>
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <div className="ml-12 flex-1">
                          <h4 className="text-md font-bold text-gray-900">{stop.name}</h4>
                          <div className="flex items-center mt-1 text-sm text-gray-500 space-x-4">
                            {stop.code && <span>Code: {stop.code}</span>}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Map Visualization */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 h-[500px] lg:h-[600px] flex flex-col relative z-0">
            <MapView stops={orderedStops} className="w-full h-full rounded-lg" />
          </div>
        </div>

      </div>
    </div>
  );
}
