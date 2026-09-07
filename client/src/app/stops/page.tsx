"use client";

import { useEffect, useState } from "react";
import api from "../../lib/axios";
import { motion } from "framer-motion";
import { FaMapPin, FaMapSigns } from "react-icons/fa";

export default function PublicStopsPage() {
  const [stops, setStops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStops = async () => {
      try {
        const res = await api.get(`/stops`);
        if (res.data.success) {
          setStops(res.data.stops);
        }
      } catch (error) {
        console.error("Failed to fetch stops", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStops();
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading stops...</p>;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center"
      >
        <FaMapPin className="mr-3 text-blue-600" />
        Bus Stops Network
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stops.map((stop, index) => (
          <motion.div 
            key={stop._id} 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500 transition-all hover:shadow-md"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">{stop.name}</h3>
              <FaMapSigns className="text-2xl text-blue-200" />
            </div>
            <div className="bg-gray-50 rounded p-3 mb-3">
              <p className="text-xs text-gray-500 uppercase font-semibold">Stop Code</p>
              <p className="text-lg font-mono font-bold text-blue-700">{stop.code}</p>
            </div>
            <div className="text-sm text-gray-600">
              <p className="mb-1"><strong>Lat:</strong> {stop.latitude}</p>
              <p className="mb-1"><strong>Lng:</strong> {stop.longitude}</p>
            </div>
            {stop.address && (
              <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
                {stop.address}
              </div>
            )}
          </motion.div>
        ))}
        {stops.length === 0 && <p className="text-gray-500 col-span-full">No stops available.</p>}
      </div>
    </div>
  );
}
