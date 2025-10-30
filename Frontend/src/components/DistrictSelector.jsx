import React from 'react';
import { MapPin, Loader2 } from 'lucide-react';

export default function DistrictSelector({
  districts,
  selectedDistrict,
  onDistrictChange,
  onLocate,
  isLoading
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-2">Select Your District</h2>
      <p className="text-sm text-gray-500 mb-4">
        Choose your district from the list to see the report.
      </p>
      
      <div className="flex flex-col sm:flex-row sm:space-x-4">
        <select
          id="district-select"
          value={selectedDistrict}
          onChange={(e) => onDistrictChange(e.target.value)}
          disabled={isLoading}
          className="w-full sm:w-1/2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
        >
          <option value="">-- Please Select --</option>
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
        
        <button
          id="location-btn"
          onClick={onLocate}
          disabled={isLoading}
          className="mt-4 sm:mt-0 w-full sm:w-1/2 flex items-center justify-center p-3 bg-blue-600 text-white rounded-lg shadow-sm font-medium hover:bg-blue-700 transition duration-150 disabled:bg-gray-400"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <MapPin className="w-5 h-5 mr-2" />
          )}
          Use My Location
        </button>
      </div>
    </div>
  );
}
