'use client'
import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  DollarSign,
  Building,
  Phone,
  ArrowLeft,
  Home,
  Download,
  CreditCard,
  Info,
  Banknote,
  FileText
} from 'lucide-react';
import { IAuction } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { PropertyMap } from '@/components/ui/PropertyMap';
import { ImageCarousel } from '@/components/ui/ImageCarousel';
import { getPropertyImages } from '@/utilies/imageUtils';
import Link from 'next/link';
import { WishlistSvg } from '../svgIcons/WishlistSvg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import ActionButton from '../atoms/ActionButton';
import { COOKIES, STRING_DATA } from '@/shared/Constants';
import { useRouter } from 'next/navigation';
import InterestModal from '../ modals/InterestModal';
import useModal from '@/hooks/useModal';
import { getCookie } from 'cookies-next';
import SurveyCard from "../atoms/SurveySection";
import { InfoTooltip } from '../atoms/InfoTooltip';
import { extractPhoneNumbers, getDateAndTimeFromISOString, getDateAndTimeFromISOStringForDisplay, getSharedAuctionUrl } from '@/shared/Utilies';
import { WhatsappShareWithIcon } from '../atoms/SocialIcons';
import { ROUTE_CONSTANTS } from '@/shared/Routes';
import { useScrollToTop } from '@/hooks/useScrollToTop';

// add props type
interface AuctionDetailPageProps {
  auctionDetail: IAuction,
  slug: string,
  isInterested: boolean
}

