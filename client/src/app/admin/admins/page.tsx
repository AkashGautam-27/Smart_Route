"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/axios";
import { motion } from "framer-motion";
import { FaPlus, FaEdit, FaUserShield, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { authService } from "../../../services/auth.service";
import { useRouter } from "next/navigation";

export default function AdminsPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const userRes = await authService.getCurrentUser();
        if (!userRes.user?.isSuperAdmin) {
          router.push("/admin");
          return;
        }

        const res = await api.get(`/main-admin/admins`);
        if (res.data.success) {
          setAdmins(res.data.admins);
        }
      } catch (error) {
        console.error("Failed to fetch admins", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, [router]);

  if (loading) return <p className="text-gray-500 mt-10">Loading admins...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaUserShield className="mr-3 text-blue-600" />
          Admin Management
        </h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center text-sm font-medium transition-colors shadow-sm">
          <FaPlus className="mr-2" /> Add Admin
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {admins.map((admin, index) => (
                <motion.tr 
                  key={admin._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{admin.email}</div>
                    <div className="text-sm text-gray-500">{admin.mobileNumber || "N/A"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {admin.isSuperAdmin ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                        Super Admin
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                        Admin
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${admin.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {admin.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(admin.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mx-2 disabled:opacity-50" disabled={admin.isSuperAdmin}>
                      <FaEdit className="inline" title="Edit" />
                    </button>
                    {admin.isActive ? (
                      <button className="text-red-600 hover:text-red-900 disabled:opacity-50" disabled={admin.isSuperAdmin}>
                        <FaToggleOff className="inline" title="Deactivate" />
                      </button>
                    ) : (
                      <button className="text-green-600 hover:text-green-900 disabled:opacity-50" disabled={admin.isSuperAdmin}>
                        <FaToggleOn className="inline" title="Activate" />
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
              {admins.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No admins found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
