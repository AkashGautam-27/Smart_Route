"use client";

import { useEffect, useState } from "react";
import api from "../../lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkedAlt, FaMapMarkerAlt, FaRoute, FaClock, FaArrowRight, FaSearch, FaBus } from "react-icons/fa";
import Link from "next/link";

export default function PublicRoutesPage() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [stops, setStops] = useState<any[]>([]);
  const [buses, setBuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchSource, setSearchSource] = useState("");
  const [searchDestination, setSearchDestination] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [routesRes, stopsRes, busesRes] = await Promise.all([
          api.get(`/routes`),
          api.get(`/stops`),
          api.get(`/buses`)
        ]);
        
        if (routesRes.data.success) setRoutes(routesRes.data.routes);
        if (stopsRes.data.success) setStops(stopsRes.data.stops);
        if (busesRes.data.success) setBuses(busesRes.data.buses);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter routes based on search criteria
  const filteredRoutes = routes.filter(route => {
    const matchSource = searchSource ? (route.source?._id === searchSource || route.source === searchSource) : true;
    const matchDest = searchDestination ? (route.destination?._id === searchDestination || route.destination === searchDestination) : true;
    return matchSource && matchDest;
  });

  // Get buses for a specific route
  const getBusesForRoute = (routeId: string) => {
    return buses.filter(bus => bus.routeId?._id === routeId || bus.routeId === routeId);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 flex items-center justify-center">
          <FaMapMarkedAlt className="mr-4 text-blue-600" />
          Find Your Route
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Search for active bus routes connecting your destination and see live bus assignments.
        </p>
      </motion.div>

      {/* Search Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-12 max-w-4xl mx-auto relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">From (Source)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMapMarkerAlt className="text-green-500" />
              </div>
              <select 
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-gray-800"
                value={searchSource}
                onChange={(e) => setSearchSource(e.target.value)}
              >
                <option value="">Any Stop</option>
                {stops.map(stop => (
                  <option key={stop._id} value={stop._id}>{stop.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">To (Destination)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMapMarkerAlt className="text-red-500" />
              </div>
              <select 
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-gray-800"
                value={searchDestination}
                onChange={(e) => setSearchDestination(e.target.value)}
              >
                <option value="">Any Stop</option>
                {stops.map(stop => (
                  <option key={stop._id} value={stop._id}>{stop.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <button 
            onClick={() => {setSearchSource(""); setSearchDestination("");}}
            className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </motion.div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {filteredRoutes.length} Route{filteredRoutes.length !== 1 ? 's' : ''} Found
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnimatePresence>
          {filteredRoutes.map((route, index) => {
            const routeBuses = getBusesForRoute(route._id);
            return (
              <motion.div 
                key={route._id} 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 flex flex-col hover:shadow-lg transition-shadow"
              >
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-blue-900">{route.name}</h3>
                  <span className="bg-white border border-blue-200 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase shadow-sm">
                    {route.routeCode}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                        <FaMapMarkerAlt className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">From</p>
                        <p className="text-sm font-bold text-gray-900">{route.source?.name}</p>
                      </div>
                    </div>
                    
                    <div className="hidden md:flex flex-1 items-center justify-center px-4">
                      <div className="h-0.5 w-full bg-gray-200 relative">
                        <FaRoute className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 bg-white px-2 text-2xl" />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
                        <FaMapMarkerAlt className="text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">To</p>
                        <p className="text-sm font-bold text-gray-900">{route.destination?.name}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-around bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500 uppercase font-bold mb-1">Distance</span>
                      <span className="font-semibold text-gray-900">{route.distance} km</span>
                    </div>
                    <div className="w-px h-8 bg-gray-200"></div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500 uppercase font-bold mb-1">Time</span>
                      <span className="font-semibold text-gray-900">{route.estimatedDuration}</span>
                    </div>
                    <div className="w-px h-8 bg-gray-200"></div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500 uppercase font-bold mb-1">Stops</span>
                      <span className="font-semibold text-gray-900">{route.stops?.length || 0}</span>
                    </div>
                  </div>

                  {/* Buses Section */}
                  <div className="mb-6 flex-1">
                    <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center">
                      <FaBus className="mr-2 text-blue-500" /> Active Buses ({routeBuses.length})
                    </h4>
                    {routeBuses.length > 0 ? (
                      <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                        {routeBuses.map(bus => (
                          <div key={bus._id} className="flex justify-between items-center bg-blue-50/50 p-2 rounded-lg border border-blue-100/50">
                            <div>
                              <p className="text-sm font-bold text-gray-900">{bus.busNumber}</p>
                              <p className="text-xs text-gray-500">{bus.operator}</p>
                            </div>
                            <span className="text-xs font-semibold bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-700">
                              {bus.busType} • {bus.capacity} seats
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg border border-gray-100 text-center">
                        No buses currently assigned to this route.
                      </div>
                    )}
                  </div>

                  <Link 
                    href={`/routes/${route._id}`}
                    className="mt-auto w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow-md group"
                  >
                    View Interactive Map 
                    <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {filteredRoutes.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <FaSearch className="mx-auto text-4xl text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No routes found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We couldn't find any routes connecting the selected stops. Try changing your search criteria or clearing filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
