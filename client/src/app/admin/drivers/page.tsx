"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaUsers, FaToggleOn, FaToggleOff, FaEye, FaTimes } from "react-icons/fa";
import Link from "next/link";

export default function DriversPage() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [buses, setBuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", mobileNumber: "" });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const [driverRes, busRes] = await Promise.all([
        api.get(`/drivers`),
        api.get(`/buses`)
      ]);
      
      if (driverRes.data.success) setDrivers(driverRes.data.drivers);
      if (busRes.data.success) setBuses(busRes.data.buses);
    } catch (error) {
      console.error("Failed to fetch drivers data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await api.patch(`/drivers/${id}/status`, {
        isActive: !currentStatus 
      });
      if (res.data.success) fetchData();
      else alert(res.data.message);
    } catch (err: any) {
      alert(err.response?.data?.message || "Error updating status");
    }
  };

  const getDriverAssignment = (driverId: string) => {
    const bus = buses.find(b => b.driverId?._id === driverId);
    if (!bus) return { bus: "None", route: "None" };
    return {
      bus: bus.busNumber,
      route: bus.routeId ? bus.routeId.name : "None"
    };
  };

  const handleCreateDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError("");

    try {
      const res = await api.post("/drivers", formData);
      if (res.data.success) {
        setShowModal(false);
        setFormData({ name: "", email: "", password: "", mobileNumber: "" });
        fetchData();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create driver");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <p className="text-gray-500">Loading drivers...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaUsers className="mr-3 text-blue-600" />
          Driver Management
        </h2>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 shadow-sm transition-colors"
        >
          <FaPlus className="mr-2" /> Add Driver
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Bus</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {drivers.map((driver, index) => {
                const assignment = getDriverAssignment(driver._id);
                return (
                  <motion.tr 
                    key={driver._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{driver.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{driver.email}</div>
                      <div className="text-sm text-gray-500">{driver.mobileNumber || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={assignment.bus !== 'None' ? 'font-medium text-blue-600' : ''}>{assignment.bus}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assignment.route}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${driver.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {driver.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/admin/drivers/${driver._id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                        <FaEye className="inline" title="View Details" />
                      </Link>
                      <button 
                        onClick={() => toggleStatus(driver._id, driver.isActive)} 
                        className={`transition-colors ${driver.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                      >
                        {driver.isActive ? (
                          <FaToggleOff className="inline text-lg" title="Deactivate" />
                        ) : (
                          <FaToggleOn className="inline text-lg" title="Activate" />
                        )}
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
              {drivers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No drivers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Driver Modal */}
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
                <h3 className="text-lg font-bold text-gray-900">Register New Driver</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleCreateDriver} className="p-6">
                {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">{error}</div>}
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                    <input 
                      type="text" 
                      required
                      placeholder="+91 9876543210"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={formData.mobileNumber}
                      onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input 
                      type="password" 
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
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
                    {submitLoading ? "Creating..." : "Register Driver"}
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

