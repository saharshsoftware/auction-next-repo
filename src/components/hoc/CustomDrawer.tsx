"use client";
import React, { useEffect, useState } from "react";
import TooltipContent from "../atoms/TooltipContent";
import { getCookie } from "cookies-next";
import { COOKIES, NAVBAR_NAV_LINKS } from "@/shared/Constants";
import { getInitials } from "@/shared/Utilies";
import LogoutButton from "../ui/LogoutButton";
import Link from "next/link";

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
    if (token) {
      setMyToken(token);
    }
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
          <LogoutButton />
        </div>
      );
    }
    return (
      <div className="lg:flex hidden items-center gap-8">
        <LogoutButton />
      </div>
    );
  };
  return (
    <>
      <div className="flex flex-col gap-4 w-full h-full">
        <div className="flex flex-col gap-4 transform transition duration-300 py-4 flex-1 overflow-y-scroll min-h-[70vh]">
          <ul className="flex flex-col gap-4">
            {NAVBAR_NAV_LINKS.map((nav, index) => {
              return (
                <li key={index}>
                  <Link href={nav?.path} onClick={toggleTopBar}>
                    {nav?.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <hr className="bg-gray-600 "></hr>
        {renderAuthComponent()}
        {/* <template v-if="updatedAuthenticated">
      <hr className="bg-gray-600 ">
      <div className="flex items-center justify-between">
        <div className="cursor-pointer">
          <div v-if="user?.profileImage" className="avatar">
            <div className="w-12 rounded-full">
              <img :src="user?.profileImage">
            </div>
          </div>
          <template v-else>
            <NxAvatar :label="getInitials(user?.name) " />
          </template>
        </div>
        <AtomsIconLabel :icon="'material-symbols:logout'">
          <div className="cursor-pointer" @click="handleLogout">
            {{ STRING_DATA.LOGOUT }}
          </div>
        </AtomsIconLabel>
      </div>
    </template> */}
      </div>
    </>
  );
};

export default CustomDrawer;
