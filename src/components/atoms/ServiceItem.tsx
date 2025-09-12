import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ROUTE_CONSTANTS } from '@/shared/Routes';
import { IServiceData } from '@/shared/ServicesConstants';

interface IServiceItemProps {
  service: IServiceData;
  className?: string;
}

const ServiceItem: React.FC<IServiceItemProps> = ({ 
  service, 
  className = ''
}) => {
  const IconComponent = service.icon;

  return (
    <div className={`group bg-white rounded-2xl p-6  border border-gray-200 ${className}`}>
      <div className="bg-indigo-50 rounded-xl p-3 w-14 h-14 mb-4 group-hover:bg-indigo-100 transition-colors">
        <IconComponent className="h-8 w-8 text-indigo-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">
        {service.title}
      </h1>
      <p className="text-sm-xs mb-4">
        {service.shortDescription}
      </p>
      <Link
        href={`${ROUTE_CONSTANTS.OUR_SERVICES}#${service.id}`}
        className="text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors flex items-center group"
      >
        Learn More
        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};

export default ServiceItem;
