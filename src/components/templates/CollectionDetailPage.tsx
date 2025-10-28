"use client";
import React from "react";
import { IPublicCollection, IAuction } from "@/types";
import Image from "next/image";
import { AuctionCard2 } from "@/components/atoms/AuctionCard2";
import { Building2, Calendar, ListChecks } from "lucide-react";
import Link from "next/link";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import PaginationCompServer, { ILocalFilter } from "@/components/atoms/PaginationCompServer";
import { sanitizeStrapiImageUrl } from "@/shared/Utilies";

interface ICollectionDetailPage {
  collectionData: IPublicCollection | null;
  propertiesData: any[];
  totalPages: number;
  currentPage: number;
  collectionId: string;
  error?: string;
}

/**
 * CollectionDetailPage component displays the details of a public collection
 * @param {ICollectionDetailPage} props - Component properties
 * @returns {JSX.Element} The rendered collection detail page
 */
const CollectionDetailPage = (props: ICollectionDetailPage) => {
  const {
    collectionData,
    propertiesData,
    totalPages,
    currentPage,
    collectionId,
    error,
  } = props;

  if (!collectionData) {
    return (
      <div className="common-section py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center flex-col h-[70vh]">
            <ListChecks className="h-16 w-16 text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-700 mb-2">
              Collection not found
            </h1>
            <p className="text-gray-500">
              The collection you are looking for does not exist or has been
              removed.
            </p>
            <Link
              href={ROUTE_CONSTANTS.DASHBOARD}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { imageUrl: imageUrlAttr, title, description, name } = collectionData?.attributes;
  const displayTitle = title || name || "Property Collection";
  const imageUrl = sanitizeStrapiImageUrl({ imageURL: imageUrlAttr }) ?? "";
  const hasImage = imageUrl && imageUrl.trim() !== "";

  // Transform properties data to match IAuction interface with defensive checks
  const transformedProperties: IAuction[] = (propertiesData || [])
    .filter((item: any) => item?.property)
    .map((item: any) => ({
      ...item.property,
      id: item.property.id?.toString() || item.id?.toString(),
    }));

  return (
    <div className="bg-gray-50">
      {/* Banner Section */}
      <div className="relative ">
        {/* Background Image (Full Width) - Only if available */}
        {hasImage && (
          <div className="relative w-full h-80 md:h-96 lg:h-120">
            <Image
              src={imageUrl}
              alt={displayTitle}
              fill
              className="object-cover aspect-video"
              priority
            />
          </div>
        )}

        {/* Content Section - Below Image */}
        <div className="container mx-auto px-4 py-12 md:py-16 relative z-10 common-section">
          <div className="text-left">
            <div className="flex items-center  gap-2 mb-4">
              <ListChecks className="h-6 w-6 " />
              <span className="text-sm font-medium uppercase tracking-wider ">
                Property Collection
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-left">
              {displayTitle}
            </h1>
            {description && (
              <p className="text-sm-xs   mb-6 leading-relaxed text-left">
                {description}
              </p>
            )}
            {transformedProperties?.length > 0 && <div className="flex flex-wrap gap-4 items-center ">
              <div className="flex items-center gap-2 ">
                <Building2 className="h-5 w-5 " />
                <span className="font-semibold ">
                  {transformedProperties?.length} Properties
                </span>
              </div>

            </div>}
          </div>
        </div>
      </div>

      {/* Properties Section */}
      <div className="container mx-auto px-4 md:pb-12  common-section pb-8">
        {transformedProperties.length === 0 ? (
          <div className="flex items-center justify-center flex-col h-[50vh] bg-white rounded-lg shadow-sm">
            <Building2 className="h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              {error ? "Unable to Load Properties" : "No Properties Available"}
            </h2>
            <p className="text-gray-500 text-center max-w-md">
              {error
                ? "This collection is currently unavailable. Please contact support if you believe this is an error."
                : "This collection does not have any properties yet. Check back later for updates."}
            </p>
            {error && (
              <p className="text-sm text-red-500 mt-2">Error: {error}</p>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Featured Properties
              </h2>
              <p className="text-gray-600">
                Browse through {transformedProperties.length} available
                properties in this collection
              </p>
            </div>

            {/* Properties List */}
            <div className="flex flex-col gap-4">
              {transformedProperties.map((property: IAuction, index: number) => (
                <AuctionCard2 key={`property-${property.id}-${index}`} property={property} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <PaginationCompServer
                totalPage={totalPages}
                activePage={currentPage}
                filterData={{ page: currentPage } as ILocalFilter}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CollectionDetailPage;