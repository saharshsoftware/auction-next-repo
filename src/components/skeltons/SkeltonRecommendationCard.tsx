import React from "react";

interface SkeltonRecommendationCardProps {
  count?: number;
}

const SkeltonItem: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="skeleton h-6 w-16 rounded"></div>
        <div className="skeleton h-6 w-24 rounded"></div>
      </div>
      <div className="skeleton h-5 w-11/12 mb-2"></div>
      <div className="skeleton h-5 w-10/12 mb-4"></div>
      <div className="grid grid-cols-2 gap-4 mt-auto">
        <div>
          <div className="skeleton h-3 w-20 mb-2"></div>
          <div className="skeleton h-4 w-28"></div>
        </div>
        <div className="flex flex-col items-end">
          <div className="skeleton h-3 w-24 mb-2"></div>
          <div className="skeleton h-8 w-24 rounded"></div>
        </div>
      </div>
      <div className="skeleton h-10 w-full rounded mt-4"></div>
    </div>
  );
};

const SkeltonRecommendationCard: React.FC<SkeltonRecommendationCardProps> = (props) => {
  const { count = 3 } = props;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeltonItem key={idx} />
      ))}
    </div>
  );
};

export default SkeltonRecommendationCard;