export const AuctionDetailPage: React.FC<AuctionDetailPageProps> = ({ auctionDetail, slug, isInterested }) => {
  const property = auctionDetail;
  const id = property?.id;
  const router = useRouter();
  const [noticeImageUrl, setNoticeImageUrl] = useState('');
  const userData = getCookie(COOKIES.AUCTION_USER_KEY)
    ? JSON.parse(getCookie(COOKIES.AUCTION_USER_KEY) ?? "")
    : null;
  const { showModal, openModal, hideModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin] = useState(true); // Default to true as requested

  // Use scroll to top hook for property detail pages
  useScrollToTop({
    scrollOnRouteChange: true,
    preserveOnBack: true
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorMessage message={error} onRetry={() => { }} />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Property not found</h2>
            <Link
              href="/auctions"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Auctions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatPrice = (price: string | null | undefined) => {
    if (!price || price === '0' || price === 'null') return 'Not specified';
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice === 0) return 'Not specified';

    // Show actual amount without formatting on detail page
    return `₹ ${numPrice.toLocaleString('en-IN')}`;
  };



  // About Property Section Component
  const renderAboutPropertySection = () => {
    // Check if we have any meaningful property data to display
    const hasDescription = property.description && property.description.trim();
    const hasResidentialDetail = property.residential_detail && property.residential_detail.trim();
    const hasCommercialDetail = property.commercial_detail && property.commercial_detail.trim();
    const hasIndustryDetail = property.industry_detail && property.industry_detail.trim();
    const hasAgricultureDetail = property.agriculture_detail && property.agriculture_detail.trim();
    const hasPropertyAddress = property.property_address && property.property_address.trim();
    const hasPincode = property.pincode && property.pincode.trim();

    // If no meaningful data exists, return null
    if (!hasDescription && !hasResidentialDetail && !hasCommercialDetail &&
      !hasIndustryDetail && !hasAgricultureDetail && !hasPropertyAddress && !hasPincode) {
      return null;
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <SectionHeader title="About Property" />
        <div className="text-sm text-gray-700 leading-relaxed">
          {hasDescription ? (
            <p className="mb-3">{property.description}</p>
          ) : (
            <>
              {hasResidentialDetail && (
                <p className="mb-3">
                  <strong>Residential Details:</strong> {property.residential_detail}
                </p>
              )}
              {hasCommercialDetail && (
                <p className="mb-3">
                  <strong>Commercial Details:</strong> {property.commercial_detail}
                </p>
              )}
              {hasIndustryDetail && (
                <p className="mb-3">
                  <strong>Industrial Details:</strong> {property.industry_detail}
                </p>
              )}
              {hasAgricultureDetail && (
                <p className="mb-3">
                  <strong>Agricultural Details:</strong> {property.agriculture_detail}
                </p>
              )}
              {hasPropertyAddress && (
                <p className="mb-3">
                  <strong>Address:</strong> {property.property_address}
                  {hasPincode && `, PIN: ${property.pincode}`}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  // Helper component for section headers
  const SectionHeader: React.FC<{ title: string; className?: string }> = ({ title, className = '' }) => (
    <div className={`border-b border-gray-200 pb-3 mb-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
  );

  const images = getPropertyImages(property);
  const hasRealImages = images.length > 0 && !images[0].includes('no-image-placeholder.png');
  const handleBackClick = () => {
    router.back();
  };

  const renderInterestContainer = () => {
    if (isInterested) {
      return (
        <div className="flex items-center gap-2 bg-green-50 p-3 rounded-md shadow-sm">
          <FontAwesomeIcon
            icon={faCheck}
            className="text-green-700 text"
          />
          <span className="text-sm text-green-700 font-bold uppercase">
            {STRING_DATA.ALREADY_INTERESTED}
          </span>
        </div>
      )
    }
    return <ActionButton
      text={STRING_DATA.SHOW_INTEREST.toUpperCase()}
      onclick={showModal}
      icon={<WishlistSvg />}
    />
  }

  const sharedUrl = getSharedAuctionUrl(property);
  const PROPERTY_ID = `E${property.id}`; // Property ID

  return (
    <>
      {openModal ? (
        <InterestModal
          openModal={openModal}
          hideModal={hideModal}
          userData={userData}
          auctionDetail={property}
        />
      ) : null}


      <div className="min-h-screen">
        <div className="">
          <div className="flex justify-between items-center mb-4">
            <em
              className="rounded-full bg-gray-300 px-3 py-2 cursor-pointer"
              onClick={handleBackClick}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </em>
            <div className="flex items-center gap-3">
              {/* Share Button */}
              <button className="flex items-center px-4 py-2 text-green-600 border border-green-300 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium">
                <WhatsappShareWithIcon url={sharedUrl} />
              </button>
              {/* Interest Button */}
              {renderInterestContainer()}
            </div>
          </div>
          {/* Property Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {property.title || 'Property Title Not Available'}
                </h1>
                {/* Property ID */}
                <div className="mb-3">
                  <span className="property-id-badge">
                    {PROPERTY_ID}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm-xs text-gray-600 mb-4">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{property.city && property.state ? `${property.city}, ${property.state}` : 'Location not specified'}</span>
                    </div>
                    {/* Google Maps Link - Moved to the right */}
                    {(property.lat && property.lng) && (
                      <ActionButton
                        text={"VIEW ON MAP"}
                        onclick={() => {
                          window.open(`https://www.google.com/maps?q=${property.lat},${property.lng}`, '_blank');
                        }}
                        icon={<MapPin className="h-4 w-4 mr-2" />}
                      />
                    )}
                  </div>
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{property.assetType || 'Asset type not specified'}</span>
                  </div>
                  {property.area && (
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{property.area}</span>
                    </div>
                  )}
                </div>

                {/* Property Address */}
                {property.propertyAddress && (
                  <div className="flex items-start text-sm-xs text-gray-600">
                    <MapPin className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0 mr-2" />
                    <div className="flex-1">
                      <span className="break-words">{property.propertyAddress}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Key Auction Details - Quick Overview */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Reserved Price */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm-xs font-medium text-gray-600 uppercase tracking-wide">Reserved Price</span>
                    <Info className="h-3 w-3 text-gray-500" />
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {property.reservePrice ? formatPrice(property.reservePrice?.toString()) : 'Not specified'}
                  </div>
                </div>

                {/* Service Provider */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm-xs font-medium text-gray-600 uppercase tracking-wide">Service Provider</span>
                    <Building className="h-3 w-3 text-gray-500" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {property.serviceProvider || 'Not specified'}
                  </div>
                </div>

                {/* Auction Start Time */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm-xs font-medium text-gray-600 uppercase tracking-wide">Auction Start Date</span>
                    <Calendar className="h-3 w-3 text-gray-500" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {property.auctionStartTime ? getDateAndTimeFromISOString(property.auctionStartTime?.toString()).date : 'Not specified'}
                  </div>
                </div>

                {/* Bank Name */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm-xs font-medium text-gray-600 uppercase tracking-wide">Bank Name</span>
                    <Building className="h-3 w-3 text-gray-500" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {property.bankName || 'Not specified'}
                  </div>
                </div>
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Ownership Type */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm-xs font-medium text-gray-600 uppercase tracking-wide">Ownership Type</span>
                    <Home className="h-3 w-3 text-gray-500" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {property.propertyOwnerShipType || 'Not specified'}
                  </div>
                </div>

                {/* Possession Type */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm-xs font-medium text-gray-600 uppercase tracking-wide">Possession Type</span>
                    <Building className="h-3 w-3 text-gray-500" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {property.propertyPossessionType || 'Not specified'}
                  </div>
                </div>

                {/* Title Deed Type */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm-xs font-medium text-gray-600 uppercase tracking-wide">Title Deed Type</span>
                    <FileText className="h-3 w-3 text-gray-500" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {property.propertyTitleDeedType || 'Not specified'}
                  </div>
                </div>

                {/* Branch Name */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm-xs font-medium text-gray-600 uppercase tracking-wide">Branch Name</span>
                    <FileText className="h-3 w-3 text-gray-500" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {property.branchName || 'Not specified'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image Carousel - Only show if we have real property images */}
          {hasRealImages && (
            <div className="mb-6">
              <ImageCarousel
                images={images}
                title={property.title || 'Property Images'}
              />
            </div>
          )}

          {/* Main Content Grid */}
          <div className="gap-6">
            {/* Left Column */}
            <div className="space-y-6">

              {/* About Property Section */}
              {renderAboutPropertySection()}

              {/* Important Dates Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <SectionHeader title="Important Dates" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Auction Start Date & Time */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="text-sm-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Auction Start Date & Time
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {property.auctionStartTime ? getDateAndTimeFromISOString(property.auctionStartTime?.toString()).date : 'Not specified'}
                    </div>
                    <div className="text-sm text-gray-600 mt-2 font-semibold">
                      {property.auctionStartTime ? getDateAndTimeFromISOString(property.auctionStartTime).timePart : 'Not specified'}
                    </div>
                  </div>

                  {/* Auction End Date & Time */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="text-sm-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Auction End Date & Time
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {property.auctionEndDate ? getDateAndTimeFromISOString(property.auctionEndDate?.toString()).date : 'Not specified'}
                    </div>
                    <div className="text-sm text-gray-600 mt-2 font-semibold">
                      {property.auctionEndDate ? getDateAndTimeFromISOString(property.auctionEndDate).timePart : 'Not specified'}
                    </div>
                  </div>

                  {/* Property Inspection Date and Time */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="text-sm-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Property Inspection Date and Time
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {property.inspectionDateFrom ? getDateAndTimeFromISOStringForDisplay(property.inspectionDateFrom) : 'Not specified'}
                    </div>
                    {property.inspectionDateTo && (
                      <div className="text-sm text-gray-600 mt-1 font-medium">
                        to {getDateAndTimeFromISOStringForDisplay(property.inspectionDateTo)}
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Price Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <SectionHeader title="Price Information" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Reserve Price */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="text-sm-xs font-medium text-gray-600 uppercase tracking-wide mb-2 flex items-center">
                      <DollarSign className="h-3 w-3 mr-1" />
                      Reserve Price
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {property?.reservePrice ? formatPrice(property?.reservePrice?.toString()) : 'Not specified'}
                    </div>
                  </div>

                  {/* EMD Amount */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="text-sm-xs font-medium text-gray-600 tracking-wide mb-2 flex items-center gap-1">
                      <CreditCard className="h-3 w-3 mr-1" />
                      <span className="uppercase">EMD Amount</span>
                      <InfoTooltip
                        content={
                          <div>
                            <p className="font-semibold text-gray-900 mb-2">What is EMD?</p>
                            <p className="text-sm-xs text-gray-700">A refundable security deposit required to participate in the auction. It&apos;s fully refunded if you don&apos;t win.</p>
                          </div>
                        }
                        position="top"
                      />
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {property?.emd ? formatPrice(property?.emd?.toString()) : 'Not specified'}
                    </div>
                  </div>

                  {/* Increment Price */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="text-sm-xs font-medium text-gray-600 uppercase tracking-wide mb-2 flex items-center">
                      <Banknote className="h-3 w-3 mr-1" />
                      Increment Price
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {property?.incrementPrice ? formatPrice(property?.incrementPrice?.toString()) : 'Not specified'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <SectionHeader title="Contact Information" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* Branch */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Branch
                    </div>
                    <div className="text-sm font-semibold text-gray-900 break-words">
                      {property.branchName || '-'}
                    </div>
                  </div>


                  {/* Inspection Officer */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Inspection Officer
                    </div>
                    <div className="text-sm font-semibold text-gray-900 break-words">
                      {property.inspectionOfficerName || '-'}
                    </div>
                  </div>

                  {/* Contact Number */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      Contact Number
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {property.contact ? (
                        <a
                          href={`tel:${extractPhoneNumbers(property.contact)[0]}`}
                          className="hover:text-gray-700 transition-colors"
                        >
                          {extractPhoneNumbers(property.contact)[0]}
                        </a>
                      ) : (
                        '-'
                      )}
                    </div>
                  </div>


                </div>
              </div>

            </div>
          </div>

          {/* Survey Card - Always visible on detail pages after 10 days */}
          <div className="mt-6">
            <SurveyCard isRandom={false} isAuctionDetail={true} />
          </div>

          {/* Action Button - Download Notice */}
          {property.noticeLink && (
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="text-center">
                <a
                  href={property.noticeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm text-sm-xs"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Auction Notice
                </a>
              </div>
            </div>
          )}

          {/* Disclaimer Section */}
          <div className="mt-6 bg-gray-50 rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Disclaimer</h3>
            <div className="text-sm-xs text-gray-700 space-y-3 leading-relaxed">
              <ul className="list-disc list-outside text-sm-xs  ">
                <li>
                  Information is shared on an &quot;as-is&quot; basis. Buyers must exercise discretion and carry out due diligence. Refer to our
                  <Link href={ROUTE_CONSTANTS.TERMS} className="text-blue-600 hover:text-blue-700"> T&C </Link>
                  for details.
                </li>
                <li>
                  e-auctiondekho is operated by Omnistack Innovation Private Limited (CIN: U62099RJ2023PTC086380). Use of this site implies acceptance of our Terms of Service and Privacy Policy.
                </li>
                <li>
                  While efforts are made to keep listings accurate, we do not guarantee the authenticity or completeness of property information and are not liable for losses arising from its use.
                </li>
                <li>
                  Real estate investments carry risks. Property values may fluctuate, and buyers/investors should verify details independently and be prepared for potential losses.
                </li>
                <li>
                  e-auctiondekho does not endorse or recommend any property listed. Listings are for informational purposes only and do not constitute an offer or solicitation.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};