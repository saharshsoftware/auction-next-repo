"use client";
import React, { useState, useMemo } from "react";
import { IAlert, IAuction } from "@/types";
import { AuctionCard2 } from "@/components/atoms/AuctionCard2";
import BackButton from "@/components/ui/BackButton";
import { STRING_DATA, FEATURE_FLAGS, REACT_QUERY } from "@/shared/Constants";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { formatPrice, handleOnSettled } from "@/shared/Utilies";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteAlert, fetchAlertDetail } from "@/services/auction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPencil,
  faTrash,
  faMapMarkerAlt,
  faBuilding,
  faTags,
  faUniversity,
  faIndianRupeeSign,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import EditAlert from "../ modals/EditAlert";
import ConfirmationModal from "../ modals/ConfirmationModal";
import useModal from "@/hooks/useModal";
import ActionButton from "../atoms/ActionButton";
import BudgetRangePills from "../atoms/BudgetRangePills";
import ReactPaginate from "react-paginate";

interface ManageAlertDetailProps {
  alert: IAlert;
}

/**
 * Static auction data representing filtered results for the alert
 * This will be replaced with dynamic data in the future
 */
const getStaticAuctionData = (alertData: IAlert | null | undefined): IAuction[] => {
  if (!alertData) return [];
  
  // Generate 15 static auctions to test pagination (10 items per page = 2 pages)
  const baseAuctions = [
    {
      title: "Commercial Building in Agra - Prime Location",
      bankName: "State Bank of India",
      branchName: "Agra Main Branch",
      reservePrice: 15000000,
      estimatedMarketPrice: 20000000,
      auctionStartTime: "2025-11-15T10:00:00Z",
      auctionEndDate: "2025-11-15T18:00:00Z",
      slug: "commercial-building-agra-1",
    },
    {
      title: "Warehouse Property in Agra Industrial Area",
      bankName: "Punjab National Bank",
      branchName: "Agra Industrial Branch",
      reservePrice: 25000000,
      estimatedMarketPrice: 35000000,
      auctionStartTime: "2025-11-20T11:00:00Z",
      auctionEndDate: "2025-11-20T19:00:00Z",
      slug: "warehouse-property-agra-2",
    },
    {
      title: "Office Space in Agra City Center",
      bankName: "HDFC Bank",
      branchName: "Agra Central Branch",
      reservePrice: 18000000,
      estimatedMarketPrice: 22000000,
      auctionStartTime: "2025-11-25T09:00:00Z",
      auctionEndDate: "2025-11-25T17:00:00Z",
      slug: "office-space-agra-3",
    },
    {
      title: "Retail Shop in Agra Market",
      bankName: "ICICI Bank",
      branchName: "Agra Market Branch",
      reservePrice: 12000000,
      estimatedMarketPrice: 16000000,
      auctionStartTime: "2025-12-01T10:00:00Z",
      auctionEndDate: "2025-12-01T18:00:00Z",
      slug: "retail-shop-agra-4",
    },
    {
      title: "Industrial Plot in Agra",
      bankName: "Bank of Baroda",
      branchName: "Agra Industrial Branch",
      reservePrice: 30000000,
      estimatedMarketPrice: 40000000,
      auctionStartTime: "2025-12-05T11:00:00Z",
      auctionEndDate: "2025-12-05T19:00:00Z",
      slug: "industrial-plot-agra-5",
    },
    {
      title: "Showroom Space in Agra Downtown",
      bankName: "Axis Bank",
      branchName: "Agra Downtown Branch",
      reservePrice: 22000000,
      estimatedMarketPrice: 28000000,
      auctionStartTime: "2025-12-10T10:00:00Z",
      auctionEndDate: "2025-12-10T18:00:00Z",
      slug: "showroom-agra-6",
    },
    {
      title: "Commercial Complex in Agra",
      bankName: "Canara Bank",
      branchName: "Agra Main Branch",
      reservePrice: 45000000,
      estimatedMarketPrice: 55000000,
      auctionStartTime: "2025-12-15T09:00:00Z",
      auctionEndDate: "2025-12-15T17:00:00Z",
      slug: "commercial-complex-agra-7",
    },
    {
      title: "Business Center in Agra Tech Park",
      bankName: "Union Bank",
      branchName: "Agra Tech Branch",
      reservePrice: 35000000,
      estimatedMarketPrice: 42000000,
      auctionStartTime: "2025-12-20T11:00:00Z",
      auctionEndDate: "2025-12-20T19:00:00Z",
      slug: "business-center-agra-8",
    },
    {
      title: "Shopping Mall Unit in Agra",
      bankName: "Indian Bank",
      branchName: "Agra Mall Branch",
      reservePrice: 28000000,
      estimatedMarketPrice: 35000000,
      auctionStartTime: "2025-12-25T10:00:00Z",
      auctionEndDate: "2025-12-25T18:00:00Z",
      slug: "mall-unit-agra-9",
    },
    {
      title: "Corporate Office in Agra Business District",
      bankName: "Central Bank",
      branchName: "Agra Business Branch",
      reservePrice: 40000000,
      estimatedMarketPrice: 50000000,
      auctionStartTime: "2025-12-30T09:00:00Z",
      auctionEndDate: "2025-12-30T17:00:00Z",
      slug: "corporate-office-agra-10",
    },
    {
      title: "Commercial Land in Agra Highway",
      bankName: "State Bank of India",
      branchName: "Agra Highway Branch",
      reservePrice: 55000000,
      estimatedMarketPrice: 65000000,
      auctionStartTime: "2026-01-05T10:00:00Z",
      auctionEndDate: "2026-01-05T18:00:00Z",
      slug: "commercial-land-agra-11",
    },
    {
      title: "Hotel Property in Agra Tourist Area",
      bankName: "Punjab National Bank",
      branchName: "Agra Tourist Branch",
      reservePrice: 75000000,
      estimatedMarketPrice: 90000000,
      auctionStartTime: "2026-01-10T11:00:00Z",
      auctionEndDate: "2026-01-10T19:00:00Z",
      slug: "hotel-property-agra-12",
    },
    {
      title: "Restaurant Space in Agra Food Street",
      bankName: "HDFC Bank",
      branchName: "Agra Food Street Branch",
      reservePrice: 16000000,
      estimatedMarketPrice: 20000000,
      auctionStartTime: "2026-01-15T10:00:00Z",
      auctionEndDate: "2026-01-15T18:00:00Z",
      slug: "restaurant-agra-13",
    },
    {
      title: "Multiplex Building in Agra Entertainment Zone",
      bankName: "ICICI Bank",
      branchName: "Agra Entertainment Branch",
      reservePrice: 60000000,
      estimatedMarketPrice: 75000000,
      auctionStartTime: "2026-01-20T09:00:00Z",
      auctionEndDate: "2026-01-20T17:00:00Z",
      slug: "multiplex-agra-14",
    },
    {
      title: "IT Office Space in Agra Tech Hub",
      bankName: "Axis Bank",
      branchName: "Agra Tech Hub Branch",
      reservePrice: 32000000,
      estimatedMarketPrice: 38000000,
      auctionStartTime: "2026-01-25T11:00:00Z",
      auctionEndDate: "2026-01-25T19:00:00Z",
      slug: "it-office-agra-15",
    },
  ];

  // Map base auctions to full IAuction objects
  return baseAuctions.map((auction, index) => ({
    id: String(index + 1),
    title: auction.title,
    bankName: auction.bankName,
    branchName: auction.branchName,
    assetCategory: alertData.assetCategory || "Commercial",
    assetType: alertData.assetType || "Commercial Building",
    location: alertData.location || "Agra",
    city: "Agra",
    state: "Uttar Pradesh",
    reservePrice: auction.reservePrice,
    estimatedMarketPrice: auction.estimatedMarketPrice,
    auctionStartTime: auction.auctionStartTime,
    auctionEndDate: auction.auctionEndDate,
    slug: auction.slug,
    auctionId: `AUC-${String(index + 1).padStart(3, "0")}`,
    propertyPossessionType: "Physical",
    noticeImageUrl: "",
    noticeImageURLs: [],
    createdAt: "2025-10-01T00:00:00Z",
    updatedAt: "2025-10-01T00:00:00Z",
    publishedAt: "2025-10-01T00:00:00Z",
    propertyType: `${alertData.assetCategory || "Commercial"} - ${alertData.assetType || "Commercial Building"}`,
    contact: "",
    contactNo: "",
    area: "",
    description: "",
    auctionType: "",
    noticeLink: "",
    authorisedOfficerContactPerson: "",
    applicationSubmissionDate: "",
    emd: 0,
    borrowerName: "",
    serviceProvider: "",
    search: "",
    updatedById: null,
    sitemapExclude: false,
    owner_name: "",
    propertyAddress: "",
    bankPropertyId: "",
    propertyTitleDeedType: "",
    propertyOwnerShipType: "",
    residentialDetail: "",
    commercialDetail: "",
    industryDetail: "",
    agricultureDetail: "",
    pincode: "",
    dealingOfficerName: "",
    inspectionDateFrom: "",
    inspectionDateTo: "",
    emdStartDateTime: "",
    emdEndDateTime: "",
    borrowerAddress: "",
    incrementPrice: 0,
    lat: "",
    lng: "",
  }));
};

