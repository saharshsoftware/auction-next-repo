"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { formatPrice, formattedDate } from "@/shared/Utilies";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { SAMPLE_CITY, SAMPLE_PLOT, STRING_DATA } from "@/shared/Constants";

const ShowSimilerProperties = (props: { item: any; index: number }) => {
  const { item, index } = props;
  return (
    <div className="custom-common-header-detail-class" key={index}>
      <div className="flex flex-col gap-4 p-4  w-full min-h-12">
        <h2 className="custom-h2-class line-clamp-1">{item?.title}</h2>
        {item?.date ? (
          <span className="text-sm">{formattedDate(item?.date)}</span>
        ) : null}
        <span className="custom-prize-color text-lg">
          {formatPrice(item?.price)}
        </span>
      </div>
    </div>
  );
};

const RecentData: React.FC = () => {
  const currentRoute = usePathname();
  console.log(currentRoute);
  const renderChildren = () => {
    if (currentRoute === ROUTE_CONSTANTS.AUCTION) {
      return (
        <>
          <div className="custom-common-header-class">
            {STRING_DATA.TOP_CITY}
          </div>
          {SAMPLE_CITY.map((item, index) => {
            return (
              <div className="custom-common-header-detail-class" key={index}>
                <div className="flex flex-col gap-4 p-4  w-full min-h-12">
                  <h2 className="line-clamp-1">{item?.label}</h2>
                </div>
              </div>
            );
          })}
        </>
      );
    }
    return (
      <>
        <div className="custom-common-header-class">
          {STRING_DATA.SIMILER_PROPERTIES}
        </div>

        {SAMPLE_PLOT.slice(0, 5).map((item, index) => {
          return (
            <ShowSimilerProperties item={item} index={index} key={index} />
          );
        })}
      </>
    );
  };
  return <>{renderChildren()}</>;
};

export default RecentData;
