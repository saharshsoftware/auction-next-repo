import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

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

        {/* Google Maps Button */}
        <div className="flex justify-center">
          <a
            href={mapLinkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm hover:shadow-md"
          >
            {/* Google Maps Icon (using a simple map icon as substitute) */}
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            Google Maps
          </a>
        </div>

      </div>
    </div>
  );
};