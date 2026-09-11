"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaUserShield, FaBus, FaEnvelope, FaLock, FaUser, FaPhone } from "react-icons/fa";
import api from "../../lib/axios";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobileNumber: "",
    role: "driver" // Default to driver
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // The public /api/auth/register endpoint in auth.controller.ts 
      // accepts name, email, password, role, and mobileNumber.
      const res = await api.post("/auth/register", formData);
      
      if (res.data.success) {
        // Automatically redirect to login after successful registration
        router.push("/login?registered=true");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden">
        
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join the SmartRoute platform today
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          {/* Role Selection */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "driver" })}
              className={`flex-1 py-3 px-4 rounded-xl flex flex-col items-center justify-center transition-all ${
                formData.role === "driver" 
                  ? "bg-blue-50 border-2 border-blue-500 text-blue-700 shadow-sm" 
                  : "bg-white border-2 border-gray-100 text-gray-500 hover:border-blue-200"
              }`}
            >
              <FaBus className={`text-2xl mb-2 ${formData.role === "driver" ? "text-blue-500" : "text-gray-400"}`} />
              <span className="font-semibold text-sm">Driver</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "admin" })}
              className={`flex-1 py-3 px-4 rounded-xl flex flex-col items-center justify-center transition-all ${
                formData.role === "admin" 
                  ? "bg-indigo-50 border-2 border-indigo-500 text-indigo-700 shadow-sm" 
                  : "bg-white border-2 border-gray-100 text-gray-500 hover:border-indigo-200"
              }`}
            >
              <FaUserShield className={`text-2xl mb-2 ${formData.role === "admin" ? "text-indigo-500" : "text-gray-400"}`} />
              <span className="font-semibold text-sm">Admin</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-3 border-gray-300 rounded-xl bg-gray-50 text-gray-900 border border-gray-200"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-3 border-gray-300 rounded-xl bg-gray-50 text-gray-900 border border-gray-200"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-3 border-gray-300 rounded-xl bg-gray-50 text-gray-900 border border-gray-200"
                  placeholder="+91 9876543210"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-3 border-gray-300 rounded-xl bg-gray-50 text-gray-900 border border-gray-200"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white ${
                formData.role === "admin" 
                  ? "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500" 
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {loading ? "Registering..." : `Register as ${formData.role === "admin" ? "Admin" : "Driver"}`}
            </button>
          </div>
          
          <div className="text-center mt-4">
            <span className="text-gray-600 text-sm">Already have an account? </span>
            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
              Sign in instead
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
