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
  if (auctionDetail) {
    return (
      <div className="flex flex-col gap-4 p-4 w-full">
        {/* {JSON.stringify(auctionDetail)} */}
        <div className="flex justify-start items-center">
          <BackButton />
        </div>
        <div className="flex lg:flex-row flex-col gap-4 justify-between items-start">
          <h2 className="custom-h2-class lg:w-3/5 break-words">
            {auctionDetail?.title}
          </h2>
          <span className="custom-prize-color font-bold text-2xl">
            {formatPrice(auctionDetail?.reservePrice)}
          </span>
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
          <ShowLabelValue heading={STRING_DATA.NOTICE} hasChildren={true}>
            <Link
              className="link primary-link"
              href={`${auctionDetail?.noticeImageURL}`}
              target="_blank"
            >
              View
            </Link>
          </ShowLabelValue>
        </div>
      </div>
    );
  }
  if (auctionDetail == undefined) {
    return NotFound(); // Handle case where blog data is not found
  }
}
