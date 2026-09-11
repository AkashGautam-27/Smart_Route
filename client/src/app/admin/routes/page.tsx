"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/axios";
import { motion } from "framer-motion";
import { FaPlus, FaEdit, FaTrash, FaMapMarkedAlt } from "react-icons/fa";
import Link from "next/link";

export default function RoutesPage() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoutes();
  }, []);

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

  const deleteRoute = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await api.delete(`/routes/${id}`);
      if (res.data.success) fetchRoutes();
      else alert(res.data.message);
    } catch (err: any) {
      alert(err.response?.data?.message || "Error deleting route");
    }
  };

  if (loading) return <p className="text-gray-500">Loading routes...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaMapMarkedAlt className="mr-3 text-blue-600" />
          Route Management
        </h2>
        <Link href="/admin/routes/create" className="flex items-center bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 shadow-sm transition-colors">
          <FaPlus className="mr-2" /> Add Route
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destination</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distance (km)</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {routes.map((route, index) => (
              <motion.tr
                key={route._id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{route.routeCode}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{route.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{route.source?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{route.destination?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{route.distance}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/admin/routes/${route._id}`} className="text-purple-600 hover:text-purple-900 mr-4 transition-colors inline-flex items-center" title="View Map">
                    <FaMapMarkedAlt className="inline mr-1" /> Map
                  </Link>
                  <Link href={`/admin/routes/${route._id}/edit`} className="text-blue-600 hover:text-blue-900 mr-4 transition-colors inline-block" title="Edit Route">
                    <FaEdit className="inline" />
                  </Link>
                  <button onClick={() => deleteRoute(route._id)} className="text-red-600 hover:text-red-900 transition-colors" title="Delete Route">
                    <FaTrash className="inline" />
                  </button>
                </td>
              </motion.tr>
            ))}
            {routes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No routes found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
