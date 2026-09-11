"use client";

import { useEffect, useState } from "react";
import api from "../../../../../lib/axios";
import { useParams, useRouter } from "next/navigation";
import { FaRoute, FaArrowLeft, FaPlus, FaTrash, FaMapPin, FaSave } from "react-icons/fa";
import Link from "next/link";

export default function EditRoutePage() {
  const router = useRouter();
  const { id } = useParams();

  const [stops, setStops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    routeCode: "",
    source: "",
    destination: "",
    distance: 0,
    duration: ""
  });

  const [routeStops, setRouteStops] = useState<{ stop: string, sequence: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all available stops
        const stopsRes = await api.get(`/stops`);
        if (stopsRes.data.success) {
          setStops(stopsRes.data.stops);
        }

        // Fetch the route to edit
        if (id) {
          const routeRes = await api.get(`/routes/${id}`);
          if (routeRes.data.success) {
            const route = routeRes.data.route;
            setFormData({
              name: route.name || "",
              routeCode: route.routeCode || "",
              source: route.source?._id || route.source || "",
              destination: route.destination?._id || route.destination || "",
              distance: route.distance || 0,
              duration: route.duration || ""
            });

            // Map the route stops, which might be populated objects
            const mappedStops = (route.stops || []).map((s: any) => ({
              stop: s.stop?._id || s.stop || "",
              sequence: s.sequence
            }));

            // Sort by sequence to ensure correct order
            mappedStops.sort((a: any, b: any) => a.sequence - b.sequence);
            setRouteStops(mappedStops);
          }
        }
      } catch (err: any) {
        console.error("Failed to fetch data", err);
        setError("Failed to load route data. It may not exist.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddStop = () => {
    setRouteStops([...routeStops, { stop: "", sequence: routeStops.length + 1 }]);
  };

  const handleRemoveStop = (index: number) => {
    const newStops = [...routeStops];
    newStops.splice(index, 1);
    // Re-sequence
    const reSequenced = newStops.map((s, i) => ({ ...s, sequence: i + 1 }));
    setRouteStops(reSequenced);
  };

  const handleStopChange = (index: number, stopId: string) => {
    const newStops = [...routeStops];
    newStops[index].stop = stopId;
    setRouteStops(newStops);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!formData.source) return setError("Please select a source stop");
    if (!formData.destination) return setError("Please select a destination stop");

    const validRouteStops = routeStops.filter(s => s.stop !== "");

    setSubmitLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        stops: validRouteStops
      };

      const res = await api.put(`/routes/${id}`, payload);
      if (res.data.success) {
        router.push("/admin/routes");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update route");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading route data...</div>;

  return (
    <div className="pb-10 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center">
        <Link href="/admin/routes" className="mr-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
          <FaArrowLeft className="text-gray-600" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaRoute className="mr-3 text-blue-600" />
          Edit Route: {formData.routeCode}
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">{error}</div>}

          <div className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Route Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Satna to Rewa Express"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Route Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. STN-REW-01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow uppercase"
                    value={formData.routeCode}
                    onChange={(e) => setFormData({ ...formData, routeCode: e.target.value.toUpperCase() })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source Stop</label>
                  <select
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  >
                    <option value="">Select Source</option>
                    {stops.map(stop => (
                      <option key={stop._id} value={stop._id}>{stop.name} ({stop.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination Stop</label>
                  <select
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  >
                    <option value="">Select Destination</option>
                    {stops.map(stop => (
                      <option key={stop._id} value={stop._id}>{stop.name} ({stop.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.distance}
                    onChange={(e) => setFormData({ ...formData, distance: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Duration</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2 hours 30 mins"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Intermediate Stops */}
            <div>
              <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                <h3 className="text-lg font-bold text-gray-900">Intermediate Stops</h3>
                <button
                  type="button"
                  onClick={handleAddStop}
                  className="flex items-center text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium"
                >
                  <FaPlus className="mr-1.5" /> Add Stop
                </button>
              </div>

              <div className="space-y-3">
                {routeStops.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <FaMapPin className="mx-auto text-3xl text-gray-300 mb-2" />
                    <p className="text-gray-500 text-sm">No intermediate stops added yet.</p>
                    <p className="text-gray-400 text-xs mt-1">Click 'Add Stop' to build the route sequence.</p>
                  </div>
                ) : (
                  routeStops.map((routeStop, index) => (
                    <div key={index} className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
                        {routeStop.sequence}
                      </div>
                      <div className="flex-grow">
                        <select
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={routeStop.stop}
                          onChange={(e) => handleStopChange(index, e.target.value)}
                        >
                          <option value="">-- Select a Stop --</option>
                          {stops.map(stop => (
                            <option key={stop._id} value={stop._id}>{stop.name} ({stop.code})</option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveStop(index)}
                        className="flex-shrink-0 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200 flex justify-end gap-4">
            <Link
              href="/admin/routes"
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitLoading}
              className="px-6 py-2.5 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all shadow-sm flex items-center"
            >
              {submitLoading ? "Saving..." : <><FaSave className="mr-2" /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
