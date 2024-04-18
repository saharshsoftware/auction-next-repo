"use client";
// import ShowLabelValue from "@/components/atoms/ShowLabelValue";
import dynamic from "next/dynamic";
const ShowLabelValue = dynamic(
  () => import("@/components/atoms/ShowLabelValue"),
  {
    ssr: false,
  }
);
import { COOKIES, STRING_DATA } from "@/shared/Constants";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

export default function ProfileTemplate() {
  const userData = getCookie(COOKIES.AUCTION_USER_KEY)
    ? JSON.parse(getCookie(COOKIES.AUCTION_USER_KEY) ?? "")
    : null;

    // const [userInfo, setUserInfo] = useState<any>({});

    // useEffect(() => {
    //   if (userData) {
    //     setUserInfo(userData);
    //   }
    //   // userData && setUserInfo(userData);
    // }, [userData]);

  return (
    <>
      <div className="custom-common-header-class">{STRING_DATA.PROFILE}</div>
      <div className="custom-common-header-detail-class">
        <div className="flex flex-col gap-4 p-4  w-full min-h-12">
          <ShowLabelValue heading={"Full Name"} value={userData?.name ?? "-"} />
          <ShowLabelValue heading={"Email"} value={userData?.email ?? "-"} />
          <ShowLabelValue heading={"Phone number"} value={userData?.username ?? "-"} />
        </div>
      </div>
    </>
  );
}
