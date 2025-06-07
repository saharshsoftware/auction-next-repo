/* eslint-disable @next/next/no-img-element */
"use client";
import { IAuction } from "@/types";
import React, { useEffect, useState } from "react";
import ShowLabelValue from "../atoms/ShowLabelValue";
import {
  COOKIES,
  SESSIONS_STORAGE_KEYS,
  STRING_DATA,
} from "@/shared/Constants";
import {
  formatPrice,
  formattedDateAndTime,
  getSharedAuctionUrl,
} from "@/shared/Utilies";
import Link from "next/link";
import ActionButton from "../atoms/ActionButton";
import NewTabSvg from "../svgIcons/NewTabSvg";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import useModal from "@/hooks/useModal";
import { getCookie } from "cookies-next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheck } from "@fortawesome/free-solid-svg-icons";
import { WhatsappShareWithIcon } from "../atoms/SocialIcons";
import { WishlistSvg } from "../svgIcons/WishlistSvg";
import InterestModal from "../ modals/InterestModal";
import FullScreenImageModal from "../ modals/FullScreenImageModal";
import Image from "next/image";
import { useAuctionDetailsStore } from "@/zustandStore/auctionDetails";
import BlurredFieldWrapper from "../atoms/BlurredFieldWrapper";
import { useRouter } from "next/navigation";
import { loginLogic } from "@/utilies/LoginHelper";
import { useLoginFormTrigger } from "@/hooks/useLoginTrigger";
import LoginModal from "../ modals/LoginModal";

const auctionLabelClass = () => "text-sm text-gray-400 font-bold";

