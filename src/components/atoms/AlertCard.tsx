import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faLocationDot,
  faBuilding,
  faIndianRupeeSign,
  faBuildingColumns,
  faHashtag,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { CustomCard } from "./CustomCard";

interface AlertProps {
  id: string;
  name: string;
  assetCategory: string;
  bankName: string;
  location: string;
  maxPrice: number;
  minPrice: number;
  type: string;
  assetType: string;
  matchCount?: number;
}

export function AlertCard({ type, name, matchCount }: AlertProps) {
  const header = (
    <>
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={faBell} className="h-4 w-4 text-blue-600" />
        <h3 className="font-medium capitalize">{name} Property Alert</h3>
      </div>
      <FontAwesomeIcon
        icon={faChevronRight}
        className="h-4 w-4 text-gray-400"
      />
    </>
  );

  return <CustomCard className="cursor-default" header={header} />;
}
