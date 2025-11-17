'use client';

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { APP_SCHEME, CONFIG, USER_PREFERENCE_KEY } from "@/config/routes";
import { mapNativeRoute } from "@/config/native-route-mapper";

const SKIP_PREFIXES = ["admin", "api"];

const normalizePath = (path: string): string => path.replace(/^\/+|\/+$/g, "");

const isMobileDevice = (userAgent: string): boolean =>
  /android|iphone|ipad|ipod|mobile|tablet/i.test(userAgent);

const shouldSkipPath = (path: string): boolean =>
  !path || SKIP_PREFIXES.some((prefix) => path.startsWith(prefix));

const setUserPreference = (value: "web" | "app") => {
  try {
    sessionStorage.setItem(USER_PREFERENCE_KEY, value);
  } catch (error) {
    console.warn("[DeepLink] Failed to persist preference", error);
  }
};

const getUserPreference = (): "web" | "app" | null => {
  try {
    return sessionStorage.getItem(USER_PREFERENCE_KEY) as "web" | "app" | null;
  } catch (error) {
    console.warn("[DeepLink] Failed to read preference", error);
    return null;
  }
};

export const useDeepLinkHandler = () => {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    setIsModalOpen(false);

    const normalizedPath = normalizePath(pathname || "");

    if (shouldSkipPath(normalizedPath)) {
      return undefined;
    }

    const userAgent = navigator.userAgent ?? "";

    if (!isMobileDevice(userAgent)) {
      return undefined;
    }

    const nativePath = mapNativeRoute(normalizedPath);
    const deepLinkTarget = `${APP_SCHEME}${nativePath}`;
    const preference = getUserPreference();

    if (preference === "web") {
      return undefined;
    }

    if (preference === "app") {
      window.location.href = deepLinkTarget;
      return undefined;
    }

    let isAppOpened = false;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isAppOpened = true;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    window.location.href = deepLinkTarget;

    const timeoutId = window.setTimeout(() => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (isAppOpened) {
        setUserPreference("app");
        return;
      }
      setIsModalOpen(true);
    }, CONFIG.MODAL_TIMEOUT);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.clearTimeout(timeoutId);
    };
  }, [pathname]);

  const handleCloseModal = () => {
    setUserPreference("web");
    setIsModalOpen(false);
  };

  return {
    shouldShowDeepLinkModal: isModalOpen,
    handleCloseDeepLinkModal: handleCloseModal,
  };
};

