import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { CustomCard } from "./CustomCard";

interface FavoriteListProps {
  name: string;
  description: string;
  createdAt: string;
  propertyCount: number;
  onViewProperties?: () => void;
}

export function FavoriteListCard({
  name,
  propertyCount,
  onViewProperties = () => {},
}: FavoriteListProps) {
  const header = (
    <>
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={faHeart} className="h-4 w-4 text-red-500" />
        <h3 className="font-medium">{name}</h3>
      </div>
      <FontAwesomeIcon
        icon={faChevronRight}
        className="h-4 w-4 text-gray-400"
      />
    </>
  );

  return (
    <CustomCard header={header} onClick={() => onViewProperties?.()}>
      <div>
        <p className="text-sm text-gray-600 mb-4">{name}</p>
        <div className="flex justify-end items-center text-sm text-gray-500">
          <span>{propertyCount || 0} properties</span> (static)
        </div>
      </div>
    </CustomCard>
  );
}
