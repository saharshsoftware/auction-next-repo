"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { CustomCard } from "./CustomCard";
import ActionButton from "./ActionButton";
import { useRouter } from "next/navigation";
import { ROUTE_CONSTANTS } from "@/shared/Routes";

interface FavoriteListProps {
  name: string;
  description: string;
  createdAt: string;
  propertyCount: number;
  onViewProperties?: (name: string) => void;
}

export function FavoriteListCard({
  name,
  propertyCount,
  onViewProperties = () => {},
}: FavoriteListProps) {
  const router = useRouter();

  const header = (
    <>
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={faHeart} className="h-4 w-4 text-red-500" />
        <h3 className="font-medium">{name}</h3>
      </div>
    </>
  );

  return (
    <CustomCard header={header} className="!cursor-default">
      <div className="mt-2 pt-4 border-t text-sm text-gray-500 ">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <ActionButton
            text="View Details"
            onclick={() => onViewProperties?.(name)}
          />
          <span>{propertyCount || 0} properties (static)</span>
        </div>
      </div>
    </CustomCard>
  );
}
