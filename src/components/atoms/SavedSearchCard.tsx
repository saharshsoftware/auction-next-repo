"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faLocationDot,
  faBuilding,
  faIndianRupeeSign,
  faBuildingColumns,
  faClock,
  faHashtag,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { CustomCard } from "./CustomCard";
import { useRouter } from "next/navigation";
import { ROUTE_CONSTANTS } from "@/shared/Routes";

interface SavedSearchProps {
  name: string;
  filter: string;
  matchCount?: number;
  data: any;
}

export function SavedSearchCard({
  name,
  filter,
  matchCount,
  data,
}: SavedSearchProps) {
  const router = useRouter();
  const header = (
    <>
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-blue-600" />
        <h3 className="font-medium">{name}</h3>
      </div>
      <FontAwesomeIcon
        icon={faChevronRight}
        className="h-4 w-4 text-gray-400"
      />
    </>
  );

  const handleClick = () => {
    // Handle card click event here
    console.log("Card clicked:", name, filter, data);
    router.push(`${ROUTE_CONSTANTS.AUCTION}?q=${data.filter}`);
  };

  return (
    <CustomCard header={header} onClick={handleClick}>
      <div className="space-y-2">
        {/* <div className="flex items-center gap-2 text-sm text-gray-600">
          <FontAwesomeIcon icon={faBuilding} className="h-4 w-4" />
          <span>
            {filters.category} - {filters.assetType}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FontAwesomeIcon icon={faLocationDot} className="h-4 w-4" />
          <span>{filters.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FontAwesomeIcon icon={faIndianRupeeSign} className="h-4 w-4" />
          <span>{filters.priceRange}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FontAwesomeIcon icon={faBuildingColumns} className="h-4 w-4" />
          <span>{filters.bank}</span>
        </div> */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm text-gray-500">
          {/* <div className="flex items-center gap-1">
            <FontAwesomeIcon icon={faClock} className="h-4 w-4" />
            <span>Updated {lastUpdated}</span>
          </div> */}
          <div className="flex items-center gap-1">
            <FontAwesomeIcon icon={faHashtag} className="h-4 w-4" />
            <span>{matchCount || 2} matches</span> (static)
          </div>
        </div>
      </div>
    </CustomCard>
  );
}