const ManageAlertDetail: React.FC<{ id: string }> = ({ id }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [selectedData, setSelectedData] = useState<IAlert>();

  // Get current page from URL search params
  const currentPage = Number(searchParams.get("page")) || 1;
  const ITEMS_PER_PAGE = 10;

  const {
    showModal: showModalEdit,
    openModal: openModalEdit,
    hideModal: hideModalEdit,
  } = useModal();

  const {
    showModal: showModalDelete,
    openModal: openModalDelete,
    hideModal: hideModalDelete,
  } = useModal();

  const { data: alertData, isLoading: isLoadingAlert } = useQuery({
    queryKey: ["alert", id],
    queryFn: async () => {
      const res = (await fetchAlertDetail(id)) as unknown as IAlert;
      return res ?? null;
    },
  });

  // Delete mutation
  const { mutate: deleteAlertMutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteAlert,
    onSettled: async (data) => {
      hideModalDelete();
      const response = {
        data,
        success: () => {
          queryClient.invalidateQueries({
            queryKey: [REACT_QUERY.ALERTS],
          });
          router.push(ROUTE_CONSTANTS.MANAGE_ALERT);
        },
        fail: (error: any) => {
          console.error("Failed to delete alert:", error);
        },
      };
      handleOnSettled(response);
    },
  });

  const handleBack = () => {
    router.push(ROUTE_CONSTANTS.MANAGE_ALERT);
  };

  const handleEditModal = () => {
    if (alertData) {
      setSelectedData(alertData);
      showModalEdit();
    }
  };

  const handleDeleteModal = () => {
    if (alertData) {
      setSelectedData(alertData);
      showModalDelete();
    }
  };

  const handleDeleteAction = () => {
    if (selectedData?.id) {
      deleteAlertMutate({ id: selectedData.id });
    }
  };

  const closeDeleteModal = () => {
    setSelectedData(undefined);
    hideModalDelete();
  };

  const renderAlertInfo = () => {
    if (isLoadingAlert) {
      return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
          <div className="text-center text-gray-600">
            <div className="animate-pulse">Loading alert details...</div>
          </div>
        </div>
      );
    }

    if (!alertData) {
      return (
        <div className="bg-white rounded-xl shadow-md border border-red-200 p-6 mb-6">
          <div className="text-center text-red-600 font-semibold">
            Alert not found
          </div>
        </div>
      );
    }

    return (
      <>
        {/* Header Section - Clean and Minimal */}
                    {/* Top Row: Back button and Actions */}
                    <div className="flex items-center justify-between mb-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Go back"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                <span className="text-sm font-medium">Back</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleEditModal}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                >
                  <FontAwesomeIcon icon={faPencil} className="text-sm" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDeleteModal}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                >
                  <FontAwesomeIcon icon={faTrash} className="text-sm" />
                  <span>Delete</span>
                </button>
              </div>
            </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col gap-4">

            {/* Alert Title */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faBell} className="text-gray-400 text-sm" />
                <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                  Alert Details
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {alertData.name}
              </h1>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-2"></div>

            {/* Alert Criteria - Simplified Grid */}
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Alert Criteria
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {alertData?.location && (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        className="text-gray-400 text-sm"
                      />
                      <span className="text-xs text-gray-500 font-semibold uppercase">
                        Location
                      </span>
                    </div>
                    <span className="text-base text-gray-900 font-semibold">
                      {alertData.location}
                    </span>
                  </div>
                )}

                {alertData?.assetCategory && (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faBuilding}
                        className="text-gray-400 text-sm"
                      />
                      <span className="text-xs text-gray-500 font-semibold uppercase">
                        Asset Category
                      </span>
                    </div>
                    <span className="text-base text-gray-900 font-semibold">
                      {alertData.assetCategory}
                    </span>
                  </div>
                )}

                {alertData?.assetType && (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faTags}
                        className="text-gray-400 text-sm"
                      />
                      <span className="text-xs text-gray-500 font-semibold uppercase">
                        Asset Type
                      </span>
                    </div>
                    <span className="text-base text-gray-900 font-semibold">
                      {alertData.assetType}
                    </span>
                  </div>
                )}

                {alertData?.bankName && (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faUniversity}
                        className="text-gray-400 text-sm"
                      />
                      <span className="text-xs text-gray-500 font-semibold uppercase">
                        Bank Name
                      </span>
                    </div>
                    <span className="text-base text-gray-900 font-semibold">
                      {alertData.bankName}
                    </span>
                  </div>
                )}
              </div>

              {/* Budget Ranges - Using BudgetRangePills Component */}
              {alertData?.budgetRanges && alertData.budgetRanges.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="text-gray-400 text-sm"
                    />
                    <span className="text-xs text-gray-500 font-semibold uppercase">
                      Budget Ranges
                    </span>
                  </div>
                  <BudgetRangePills
                    budgetRanges={alertData.budgetRanges}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  /**
   * Render static auction listings with pagination
   * This will be replaced with dynamic API data when FEATURE_FLAGS.USE_STATIC_ALERT_AUCTIONS is set to false
   */
  const renderStaticAuctionListings = () => {
    if (!alertData) return null;

    const allAuctions = getStaticAuctionData(alertData);
    const totalPages = Math.ceil(allAuctions.length / ITEMS_PER_PAGE);

    // Paginate auctions
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedAuctions = allAuctions.slice(startIndex, endIndex);

    const handlePageChange = (event: { selected: number }) => {
      const newPage = event.selected + 1;
      router.push(`${pathname}?page=${newPage}`, { scroll: true });
      // Scroll to top of auction list
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (allAuctions.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600 text-lg">
            No auctions found matching your alert criteria.
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Matching Properties ({allAuctions.length})
          </h2>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {paginatedAuctions.map((auction) => (
            <AuctionCard2 key={auction.id} property={auction} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="my-4">
            <ReactPaginate
              previousLabel="< previous"
              breakLabel="..."
              nextLabel="next >"
              pageCount={totalPages}
              onPageChange={handlePageChange}
              marginPagesDisplayed={1}
              pageRangeDisplayed={1}
              forcePage={currentPage - 1}
              className="flex justify-center pagination"
            />
          </div>
        )}
      </div>
    );
  };

  /**
   * Render dynamic auction listings from API with pagination
   * Uncomment and use this when FEATURE_FLAGS.USE_STATIC_ALERT_AUCTIONS is set to false
   */
  // const renderDynamicAuctionListings = () => {
  //   const { data: auctionsResponse, isLoading: isLoadingAuctions } = useQuery({
  //     queryKey: ["alert-auctions", id, currentPage],
  //     queryFn: async () => {
  //       // TODO: Replace with actual API call to fetch auctions for this alert
  //       // Include page parameter in the API call
  //       // const res = await fetchAlertAuctions(id, currentPage, ITEMS_PER_PAGE);
  //       // return res ?? { data: [], totalPages: 0 };
  //       return { data: [], totalPages: 0 };
  //     },
  //     enabled: !!alertData?.id,
  //   });
  //
  //   const handlePageChange = (event: { selected: number }) => {
  //     const newPage = event.selected + 1;
  //     router.push(`${pathname}?page=${newPage}`, { scroll: true });
  //     window.scrollTo({ top: 0, behavior: "smooth" });
  //   };
  //
  //   if (isLoadingAuctions) {
  //     return (
  //       <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
  //         <p className="text-gray-600 text-lg">Loading auctions...</p>
  //       </div>
  //     );
  //   }
  //
  //   const auctionsData = auctionsResponse?.data || [];
  //   const totalPages = auctionsResponse?.totalPages || 0;
  //
  //   if (auctionsData.length === 0) {
  //     return (
  //       <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
  //         <p className="text-gray-600 text-lg">
  //           No auctions found matching your alert criteria.
  //         </p>
  //       </div>
  //     );
  //   }
  //
  //   return (
  //     <div className="flex flex-col gap-4">
  //       <div className="flex items-center justify-between">
  //         <h2 className="text-xl font-bold text-gray-900">
  //           Matching Properties ({auctionsData.length})
  //         </h2>
  //         <span className="text-sm text-gray-600">
  //           Page {currentPage} of {totalPages}
  //         </span>
  //       </div>
  //
  //       <div className="flex flex-col gap-4">
  //         {auctionsData.map((auction: IAuction) => (
  //           <AuctionCard2 key={auction.id} property={auction} />
  //         ))}
  //       </div>
  //
  //       {/* Pagination */}
  //       {totalPages > 1 && (
  //         <div className="my-4">
  //           <ReactPaginate
  //             previousLabel="< previous"
  //             breakLabel="..."
  //             nextLabel="next >"
  //             pageCount={totalPages}
  //             onPageChange={handlePageChange}
  //             marginPagesDisplayed={1}
  //             pageRangeDisplayed={1}
  //             forcePage={currentPage - 1}
  //             className="flex justify-center pagination"
  //           />
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

  return (
    <>
      {/* Edit Modal */}
      <EditAlert
        fieldata={selectedData}
        openModal={openModalEdit}
        hideModal={hideModalEdit}
        deleteLoading={isDeleting}
        deleteAction={handleDeleteAction}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        message={STRING_DATA.DELETE_ALERT_MESSAGE}
        openModal={openModalDelete}
        actionLabel={STRING_DATA.DELETE}
        hideModal={closeDeleteModal}
        onActionClick={handleDeleteAction}
        loading={isDeleting}
      />

      <div className="mx-auto lg:w-3/5 sm:w-4/5 w-11/12 my-4">
        {renderAlertInfo()}
        {FEATURE_FLAGS.USE_STATIC_ALERT_AUCTIONS && renderStaticAuctionListings()}
        {/* Uncomment below when ready to use dynamic API data */}
        {/* {!FEATURE_FLAGS.USE_STATIC_ALERT_AUCTIONS && renderDynamicAuctionListings()} */}
      </div>
    </>
  );
};

export default ManageAlertDetail;

