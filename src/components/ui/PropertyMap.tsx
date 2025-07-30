import React from 'react';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';

interface PropertyMapProps {
  lat: string | null;
  lng: string | null;
  title?: string;
  address?: string;
  className?: string;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({ 
  lat, 
  lng, 
  title = 'Property Location',
  address,
  className = '' 
}) => {
  if (!lat || !lng) {
    return null;
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    return null;
  }

  // Create Google Maps link for opening in new tab
  const mapLinkUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-6 py-4 border-b border-gray-100">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-lg mr-3 flex-shrink-0">
            <MapPin className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-600">Click to view on Google Maps</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Address Section */}
        {address && (
          <div className="mb-4">
            <div className="flex items-start space-x-3">
              <div className="bg-gray-100 p-2 rounded-lg flex-shrink-0 mt-1">
                <Navigation className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Property Address</h4>
                <p className="text-sm text-gray-700 leading-relaxed break-words">
                  {address}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Coordinates Section */}
        <div className="mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">GPS Coordinates</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Latitude:</span>
                <span className="ml-2 font-mono text-gray-900">{latitude.toFixed(6)}</span>
              </div>
              <div>
                <span className="text-gray-600">Longitude:</span>
                <span className="ml-2 font-mono text-gray-900">{longitude.toFixed(6)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={mapLinkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm hover:shadow-md"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View on Google Maps
          </a>
          
          {/* Get Directions Button */}
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm hover:shadow-md"
          >
            <Navigation className="h-4 w-4 mr-2" />
            Get Directions
          </a>
        </div>

        {/* Additional Info */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700 text-center">
            <MapPin className="h-3 w-3 inline mr-1" />
            Tap the buttons above to open in Google Maps app or get turn-by-turn directions
          </p>
        </div>
      </div>
    </div>
  );
};