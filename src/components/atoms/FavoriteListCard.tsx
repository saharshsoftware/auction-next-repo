"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { CustomCard } from "./CustomCard";
import ActionButton from "./ActionButton";
import { useRouter } from "next/navigation";
import { fetchFavoriteListPropertyClient } from "@/services/favouriteList";
import { useEffect, useState } from "react";

interface FavoriteListProps {
  listId: string;
  name: string;
  description: string;
  createdAt: string;
  propertyCount: number;
  onViewProperties?: (name: string) => void;
}

export function FavoriteListCard({
  listId,
  name,
  propertyCount,
  onViewProperties = () => {},
}: FavoriteListProps) {
  const router = useRouter();
  const [count, setCount] = useState(0);

  const header = (
    <>
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={faHeart} className="h-4 w-4 text-red-500" />
        <h3 className="font-medium">{name}</h3>
      </div>
    </>
  );

  const fetchFavoriteListPropertyData = async (listId: string) => {
    try {
      let res;
      console.log("(INFO):: params", listId);
      res = await fetchFavoriteListPropertyClient({ listId, onlyCount: true });
      console.log("fetchFavoriteListPropertyData:", res);
      const totalCount = res?.length ?? 0;
      setCount(totalCount);
    } catch (error) {
      console.error("Error fetching auction data:", error);
    } finally {
    }
  };

  useEffect(() => {
    if (!listId) return;
    fetchFavoriteListPropertyData(listId);
  }, [listId]);

  return (
    <CustomCard header={header} className="!cursor-default">
      <div className="mt-2 pt-4 border-t text-sm text-gray-500 ">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <ActionButton
            text="View Properties"
            onclick={() => onViewProperties?.(name)}
          />
          <span>
            {count} {count > 1 ? "properties" : "property"}
          </span>
        </div>
      </div>
    </CustomCard>
  );
}
