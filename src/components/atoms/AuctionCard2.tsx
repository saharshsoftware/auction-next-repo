/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import {
  getSharedAuctionUrl,
  getDateAndTimeFromISOStringForDisplay,
  getDateAndTimeFromISOString,
} from "../../shared/Utilies";
import { IAuction } from "@/types";
import Link from "next/link";
import { Eye, Share, Building2, UserCheck, Clock } from "lucide-react";
import { getPropertyImages } from "@/utilies/imageUtils";
import { WhatsappShareWithIcon } from "./SocialIcons";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ActionButton from "./ActionButton";
import FullScreenImageModal from "../ modals/FullScreenImageModal";
import { PhotoCountBadge } from "./PhotoCountBadge";
import useModal from "@/hooks/useModal";
import { useRouter } from "next/navigation";

interface PropertyCardProps {
  property: IAuction;
  isAdmin?: boolean;
  className?: string;
  showRemoveButton?: boolean;
  propertyId?: string;
  handleRemove?: (data: any) => void;
  forceMobileNoImage?: boolean;
}

const auctionLabelClass = () => "text-sm-xs text-gray-400 font-bold";

export const AuctionCard2: React.FC<PropertyCardProps> = (props) => {
  const {
    property,
    isAdmin = false,
    className = '',
    showRemoveButton = false,
    propertyId = '',
    handleRemove = () => { },
    forceMobileNoImage = false,
  } = props;
  const {
    showModal: showImageModal,
    openModal: openImageModal,
    hideModal: hideImageModal,
  } = useModal();
  const router = useRouter();
  const sharedUrl = getSharedAuctionUrl(property);
  const isViewNoticeVisible = property?.noticeLink && isAdmin;

  // State for client-side only date comparison to avoid hydration mismatch
  const [isAuctionEndedState, setIsAuctionEndedState] = useState<boolean>(false);
  
  useEffect(() => {
    // Only run date comparison on client-side to avoid hydration mismatch
    if (property?.auctionEndDate) {
      const endDate = new Date(property.auctionEndDate);
      const currentDate = new Date();
      setIsAuctionEndedState(endDate < currentDate);
    }
  }, [property?.auctionEndDate]);

  // Function to check if auction end date is in the past
  const isAuctionEnded = (): boolean => {
    return isAuctionEndedState;
  };

  const formatPrice = (price: string | null | undefined) => {
    if (!price || price === '0' || price === 'null') return 'Not specified';
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice === 0) return 'Not specified';

    let formattedPrice: string;

    if (numPrice >= 10000000) {
      // If price is greater than or equal to 1 crore (10,000,000)
      formattedPrice = (numPrice / 10000000).toFixed(2) + ' Cr';
    } else if (numPrice >= 100000) {
      // If price is greater than or equal to 1 lakh (100,000)
      formattedPrice = (numPrice / 100000).toFixed(2) + ' Lakh';
    } else {
      formattedPrice = numPrice.toLocaleString();
    }
    return `₹ ${formattedPrice}`;
  };

  const getExpiredContainer = () => {
    return (
      <div className="bg-red-600 text-white px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-2 shadow-lg ">
        <Clock className="h-3 w-3" />
        <span className="text-xs font-bold">EXPIRED</span>
      </div>
    )
  };

  const [imageLoadError, setImageLoadError] = React.useState(false);

  const propertyImages = getPropertyImages(property);
  const hasRealImages = propertyImages.length > 0 && !propertyImages[0].includes('no-image-placeholder.png') && !imageLoadError;
  const imageUrl = hasRealImages ? propertyImages[0] : null;

  // Function to handle image load errors
  const handleImageError = () => {
    setImageLoadError(true);
  };

  // Function to check if area should be displayed
  const shouldShowArea = (area: string | null | undefined, city: string | null | undefined): boolean => {
    if (!area || !city) return false;

    const normalizedArea = area.toLowerCase().trim();
    const normalizedCity = city.toLowerCase().trim();

    return normalizedArea !== normalizedCity && normalizedArea.length > 0;
  };

  // Function to render enhanced property title with area
  const renderEnhancedTitle = (isMobile: boolean = false) => {
    const title = property?.title || 'Property Title Not Available';
    const shouldShowAreaBadge = shouldShowArea(property?.area, property?.city);

    const titleClasses = isMobile
      ? "text-lg font-bold text-gray-900 leading-tight"
      : "text-xl font-bold text-gray-900 leading-tight";

    if (!shouldShowAreaBadge) {
      return <h3 className={titleClasses}>
        {title}
      </h3>;
    }

    return (
      <h3 className={titleClasses}>
        {title}
        <span className="text-sm font-normal text-gray-600 ml-2">
          ({property?.area})
        </span>
      </h3>
    );
  };

  const PROPERTY_ID = `E${property.id}`; // Property ID

  /**
 * Renders property badges (Property ID and Asset Category) consistently
 * for both image and non-image scenarios
 */
  const renderPropertyBadges = (isMobile: boolean = false) => {
    if (isMobile) {
      // Mobile: Badges in a dedicated section with absolute positioning
      return (
        <div className="relative h-12 w-full bg-gray-50 border-b border-gray-200">
          {/* Property ID Badge - Light yellow with rounded corners */}
          <div className="absolute top-3 left-3">
            <span className="property-id-badge">
              {PROPERTY_ID}
            </span>
          </div>

          {/* Property Type Badge - Blue with rounded corners, hide for Gold Auctions */}
          <div className="absolute top-3 right-3">
            {property?.assetCategory && <span className="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-xs font-medium">
              {property?.assetCategory}
            </span>}
          </div>
        </div>
      );
    } else {
      // Desktop: Badges in a full-width row with justify-between
      return (
        <div className={`relative w-full h-12  flex items-center gap-4 p-4 md:p-0 ${isAuctionEnded() ? 'md:justify-start justify-between !w-full' : 'md:w-[17.85rem] justify-between '} ${forceMobileNoImage ? '!w-full !px-4' : ''}`}>
          {/* Property ID Badge - Light yellow with rounded corners */}
          <span className="property-id-badge">
            {PROPERTY_ID}
          </span>

          <div className="flex items-center gap-2">
            {/* Property Type Badge - Blue with rounded corners, hide for Gold Auctions */}
            {property?.assetCategory && <span className="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-xs font-medium">
              {property?.assetCategory}
            </span>}

            {/* Auction Ended Indicator */}
            {isAuctionEnded() && (
              <div className="">
                {getExpiredContainer()}
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <>
      {openImageModal ? (
        <FullScreenImageModal
          openModal={openImageModal}
          hideModal={hideImageModal}
          imageUrl={imageUrl || ''}
        />
      ) : null}
      <div className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200`}>
        {/* Mobile Layout */}
        <div className={forceMobileNoImage ? "block" : "block md:hidden"}>
          {/* Image Section - Mobile (only show if real images exist) */}
          {hasRealImages && !forceMobileNoImage && (
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={imageUrl!}
                alt={property?.title || 'Property'}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                onClick={showImageModal}
                onError={handleImageError}
              />

              {/* Property ID Badge - Light yellow with rounded corners */}
              <div className="absolute top-3 left-3">
                <span className="property-id-badge">
                  {PROPERTY_ID}
                </span>
              </div>

              {/* Property Type Badge - Blue with rounded corners, hide for Gold Auctions */}
              <div className="absolute top-3 right-3">
                {property?.assetCategory && <span className="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-xs font-medium">
                  {property?.assetCategory}
                </span>}
              </div>

              {/* Auction Ended Indicator */}
              {isAuctionEnded() && (
                <div className="absolute bottom-2 right-3 z-10">
                  {getExpiredContainer()}
                </div>
              )}


              {/* Image Count Indicator */}
              {property?.images?.length > 1 && (
                <div className="absolute bottom-3 right-3">
                  <div className="bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {property?.images?.length}
                  </div>
                </div>
              )}
            </div>
          )}

          {(!hasRealImages || forceMobileNoImage) && renderPropertyBadges()}

          {/* Content Section - Mobile */}
          <div className="p-4">


            {/* Title */}
            <div className="mb-3">
              {renderEnhancedTitle(true)}
              {hasRealImages && <PhotoCountBadge count={propertyImages.length} className="mt-1" />}
            </div>

            {/* Seller Info */}
            <div className="mb-3">
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-500" />
                <span>{property?.bankName || 'Not specified'}</span>
              </div>
            </div>

            {/* Possession Type - Mobile */}
            {property?.propertyPossessionType && (
              <div className="mb-3">
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-gray-500" />
                  <span>{property.propertyPossessionType}</span>
                </div>
              </div>
            )}

            {/* Add a separator */}
            <div className="my-2 h-px bg-gray-200"></div>

            {/* Reserve Price and Auction Date Row */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-gray-600 mb-1">Reserve Price</div>
                <div className="text-sm-xs font-bold text-gray-900">
                  {property?.reservePrice ? formatPrice(property?.reservePrice?.toString()) : 'Not specified'}
                </div>
                {property?.assetType && <div className="mt-4">
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                    {property?.assetType}
                  </span>
                </div>}
              </div>
              <div className="flex flex-col items-end">
                <div className="text-xs text-gray-600 mb-1">Auction Date</div>
                <div className="text-sm-xs font-bold text-gray-900">
                  {property?.auctionStartTime ? getDateAndTimeFromISOString(property?.auctionStartTime?.toString())?.date : 'Not specified'}
                </div>
                <div className="mt-4 flex justify-end">
                  <div className="flex items-center px-3 py-1.5 text-green-600 border border-green-300 rounded-lg hover:bg-green-50 transition-colors text-sm-xs font-medium ml-6">
                    {WhatsappShareWithIcon({ url: sharedUrl })}
                  </div>
                </div>
              </div>
            </div>

            {/* View Auction Button - Full Width on Mobile */}
            <div className="space-y-2">
              <Link
                prefetch
                href={`/auctions/${property?.slug}`}
                className="block w-full text-center px-4 py-3 bg-brand-color text-white hover:bg-blue-700 rounded-lg transition-colors text-sm font-semibold"
              >
                View Auction
              </Link>

              {/* Notice Link - Mobile */}
              {isViewNoticeVisible && (
                <a
                  href={property?.noticeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm-xs font-medium"
                >
                  View Notice
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        {!forceMobileNoImage && (
        <div className="hidden md:flex">
          {/* Image Section - Desktop (only show if real images exist) */}
          {hasRealImages && (
            <div className="relative w-80 h-64 flex-shrink-0 overflow-hidden">
              <img
                src={imageUrl!}
                alt={property?.title || 'Property'}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
                onClick={showImageModal}
                onError={handleImageError}
              />

              {/* Property ID Badge - Light yellow with rounded corners */}
              <div className="absolute top-3 left-3">
                <span className="property-id-badge">
                  {PROPERTY_ID}
                </span>
              </div>

              {/* Property Type Badge - Blue with rounded corners, hide for Gold Auctions */}
              {property?.assetCategory !== 'Gold Auctions' && (
                <div className="absolute top-3 right-3">
                  <span className="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-xs font-medium">
                    {property?.assetCategory || 'Property'}
                  </span>
                </div>
              )}

              {/* Auction Ended Indicator */}
              {isAuctionEnded() && (
                <div className="absolute bottom-2 right-3 z-10">
                  {getExpiredContainer()}
                </div>
              )}

              {/* Image Count Indicator */}
              {property?.images?.length > 1 && (
                <div className="absolute bottom-3 right-3">
                  <div className="bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {property?.images?.length}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Badges Section - Always visible (when no image) */}
          {/* {!hasRealImages && (
            <div className="relative w-80 h-12 flex-shrink-0 bg-gray-50 border-r border-gray-200">
              <div className="absolute top-3 left-3">
                <span className="property-id-badge">
                  {PROPERTY_ID}
                </span>
              </div>

              {property?.assetCategory !== 'Gold Auctions' && (
                <div className="absolute top-3 right-3">
                  <span className="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-xs font-medium">
                    {property?.assetCategory || 'Property'}
                  </span>
                </div>
              )}  
            </div>
          )} */}

          {/* Content Section - Desktop */}
          <div className="flex-1 p-6">
            {/* Property Type badge when no image - Desktop */}
            {/* {!hasRealImages && property?.assetCategory !== 'Gold Auctions' && (
              <div className="flex justify-start items-center mb-4">
                <span className="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-xs font-medium">
                  {property?.assetType || 'Property'}
                </span>
              </div>
            )} */}
            {!hasRealImages && renderPropertyBadges()}

            {/* Title */}
            <Link prefetch href={`/auctions/${property?.slug}`}>
              <div className="mb-4 cursor-pointer">
                {renderEnhancedTitle(false)}
              </div>
            </Link>

            {/* Seller Info */}
            <div className="mb-4">
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-500" />
                <span>{property?.bankName || 'Not specified'}</span>
              </div>
            </div>

            {property?.propertyPossessionType && (
              <div className="mb-4">
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-gray-500" />
                  <span>{property.propertyPossessionType}</span>
                </div>
              </div>
            )}


            {/* Add a separator */}
            <div className="my-3 h-px bg-gray-200"></div>

            {/* Reserve Price and Auction Date Row */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <div className="text-sm-xs text-gray-600 mb-1">Reserve Price</div>
                <div className="text-2xl font-bold text-gray-900">
                  {property?.reservePrice ? formatPrice(property?.reservePrice?.toString()) : 'Not specified'}
                </div>
                {property?.assetType && <div className="mt-2">
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm-xs">
                    {property?.assetType}
                  </span>
                </div>}
              </div>
              <div className="flex flex-col items-end">
                <div className="text-sm-xs text-gray-600 mb-1">Auction Date</div>
                <div className="text-sm-xs font-bold text-gray-900">
                  {property?.auctionStartTime ? getDateAndTimeFromISOString(property?.auctionStartTime?.toString())?.date : 'Not specified'}
                </div>
                {/* <div className="mt-2 flex justify-end">
                    {WhatsappShareWithIcon({ url: sharedUrl })}
                  </div> */}

                <div className="mt-4 flex justify-end">
                  <div className="flex items-center px-3 py-1.5 text-green-600 border border-green-300 rounded-lg hover:bg-green-50 transition-colors text-sm-xs font-medium ml-6">
                    {WhatsappShareWithIcon({ url: sharedUrl })}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row - Asset Info and Button */}
            <div className="flex items-center justify-end">


              {/* View Auction Button */}
              <div className="flex items-center space-x-3">
                {/* <Link
                  href={`/auctions/${property?.slug}`}
                  prefetch={false}
                  className="inline-flex items-center px-6 py-2.5 bg-brand-color text-white rounded-lg hover:bg-blue-700 transition-colors text-sm-xs font-semibold"
                >
                  View Auction
                </Link> */}

                {/* Notice Link - Desktop */}
                {isViewNoticeVisible && (
                  <a
                    href={property?.noticeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm-xs font-medium"
                  >
                    View Notice
                  </a>
                )}

                {showRemoveButton ? (
                  <ActionButton
                    text="Remove"
                    icon={<FontAwesomeIcon icon={faX} />}
                    customClass="w-fit"
                    onclick={() => handleRemove(propertyId)}
                    isDeleteButton={true}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </>
  );
};
