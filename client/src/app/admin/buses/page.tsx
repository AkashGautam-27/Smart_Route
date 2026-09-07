"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/axios";
import { motion } from "framer-motion";
import { FaPlus, FaEdit, FaTrash, FaBus, FaEye } from "react-icons/fa";
import Link from "next/link";

export default function BusesPage() {
  const [buses, setBuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBuses();
  }, []);

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

  const deleteBus = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await api.delete(`/buses/${id}`);
      if (res.data.success) fetchBuses();
      else alert(res.data.message);
    } catch (err: any) {
      alert(err.response?.data?.message || "Error deleting bus");
    }
  };

  if (loading) return <p className="text-gray-500">Loading buses...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaBus className="mr-3 text-blue-600" />
          Bus Management
        </h2>
        <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 shadow-sm transition-colors">
          <FaPlus className="mr-2" /> Add Bus
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bus Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reg. Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Driver Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {buses.map((bus, index) => (
                <motion.tr 
                  key={bus._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{bus.busNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bus.registrationNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{bus.operator}</div>
                    <div className="text-sm text-gray-500 uppercase">{bus.busType || "Unknown"} • {bus.capacity} seats</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bus.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {bus.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{bus.driverId ? bus.driverId.name : "Unassigned"}</div>
                    {bus.driverId?.mobileNumber && (
                      <div className="text-sm text-gray-500">{bus.driverId.mobileNumber}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bus.routeId ? bus.routeId.name : "Unassigned"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/admin/buses/${bus._id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                      <FaEye className="inline" title="View Details" />
                    </Link>
                    <button className="text-blue-600 hover:text-blue-900 mr-3 transition-colors">
                      <FaEdit className="inline" title="Edit" />
                    </button>
                    <button onClick={() => deleteBus(bus._id)} className="text-red-600 hover:text-red-900 transition-colors">
                      <FaTrash className="inline" title="Delete" />
                    </button>
                  </td>
                </motion.tr>
              ))}
              {buses.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">No buses found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
