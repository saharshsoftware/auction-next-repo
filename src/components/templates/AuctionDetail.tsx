"use client";
import { IAuction } from "@/types";
import React, { useEffect, useState } from "react";
import ShowLabelValue from "../atoms/ShowLabelValue";
import { COOKIES, STRING_DATA } from "@/shared/Constants";
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
import { faArrowLeft, faHeart } from "@fortawesome/free-solid-svg-icons";
import { WhatsappShareWithIcon } from "../atoms/SocialIcons";
import { WishlistSvg } from "../svgIcons/WishlistSvg";
import InterestModal from "../ modals/InterestModal";
import { useRouter } from "next/navigation";

const auctionLabelClass = () => "text-sm text-gray-400 font-bold";

const AuctionDetail = (props: { auctionDetail: IAuction }) => {
  const { auctionDetail } = props;
  const tokenFromCookie = getCookie(COOKIES.TOKEN_KEY);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(tokenFromCookie ? String(tokenFromCookie) : null);
  }, [tokenFromCookie]);
  const { showModal, openModal, hideModal } = useModal();
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
    if (token === null) {
      return (
        <ActionButton
          text={STRING_DATA.LOGIN_VIEW_DOC.toUpperCase()}
          onclick={showModal}
        />
      );
    }
    if (token) {
      return (
        <Link
          href={`${process.env.NEXT_PUBLIC_IMAGE_CLOUDFRONT}/${auctionDetail?.noticeImageURL}`}
          target="_blank"
          className="flex items-center gap-2 link link-primary"
        >
          <span>Notice link</span>
          <NewTabSvg />
        </Link>
      );
    }
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
      <div className="flex flex-col gap-4 w-full">
        {/* {JSON.stringify(auctionDetail)} */}
        <div className="flex justify-between items-center">
          <Link href={ROUTE_CONSTANTS.AUCTION}>
            <em className="rounded-full bg-gray-300 px-3 py-2">
              <FontAwesomeIcon icon={faArrowLeft} />
            </em>
          </Link>
          <ActionButton
            text={STRING_DATA.SHOW_INTEREST.toUpperCase()}
            onclick={showModal}
            icon={<WishlistSvg />}
          />
        </div>
        <div className="flex lg:flex-row flex-col gap-4 justify-between items-start">
          <h1 className="custom-h2-class break-words">
            {auctionDetail?.title}
          </h1>
        </div>
        <div className={`flex gap-4 justify-between items-start flex-wrap `}>
          {/* <div className="flex flex-col gap-2 items-start justify-start">
            {renderPriceDetails()}
          </div> */}
          <div className="border border-green-500 rounded-lg px-2 py-1">
            {WhatsappShareWithIcon({ url: sharedUrl })}
          </div>
        </div>

        <p className="flex-1 ">{auctionDetail?.description}</p>
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
            heading={STRING_DATA.BORROW_NAME}
            value={auctionDetail?.borrowerName}
          />
          <ShowLabelValue
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
            value={formattedDateAndTime(auctionDetail?.auctionEndDate ?? "")}
          />
          <ShowLabelValue
            heading={STRING_DATA.AUCTION_START_D_AND_T}
            value={formattedDateAndTime(auctionDetail?.auctionStartTime ?? "")}
          />
          <ShowLabelValue
            heading={STRING_DATA.AUCTION_END_D_AND_T}
            value={formattedDateAndTime(auctionDetail?.auctionEndDate ?? "")}
          />
          {/* Set hasChildren props true to render link in ui */}
          <ShowLabelValue heading={"Documents"} hasChildren={true}>
            {noticeLinkRenderer()}
          </ShowLabelValue>
        </div>
      </div>
    </>
  );
};

export default AuctionDetail;
