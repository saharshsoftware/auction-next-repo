import { COOKIES } from "@/shared/Constants";
import { useAuthStore } from "@/zustandStore/authStore";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

/**
 * Hook to check if user is authenticated
 * Hydration-safe: always starts with false to match server render
 */
export const useIsAuthenticated = () => {
  // Always start with false to avoid hydration mismatch
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { authRefreshTrigger, triggerAuthRefresh } = useAuthStore();

  useEffect(() => {
    // Read cookie only after mount (client-side only)
    const token = getCookie(COOKIES.TOKEN_KEY);
    setIsAuthenticated(!!token);
  }, [authRefreshTrigger]);

  return {
    isAuthenticated,
    refreshAuth: triggerAuthRefresh,
  };
};

/**
 * Hook to get user data from cookies
 * Hydration-safe: always starts with null to match server render
 */
export const useUserData = () => {
  const [userData, setUserData] = useState<Record<string, any> | null>(null);
  const [token, setToken] = useState<string>("");
  const { authRefreshTrigger, triggerAuthRefresh } = useAuthStore();

  useEffect(() => {
    // Read cookies only after mount (client-side only)
    const cookieToken = getCookie(COOKIES.TOKEN_KEY);
    const cookieUserData = getCookie(COOKIES.AUCTION_USER_KEY);
    setToken(cookieToken ? String(cookieToken) : "");
    if (cookieUserData) {
      try {
        setUserData(JSON.parse(String(cookieUserData)));
      } catch (e) {
        setUserData(null);
      }
    } else {
      setUserData(null);
    }
  }, [authRefreshTrigger]);

  return {
    userData,
    token,
    refreshAuth: triggerAuthRefresh,
  };
};