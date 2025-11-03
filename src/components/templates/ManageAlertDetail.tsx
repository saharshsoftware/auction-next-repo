"use client";
import React, { useState } from "react";
import { IAlert, IAuction } from "@/types";
import { AuctionCard2 } from "@/components/atoms/AuctionCard2";
import { STRING_DATA, FEATURE_FLAGS, REACT_QUERY } from "@/shared/Constants";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { handleOnSettled } from "@/shared/Utilies";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteAlert, fetchAlertDetail, fetchAlertMatchingNotices } from "@/services/auction";
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
import BudgetRangePills from "../atoms/BudgetRangePills";
import ReactPaginate from "react-paginate";


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

  // Fetch matching notices from API with server-side pagination
  const { data: noticesResponse, isLoading: isLoadingNotices } = useQuery({
    queryKey: ["alert-matching-notices", id, currentPage],
    queryFn: async () => {
      const res = await fetchAlertMatchingNotices({
        alertId: id,
        page: currentPage,
        pageSize: ITEMS_PER_PAGE,
        days: 60,
        noticesLimit: 100,
        sortField: "created_at",
        sortOrder: "DESC",
      });
      return res ?? { data: [], meta: { pagination: {} } };
    },
    enabled: !!alertData?.id && !FEATURE_FLAGS.USE_STATIC_ALERT_AUCTIONS,
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
        <div className="p-6 mb-6">
          <div className="text-center text-gray-600">
            <div className="animate-pulse text-xs">Loading alert details...</div>
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
   * Render dynamic auction listings from API with server-side pagination
   * API handles pagination, we just display the results
   */
  const renderDynamicAuctionListings = () => {
    const handlePageChange = (event: { selected: number }) => {
      const newPage = event.selected + 1;
      router.push(`${pathname}?page=${newPage}`, { scroll: true });
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (isLoadingNotices) {
      return (
        <div className="text-center py-12 ">
          <p className="text-gray-600 text-xs">Loading matching properties...</p>
        </div>
      );
    }

    // Extract data from API response
    const alertResults = noticesResponse?.data || [];
    const notices = alertResults.length > 0 ? alertResults[0]?.notices || [] : [];
    const pagination = noticesResponse?.meta?.pagination || {};
    const totalPages = pagination.pageCount || 0;

    if (notices.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600 text-lg">
            No properties found matching your alert criteria.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            We&apos;ll notify you when new matching properties are available.
          </p>
        </div>
      );
    }

    // Transform API notices to IAuction format
    const transformedAuctions: IAuction[] = notices.map((notice: any) => ({
      id: String(notice.id),
      title: notice.title || "",
      bankName: notice.bankName || "",
      branchName: notice.branchName || "",
      assetCategory: notice.assetCategory || "",
      assetType: alertData?.assetType || "",
      location: notice.city || "",
      city: notice.city || "",
      state: notice.state || "",
      reservePrice: notice.reservePrice || 0,
      estimatedMarketPrice: 0,
      auctionStartTime: notice.createdAt || "",
      auctionEndDate: "",
      slug: notice.slug || "",
      auctionId: "",
      propertyPossessionType: "",
      noticeImageUrl: "",
      noticeImageURLs: [],
      createdAt: notice.createdAt || "",
      updatedAt: "",
      publishedAt: "",
      propertyType: `${notice.assetCategory || ""} - ${alertData?.assetType || ""}`,
      contact: notice.contact || "",
      contactNo: "",
      area: "",
      description: notice.description || "",
      auctionType: "",
      noticeLink: notice.noticeLink || "",
      authorisedOfficerContactPerson: "",
      applicationSubmissionDate: "",
      emd: 0,
      borrowerName: notice.borrowerName || "",
      serviceProvider: notice.serviceProvider || "",
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

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Matching Properties
          </h2>
          {totalPages > 1 && (
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {transformedAuctions.map((auction: IAuction) => (
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
        {/* Only render listings after alert data is loaded */}
        {!isLoadingAlert && alertData && renderDynamicAuctionListings()}
      </div>
    </>
  );
};

export default ManageAlertDetail;

