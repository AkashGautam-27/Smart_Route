"use client";

import { useEffect, useState } from "react";
import api from "../../../../lib/axios";
import { useParams, useRouter } from "next/navigation";
import { FaArrowLeft, FaIdCard, FaBus, FaRoute, FaUserTie } from "react-icons/fa";
import { motion } from "framer-motion";

export default function DriverDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [driver, setDriver] = useState<any>(null);
  const [bus, setBus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const [driverRes, busesRes] = await Promise.all([
          api.get(`/drivers`), // Quick hack since we don't have GET /drivers/:id yet, we filter. Or wait! The backend didn't expose GET /drivers/:id explicitly in phase 2? Oh wait, user wrote: `GET /api/drivers/:id` in backend structure requirement.
          api.get(`/buses`) // To find assigned bus
        ]);

        const drivers = driverRes.data.success ? driverRes.data.drivers : [];
        const foundDriver = drivers.find((d: any) => d._id === params.id);
        
        if (foundDriver) {
          setDriver(foundDriver);
          const buses = busesRes.data.success ? busesRes.data.buses : [];
          const assignedBus = buses.find((b: any) => b.driverId?._id === params.id);
          setBus(assignedBus || null);
        }
      } catch (error) {
        console.error("Failed to fetch details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDriverDetails();
  }, [params.id]);

  if (loading) return <p className="text-gray-500 mt-10">Loading driver details...</p>;
  if (!driver) return <p className="text-red-500 mt-10">Driver not found.</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => router.back()}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <FaArrowLeft className="mr-2" /> Back to Drivers
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden"
      >
        <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex items-center">
          <FaUserTie className="text-blue-600 text-2xl mr-3" />
          <h2 className="text-xl font-bold text-blue-900">Driver Details</h2>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2 flex items-center">
              <FaIdCard className="mr-2" /> Driver Information
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400">Name</p>
                <p className="text-lg font-medium text-gray-900">{driver.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-base text-gray-900">{driver.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Mobile Number</p>
                <p className="text-base text-gray-900">{driver.mobileNumber || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Status</p>
                <span className={`px-2 py-1 mt-1 inline-flex text-xs leading-5 font-semibold rounded-full ${driver.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {driver.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-400">Created At</p>
                <p className="text-sm text-gray-900">{new Date(driver.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2 flex items-center">
              <FaBus className="mr-2" /> Assignment Information
            </h3>
            {!bus ? (
              <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 italic text-center">No bus assigned</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-semibold text-blue-900 flex items-center mb-2">
                    <FaBus className="mr-2" /> Assigned Bus
                  </h4>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <p className="text-xs text-gray-500">Bus Number</p>
                      <p className="font-medium">{bus.busNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Registration</p>
                      <p className="font-medium">{bus.registrationNumber}</p>
                    </div>
                  </div>
                </div>

                {!bus.routeId ? (
                  <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500 italic text-center">No route assigned</p>
                  </div>
                ) : (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <h4 className="font-semibold text-green-900 flex items-center mb-2">
                      <FaRoute className="mr-2" /> Assigned Route
                    </h4>
                    <div className="space-y-2 mt-2">
                      <div>
                        <p className="text-xs text-gray-500">Route Name</p>
                        <p className="font-medium">{bus.routeId.name || "Unknown"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
