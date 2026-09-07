"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../../services/auth.service";
import { motion } from "framer-motion";
import { FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";

export default function DriverDashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authService.getCurrentUser();
        if (res.success && res.user.role === "driver") {
          setUser(res.user);
        } else {
          router.push("/login");
        }
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-blue-600 shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center text-white">
              <FaTachometerAlt className="text-2xl mr-3" />
              <h1 className="text-xl font-bold">
                SmartRoute Driver Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-sm font-medium text-blue-100">Welcome, {user?.name || "Driver"}</span>
              <button
                onClick={() => authService.logout()}
                className="flex items-center text-sm font-medium text-white hover:text-blue-200 transition-colors"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="border-4 border-dashed border-gray-300 rounded-lg h-96 flex flex-col items-center justify-center bg-white shadow-sm"
        >
          <FaTachometerAlt className="text-6xl text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">
            GPS tracking features will be implemented in later phases.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
