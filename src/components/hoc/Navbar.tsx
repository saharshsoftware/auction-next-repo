"use client";
import React, { useState, useEffect } from "react";
import { COOKIES, STRING_DATA } from "../../shared/Constants";
import ActionButton from "../atoms/ActionButton";
import { ROUTE_CONSTANTS } from "../../shared/Routes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import logo from "@/assets/images/logo.png";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import TooltipContent from "../atoms/TooltipContent";
import { getInitials } from "@/shared/Utilies";
import CustomDrawer from "./CustomDrawer";
import SearchKeywordComp from "../atoms/SearchKeywordComp";
import Image from "next/image";

const getWaveSvg = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
      <path
        fill="#5356FF"
        fillOpacity="1"
        d="M0,96L24,133.3C48,171,96,245,144,256C192,267,240,213,288,197.3C336,181,384,203,432,224C480,245,528,267,576,272C624,277,672,267,720,234.7C768,203,816,149,864,144C912,139,960,181,1008,192C1056,203,1104,181,1152,197.3C1200,213,1248,267,1296,288C1344,309,1392,299,1416,293.3L1440,288L1440,0L1416,0C1392,0,1344,0,1296,0C1248,0,1200,0,1152,0C1104,0,1056,0,1008,0C960,0,912,0,864,0C816,0,768,0,720,0C672,0,624,0,576,0C528,0,480,0,432,0C384,0,336,0,288,0C240,0,192,0,144,0C96,0,48,0,24,0L0,0Z"
      ></path>
    </svg>
  );
};

const downSvg = () => {
  return (
    <svg
      fill="#000000"
      width="12px"
      height="12px"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569l9 13z" />
    </svg>
  );
};

const upSvg = () => {
  return (
    <svg
      fill="#000000"
      width="12px"
      height="12px"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 19h18a1.002 1.002 0 0 0 .823-1.569l-9-13c-.373-.539-1.271-.539-1.645 0l-9 13A.999.999 0 0 0 3 19z" />
    </svg>
  );
};

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const token = getCookie(COOKIES.TOKEN_KEY) ?? "";
  const userData = getCookie(COOKIES.AUCTION_USER_KEY)
    ? JSON.parse(getCookie(COOKIES.AUCTION_USER_KEY) ?? "")
    : null;
  const [myToken, setMyToken] = useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  // console.log(getCookie(COOKIES.TOKEN_KEY), "getCookie(COOKIES.TOKEN_KEY)");
  useEffect(() => {
    console.log(token);
    setMyToken(token);
  }, [token]);

  const [isMobileView, setIsMobileView] = useState({
    mobileView: false,
    isOpenTopbar: false,
  });

  const handleResize = () => {
    setIsMobileView((prev) => ({
      ...prev,
      mobileView: window.innerWidth < 1024,
    })); // Assuming mobile view below 768px width
  };

  useEffect(() => {
    handleResize(); // Initial check on component mount

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleTopBar = () => {
    setIsMobileView((prev) => ({
      ...prev,
      isOpenTopbar: !prev.isOpenTopbar,
    }));
  };

  const setNavbarPositionClass = () => {
    if (pathname === ROUTE_CONSTANTS.DASHBOARD) {
      return false;
    }
    return true;
  };

  const renderAuthComponent = () => {
    // console.log(myToken, "myTokenmyToken");
    if (myToken) {
      return (
        <>
          <div className="relative">
            <Popover
              placement="bottom"
              isOpen={isOpen}
              onOpenChange={(open) => setIsOpen(open)}
            >
              <PopoverTrigger>
                <div className="avatar placeholder cursor-pointer">
                  <div className="bg-neutral text-neutral-content rounded-full w-12">
                    <span>{getInitials(userData?.name)}</span>
                  </div>
                  <em className="absolute bottom-[1.2rem] -right-5">
                    {isOpen ? downSvg() : upSvg()}
                  </em>
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <TooltipContent closePopover={() => setIsOpen(false)} />
              </PopoverContent>
            </Popover>
          </div>
        </>
      );
    }
    return (
      <div className="md:flex hidden items-center gap-8">
        <Link href={ROUTE_CONSTANTS.LOGIN}>{STRING_DATA.LOGIN}</Link>
        <ActionButton
          text={STRING_DATA.REGISTER}
          onclick={() => router.push(ROUTE_CONSTANTS.REGISTER)}
        />
      </div>
    );
  };

  const handleLogoClick = () => {
    // debugger;
    if (isMobileView?.isOpenTopbar) {
      setIsMobileView((prev) => ({
        ...prev,
        isOpenTopbar: false,
      }));
    }
  };

  return (
    <>
      <div
        className={`navbar ${
          setNavbarPositionClass() ? "" : "fixed top-0"
        }  bg-white z-50 shadow border-b-2`}
      >
        <em className="sticky top-0 left-0 right-0">{getWaveSvg()}</em>
        <div className="flex flex-row items-center justify-between lg:px-4 w-full gap-4">
          <div className="flex items-center gap-12">
            <Link
              href={ROUTE_CONSTANTS.DASHBOARD}
              className="lg:text-xl text-lg font-bold cursor-pointer "
              onClick={handleLogoClick}
            >
              <img src={logo.src} alt="logo" className="h-16" />
            </Link>
            <div className="hidden md:flex items-center gap-12">
              <Link
                href={ROUTE_CONSTANTS.DASHBOARD}
                className="cursor-pointer text-xs lg:text-sm"
              >
                {STRING_DATA.HOME}{" "}
              </Link>
              <Link
                href={ROUTE_CONSTANTS.ABOUT_US}
                className="cursor-pointer text-xs lg:text-sm"
              >
                {STRING_DATA.ABOUT_US}{" "}
              </Link>
              <Link
                href={ROUTE_CONSTANTS.CONTACT}
                className="cursor-pointer text-xs lg:text-sm"
              >
                {STRING_DATA.CONTACT_US}{" "}
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-12">
            <div className="w-80">
              <SearchKeywordComp handleClick={handleLogoClick} />
            </div>
            {renderAuthComponent()}
          </div>

          <div className="lg:hidden cursor-pointer" onClick={toggleTopBar}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </div>
        </div>
      </div>
      {/* {renderMobileMenu()} */}

      <div
        className={`custom-drawer-class  ${
          !isMobileView.isOpenTopbar && "-translate-x-full"
        } `}
      >
        <CustomDrawer toggleTopBar={toggleTopBar} />
      </div>
    </>
  );
};

export default Navbar;

export const revalidate = 0;
