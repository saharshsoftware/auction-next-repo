import React from 'react';
import ServiceItem from './ServiceItem';
import { SERVICES_DATA } from '@/shared/ServicesConstants';
import { STRING_DATA } from '@/shared/Constants';

const ServicesSection: React.FC = () => {
  return (
    <>
      {/* Services Section - How eAuctionDekho Can Help */}
      <section className="py-20 bg-gray-50 section-class">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">
            How e-auctiondekho can help
          </h2>
          <p className="text-sm-xs max-w-3xl mx-auto">
            We provide comprehensive ground-level support to make your auction journey smooth and successful.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
          {SERVICES_DATA.map((service) => (
            <ServiceItem
              key={service.id}
              service={service}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default ServicesSection