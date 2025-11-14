(function () {
  // Configuration
  const CONFIG = {
    APP_SCHEME: "eauctiondekho://",
    ANDROID_PACKAGE: "com.eauctiondekho",
    PLAYSTORE_URL: "https://play.google.com/store/apps/details?id=com.eauctiondekho",
    APPSTORE_URL: "https://apps.apple.com/us/app/e-auctiondekho/id6742924249",
    IOS_APP_STORE_ID: "6742924249",
    MODAL_TIMEOUT: 1500, // Increased timeout
    STORAGE_KEYS: {
      PREFER_WEB: "preferWeb",
      APP_CHECK_DONE: "appCheckDone",
      USER_PREFERENCE: "userLinkPreference",
    },
  };

  // Detect if we're in a supported Android browser that handles intents
  function isAndroidWithIntentSupport() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isAndroid = /android/i.test(userAgent);
    const isChrome = /chrome/i.test(userAgent);
    const isSamsung = /samsung/i.test(userAgent);
    const hasSupport = isAndroid && (isChrome || isSamsung);
    
    console.log("[Deeplink] Platform detection:", {
      userAgent: userAgent.substring(0, 100),
      isAndroid,
      isChrome,
      isSamsung,
      hasIntentSupport: hasSupport
    });
    
    return hasSupport;
  }

  // Check if app is likely installed by checking if intent filters would work
  function shouldLetSystemHandle() {
    // For Android Chrome/Samsung browsers, let system handle if app is installed
    // The system will show the native popup
    const shouldHandle = isAndroidWithIntentSupport();
    console.log("[Deeplink] Should let system handle:", shouldHandle);
    return shouldHandle;
  }

  // Your existing utility functions remain the same...
  function isMobileDevice() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobile = /android|iphone|ipad|ipod|mobile|tablet/i.test(userAgent.toLowerCase());
    const isTablet = /(ipad|tablet|playbook|silk)|(android(?!.*mobile))/i.test(userAgent);
    const result = isMobile || isTablet;
    console.log("[Deeplink] Mobile device check:", { isMobile, isTablet, result });
    return result;
  }

  function getAppStoreLink() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent)) {
      return CONFIG.PLAYSTORE_URL;
    } else if (/iphone|ipad|ipod/i.test(userAgent)) {
      return CONFIG.APPSTORE_URL;
    }
    return null;
  }

  // Utility: Create and show modal with improved UX
  function showModal(message, onContinue, onCancel) {
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "1000";

    const modalContent = document.createElement("div");
    modalContent.style.backgroundColor = "#fff";
    modalContent.style.padding = "25px";
    modalContent.style.borderRadius = "12px";
    modalContent.style.textAlign = "center";
    modalContent.style.width = "90%";
    modalContent.style.maxWidth = "400px";
    modalContent.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
    modalContent.style.fontFamily = "Arial, sans-serif";

    const modalMessage = document.createElement("p");
    modalMessage.innerText = message;
    modalMessage.style.fontSize = "16px";
    modalMessage.style.marginBottom = "20px";
    modalMessage.style.color = "#333";

    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "center";
    buttonContainer.style.gap = "15px";

    const continueButton = document.createElement("button");
    continueButton.innerText = "Install App";
    continueButton.style.padding = "10px 20px";
    continueButton.style.backgroundColor = "#5356FF";
    continueButton.style.color = "#fff";
    continueButton.style.border = "none";
    continueButton.style.borderRadius = "8px";
    continueButton.style.cursor = "pointer";
    continueButton.style.fontSize = "14px";
    continueButton.style.transition = "background-color 0.3s";
    continueButton.style.fontWeight = "bold";
    continueButton.onmouseout = () =>
      (continueButton.style.backgroundColor = "#5356FF");
    continueButton.onclick = () => {
      onContinue();
      document.body.removeChild(modal);
    };

    const cancelButton = document.createElement("button");
    cancelButton.innerText = "Continue on Website";
    cancelButton.style.padding = "10px 20px";
    cancelButton.style.backgroundColor = "#ddd";
    cancelButton.style.color = "#333";
    cancelButton.style.border = "none";
    cancelButton.style.borderRadius = "8px";
    cancelButton.style.cursor = "pointer";
    cancelButton.style.fontSize = "14px";
    cancelButton.style.transition = "background-color 0.3s";
    cancelButton.style.fontWeight = "bold";
    cancelButton.onmouseover = () =>
      (cancelButton.style.backgroundColor = "#ccc");
    cancelButton.onmouseout = () =>
      (cancelButton.style.backgroundColor = "#ddd");
    cancelButton.onclick = () => {
      onCancel();
      document.body.removeChild(modal);
    };

    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(continueButton);

    modalContent.appendChild(modalMessage);
    modalContent.appendChild(buttonContainer);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
  }

  // Your existing deeplinkRoutes array remains the same...
 // Routes-to-Deeplink rules
 const deeplinkRoutes = [

  // Profile and User Management
  {
    name: "Profile",
    match: (path) => path === "profile" || path === "profile/",
    deepLink: () => `${CONFIG.APP_SCHEME}profile`,
  },
  {
    name: "Manage Alert",
    match: (path) => path.startsWith("manage-alert"),
    deepLink: () => `${CONFIG.APP_SCHEME}alerts`,
  },
  {
    name: "Manage List",
    match: (path) => path.startsWith("manage-list"),
    deepLink: () => `${CONFIG.APP_SCHEME}wishlist`,
  },
  {
    name: "Manage filters",
    match: (path) => path.startsWith("manage-filter"),
    deepLink: () => `${CONFIG.APP_SCHEME}saved-search`,
  },
  // Auction-related routes
  {
    name: "E-Auction find auctions",
    match: (path) => path.startsWith("auctions/find-auctions"),
    deepLink: (path) => `${CONFIG.APP_SCHEME}auctions`,
  },

  {
    name: "Auction Details",
    match: (path) => path.startsWith("auctions/"),
    deepLink: (path) => `${CONFIG.APP_SCHEME}${path}`,
  },
  {
    name: "E-Auction Banks",
    match: (path) => path.startsWith("e-auction-banks"),
    deepLink: () => `${CONFIG.APP_SCHEME}banks`,
  },
  {
    name: "E-Auction Categories",
    match: (path) => path.startsWith("e-auction-categories"),
    deepLink: () => `${CONFIG.APP_SCHEME}categories`,
  },
  {
    name: "E-Auction Cities",
    match: (path) => path.startsWith("e-auction-in-cities"),
    deepLink: () => `${CONFIG.APP_SCHEME}locations`,
  },

  // Browse and Search routes
  {
    name: "Location Bank Details",
    match: (path) => {
      // Match pattern: locations/{city}/banks/{bank-name}
      const parts = path.split('/');
      return parts.length >= 4 &&
        parts[0] === 'locations' &&
        parts[2] === 'banks' &&
        parts[1] && parts[3];
    },
    deepLink: (path) => {
      // Extract city and bank from the path
      const parts = path.split('/');
      const city = parts[1];
      const bank = parts[3];
      return `${CONFIG.APP_SCHEME}locations/${city}/banks/${bank}`;
    },
  },
  {
    name: "Location Category Details",
    match: (path) => {
      // Match pattern: locations/{city}/banks/{bank-name}
      const parts = path.split('/');
      return parts.length >= 4 &&
        parts[0] === 'locations' &&
        parts[2] === 'categories' &&
        parts[1] && parts[3];
    },
    deepLink: (path) => {
      // Extract city and category from the path
      const parts = path.split('/');
      const city = parts[1];
      const category = parts[3];
      return `${CONFIG.APP_SCHEME}locations/${city}/categories/${category}`;
    },
  },
  {
    name: "Location Type Details",
    match: (path) => {
      // Match pattern: locations/{city}/types/{type}
      const parts = path.split('/');
      return parts.length >= 4 &&
        parts[0] === 'locations' &&
        parts[2] === 'types' &&
        parts[1] && parts[3];
    },
    deepLink: (path) => {
      // Extract city and type from the path
      const parts = path.split('/');
      const city = parts[1];
      const type = parts[3];
      return `${CONFIG.APP_SCHEME}locations/${city}/types/${type}`;
    },
  },
  {
    name: "Bank Category Details",
    match: (path) => {
      // Match pattern: banks/{bank-name}/categories/{category}
      const parts = path.split('/');
      return parts.length >= 4 &&
        parts[0] === 'banks' &&
        parts[2] === 'categories' &&
        parts[1] && parts[3];
    },
    deepLink: (path) => {
      // Extract city and type from the path
      const parts = path.split('/');
      const bank = parts[1];
      const type = parts[3];
      return `${CONFIG.APP_SCHEME}banks/${bank}/categories/${category}`;
    },
  },
  {
    name: "Bank Type Details",
    match: (path) => {
      // Match pattern: banks/{bank-name}/types/{type}
      const parts = path.split('/');
      return parts.length >= 4 &&
        parts[0] === 'banks' &&
        parts[2] === 'types' &&
        parts[1] && parts[3];
    },
    deepLink: (path) => {
      // Extract bank and type from the path
      const parts = path.split('/');
      const bank = parts[1];
      const type = parts[3];
      return `${CONFIG.APP_SCHEME}banks/${bank}/types/${type}`;
    },
  },
  {
    name: "Category Type Details",
    match: (path) => {
      // Match pattern: categories/{category-name}/types/{type}
      const parts = path.split('/');
      return parts.length >= 4 &&
        parts[0] === 'categories' &&
        parts[2] === 'types' &&
        parts[1] && parts[3];
    },
    deepLink: (path) => {
      // Extract category and type from the path
      const parts = path.split('/');
      const category = parts[1];
      const type = parts[3];
      return `${CONFIG.APP_SCHEME}categories/${category}/types/${type}`;
    },
  },
  {
    name: "Banks",
    match: (path) => path.startsWith("banks"),
    deepLink: (path) => `${CONFIG.APP_SCHEME}banks`,
  },
  {
    name: "Categories",
    match: (path) => path.startsWith("categories"),
    deepLink: (path) => `${CONFIG.APP_SCHEME}categories`,
  },
  {
    name: "Cities",
    match: (path) => path.startsWith("cities"),
    deepLink: (path) => `${CONFIG.APP_SCHEME}locations`,
  },
  {
    name: "Locations",
    match: (path) => path.startsWith("locations"),
    deepLink: (path) => `${CONFIG.APP_SCHEME}locations`,
  },
  {
    name: "Collections",
    match: (path) => path.startsWith("collections"),
    deepLink: (path) => `${CONFIG.APP_SCHEME}properties-collection`,
  },

  // Help and Information routes
  {
    name: "How to Create Alerts",
    match: (path) => path.startsWith("how-to-create-alerts"),
    deepLink: () => `${CONFIG.APP_SCHEME}how-to-create-alerts`,
  },
  {
    name: "How to Create Saved Searches",
    match: (path) => path.startsWith("how-to-create-saved-searches"),
    deepLink: () => `${CONFIG.APP_SCHEME}how-to-create-saved-searches`,
  },
  {
    name: "How to Create Wishlist",
    match: (path) => path.startsWith("how-to-create-wishlist"),
    deepLink: () => `${CONFIG.APP_SCHEME}how-to-create-wishlist`,
  },
  {
    name: "FAQ",
    match: (path) => path === "faq" || path === "faq/",
    deepLink: () => `${CONFIG.APP_SCHEME}faq`,
  },
  {
    name: "Bank Auction Support",
    match: (path) => path.startsWith("bank-auction-support"),
    deepLink: () => `${CONFIG.APP_SCHEME}bank-auction-support`,
  },

  // Content and Information routes
  // {
  //   name: "Blogs",
  //   match: (path) => path.startsWith("blogs"),
  //   deepLink: (path) => `${CONFIG.APP_SCHEME}content/blogs`,
  // },
  {
    name: "About Us",
    match: (path) => path === "about-us" || path === "about-us/",
    deepLink: () => `${CONFIG.APP_SCHEME}about-us`,
  },
  {
    name: "Contact",
    match: (path) => path === "contact-us",
    deepLink: () => `${CONFIG.APP_SCHEME}contact`,
  },
  {
    name: "Privacy",
    match: (path) => path === "privacy" || path === "privacy/",
    deepLink: () => `${CONFIG.APP_SCHEME}settings/privacy`,
  },
  {
    name: "Terms",
    match: (path) => path === "terms" || path === "terms/",
    deepLink: () => `${CONFIG.APP_SCHEME}settings/terms`,
  },
  {
    name: "User recommendations",
    match: (path) => path === "user/recommendations",
    deepLink: () => `${CONFIG.APP_SCHEME}recommended`,
  },

  // Generic fallback - should be last
  {
    name: "Generic fallback",
    match: (path) => true,
    deepLink: (path) => `${CONFIG.APP_SCHEME}${path}`,
  },
];

  function getSlugFromPath() {
    return window.location.pathname.replace(/^\//, "").replace(/\/$/, "");
  }

  // Modified Android handling - always try Intent URL, show modal if app not installed
  function tryOpeningAppWithFallback(deepLink) {
    console.log("[Deeplink] tryOpeningAppWithFallback called", { deepLink });
    
    const systemWillHandle = shouldLetSystemHandle();
    console.log("[Deeplink] System will handle natively:", systemWillHandle);
    
    // Always try to open the app via Intent URL
    // On Android Chrome, this will trigger the browser prompt (via assetlinks.json)
    // If app is installed, user can choose to open it
    // If app is not installed, we'll show our modal after timeout
    let appOpened = false;
    let visibilityChanged = false;
    let browserPromptShown = false;
    let windowBlurred = false;
    
    // Track blur/focus events to detect browser prompt
    const blurHandler = () => {
      windowBlurred = true;
      browserPromptShown = true;
      console.log("[Deeplink] Window blurred - browser prompt likely appeared");
    };
    
    const focusHandler = () => {
      // If window regains focus after blur, browser prompt was likely dismissed
      if (windowBlurred && !appOpened) {
        console.log("[Deeplink] Window focused again - browser prompt was likely dismissed");
      }
    };
    
    window.addEventListener("blur", blurHandler);
    window.addEventListener("focus", focusHandler);
    
    const visibilityHandler = () => {
      visibilityChanged = true;
      if (document.hidden) {
        appOpened = true;
        console.log("[Deeplink] ✅ Page hidden - app likely opened");
      } else {
        console.log("[Deeplink] Page visible again");
      }
    };
    document.addEventListener("visibilitychange", visibilityHandler);

    const pathname = window.location.pathname.replace(/^\//, "");
    const intentUrl = `intent://${pathname}#Intent;scheme=${CONFIG.APP_SCHEME.replace("://", "")};package=${CONFIG.ANDROID_PACKAGE};end`;
    
    console.log("[Deeplink] Attempting to open app via Intent URL:", {
      pathname,
      intentUrl,
      deepLink,
      systemWillHandle,
      timeout: CONFIG.MODAL_TIMEOUT + "ms"
    });
    
    // Use Intent URL for Android - this is the correct format for App Links
    // Intent URL format: intent://path#Intent;scheme=appscheme;package=com.package;end
    window.location.href = intentUrl;

    // For Android Chrome, we need to handle carefully:
    // 1. If app is installed: Browser shows native prompt (assetlinks.json)
    // 2. If app is NOT installed: No prompt appears, we should show our modal
    // Strategy: Wait longer on Chrome. If no interaction detected, assume app not installed
    const timeout = systemWillHandle ? 3000 : CONFIG.MODAL_TIMEOUT; // 3s for Chrome
    
    setTimeout(() => {
      document.removeEventListener("visibilitychange", visibilityHandler);
      window.removeEventListener("blur", blurHandler);
      window.removeEventListener("focus", focusHandler);
      
      const isFocused = document.hasFocus();
      
      console.log("[Deeplink] Timeout reached - checking app status:", {
        appOpened,
        visibilityChanged,
        documentHidden: document.hidden,
        systemWillHandle,
        browserPromptShown,
        windowBlurred,
        isFocused,
        timeout: timeout + "ms"
      });
      
      if (!appOpened) {
        // On Android Chrome:
        // - If browser prompt appeared (blur detected), user likely dismissed it → Don't nag with modal
        // - If no prompt detected after 3s, app is likely NOT installed → Show install modal
        if (systemWillHandle && browserPromptShown) {
          console.log("[Deeplink] ⚠️ Android Chrome: Browser prompt was shown");
          console.log("[Deeplink] User dismissed prompt - NOT showing custom modal (respecting user choice)");
          return; // User made their choice via browser prompt
        }
        
        // App didn't open AND no browser prompt detected
        // This means app is likely NOT installed - show install modal
        if (systemWillHandle) {
          console.log("[Deeplink] Android Chrome: No browser prompt detected after 3s");
          console.log("[Deeplink] App likely NOT installed - showing install modal");
        } else {
          console.log("[Deeplink] App not detected - showing install modal");
        }
        showInstallModal(deepLink);
      } else {
        console.log("[Deeplink] ✅ App opened successfully - not showing modal");
      }
    }, timeout);
  }

  // iOS handling - use custom scheme to open app
  function tryUniversalLinkWithFallback(deepLink) {
    console.log("[Deeplink] tryUniversalLinkWithFallback called", { deepLink });
    
    let appOpened = false;
    
    const visibilityHandler = () => {
      if (document.hidden) {
        appOpened = true;
        console.log("[Deeplink] ✅ Page hidden - iOS app opened");
      }
    };
    document.addEventListener("visibilitychange", visibilityHandler);

    const pathname = window.location.pathname.replace(/^\//, "");
    const customSchemeUrl = `${CONFIG.APP_SCHEME}${pathname}`;
    
    console.log("[Deeplink] Attempting to open iOS app:", {
      customSchemeUrl,
      deepLink,
      timeout: CONFIG.MODAL_TIMEOUT + "ms"
    });
    
    // Try to open app with custom scheme
    // On iOS Safari/Chrome, this ALWAYS shows system alert if app is installed
    // If app is not installed, it fails silently
    window.location.href = customSchemeUrl;

    // Wait and check if app opened
    setTimeout(() => {
      document.removeEventListener("visibilitychange", visibilityHandler);
      
      console.log("[Deeplink] Timeout reached - checking app status:", {
        appOpened,
        documentHidden: document.hidden
      });
      
      if (!appOpened) {
        // iOS behaves consistently:
        // - If app installed: System alert ALWAYS appears, user opens or dismisses
        // - If app NOT installed: Nothing happens, no alert
        // 
        // PROBLEM: We can't reliably detect if alert was dismissed vs app not installed
        // SOLUTION: Follow industry standard - show custom modal as fallback
        //           This gives users a clear path to install the app
        console.log("[Deeplink] iOS: App didn't open - showing install modal");
        console.log("[Deeplink] Note: If you dismissed the system alert, you can also use this modal");
        showInstallModal(deepLink);
      } else {
        console.log("[Deeplink] ✅ App opened successfully - not showing modal");
      }
    }, CONFIG.MODAL_TIMEOUT);
  }

  function showInstallModal(deepLink) {
    console.log("[Deeplink] showInstallModal called", { deepLink });
    
    showModal(
      "For the best experience, we recommend using the eAuctionDekho app. What would you like to do?",
      () => {
        console.log("[Deeplink] User clicked 'Install App'");
        sessionStorage.setItem(CONFIG.STORAGE_KEYS.USER_PREFERENCE, "app");
        const appStoreLink = getAppStoreLink();
        console.log("[Deeplink] App store link:", appStoreLink);
        
        if (appStoreLink) {
          console.log("[Deeplink] Attempting to open app, then redirecting to store");
          window.location.href = deepLink;
          setTimeout(() => {
            console.log("[Deeplink] Redirecting to app store:", appStoreLink);
            window.location.href = appStoreLink;
          }, 300);
        } else {
          console.log("[Deeplink] No app store link found, using deep link only");
          window.location.href = deepLink;
        }
      },
      () => {
        console.log("[Deeplink] User clicked 'Continue on Website'");
        sessionStorage.setItem(CONFIG.STORAGE_KEYS.USER_PREFERENCE, "web");
        console.log("[Deeplink] User preference set to 'web' - will skip deeplink routing");
      }
    );
  }

  // Enhanced main routing function
  function handleDeeplinkRouting() {
    console.log("[Deeplink] ===== Starting deeplink routing =====");
    console.log("[Deeplink] Current URL:", window.location.href);
    console.log("[Deeplink] Pathname:", window.location.pathname);
    
    try {
      if (!isMobileDevice()) {
        console.log("[Deeplink] ❌ Not a mobile device, skipping deeplink routing");
        return;
      }

      const userChoice = sessionStorage.getItem(CONFIG.STORAGE_KEYS.USER_PREFERENCE);
      console.log("[Deeplink] User preference:", userChoice || "none");
      
      if (userChoice === "web") {
        console.log("[Deeplink] ❌ User prefers web, skipping deeplink routing");
        return;
      }

      const pathname = window.location.pathname.slice(1);
      console.log("[Deeplink] Processing pathname:", pathname);
      
      if (pathname.startsWith("admin/") || pathname.startsWith("api/")) {
        console.log("[Deeplink] ❌ Skipping admin/api routes");
        return;
      }

      // Find matching route
      let matchedDeepLink = null;
      let matchedRouteName = null;
      
      console.log("[Deeplink] Searching through", deeplinkRoutes.length, "routes...");
      
      for (const route of deeplinkRoutes) {
        if (route.match(pathname)) {
          matchedDeepLink = route.deepLink(pathname);
          matchedRouteName = route.name;
          console.log("[Deeplink] ✅ Matched route:", {
            routeName: matchedRouteName,
            pathname,
            deepLink: matchedDeepLink
          });
          break;
        }
      }

      if (!matchedDeepLink) {
        console.log("[Deeplink] ❌ No matching route found for pathname:", pathname);
        return;
      }

      if (userChoice === "app") {
        console.log("[Deeplink] ✅ User explicitly chose app - redirecting directly:", matchedDeepLink);
        window.location.href = matchedDeepLink;
        return;
      }

      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isAndroid = /android/i.test(userAgent);
      const isIOS = /iphone|ipad|ipod/i.test(userAgent);

      console.log("[Deeplink] Platform detection:", {
        isAndroid,
        isIOS,
        userAgent: userAgent.substring(0, 80)
      });

      if (isAndroid) {
        console.log("[Deeplink] → Routing to Android handler");
        tryOpeningAppWithFallback(matchedDeepLink);
      } else if (isIOS) {
        console.log("[Deeplink] → Routing to iOS handler");
        tryUniversalLinkWithFallback(matchedDeepLink);
      } else {
        console.log("[Deeplink] → Routing to desktop/other handler");
        showInstallModal(matchedDeepLink);
      }
      
      console.log("[Deeplink] ===== Deeplink routing completed =====");
    } catch (error) {
      console.error("[Deeplink] ❌ Error in routing:", error);
      console.error("[Deeplink] Error stack:", error.stack);
    }
  }

  // Run after DOM loaded
  console.log("[Deeplink] Script loaded, document readyState:", document.readyState);
  
  if (document.readyState === "complete" || document.readyState === "interactive") {
    console.log("[Deeplink] DOM already ready, scheduling routing in 100ms");
    setTimeout(() => {
      console.log("[Deeplink] Executing routing (delayed)");
      handleDeeplinkRouting();
    }, 100); // Small delay to ensure system handles first
  } else {
    console.log("[Deeplink] Waiting for DOMContentLoaded");
    document.addEventListener("DOMContentLoaded", () => {
      console.log("[Deeplink] DOMContentLoaded fired, scheduling routing in 100ms");
      setTimeout(() => {
        console.log("[Deeplink] Executing routing (after DOMContentLoaded)");
        handleDeeplinkRouting();
      }, 100);
    });
  }
})();