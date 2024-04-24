import { sanitizeStrapiImageUrl } from "@/shared/Utilies";
import Link from "next/link";
import React from "react";
import ImageTag from "../ui/ImageTag";
interface ICategroyCollection {
  item: any;
  fetchQuery?: string;
  key?: string | number;
}

const CategoryCollection = (props: ICategroyCollection) => {
  const { item = ""} = props;
  const imageUrl = sanitizeStrapiImageUrl(item);
  return (
    <>
      <Link href={`/category/${item?.slug}`}>
        <div className="w-full border border-gray-400 rounded-lg shadow p-4">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="relative w-12 h-12">
              <ImageTag
                imageUrl={imageUrl}
                alt={"i"}
                customClass="object-contain bg-contain "
              />
            </div>
            <div>{item?.totalNotices}</div>
            {item?.name}
          </div>
        </div>
      </Link>
    </>
  );
};

export default CategoryCollection;
