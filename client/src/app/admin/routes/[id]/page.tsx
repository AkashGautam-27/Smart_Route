"use client";

import { useEffect, useState } from "react";
import api from "../../../../lib/axios";
import { useParams, useRouter } from "next/navigation";
import { FaRoute, FaMapMarkerAlt, FaClock, FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import Link from "next/link";
import MapView from "../../../../components/map/MapView";

export default function AdminRouteDetailsPage() {
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
      <div className="flex flex-col items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading route data...</p>
      </div>
    );
  }

  if (error || !route) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <FaExclamationTriangle className="text-6xl text-amber-500 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || "Route not found"}</h2>
        <button 
          onClick={() => router.push('/admin/routes')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Back to Admin Routes
        </button>
      </div>
    );
  }

  // Ensure stops are ordered
  const orderedStops = [...(route.stops || [])].sort((a: any, b: any) => a.sequence - b.sequence);

  return (
    <div className="pb-10">
      <div className="mb-6">
        <Link href="/admin/routes" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-4 transition-colors">
          <FaArrowLeft className="mr-2" /> Back to Routes List
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              {route.name}
              <span className="ml-3 bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider align-middle">
                {route.routeCode}
              </span>
            </h2>
            <div className="flex space-x-6 mt-2">
              <span className="text-sm font-medium text-gray-600 flex items-center">
                <FaRoute className="text-blue-500 mr-2" /> {route.distance} km
              </span>
              <span className="text-sm font-medium text-gray-600 flex items-center">
                <FaClock className="text-purple-500 mr-2" /> {route.estimatedDuration} mins
              </span>
              <span className={`text-sm font-medium flex items-center ${route.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                <FaCheckCircle className="mr-1" /> {route.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          <div>
            <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm">
              Edit Route
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Stops List */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-[500px] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 shrink-0">
              <h3 className="text-md font-bold text-gray-900 flex items-center">
                <FaMapMarkerAlt className="text-blue-600 mr-2" />
                Ordered Stops
              </h3>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
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
                          <h4 className="text-sm font-bold text-gray-900">{stop.name}</h4>
                          <div className="flex items-center text-xs text-gray-500 mt-0.5">
                            {stop.code && <span className="mr-2">Code: {stop.code}</span>}
                            <span>• Lat: {stop.latitude?.toFixed(4) || 'N/A'}, Lng: {stop.longitude?.toFixed(4) || 'N/A'}</span>
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
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 h-[500px] flex flex-col relative z-0">
            <MapView stops={orderedStops} className="w-full h-full rounded-lg" />
          </div>
        </div>

      </div>
    </div>
  );
}
