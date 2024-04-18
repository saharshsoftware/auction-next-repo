/* eslint-disable @next/next/no-img-element */
import ShowLabelValue from "@/components/atoms/ShowLabelValue";
import { getAuctionDetail } from "@/server/actions";
import { Metadata } from "next";
import {
  formatPrice,
  formattedDateAndTime,
  sanitizedAuctionDetail,
} from "@/shared/Utilies";
import { SAMPLE_PLOT2, STRING_DATA } from "@/shared/Constants";
import { IAuction } from "@/types";
import NotFound from "@/app/not-found";
import Link from "next/link";
import BackButton from "@/components/ui/BackButton";
import { getAuctionDetailClient } from "@/services/auction";
import ActionButton from "@/components/atoms/ActionButton";
import { ROUTES_MANIFEST } from "next/dist/shared/lib/constants";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import nodataimage from "@/assets/images/new-tab.png";

export const metadata: Metadata = {
  title: "Find auction with amazing deals",
};

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { slug } = params;
  const auctionDetail = (await getAuctionDetail({ slug })) as IAuction;
  // const auctionDetail = sanitizedAuctionDetail(SAMPLE_PLOT2?.[0]) as IAuction;

  const getIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0,0,256,256"
        width="1.2rem"
        height="1.2rem"
      >
        <g
          fill="#ffffff"
          fill-rule="nonzero"
          stroke="none"
          stroke-width="1"
          stroke-linecap="butt"
          stroke-linejoin="miter"
          stroke-miterlimit="10"
          stroke-dasharray=""
          stroke-dashoffset="0"
          font-family="none"
          font-weight="none"
          font-size="none"
          text-anchor="none"
        >
          <g transform="scale(5.33333,5.33333)">
            <path d="M40.96094,4.98047c-0.07387,0.00243 -0.14755,0.00895 -0.2207,0.01953h-12.74023c-0.72127,-0.0102 -1.39216,0.36875 -1.75578,0.99175c-0.36361,0.623 -0.36361,1.39351 0,2.01651c0.36361,0.623 1.0345,1.00195 1.75578,0.99175h8.17188l-13.58594,13.58594c-0.52248,0.50163 -0.73295,1.24653 -0.55024,1.94742c0.18271,0.70088 0.73006,1.24823 1.43094,1.43094c0.70088,0.18271 1.44578,-0.02776 1.94742,-0.55024l13.58594,-13.58594v8.17188c-0.0102,0.72127 0.36875,1.39216 0.99175,1.75578c0.623,0.36361 1.39351,0.36361 2.01651,0c0.623,-0.36361 1.00195,-1.0345 0.99175,-1.75578v-12.75391c0.0781,-0.58158 -0.10312,-1.16812 -0.49567,-1.60429c-0.39255,-0.43617 -0.95683,-0.67796 -1.5434,-0.66133zM12.5,8c-4.11731,0 -7.5,3.38269 -7.5,7.5v20c0,4.11731 3.38269,7.5 7.5,7.5h20c4.11731,0 7.5,-3.38269 7.5,-7.5v-9.5c0.0102,-0.72127 -0.36875,-1.39216 -0.99175,-1.75578c-0.623,-0.36361 -1.39351,-0.36361 -2.01651,0c-0.623,0.36361 -1.00195,1.0345 -0.99175,1.75578v9.5c0,1.94669 -1.55331,3.5 -3.5,3.5h-20c-1.94669,0 -3.5,-1.55331 -3.5,-3.5v-20c0,-1.94669 1.55331,-3.5 3.5,-3.5h9.5c0.72127,0.0102 1.39216,-0.36875 1.75578,-0.99175c0.36361,-0.623 0.36361,-1.39351 0,-2.01651c-0.36361,-0.623 -1.0345,-1.00195 -1.75578,-0.99175z"></path>
          </g>
        </g>
      </svg>
    );
  }

  if (auctionDetail) {
    return (
      <div className="flex flex-col gap-4 p-4 w-full">
        {/* {JSON.stringify(auctionDetail)} */}
        <div className="flex justify-start items-center">
          {/* <BackButton /> */}
          <Link href={ROUTE_CONSTANTS.AUCTION}>
            <ActionButton text={STRING_DATA.BACK.toUpperCase()} />
          </Link>
        </div>
        <div className="flex lg:flex-row flex-col gap-4 justify-between items-start">
          <h2 className="custom-h2-class lg:w-3/5 break-words">
            {auctionDetail?.title}
          </h2>
          <span className="custom-prize-color font-bold text-2xl">
            {formatPrice(auctionDetail?.reservePrice)}
          </span>
        </div>
        <span className="border border-blue-300 bg-blue-100 text-sm rounded-full px-2 py-1 font-semibold">
          Estimated Market Value{" "}
          {formatPrice(auctionDetail?.estimatedMarketPrice)}
        </span>
        <p className="flex-1 ">{auctionDetail?.description}</p>
        <div className="text-2xl font-bold">{STRING_DATA.DESCRIPTION}</div>
        <hr className="border-[0.25px] border-zinc-400" />
        <div className="space-y-4 w-full">
          <ShowLabelValue
            heading={STRING_DATA.BANK}
            value={auctionDetail?.name}
          />
          <ShowLabelValue
            heading={STRING_DATA.BRANCH_NAME}
            value={auctionDetail?.branchName}
          />
          <ShowLabelValue
            heading={STRING_DATA.PROPERTY_TYPE}
            value={formatPrice(auctionDetail?.propertyType)}
          />
          <ShowLabelValue
            heading={STRING_DATA.AREA}
            value={auctionDetail?.authorisedOfficerContactPerson}
          />
          <ShowLabelValue
            heading={STRING_DATA.LOCALITY}
            value={auctionDetail?.location}
          />
          <ShowLabelValue
            heading={STRING_DATA.CITY}
            value={auctionDetail?.location}
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

          <Link
            href={`${process.env.NEXT_PUBLIC_IMAGE_CLOUDFRONT}/${auctionDetail?.noticeImageURL}`}
            target="_blank"
            className="mt-8"
          >
            <ActionButton
              text="View notice"
              customClass="lg:w-fit w-full"
              icon={getIcon()}
            />
          </Link>
        </div>
      </div>
    );
  }
  if (auctionDetail == undefined) {
    return NotFound(); // Handle case where blog data is not found
  }
}
