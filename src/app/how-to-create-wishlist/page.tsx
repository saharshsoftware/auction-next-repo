"use client";
import React, { useEffect, useState } from "react";
import InstructionWishlistSection from "@/components/molecules/InstructionWishlistSection";
import { getCookie } from "cookies-next";
import { COOKIES } from "@/shared/Constants";
export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const token = getCookie(COOKIES.TOKEN_KEY);

  useEffect(() => {
    if (!token) {
      setIsAuthenticated(false);
      return;
    }
    setIsAuthenticated(true);
  }, [token]);
  return (
    <div className="my-12">
      <InstructionWishlistSection isAuthenticated={isAuthenticated} isHowToCreateRoute={true} />
    </div>
  );
}
