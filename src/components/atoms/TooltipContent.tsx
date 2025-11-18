import React from "react";
import LogoutButton from "../ui/LogoutButton";
import { getNavbarLinksForUser } from "@/shared/Constants";
import Link from "next/link";
import { ROUTE_CONSTANTS } from "@/shared/Routes";

interface TooltipContentProps {
  readonly closePopover?: () => void;
  readonly userEmail?: string | null;
}

const TooltipContent: React.FC<TooltipContentProps> = ({ closePopover = () => {}, userEmail = null }) => {
  const navLinks = getNavbarLinksForUser(userEmail).filter((nav) => nav.path !== ROUTE_CONSTANTS.PRICING);
  return (
    <>
      <div className=" flex flex-col gap-4 p-4 bg-white rounded-lg shadow border border-gray-400 min-w-52">
        <ul className="flex flex-col gap-4">
          {navLinks.map((nav, index) => {
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
