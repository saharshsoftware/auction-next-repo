import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faBuilding,
  faRuler,
  faIndianRupeeSign,
  faBuildingColumns,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
// import { Button } from "@/components/ui/button";
import { CustomCard } from "./CustomCard";
import ActionButton from "./ActionButton";

interface PropertyProps {
  title: string;
  type: string;
  location: string;
  price: string;
  bank: string;
  area: string;
  image: string;
  auctionDate: string;
}

export function PropertyCard({
  title,
  type,
  location,
  price,
  bank,
  area,
  image,
  auctionDate,
}: PropertyProps) {
  const header = <h3 className="font-medium text-lg">{title}</h3>;

  const footer = (
    <div className="flex justify-end w-full">
      <ActionButton text="View Properties" />
    </div>
  );

  return (
    <CustomCard header={header} footer={footer}>
      <div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FontAwesomeIcon icon={faLocationDot} className="h-4 w-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FontAwesomeIcon icon={faBuilding} className="h-4 w-4" />
            <span>{type}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FontAwesomeIcon icon={faRuler} className="h-4 w-4" />
            <span>{area}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FontAwesomeIcon icon={faIndianRupeeSign} className="h-4 w-4" />
            <span className="font-semibold text-blue-600">{price}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FontAwesomeIcon icon={faBuildingColumns} className="h-4 w-4" />
            <span>{bank}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FontAwesomeIcon icon={faCalendarDays} className="h-4 w-4" />
            <span>Auction Date: {auctionDate}</span>
          </div>
        </div>
      </div>
    </CustomCard>
  );
}
