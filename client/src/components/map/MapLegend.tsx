import React from 'react';

const MapLegend: React.FC = () => {
  return (
    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200 z-[1000]">
      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Legend</h4>
      <div className="space-y-2">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm mr-2"></div>
          <span className="text-sm text-gray-700 font-medium">Source</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-sm mr-2"></div>
          <span className="text-sm text-gray-700 font-medium">Stop</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-sm mr-2"></div>
          <span className="text-sm text-gray-700 font-medium">Destination</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow-sm mr-2"></div>
          <span className="text-sm text-gray-700 font-medium">Driver Location</span>
        </div>
        <div className="flex items-center mt-3 pt-2 border-t border-gray-100">
          <div className="w-4 h-1 bg-blue-600 mr-2 rounded-full"></div>
          <span className="text-sm text-gray-700 font-medium">Route Path</span>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;
