'use client'
import AuctionCard from "@/components/atoms/AuctionCard";
import { AuctionCard2 } from "@/components/atoms/AuctionCard2";
import PaginationCompServer, {
  ILocalFilter,
} from "@/components/atoms/PaginationCompServer";
import { IAuction } from "@/types";

const ShowAuctionListServer = ({
  auctions,
  totalPages,
  activePage,
  filterData,
}: {
  auctions: IAuction[];
  totalPages: number;
  activePage: number;
  filterData: ILocalFilter;
}) => {
  console.table(auctions);
  return (
    <div className="flex flex-col gap-4 w-full">
      {auctions.length === 0 ? (
        <div className="flex items-center justify-center flex-col h-[70vh]">
          No data found
        </div>
      ) : (
        <>
          {auctions.map((item, index) => (
            <AuctionCard2 key={index} property={item} />
          ))}
          <PaginationCompServer
            totalPage={totalPages}
            activePage={activePage}
            filterData={filterData}
          />
        </>
      )}
    </div>
  );
};

export default ShowAuctionListServer;
