"use client";

import { useEffect, useState } from "react";
import api from "../../lib/axios";
import { motion } from "framer-motion";
import { FaMapMarkedAlt, FaMapMarkerAlt, FaRoute, FaClock } from "react-icons/fa";

export default function PublicRoutesPage() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await api.get(`/routes`);
        if (res.data.success) {
          setRoutes(res.data.routes);
        }
      } catch (error) {
        console.error("Failed to fetch routes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading routes...</p>;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <motion.h1 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center"
      >
        <FaMapMarkedAlt className="mr-3 text-blue-600" />
        Available Routes
      </motion.h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {routes.map((route, index) => (
          <motion.div 
            key={route._id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
          >
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-blue-900">{route.name}</h3>
              <span className="bg-blue-200 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                {route.routeCode}
              </span>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <FaMapMarkerAlt className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">From</p>
                    <p className="text-sm font-medium text-gray-900">{route.source?.name}</p>
                  </div>
                </div>
                
                <div className="hidden md:flex flex-1 items-center justify-center px-4">
                  <div className="h-0.5 w-full bg-gray-200 relative">
                    <FaRoute className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 bg-white px-2 text-3xl" />
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
                    <FaMapMarkerAlt className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">To</p>
                    <p className="text-sm font-medium text-gray-900">{route.destination?.name}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-around bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-gray-600">
                  <FaRoute className="mr-2 text-blue-500" />
                  <span className="font-semibold">{route.distance} km</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaClock className="mr-2 text-blue-500" />
                  <span className="font-semibold">{route.estimatedDuration} mins</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {routes.length === 0 && <p className="text-gray-500">No routes available.</p>}
      </div>
    </div>
  );
}
