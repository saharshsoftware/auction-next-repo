"use client"
import { IAuction } from '@/types';
import React from 'react'
import ShowLabelValue from '../atoms/ShowLabelValue';
import { COOKIES, STRING_DATA } from '@/shared/Constants';
import { formatPrice, formattedDateAndTime } from '@/shared/Utilies';
import Link from 'next/link';
import ActionButton from '../atoms/ActionButton';
import NewTabSvg from '../svgIcons/NewTabSvg';
import { ROUTE_CONSTANTS } from '@/shared/Routes';
import useModal from '@/hooks/useModal';
import InterestModal from '../ modals/InterestModal';
import { getCookie } from 'cookies-next';

const AuctionDetail = (props: { auctionDetail: IAuction }) => {
  const { auctionDetail } = props;
  const { showModal, openModal, hideModal } = useModal();
  const userData = getCookie(COOKIES.AUCTION_USER_KEY)
    ? JSON.parse(getCookie(COOKIES.AUCTION_USER_KEY) ?? "")
    : null;

  return (
    <>
      {/* Create alert Modal */}
      {openModal ? (
        <InterestModal
          openModal={openModal}
          hideModal={hideModal}
          userData={userData}
        />
      ) : null}
      <div className="flex flex-col gap-4 p-4 w-full">
        {/* {JSON.stringify(auctionDetail)} */}
        <div className="flex justify-between items-center">
          <Link href={ROUTE_CONSTANTS.AUCTION}>
            <ActionButton
              text={STRING_DATA.BACK.toUpperCase()}
              isActionButton={false}
            />
          </Link>
          <ActionButton
            text={STRING_DATA.SHOW_INTEREST.toUpperCase()}
            onclick={showModal}
          />
        </div>
        <div className="flex lg:flex-row flex-col gap-4 justify-between items-start">
          <h2 className="custom-h2-class lg:w-3/5 break-words">
            {auctionDetail?.title}
          </h2>
          <span className="custom-prize-color font-bold text-2xl">
            {formatPrice(auctionDetail?.reservePrice)}
          </span>
        </div>
        <span className="border border-blue-300 bg-blue-100 text-sm rounded-full px-2 py-1 font-semibold w-fit">
          Estimated Market Value{" "}
          {formatPrice(auctionDetail?.estimatedMarketPrice)}
        </span>
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
          {/* {JSON.stringify(auctionDetail)} */}
          <Link
            href={`${process.env.NEXT_PUBLIC_IMAGE_CLOUDFRONT}${auctionDetail?.noticeImageURL}`}
            target="_blank"
          >
            <ActionButton
              text="View notice"
              customClass="lg:w-fit w-full mt-4"
              icon={<NewTabSvg />}
            />
          </Link>
        </div>
      </div>
    </>
  );
};

export default AuctionDetail