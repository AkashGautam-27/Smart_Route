"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaEdit, FaTrash, FaMapPin, FaTimes } from "react-icons/fa";

export default function StopsPage() {
  const [stops, setStops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    latitude: 0,
    longitude: 0,
    address: ""
  });

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

  const handleCreateStop = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError("");

    try {
      const res = await api.post("/stops", formData);
      if (res.data.success) {
        setShowModal(false);
        setFormData({
          name: "",
          code: "",
          latitude: 0,
          longitude: 0,
          address: ""
        });
        fetchStops();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create stop");
    } finally {
      setSubmitLoading(false);
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
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 shadow-sm transition-colors"
        >
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
                  <a href={`/admin/stops/${stop._id}`} className="text-purple-600 hover:text-purple-900 mr-4 transition-colors inline-flex items-center" title="View Map">
                    <FaMapPin className="inline mr-1" /> Map
                  </a>
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

      {/* Create Stop Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900">Add New Stop</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleCreateStop} className="p-6 overflow-y-auto max-h-[80vh]">
                {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">{error}</div>}
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stop Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Satna Bus Stand"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stop Code</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. STN"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 uppercase"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                      <input 
                        type="number" 
                        step="any"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={formData.latitude}
                        onChange={(e) => setFormData({...formData, latitude: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                      <input 
                        type="number" 
                        step="any"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={formData.longitude}
                        onChange={(e) => setFormData({...formData, longitude: parseFloat(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address (Optional)</label>
                    <textarea 
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    ></textarea>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={submitLoading}
                    className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {submitLoading ? "Adding..." : "Add Stop"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
