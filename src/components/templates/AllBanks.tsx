/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { COOKIES, FILTER_EMPTY } from "@/shared/Constants";
import { IBanks } from "@/types";
import Link from "next/link";
import React from "react";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { useFilterStore } from "@/zustandStore/filters";

const AllBanks = (props: { data: any[] }) => {
  const { data: bankData } = props;
  const { setFilter } = useFilterStore();

  const handleLinkClick = (bank: IBanks) => {
    setFilter({
      ...FILTER_EMPTY,
      bank: { ...bank, label: bank?.name, value: bank?.id } as any,
    });
  };
  return (
    <div className="common-section my-8">
      <div className="flex flex-col gap-8">
        {bankData?.map(([letter, banks]) => (
          <div
            key={letter}
            className="rounded shadow p-2 flex flex-col border border-blue-400 gap-4"
          >
            <h2 className="font-semibold text-2xl">{letter}</h2>
            <ul className="grid grid-cols-12 gap-4">
              {banks.map((bank: IBanks) => {
                return (
                  <li
                    key={bank?.slug}
                    className="lg:col-span-3 md:col-span-4 col-span-6"
                  >
                    <p>
                      <Link
                        className={`text-blue-600 text-sm-xs`}
                        href={`${ROUTE_CONSTANTS.BANKS}/${bank?.slug}`}
                        onClick={() => handleLinkClick(bank)}
                        prefetch={false}
                      >
                        {bank?.name}
                      </Link>
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllBanks;
