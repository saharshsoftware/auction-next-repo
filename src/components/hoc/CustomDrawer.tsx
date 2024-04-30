"use client";
import React, { useEffect, useState } from "react";
import TooltipContent from "../atoms/TooltipContent";
import { getCookie } from "cookies-next";
import { COOKIES, NAVBAR_NAV_LINKS, STRING_DATA } from "@/shared/Constants";
import { getInitials } from "@/shared/Utilies";
import LogoutButton from "../ui/LogoutButton";
import Link from "next/link";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ICustomDrawer {
  toggleTopBar: ()=> void;
}

const CustomDrawer = (props: ICustomDrawer) => {
  const { toggleTopBar } = props;
  const token = getCookie(COOKIES.TOKEN_KEY) ?? "";
  const userData = getCookie(COOKIES.AUCTION_USER_KEY)
    ? JSON.parse(getCookie(COOKIES.AUCTION_USER_KEY) ?? "")
    : null;
  const [myToken, setMyToken] = useState("");
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    console.log(token, "tokeneffect")
    setMyToken(token);

    // userData && setUserInfo(userData);
  }, [token]);

  const renderAuthComponent = () => {
    if (myToken) {
      return (
        <div className="flex items-center justify-between">
          <div className="cursor-pointer">
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-12">
                <span className="text-xl">
                  {getInitials(userData?.name ?? "")}
                </span>
              </div>
            </div>
          </div>
          <LogoutButton
            customClass={"text-sm cursor-pointer text-error hover:underline"}
            handleClick={toggleTopBar}
          />
        </div>
      );
    }
    return null
  };


  const renderLinks = () => {
    if (myToken) {
      return (
        <>
          <ul className="flex flex-col gap-4">
            {NAVBAR_NAV_LINKS.map((nav: any, index) => {
              return (
                <li key={index} className="flex justify-between gap-2">
                  <Link href={nav?.path} onClick={toggleTopBar}>
                    {nav?.label}
                  </Link>
                  {nav?.icon ? <FontAwesomeIcon icon={nav?.icon} /> : null}
                </li>
              );
            })}
          </ul>
        </>
      );
    }
    return (
      <>
        <Link href={ROUTE_CONSTANTS.LOGIN} onClick={toggleTopBar}>
          {STRING_DATA.LOGIN}
        </Link>
        <Link href={ROUTE_CONSTANTS.REGISTER} onClick={toggleTopBar}>
          {STRING_DATA.REGISTER}
        </Link>
      </>
    );
  }
  return (
    <>
      <div className="flex flex-col gap-4 w-full h-full px-2">
        <div className="flex flex-col gap-4 transform transition duration-300 py-4 flex-1 ">
          {renderLinks()}
        </div>
        <hr className="bg-gray-600 "></hr>
        {renderAuthComponent()}
        
      </div>
    </>
  );
};

export default CustomDrawer;
