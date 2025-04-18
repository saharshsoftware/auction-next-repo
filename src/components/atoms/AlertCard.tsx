import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faLocationDot,
  faBuilding,
  faIndianRupeeSign,
  faBuildingColumns,
} from "@fortawesome/free-solid-svg-icons";
import { CustomCard } from "./CustomCard";

interface AlertProps {
  data: any;
}

export function AlertCard({ data }: AlertProps) {
  const header = (
    <>
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={faBell} className="h-4 w-4 text-blue-600" />
        <h3 className="font-medium capitalize">{data?.name} Property Alert</h3>
      </div>
    </>
  );

  return (
    <CustomCard
      header={header}
      className="!cursor-default flex flex-col h-full" // make sure h-full is applied properly
    >
      <div className="flex flex-col flex-grow h-full">
        <div className="space-y-2 flex-grow">
          {data?.assetType && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FontAwesomeIcon icon={faBuilding} className="h-4 w-4" />
              <span>{data?.assetType}</span>
            </div>
          )}
          {data?.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FontAwesomeIcon icon={faLocationDot} className="h-4 w-4" />
              <span>{data?.location}</span>
            </div>
          )}
          {data?.minPrice && data?.maxPrice ? (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FontAwesomeIcon icon={faIndianRupeeSign} className="h-4 w-4" />
              <span>
                {data.minPrice} - {data?.maxPrice}
              </span>
            </div>
          ) : null}
          {data?.bankName && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FontAwesomeIcon icon={faBuildingColumns} className="h-4 w-4" />
              <span>{data?.bankName}</span>
            </div>
          )}
        </div>
        <div className="mt-2 pt-4 border-t text-sm text-gray-500 flex items-center justify-end">
          <div className="flex justify-end items-center text-sm text-gray-500">
            <span>{0} properties (static)</span>
          </div>
        </div>
      </div>
    </CustomCard>
  );
}
