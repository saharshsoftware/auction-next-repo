export const APP_SCHEME = "com.eauctiondekho://";

export const ANDROID_PACKAGE = "com.eauctiondekho";

export const PLAYSTORE_URL =
  "https://play.google.com/store/apps/details?id=com.eauctiondekho";

export const APPSTORE_URL =
  "https://apps.apple.com/us/app/e-auctiondekho/id6742924249";

export const USER_PREFERENCE_KEY = "userLinkPreference";

interface AppConfig {
  readonly MODAL_TIMEOUT: number;
  getStoreLink(): string | null;
}

/**
 * Configuration helpers for deep-link experiences.
 */
export const CONFIG: AppConfig = {
  MODAL_TIMEOUT: 1200,
  getStoreLink(): string | null {
    if (typeof navigator === "undefined") {
      return null;
    }
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("android")) {
      return PLAYSTORE_URL;
    }
    if (/iphone|ipad|ipod/.test(ua)) {
      return APPSTORE_URL;
    }
    return null;
  },
};


