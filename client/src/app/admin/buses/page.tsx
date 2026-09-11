"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaEdit, FaTrash, FaBus, FaEye, FaTimes } from "react-icons/fa";
import Link from "next/link";

export default function BusesPage() {
  const [buses, setBuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    busNumber: "",
    registrationNumber: "",
    operator: "",
    busType: "ordinary",
    capacity: 40,
    status: "active"
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleCreateBus = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError("");

    try {
      const res = await api.post("/buses", formData);
      if (res.data.success) {
        setShowModal(false);
        setFormData({
          busNumber: "",
          registrationNumber: "",
          operator: "",
          busType: "ordinary",
          capacity: 40,
          status: "active"
        });
        fetchBuses();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create bus");
    } finally {
      setSubmitLoading(false);
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
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 shadow-sm transition-colors"
        >
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

      {/* Create Bus Modal */}
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
                <h3 className="text-lg font-bold text-gray-900">Add New Bus</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleCreateBus} className="p-6 overflow-y-auto max-h-[80vh]">
                {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">{error}</div>}
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bus Number / Display Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. SMR-101"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={formData.busNumber}
                      onChange={(e) => setFormData({...formData, busNumber: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. MP-19-AB-1234"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={formData.registrationNumber}
                      onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Operator / Company Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={formData.operator}
                      onChange={(e) => setFormData({...formData, operator: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bus Type</label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={formData.busType}
                        onChange={(e) => setFormData({...formData, busType: e.target.value})}
                      >
                        <option value="ordinary">Ordinary</option>
                        <option value="express">Express</option>
                        <option value="ac">AC</option>
                        <option value="electric">Electric</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                      <input 
                        type="number" 
                        required
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={formData.capacity}
                        onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                      />
                    </div>
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
                    {submitLoading ? "Adding..." : "Add Bus"}
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
