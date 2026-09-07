"use client";

import { useEffect, useState } from "react";
import api from "../../../../lib/axios";
import { useParams, useRouter } from "next/navigation";
import { FaArrowLeft, FaBus, FaRoute, FaUserTie, FaInfoCircle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function BusDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [bus, setBus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        const res = await api.get(`/buses/${params.id}`);
        if (res.data.success) {
          setBus(res.data.bus);
        }
      } catch (error) {
        console.error("Failed to fetch bus details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusDetails();
  }, [params.id]);

  if (loading) return <p className="text-gray-500 mt-10">Loading bus details...</p>;
  if (!bus) return <p className="text-red-500 mt-10">Bus not found.</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => router.back()}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <FaArrowLeft className="mr-2" /> Back to Buses
      </button>

      <div className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden"
        >
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex items-center justify-between">
            <div className="flex items-center">
              <FaBus className="text-blue-600 text-2xl mr-3" />
              <h2 className="text-xl font-bold text-blue-900">Bus Information</h2>
            </div>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${bus.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {bus.status.toUpperCase()}
            </span>
          </div>
          
          <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Bus Number</p>
              <p className="text-lg font-bold text-gray-900">{bus.busNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Registration Number</p>
              <p className="text-lg font-medium text-gray-900">{bus.registrationNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Operator</p>
              <p className="text-lg font-medium text-gray-900">{bus.operator}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Bus Type</p>
              <p className="text-lg font-medium text-gray-900 capitalize">{bus.busType}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Capacity</p>
              <p className="text-lg font-medium text-gray-900">{bus.capacity} seats</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden"
          >
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center">
              <FaUserTie className="text-gray-600 mr-2" />
              <h3 className="font-bold text-gray-900">Driver Information</h3>
            </div>
            <div className="p-6">
              {!bus.driverId ? (
                <p className="text-gray-500 italic">No driver assigned</p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{bus.driverId.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Mobile</p>
                    <p className="font-medium text-gray-900">{bus.driverId.mobileNumber || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{bus.driverId.email}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden"
          >
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center">
              <FaRoute className="text-gray-600 mr-2" />
              <h3 className="font-bold text-gray-900">Route Information</h3>
            </div>
            <div className="p-6">
              {!bus.routeId ? (
                <p className="text-gray-500 italic">No route assigned</p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500">Route</p>
                    <p className="font-medium text-gray-900">{bus.routeId.name}</p>
                  </div>
                  {/* Ideally, we would have source/destination populated, but route details are enough here based on standard populate */}
                  <div className="flex items-center text-blue-600 text-sm mt-4">
                    <FaInfoCircle className="mr-1" />
                    <span>View full route map on Routes page</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
