import ShowLabelValue from "@/components/atoms/ShowLabelValue";
import { SAMPLE_PLOT, STRING_DATA } from "@/shared/Constants";
import { formatPrice, formattedDateAndTime } from "@/shared/Utilies";

export default function AuctionDetailPage() {
  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      <div className="flex lg:flex-row flex-col gap-4 justify-between items-start">
        <h2 className="custom-h2-class">{SAMPLE_PLOT?.[0]?.title}</h2>
        <span className="custom-prize-color font-bold text-2xl">
          {formatPrice(SAMPLE_PLOT?.[0]?.price)}
        </span>
      </div>
      <p className="flex-1 ">{SAMPLE_PLOT?.[0]?.desc}</p>
      <div className="text-2xl font-bold">{STRING_DATA.DESCRIPTION}</div>
      <hr className="border-[0.25px] border-zinc-400" />
      <div className="space-y-4 w-full">
        <ShowLabelValue
          heading={STRING_DATA.BANK}
          value={SAMPLE_PLOT?.[0]?.view_auction_data?.bank_name}
        />
        <ShowLabelValue
          heading={STRING_DATA.PROPERTY_TYPE}
          value={SAMPLE_PLOT?.[0]?.view_auction_data?.property}
        />
        <ShowLabelValue
          heading={STRING_DATA.AREA}
          value={SAMPLE_PLOT?.[0]?.view_auction_data?.area}
        />
        <ShowLabelValue
          heading={STRING_DATA.POSSESSION}
          value={SAMPLE_PLOT?.[0]?.view_auction_data?.possession}
        />
        <ShowLabelValue
          heading={STRING_DATA.LOCALITY}
          value={SAMPLE_PLOT?.[0]?.view_auction_data?.locality}
        />
        <ShowLabelValue
          heading={STRING_DATA.CITY}
          value={SAMPLE_PLOT?.[0]?.view_auction_data?.city}
        />
        <ShowLabelValue
          heading={STRING_DATA.RESERVED_PRICE}
          value={formatPrice(
            SAMPLE_PLOT?.[0]?.view_auction_data?.reserve_price
          )}
        />
        <ShowLabelValue
          heading={STRING_DATA.EMD_AMOUNT}
          value={formatPrice(SAMPLE_PLOT?.[0]?.view_auction_data?.emd_amount)}
        />
        <ShowLabelValue
          heading={STRING_DATA.EMD_SUBMISSION}
          value={formattedDateAndTime(
            SAMPLE_PLOT?.[0]?.view_auction_data?.emd_submission ?? ""
          )}
        />
        <ShowLabelValue
          heading={STRING_DATA.AUCTION_START_D_AND_T}
          value={formattedDateAndTime(
            SAMPLE_PLOT?.[0]?.view_auction_data?.auction_start_date_and_time ??
              ""
          )}
        />
        <ShowLabelValue
          heading={STRING_DATA.AUCTION_END_D_AND_T}
          value={formattedDateAndTime(
            SAMPLE_PLOT?.[0]?.view_auction_data?.auction_end_date_and_time ?? ""
          )}
        />
      </div>
    </div>
  );
}
