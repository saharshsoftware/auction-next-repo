"use client";
import React, { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import {
  COOKIES,
  NAVBAR_NAV_LINKS,
  NAVICON_COLOR,
  STRING_DATA,
} from "@/shared/Constants";
import { getInitials } from "@/shared/Utilies";
import LogoutButton from "../ui/LogoutButton";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchKeywordComp from "../atoms/SearchKeywordComp";
import NextLink from "../ui/NextLink";
import {
  faBagShopping,
  faBank,
  faList,
  faMapPin,
  faPhone,
  faRightToBracket,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

interface ICustomDrawer {
  toggleTopBar: () => void;
}

const CustomDrawer = (props: ICustomDrawer) => {
  const { toggleTopBar = () => {} } = props;
  const token = getCookie(COOKIES.TOKEN_KEY) ?? "";
  const userData = getCookie(COOKIES.AUCTION_USER_KEY)
    ? JSON.parse(getCookie(COOKIES.AUCTION_USER_KEY) ?? "")
    : null;
  const [myToken, setMyToken] = useState("");
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    setMyToken(token);

    // userData && setUserInfo(userData);
  }, [token]);

  const renderAuthComponent = () => {
    if (myToken) {
      return (
        <>
          <hr className="bg-gray-600 "></hr>

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
        </>
      );
    }
    return null;
  };

  const renderLinks = () => {
    if (myToken) {
      return (
        <>
          <ul className="flex flex-col gap-4">
            {NAVBAR_NAV_LINKS.map((nav: any, index) => {
              return (
                <li key={index}>
                  <NextLink
                    href={nav?.path}
                    onClick={toggleTopBar}
                    hasChildren={true}
                    customClass="flex justify-between gap-2"
                  >
                    <span>{nav?.label}</span>
                    {nav?.icon ? (
                      <FontAwesomeIcon icon={nav?.icon} color={NAVICON_COLOR} />
                    ) : null}
                  </NextLink>
                </li>
              );
            })}
          </ul>
        </>
      );
    }
    return (
      <>
        <NextLink
          href={ROUTE_CONSTANTS.LOGIN}
          onClick={toggleTopBar}
          hasChildren={true}
          customClass="flex justify-between gap-2"
        >
          <span>{STRING_DATA.LOGIN}</span>
          <FontAwesomeIcon icon={faRightToBracket} color={NAVICON_COLOR} />
        </NextLink>
        <NextLink
          href={ROUTE_CONSTANTS.REGISTER}
          onClick={toggleTopBar}
          hasChildren={true}
          customClass="flex justify-between gap-2"
        >
          <span>{STRING_DATA.REGISTER}</span>
          <FontAwesomeIcon icon={faUserPlus} color={NAVICON_COLOR} />
        </NextLink>
      </>
    );
  };
  return (
    <>
      <div className="flex flex-col gap-4 w-full h-full px-2">
        <div className="flex flex-col gap-4 transform transition duration-300 py-4 flex-1 ">
          <SearchKeywordComp handleClick={toggleTopBar} />
          {renderLinks()}

          <NextLink
            href={ROUTE_CONSTANTS.BANKS}
            onClick={toggleTopBar}
            hasChildren={true}
            customClass="flex justify-between gap-2"
          >
            <span>{STRING_DATA.BANKS}</span>
            <FontAwesomeIcon color={NAVICON_COLOR} icon={faBank} />
          </NextLink>
          <NextLink
            href={ROUTE_CONSTANTS.CITIES}
            onClick={toggleTopBar}
            hasChildren={true}
            customClass="flex justify-between gap-2"
          >
            <span>{STRING_DATA.CITIES}</span>
            <FontAwesomeIcon color={NAVICON_COLOR} icon={faMapPin} />
          </NextLink>
          <NextLink
            href={ROUTE_CONSTANTS.CATEGORY}
            onClick={toggleTopBar}
            hasChildren={true}
            customClass="flex justify-between gap-2"
          >
            <span>{STRING_DATA.CATEGORIES}</span>
            <FontAwesomeIcon color={NAVICON_COLOR} icon={faBagShopping} />
          </NextLink>
          <NextLink
            href={ROUTE_CONSTANTS.TYPES}
            onClick={toggleTopBar}
            hasChildren={true}
            customClass="flex justify-between gap-2"
          >
            <span>{STRING_DATA.PROPERTY_TYPES}</span>
            <FontAwesomeIcon color={NAVICON_COLOR} icon={faList} />
          </NextLink>
          <NextLink
            href={ROUTE_CONSTANTS.CONTACT}
            onClick={toggleTopBar}
            hasChildren={true}
            customClass="flex justify-between gap-2"
          >
            <span>{STRING_DATA.CONTACT_US}</span>
            <FontAwesomeIcon color={NAVICON_COLOR} icon={faPhone} />
          </NextLink>
        </div>
        {renderAuthComponent()}
      </div>
    </>
  );
};

export default CustomDrawer;