const AuctionDetail = (props: { auctionDetail: IAuction, slug: string, isInterested: boolean }) => {
  const { auctionDetail, slug, isInterested = false } = props;
  const showLogin = loginLogic.getShouldShowLogin()
  const router = useRouter();
  const noticeImageUrl = auctionDetail?.noticeImageURL
    ? `${process.env.NEXT_PUBLIC_IMAGE_CLOUDFRONT}/${auctionDetail?.noticeImageURL}`
    : "";
  const tokenFromCookie = getCookie(COOKIES.TOKEN_KEY);
  const [token, setToken] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setToken(tokenFromCookie ? String(tokenFromCookie) : null);
  }, [tokenFromCookie]);

  useEffect(() => {
    if (!token) {
      loginLogic.markAuctionDetailVisited(slug); // Pass unique ID
    }
  }, [slug, token]);

  const { showModal, openModal, hideModal } = useModal();
  const {
    showModal: showImageModal,
    openModal: openImageModal,
    hideModal: hideImageModal,
  } = useModal();

  const userData = getCookie(COOKIES.AUCTION_USER_KEY)
    ? JSON.parse(getCookie(COOKIES.AUCTION_USER_KEY) ?? "")
    : null;

  const sharedUrl = getSharedAuctionUrl(auctionDetail);

  const renderPriceDetails = () => {
    if (auctionDetail?.assetCategory !== "Gold Auctions") {
      return (
        <>
          <span className={auctionLabelClass()}>Reserve price</span>
          <span className="custom-prize-color font-bold text-2xl">
            {formatPrice(auctionDetail?.reservePrice)}
          </span>
          <span
            className="border border-blue-300 bg-blue-100 text-sm rounded-full px-2 py-1 font-semibold"
            style={{ width: "max-content" }}
          >
            Estimated Market Value{" "}
            {formatPrice(auctionDetail?.estimatedMarketPrice)}
          </span>
        </>
      );
    }
    return null;
  };

  const noticeLinkRenderer = () => {
    if (token === null && showLogin) {
      return (
        <button
          onClick={showModal}
          className="flex items-center justify-center cursor-pointer  link link-primary font-semibold underline rounded "
        >
          {STRING_DATA.LOGIN_VIEW_DOC.toUpperCase()}
        </button>
      );
    }
    return (
      // <Link
      //   // href={`${process.env.NEXT_PUBLIC_IMAGE_CLOUDFRONT}/${auctionDetail?.noticeImageURL}`}
      //   target="_blank"
      //   className="flex items-center gap-2 link link-primary"
      //   onClick={showImageModal}
      // >
      //   <span>Notice link</span>
      //   <NewTabSvg />
      // </Link>
      <>
        <div
          className="flex items-center gap-2 link link-primary"
          onClick={showImageModal}
        >
          <>
            <span>Notice link</span>
            <NewTabSvg />
          </>
        </div>
        <div className="relative">
          {/* <Image
              src={noticeImageUrl}
              width={120}
              height={60}
              alt="no-data"
              onError={() => {
                setHasError(true);
              }}
            /> */}

          <img
            src={noticeImageUrl}
            alt={"no-data"}
            className={"w-24  h-auto bg-contain hidden"}
            onError={() => {
              setHasError(true);
            }}
          />
        </div>
      </>
    );

  };

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

  if (!auctionDetail) return <p>Loading...</p>;

  const renderTermsAndConditions = () => {
    return (
      <div className="text-sm mt-2 cursor-pointer  link link-primary font-semibold underline">
        <a href="/terms" rel="noopener noreferrer">
          Terms & Conditions
        </a>
      </div>
    );
  };

  const renderAuctionExpiredNotice = () => {
    const isPastDate =
      auctionDetail?.auctionEndDate &&
      new Date(auctionDetail.auctionEndDate) < new Date();

    if (isPastDate) {
      return (
        <div className="text-red-600 text-sm font-semibold flex items-center gap-1">
          ⚠ Notice: This auction notice is from a past date. The information shown may be outdated or no longer valid. Please verify details with the official source if you intend to take action.
        </div>
      );
    }
    return null;
  };


  return (
    <>
      {/* Create alert Modal */}
      {openModal ? (
        <InterestModal
          openModal={openModal}
          hideModal={hideModal}
          userData={userData}
          auctionDetail={auctionDetail}
        />
      ) : null}

      {openImageModal ? (
        <FullScreenImageModal
          openModal={openImageModal}
          hideModal={hideImageModal}
          imageUrl={noticeImageUrl}
        />
      ) : null}


      <div className="flex flex-col gap-4 w-full">
        {/* {JSON.stringify(auctionDetail)} */}
        <div className="flex justify-between items-center">
          {/* <Link href={window.location.href}> */}
          <em
            className="rounded-full bg-gray-300 px-3 py-2 cursor-pointer"
            onClick={handleBackClick}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </em>
          {/* </Link> */}

          {renderInterestContainer()}
        </div>
        <div className="flex lg:flex-row flex-col gap-4 justify-between items-start">
          <h1 className="custom-h2-class break-words">
            {auctionDetail?.title}
          </h1>
        </div>
        {renderAuctionExpiredNotice()}
        <div className={`flex gap-4 justify-between items-start flex-wrap `}>
          {/* <div className="flex flex-col gap-2 items-start justify-start">
            {renderPriceDetails()}
          </div> */}
          <div className="border border-green-500 rounded-lg px-2 py-1">
            {WhatsappShareWithIcon({ url: sharedUrl })}
          </div>
        </div>

        {auctionDetail?.description && (
          <BlurredFieldWrapper isBlurred={token === null && showLogin}>
            <p className="flex-1 ">{auctionDetail?.description}</p>
          </BlurredFieldWrapper>
        )}
        <div className="text-2xl font-bold">{STRING_DATA.DESCRIPTION}</div>
        <hr className="border-[0.25px] border-zinc-400" />
        <div className="space-y-4 w-full">
          <ShowLabelValue
            heading={STRING_DATA.BANK}
            value={auctionDetail?.bankName}
          />
          <ShowLabelValue
            heading={STRING_DATA.BRANCH_NAME}
            value={auctionDetail?.branchName}
          />
          <ShowLabelValue
            heading={STRING_DATA.PROPERTY_TYPE}
            value={auctionDetail?.propertyType}
          />
          <ShowLabelValue
            heading={STRING_DATA.AREA}
            value={auctionDetail?.area ?? "-"}
          />
          <ShowLabelValue
            heading={STRING_DATA.CITY}
            value={auctionDetail?.city}
          />
          <ShowLabelValue
            isBlurred={token === null && showLogin}
            heading={STRING_DATA.CONTACT}
            value={auctionDetail?.contact}
          />
          <ShowLabelValue
            heading={STRING_DATA.RESERVED_PRICE}
            value={formatPrice(auctionDetail?.reservePrice)}
          />
          <ShowLabelValue
            heading={STRING_DATA.SERVICE_PROVIDER}
            value={auctionDetail?.serviceProvider}
          />
          <ShowLabelValue
            heading={STRING_DATA.EMD_AMOUNT}
            value={formatPrice(auctionDetail?.emd)}
          />
          <ShowLabelValue
            heading={STRING_DATA.EMD_SUBMISSION}
            value={
              auctionDetail?.auctionEndDate
                ? formattedDateAndTime(auctionDetail?.auctionEndDate ?? "")
                : "-"
            }
          />
          <ShowLabelValue
            heading={STRING_DATA.AUCTION_START_D_AND_T}
            value={
              auctionDetail?.auctionStartTime
                ? formattedDateAndTime(auctionDetail?.auctionStartTime ?? "")
                : "-"
            }
          />
          <ShowLabelValue
            heading={STRING_DATA.AUCTION_END_D_AND_T}
            value={
              auctionDetail?.auctionEndDate
                ? formattedDateAndTime(auctionDetail?.auctionEndDate ?? "")
                : "-"
            }
          />
          {/* Set hasChildren props true to render link in ui */}
          {!hasError && auctionDetail?.noticeImageURL ? (
            <ShowLabelValue heading={"Documents"} hasChildren={true}>
              {noticeLinkRenderer()}
            </ShowLabelValue>
          ) : null}
        </div>
        {renderTermsAndConditions()}
      </div>
    </>
  );
};

export default AuctionDetail;
