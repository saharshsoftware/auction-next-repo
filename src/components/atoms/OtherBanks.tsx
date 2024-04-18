"use client";
import { fetchBanks } from "@/server/actions";
import { REACT_QUERY, STRING_DATA } from "@/shared/Constants";
import { IBanks } from "@/types";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const OtherBanks = (props: { isFooter?: boolean }) => {
  const { isFooter = false } = props;
  const params = useParams();
  const [data, setData] = useState<any>([]);

  const { data: bankOptions, refetch } = useQuery({
    queryKey: [REACT_QUERY.AUCTION_BANKS],
    queryFn: async () => {
      const res = (await fetchBanks()) as unknown as IBanks[];
      setData([...res?.filter((item) => item?.slug !== params?.slug)]);
      return res ?? [];
    },
    enabled: false,
  });

  useEffect(() => {
    const { slug } = params;
    if (slug && bankOptions?.length) {
      setData([...bankOptions?.filter((item) => item?.slug !== slug)]);
    }
  }, [params]);

  useEffect(() => {
    refetch();
  }, []);

  const renderLink = (item: IBanks) => {
    if (item?.route) {
      return <Link href={item?.route ?? ""}>{item?.name}</Link>;
    }
    return item?.name;
  };

  if (isFooter) {
    return (
      <>
        <div className="">{STRING_DATA.TOP_BANKS}</div>
        {[...(bankOptions ?? [])].map((item, index) => {
          return (
            <div className="" key={index}>
              {renderLink(item)}
            </div>
          );
        })}
      </>
    );
  }

  // console.log(bankOptions, "bankOptions");
  return (
    <>
      <div className="custom-common-header-class">
        {STRING_DATA.OTHER_BANKS}
      </div>

      {data?.map((item: IBanks, index: number) => {
        return (
          <div className="custom-common-header-detail-class" key={index}>
            <div className="flex flex-col gap-4 p-4  w-full min-h-12">
              <h2 className="custom-h2-class line-clamp-1">
                {renderLink(item)}
              </h2>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default OtherBanks;
