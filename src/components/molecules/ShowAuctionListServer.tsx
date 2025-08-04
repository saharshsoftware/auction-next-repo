// 'use client'
import AuctionCard from "@/components/atoms/AuctionCard";
import { AuctionCard2 } from "@/components/atoms/AuctionCard2";
import dynamic from "next/dynamic";
import PaginationCompServer, {
  ILocalFilter,
} from "@/components/atoms/PaginationCompServer";
import { IAuction } from "@/types";
import { useMemo } from "react";

const SurveyCard = dynamic(() => import("@/components/atoms/SurveySection"), { ssr: false });

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
  // Determine random position for SurveyCard (3, 5, or 7)
  const surveyPosition = useMemo(() => {
    const positions = [3, 5, 7];
    return positions[Math.floor(Math.random() * positions.length)];
  }, [activePage]);

  // Create the auction list with SurveyCard inserted at random position
  const auctionListWithSurvey = useMemo(() => {
    if (auctions.length === 0) return [];
    
    const result = [];
    for (let i = 0; i < auctions.length; i++) {
      result.push(
        <AuctionCard2 key={`auction-${i}`} property={auctions[i]} />
      );
      
      // Insert SurveyCard at the determined position
      if (i === surveyPosition - 1) {
        result.push(
          <SurveyCard 
            key="survey-card" 
            isRandom={true} 
            pageNumber={activePage} 
          />
        );
      }
    }
    
    return result;
  }, [auctions, surveyPosition, activePage]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {auctions.length === 0 ? (
        <div className="flex items-center justify-center flex-col h-[70vh]">
          No data found
        </div>
      ) : (
        <>
          {auctionListWithSurvey}
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
