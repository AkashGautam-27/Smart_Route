"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../../services/auth.service";
import api from "../../lib/axios";
import { FaSignOutAlt, FaTachometerAlt, FaBus, FaRoute, FaMapMarkerAlt, FaPlay, FaStop, FaExclamationTriangle } from "react-icons/fa";
import MapView from "../../components/map/MapView";

export default function DriverDashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [statusData, setStatusData] = useState<any>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number; accuracy?: number; lastUpdated?: string } | null>(null);
  const router = useRouter();
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    const checkAuthAndStatus = async () => {
      try {
        const res = await authService.getCurrentUser();
        if (res.success && res.user.role === "driver") {
          setUser(res.user);
          await fetchStatus();
        } else {
          router.push("/login");
        }
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndStatus();

    return () => {
      // Cleanup geolocation watcher on unmount
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [router]);

  const fetchStatus = async () => {
    try {
      const res = await api.get('/driver/location/status');
      if (res.data.success) {
        setStatusData(res.data.data);
        setIsSharing(res.data.data.sharing);
        if (res.data.data.lastLocation) {
          setCurrentLocation({
            ...res.data.data.lastLocation,
            lastUpdated: new Date(res.data.data.lastLocation.recordedAt).toLocaleTimeString(),
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch driver status", err);
    }
  };

  const startSharing = async () => {
    setLocationError("");
    if (!statusData?.bus) {
      setLocationError("You cannot start location sharing because no bus is assigned to you.");
      return;
    }

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    try {
      // API call to start sharing
      const res = await api.post('/driver/location/start');
      if (res.data.success) {
        setIsSharing(true);
        // Start watching position
        watchIdRef.current = navigator.geolocation.watchPosition(
          async (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            const updatedTime = new Date(position.timestamp).toLocaleTimeString();
            
            setCurrentLocation({ latitude, longitude, accuracy, lastUpdated: updatedTime });

            // Send to backend
            try {
              await api.post('/driver/location', { latitude, longitude, accuracy });
            } catch (err) {
              console.error("Failed to sync location to backend");
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            if (error.code === error.PERMISSION_DENIED) {
              setLocationError("Location permission denied. Please allow location access in your browser settings.");
              stopSharing();
            } else if (error.code === error.POSITION_UNAVAILABLE) {
              setLocationError("Unable to determine your current location.");
            } else {
              setLocationError("Location request timed out or failed. Retrying...");
            }
          },
          {
            enableHighAccuracy: true,
            maximumAge: 10000,
            timeout: 5000,
          }
        );
      }
    } catch (err: any) {
      setLocationError(err.response?.data?.message || "Failed to start location sharing.");
    }
  };

  const stopSharing = async () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    
    setIsSharing(false);
    
    try {
      await api.post('/driver/location/stop');
    } catch (err) {
      console.error("Failed to stop sharing on backend");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const assignedRouteStops = statusData?.route?.stops ? [...statusData.route.stops].sort((a: any, b: any) => a.sequence - b.sequence) : [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-10">
      <nav className="bg-blue-600 shadow-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center text-white">
              <FaTachometerAlt className="text-2xl mr-3" />
              <h1 className="text-xl font-bold tracking-wide">
                Driver Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-sm font-medium text-blue-100 hidden sm:block">Welcome, {user?.name || "Driver"}</span>
              <button
                onClick={() => authService.logout()}
                className="flex items-center text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Info & Controls */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Driver Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Driver Profile</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</p>
                <p className="text-md font-medium text-gray-900">{user?.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</p>
                <p className="text-md font-medium text-gray-900">{user?.email}</p>
              </div>
              {user?.mobileNumber && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mobile</p>
                  <p className="text-md font-medium text-gray-900">{user?.mobileNumber}</p>
                </div>
              )}
            </div>
          </div>

          {/* Assignment Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Current Assignment</h2>
            
            {statusData?.bus ? (
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <FaBus className="text-blue-500 text-xl mr-3" />
                  <div>
                    <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider">Assigned Bus</p>
                    <p className="text-md font-bold text-blue-900">{statusData.bus.busNumber}</p>
                    <p className="text-xs text-blue-600">{statusData.bus.registrationNumber}</p>
                  </div>
                </div>

                {statusData?.route ? (
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <FaRoute className="text-green-500 text-xl mr-3" />
                    <div>
                      <p className="text-xs font-semibold text-green-800 uppercase tracking-wider">Assigned Route</p>
                      <p className="text-md font-bold text-green-900">{statusData.route.name}</p>
                      <p className="text-xs text-green-600">{statusData.route.routeCode}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-500">
                    No active route assigned to this bus.
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start">
                <FaExclamationTriangle className="text-amber-500 mt-0.5 mr-2" />
                <p className="text-sm text-amber-800 font-medium">You do not have a bus assigned yet. Please contact administration.</p>
              </div>
            )}
          </div>

          {/* Location Controls Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-1 ${isSharing ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
              Location Sharing
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isSharing ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {isSharing ? 'Active' : 'Inactive'}
              </span>
            </h2>

            {locationError && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium">
                {locationError}
              </div>
            )}

            {isSharing ? (
              <button
                onClick={stopSharing}
                className="w-full flex justify-center items-center py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors shadow-sm mb-4"
              >
                <FaStop className="mr-2" /> Stop Sharing Location
              </button>
            ) : (
              <button
                onClick={startSharing}
                disabled={!statusData?.bus}
                className="w-full flex justify-center items-center py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                <FaPlay className="mr-2" /> Start Sharing Location
              </button>
            )}

            {currentLocation && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Last Updated:</span>
                  <span className="text-gray-900 font-bold">{currentLocation.lastUpdated || "Just now"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Accuracy:</span>
                  <span className="text-gray-900 font-bold">{currentLocation.accuracy ? `${Math.round(currentLocation.accuracy)} meters` : 'Calculating...'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Map */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 h-[500px] lg:h-[700px] flex flex-col relative">
            {(currentLocation || assignedRouteStops.length > 0) ? (
              <MapView 
                stops={assignedRouteStops} 
                driverLocation={currentLocation || undefined}
                className="w-full h-full rounded-lg" 
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 rounded-lg">
                <FaMapMarkerAlt className="text-6xl text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">Map will appear once location sharing begins or route is assigned.</p>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
