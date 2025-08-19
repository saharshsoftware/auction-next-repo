import React from "react";

const FAQLoading: React.FC = () => {
  return (
    <div className="section-class">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4 mb-8">
        <div className="rounded-full bg-gray-300 w-12 h-12 animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-8 bg-gray-300 rounded w-80 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-96 animate-pulse"></div>
        </div>
      </div>

      {/* Search and Filters Skeleton */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="h-12 bg-gray-300 rounded-lg animate-pulse"></div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-8 bg-gray-300 rounded-full w-24 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Content Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="h-6 bg-gray-300 rounded w-full animate-pulse mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Quick Links Skeleton */}
      <div className="mt-16 bg-gray-50 rounded-lg p-8">
        <div className="h-8 bg-gray-300 rounded w-32 animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="h-5 bg-gray-300 rounded w-24 animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section Skeleton */}
      <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
        <div className="h-8 bg-gray-300 rounded w-48 animate-pulse mb-4 mx-auto"></div>
        <div className="h-4 bg-gray-300 rounded w-80 animate-pulse mb-6 mx-auto"></div>
        <div className="h-12 bg-gray-300 rounded w-32 animate-pulse mx-auto"></div>
      </div>
    </div>
  );
};

export default FAQLoading;
