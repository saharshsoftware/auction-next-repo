import { COOKIES } from "@/shared/Constants";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

export const useIsAuthenticated = () => {
  const token = getCookie(COOKIES.TOKEN_KEY);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
  useEffect(() => {
    setIsAuthenticated(!!token);
  }, [token]);
  return {
    isAuthenticated,
  };
};