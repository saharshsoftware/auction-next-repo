/* eslint-disable @next/next/no-async-client-component */
"use client"
import React, { useEffect, useState } from "react";
import InstructionAlertSection from "@/components/molecules/InstructionAlertSection";
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
    <section className="section-class py-12 bg-even-color">
      <InstructionAlertSection isAuthenticated={isAuthenticated} isHowToCreateRoute={true} />
    </section>
  );
}
