import React from "react";
import LogoutButton from "../ui/LogoutButton";
import { NAVBAR_NAV_LINKS } from "@/shared/Constants";
import Link from "next/link";

const TooltipContent = (props: { closePopover?:()=>void }) => {
  const {closePopover=()=>{}} = props
  return (
    <>
      <div className=" flex flex-col gap-4 p-4 bg-white rounded-lg shadow border border-gray-400 min-w-52">
        <ul className="flex flex-col gap-4">
          {NAVBAR_NAV_LINKS.map((nav, index) => {
            return (
              <li key={index} className="text-sm">
                <Link href={nav?.path} onClick={closePopover}>
                  {nav?.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <hr className="bg-gray-600 " />
        <LogoutButton
          handleClick={closePopover}
          customClass={"text-sm cursor-pointer text-error hover:underline"}
        />
      </div>
    </>
  );
};

export default TooltipContent;
