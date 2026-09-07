"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/axios";
import { motion } from "framer-motion";
import { FaPlus, FaEdit, FaTrash, FaMapPin } from "react-icons/fa";

export default function StopsPage() {
  const [stops, setStops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStops();
  }, []);

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

  const deleteStop = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await api.delete(`/stops/${id}`);
      if (res.data.success) fetchStops();
      else alert(res.data.message);
    } catch (err: any) {
      alert(err.response?.data?.message || "Error deleting stop");
    }
  };

  if (loading) return <p className="text-gray-500">Loading stops...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaMapPin className="mr-3 text-blue-600" />
          Stop Management
        </h2>
        <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 shadow-sm transition-colors">
          <FaPlus className="mr-2" /> Add Stop
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lat/Lng</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stops.map((stop, index) => (
              <motion.tr 
                key={stop._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{stop.code}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stop.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stop.latitude}, {stop.longitude}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-4 transition-colors">
                    <FaEdit className="inline" />
                  </button>
                  <button onClick={() => deleteStop(stop._id)} className="text-red-600 hover:text-red-900 transition-colors">
                    <FaTrash className="inline" />
                  </button>
                </td>
              </motion.tr>
            ))}
            {stops.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No stops found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
