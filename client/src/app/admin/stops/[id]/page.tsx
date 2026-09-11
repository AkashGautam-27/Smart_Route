"use client";

import { useEffect, useState } from "react";
import api from "../../../../lib/axios";
import { useParams, useRouter } from "next/navigation";
import { FaMapMarkerAlt, FaArrowLeft, FaExclamationTriangle, FaMapPin, FaInfoCircle } from "react-icons/fa";
import Link from "next/link";
import MapView from "../../../../components/map/MapView";

export default function AdminStopDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [stop, setStop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStop = async () => {
      try {
        const res = await api.get(`/stops/${id}`);
        if (res.data.success) {
          setStop(res.data.stop);
        } else {
          setError("Failed to load stop details.");
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("Stop not found.");
        } else {
          setError("Unable to load stop information. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchStop();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading stop data...</p>
      </div>
    );
  }

  if (error || !stop) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <FaExclamationTriangle className="text-6xl text-amber-500 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || "Stop not found"}</h2>
        <button 
          onClick={() => router.push('/admin/stops')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Back to Admin Stops
        </button>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="mb-6">
        <Link href="/admin/stops" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-4 transition-colors">
          <FaArrowLeft className="mr-2" /> Back to Stops List
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaMapPin className="mr-3 text-blue-600" />
              {stop.name}
              <span className="ml-3 bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider align-middle">
                {stop.code}
              </span>
            </h2>
          </div>
          <div>
            <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm">
              Edit Stop
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Stop Information */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 shrink-0">
              <h3 className="text-md font-bold text-gray-900 flex items-center">
                <FaInfoCircle className="text-blue-600 mr-2" />
                Stop Details
              </h3>
            </div>
            <div className="p-6 space-y-6">
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Name</p>
                <p className="text-lg font-bold text-gray-900">{stop.name}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Code</p>
                <p className="text-md font-semibold text-gray-900">{stop.code}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Coordinates</p>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-500">Latitude:</span>
                    <span className="text-sm font-bold font-mono text-gray-700">{stop.latitude}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Longitude:</span>
                    <span className="text-sm font-bold font-mono text-gray-700">{stop.longitude}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Address</p>
                <p className="text-md font-medium text-gray-900">{stop.address || "No address provided"}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Default Sequence</p>
                <p className="text-md font-medium text-gray-900">{stop.sequence}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Map Visualization */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 h-[500px] flex flex-col relative z-0">
            {stop.latitude && stop.longitude ? (
              <MapView stops={[stop]} center={[stop.latitude, stop.longitude]} zoom={15} className="w-full h-full rounded-lg" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500 font-medium">Invalid map coordinates.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
