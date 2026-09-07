"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { authService } from "../../services/auth.service";
import { motion } from "framer-motion";
import { FaBus, FaUsers, FaMapMarkedAlt, FaMapPin, FaTachometerAlt, FaSignOutAlt, FaUserShield } from "react-icons/fa";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authService.getCurrentUser();
        if (res.success && res.user.role === "admin") {
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
        <p className="text-gray-500">Loading Admin...</p>
      </div>
    );
  }

  const transportNav = [
    { name: "Buses", href: "/admin/buses", icon: <FaBus /> },
    { name: "Routes", href: "/admin/routes", icon: <FaMapMarkedAlt /> },
    { name: "Stops", href: "/admin/stops", icon: <FaMapPin /> },
  ];

  const peopleNav = [
    { name: "Drivers", href: "/admin/drivers", icon: <FaUsers /> },
  ];

  if (user?.isSuperAdmin) {
    peopleNav.push({ name: "Admins", href: "/admin/admins", icon: <FaUserShield /> });
  }

  const renderNavGroup = (items: typeof transportNav) => (
    <ul className="space-y-1">
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <li key={item.name}>
            <Link
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className={`mr-3 text-lg ${isActive ? "text-blue-700" : "text-gray-400"}`}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex overflow-hidden">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 bg-white shadow-md flex flex-col z-10 relative"
      >
        <div className="h-16 flex items-center justify-center border-b">
          <h1 className="text-xl font-bold text-blue-900">SmartRoute Admin</h1>
        </div>
        <nav className="mt-6 flex-1 px-4 space-y-6 overflow-y-auto">
          <div>
            <Link
              href="/admin"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                pathname === "/admin"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className={`mr-3 text-lg ${pathname === "/admin" ? "text-blue-700" : "text-gray-400"}`}>
                <FaTachometerAlt />
              </span>
              Dashboard
            </Link>
          </div>

          <div>
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Transport
            </h3>
            {renderNavGroup(transportNav)}
          </div>

          <div>
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              People
            </h3>
            {renderNavGroup(peopleNav)}
          </div>
        </nav>
        <div className="p-4 border-t mt-auto">
          <button
            onClick={() => authService.logout()}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
          >
            <FaSignOutAlt className="mr-3 text-lg" />
            Logout
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-end px-8 z-0">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col text-right">
              <span className="text-sm font-semibold text-gray-900">
                {user?.name || "Admin"}
                {user?.isSuperAdmin && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Super Admin</span>}
              </span>
              <span className="text-xs text-gray-500">{user?.email || ""}</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
              {user?.name?.charAt(0) || "A"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
