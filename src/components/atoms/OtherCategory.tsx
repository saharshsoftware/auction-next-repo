"use client"
import { getCategoryBoxCollection } from '@/server/actions';
import { REACT_QUERY, STRING_DATA } from '@/shared/Constants';
import { ICategoryCollection } from '@/types';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import CustomLoading from './Loading';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const OtherCategory = (props: { isFooter?: boolean }) => {
  const { isFooter = false } = props;
  const params = useParams();
  const [data, setData] = useState<any>([]);
  const {
    data: categoryOptions,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [REACT_QUERY.CATEGORY_BOX_COLLECITON_OPTIONS],
    queryFn: async () => {
      const res =
        (await getCategoryBoxCollection()) as unknown as ICategoryCollection[];
      // console.log(res, "othercategory");
      setData([...res?.filter((item) => item?.slug !== params?.slug)]);
      return res ?? [];
    },
    enabled: false,
  });

  useEffect(() => {
    const { slug } = params;
    if (slug && categoryOptions?.length) {
      setData([...categoryOptions?.filter((item) => item?.slug !== slug)]);
    }
  }, [params]);

  useEffect(() => {
    refetch();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <CustomLoading />
      </div>
    );
  }

  const renderLink = (item: ICategoryCollection) => {
    if (item?.route) {
      return <Link href={item?.route ?? ""}>{item?.name}</Link>;
    }
    return item?.name;
  };

    if (isFooter) {
      return (
        <>
          <div className="">{STRING_DATA.TOP_CATEGORIES}</div>
          {[...(categoryOptions ?? [])].map((item, index) => {
            return (
              <div className="" key={index}>
                {renderLink(item)}
              </div>
            );
          })}
        </>
      );
    }
  return (
    <>
      <div className="custom-common-header-class">
        {STRING_DATA.OTHER_CATEGORIES}
      </div>

      {data?.map((item: ICategoryCollection, index: number) => {
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

export default OtherCategory