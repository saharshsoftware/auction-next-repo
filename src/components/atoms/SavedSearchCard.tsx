"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faLocationDot,
  faBuilding,
  faIndianRupeeSign,
  faBuildingColumns,
} from "@fortawesome/free-solid-svg-icons";
import { CustomCard } from "./CustomCard";
import { useRouter } from "next/navigation";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { getDataFromQueryParamsMethod } from "@/shared/Utilies";
import ActionButton from "./ActionButton";
import { TempFilters } from "@/types";

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

  const searchFilterValues: TempFilters =
    getDataFromQueryParamsMethod(data.filter) ?? {};

  const handleClick = () => {
    router.push(`${ROUTE_CONSTANTS.AUCTION}?q=${data.filter}`);
  };

  const header = (
    <>
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-blue-600" />
        <h3 className="font-medium">{name}</h3>
      </div>
    </>
  );

  return (
    <CustomCard
      header={header}
      className="flex flex-col h-full !cursor-default" // make sure h-full is applied properly
    >
      <div className="flex flex-col flex-grow h-full">
        <div className="space-y-2 flex-grow">
          {searchFilterValues.propertyType?.name && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FontAwesomeIcon icon={faBuilding} className="h-4 w-4" />
              <span>{searchFilterValues.propertyType.name}</span>
            </div>
          )}
          {searchFilterValues.location?.name && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FontAwesomeIcon icon={faLocationDot} className="h-4 w-4" />
              <span>{searchFilterValues.location.name}</span>
            </div>
          )}
          {searchFilterValues.price?.length === 2 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FontAwesomeIcon icon={faIndianRupeeSign} className="h-4 w-4" />
              <span>
                {searchFilterValues.price[0]} - {searchFilterValues.price[1]}
              </span>
            </div>
          )}
          {searchFilterValues.bank?.name && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FontAwesomeIcon icon={faBuildingColumns} className="h-4 w-4" />
              <span>{searchFilterValues.bank.name}</span>
            </div>
          )}
        </div>

        {/* Footer stays at the bottom */}
        <div className="mt-2 pt-4 border-t text-sm text-gray-500 flex items-center justify-between">
          <ActionButton text="View Details" onclick={handleClick} />
          <div className="flex items-center gap-1">
            <span>~ {matchCount || 2} matches</span> (static)
          </div>
        </div>
      </div>
    </CustomCard>
  );
}
