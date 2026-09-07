"use client";

import { useEffect, useState } from "react";
import api from "../../lib/axios";
import { motion } from "framer-motion";
import { FaUserShield, FaUsers, FaBus, FaMapMarkedAlt, FaMapPin, FaCheckCircle } from "react-icons/fa";
import { authService } from "../../services/auth.service";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    totalAdmins: 0,
    totalDrivers: 0,
    activeDrivers: 0,
    totalBuses: 0,
    activeBuses: 0,
    totalRoutes: 0,
    totalStops: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const userRes = await authService.getCurrentUser();
        const superAdmin = userRes.user?.isSuperAdmin;
        setIsSuperAdmin(superAdmin);

        if (superAdmin) {
          try {
            const dashRes = await api.get("/main-admin/dashboard");
            if (dashRes.data.success) {
              const data = dashRes.data.data;
              setMetrics({
                totalAdmins: data.totalAdmins,
                totalDrivers: data.totalDrivers,
                activeDrivers: data.activeDrivers,
                totalBuses: data.totalBuses,
                activeBuses: data.activeBuses,
                totalRoutes: data.totalRoutes,
                totalStops: data.totalStops,
              });
              return;
            }
          } catch (e) {
            console.error("Failed to fetch dashboard metrics");
          }
        }

        // Fallback for regular admins
        const [driverRes, busRes, routeRes, stopRes] = await Promise.all([
          api.get("/drivers"),
          api.get("/buses"),
          api.get("/routes"),
          api.get("/stops"),
        ]);

        const drivers = driverRes.data.success ? driverRes.data.drivers : [];
        const buses = busRes.data.success ? busRes.data.buses : [];
        
        setMetrics({
          totalAdmins: 0,
          totalDrivers: drivers.length,
          activeDrivers: drivers.filter((d: any) => d.isActive).length,
          totalBuses: buses.length,
          activeBuses: buses.filter((b: any) => b.status === "active").length,
          totalRoutes: routeRes.data.success ? routeRes.data.routes.length : 0,
          totalStops: stopRes.data.success ? stopRes.data.stops.length : 0,
        });

      } catch (error) {
        console.error("Failed to fetch dashboard metrics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return <p className="text-gray-500 mt-10">Loading Dashboard...</p>;
  }

  const statCards = [
    { title: "Total Drivers", value: metrics.totalDrivers, icon: <FaUsers />, color: "bg-blue-500", show: true },
    { title: "Active Drivers", value: metrics.activeDrivers, icon: <FaCheckCircle />, color: "bg-green-500", show: true },
    { title: "Total Buses", value: metrics.totalBuses, icon: <FaBus />, color: "bg-purple-500", show: true },
    { title: "Active Buses", value: metrics.activeBuses, icon: <FaCheckCircle />, color: "bg-green-500", show: true },
    { title: "Total Routes", value: metrics.totalRoutes, icon: <FaMapMarkedAlt />, color: "bg-orange-500", show: true },
    { title: "Total Stops", value: metrics.totalStops, icon: <FaMapPin />, color: "bg-red-500", show: true },
    { title: "Total Admins", value: metrics.totalAdmins, icon: <FaUserShield />, color: "bg-gray-800", show: isSuperAdmin },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statCards.filter(card => card.show).map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center"
          >
            <div className={`h-12 w-12 rounded-lg ${stat.color} text-white flex items-center justify-center text-2xl mr-4 shadow-md`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
