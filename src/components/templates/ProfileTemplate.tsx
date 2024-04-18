"use client";
import ShowLabelValue from "@/components/atoms/ShowLabelValue";
import { COOKIES, STRING_DATA } from "@/shared/Constants";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

export default function ProfileTemplate() {
  const userData = getCookie(COOKIES.AUCTION_USER_KEY)
    ? JSON.parse(getCookie(COOKIES.AUCTION_USER_KEY) ?? "")
    : null;

    const [userInfo, setUserInfo] = useState<any>({});

    useEffect(() => {
      if (userData) {
        setUserInfo(userData);
      }
      // userData && setUserInfo(userData);
    }, [userData]);

  return (
    <>
      <div className="custom-common-header-class">{STRING_DATA.PROFILE}</div>
      <div className="custom-common-header-detail-class">
        <div className="flex flex-col gap-4 p-4  w-full min-h-12">
          <ShowLabelValue heading={"Full Name"} value={userInfo?.name ?? '-'} />
          <ShowLabelValue heading={"Email"} value={userInfo?.email ?? '-'} />
        </div>
      </div>
    </>
  );
}
