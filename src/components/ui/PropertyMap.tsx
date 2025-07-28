import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

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
    <div className={`bg-white rounded-xl shadow-sm p-4 sm:p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <MapPin className="h-5 w-5 text-blue-600 mr-2" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {address && (
              <p className="text-sm text-gray-600 mt-1">{address}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </p>
          </div>
        </div>
        <a
          href={mapLinkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View on Google Map
        </a>
      </div>
    </div>
  );
};