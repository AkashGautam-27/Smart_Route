"use client";

import { useEffect, useState } from "react";
import api from "../../lib/axios";
import { motion } from "framer-motion";
import { FaBus, FaUsers, FaInfoCircle } from "react-icons/fa";

export default function PublicBusesPage() {
  const [buses, setBuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const res = await api.get(`/buses`);
        if (res.data.success) {
          setBuses(res.data.buses);
        }
      } catch (error) {
        console.error("Failed to fetch buses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading buses...</p>;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center"
      >
        <FaBus className="mr-3 text-blue-600" />
        Public Buses
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buses.map((bus, index) => (
          <motion.div 
            key={bus._id} 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">{bus.busNumber}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bus.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {bus.status}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <FaUsers className="mr-3 text-gray-400 text-lg" />
                <span><strong>Capacity:</strong> {bus.capacity} seats</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FaInfoCircle className="mr-3 text-gray-400 text-lg" />
                <span><strong>Operator:</strong> {bus.operator}</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-blue-700">
                  Route: {bus.routeId ? bus.routeId.name : "Not assigned"}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
        {buses.length === 0 && <p className="text-gray-500">No buses available.</p>}
      </div>
    </div>
  );
}
