(function () {
  // Configuration
  const CONFIG = {
    APP_SCHEME: "com.eauctiondekho://",
    ANDROID_PACKAGE: "com.eauctiondekho",
    PLAYSTORE_URL: "https://play.google.com/store/apps/details?id=com.eauctiondekho",
    APPSTORE_URL:
      "https://apps.apple.com/us/app/e-auctiondekho/id6742924249",
    IOS_APP_STORE_ID: "6742924249", // Add your iOS app store ID
    MODAL_TIMEOUT: 1000, // Reduced timeout for better UX
    STORAGE_KEYS: {
      PREFER_WEB: "preferWeb",
      APP_CHECK_DONE: "appCheckDone",
      USER_PREFERENCE: "userLinkPreference",
    },
  };

  // Utility: Detect mobile device (more reliable detection)
  function isMobileDevice() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobile = /android|iphone|ipad|ipod|mobile|tablet/i.test(
      userAgent.toLowerCase()
    );
    const isTablet = /(ipad|tablet|playbook|silk)|(android(?!.*mobile))/i.test(
      userAgent
    );
    return isMobile || isTablet;
  }

  // Utility: Get appropriate app store link with tracking parameters
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

  // Enhanced app opening function with fallback
  function tryOpeningApp(deepLink) {
    if (!isMobileDevice()) return;
  
    const userChoice = sessionStorage.getItem(CONFIG.STORAGE_KEYS.USER_PREFERENCE);
    if (userChoice === "web") return;
    if (userChoice === "app") {
      window.location.href = deepLink;
      return;
    }
  
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    let appOpened = false;
  
    const visibilityHandler = () => {
      if (document.hidden) appOpened = true;
    };
    document.addEventListener("visibilitychange", visibilityHandler);
  
    if (/android/i.test(userAgent)) {
      // ✅ Use Intent URL for Android Chrome
      const intentUrl = `intent://${window.location.pathname.replace(
        /^\//,
        ""
      )}#Intent;scheme=com.eauctiondekho;package=${CONFIG.ANDROID_PACKAGE};S.browser_fallback_url=${encodeURIComponent(
        CONFIG.PLAYSTORE_URL
      )};end`;
  
      window.location.href = intentUrl;
    } else if (/iphone|ipad|ipod/i.test(userAgent)) {
      // ✅ Use Universal Link if available
      const universalLink = `https://eauctiondekho.com/${window.location.pathname}`;
      window.location.href = universalLink;
  
      // fallback to custom scheme after a short delay (for older iOS or if Universal not configured)
      setTimeout(() => {
        if (!appOpened) window.location.href = CONFIG.APP_SCHEME + window.location.pathname;
      }, 1000);
    } else {
      // fallback for unknown device types
      window.location.href = deepLink;
    }
  
    // Final fallback (show modal if nothing opened)
    setTimeout(() => {
      document.removeEventListener("visibilitychange", visibilityHandler);
      if (!appOpened) showInstallModal(deepLink);
    }, CONFIG.MODAL_TIMEOUT || 1500);
  }
  

  function showInstallModal(deepLink) {
    showModal(
      "For the best experience, we recommend using the eAuctionDekho app. What would you like to do?",
      () => {
        const storage = sessionStorage;
        storage.setItem(CONFIG.STORAGE_KEYS.USER_PREFERENCE, "app");

        const appStoreLink = getAppStoreLink();
        if (appStoreLink) {
          // Try to open app again in case it was just slow to respond
          window.location.href = deepLink;
          setTimeout(() => {
            window.location.href = appStoreLink;
          }, 300);
        } else {
          window.location.href = deepLink;
        }
      },
      () => {
        const storage = sessionStorage;
        storage.setItem(CONFIG.STORAGE_KEYS.USER_PREFERENCE, "web");
      }
    );
  }

  // Main entry with error handling
  function handleDeeplinkRouting() {
    try {
      const currentUrl = window.location.href;
      const urlObj = new URL(currentUrl);
      const pathname = urlObj.pathname.slice(1); // remove initial '/'

      // Skip for certain paths if needed
      if (pathname.startsWith("admin/") || pathname.startsWith("api/")) {
        return;
      }
      console.log(pathname);
      console.log(deeplinkRoutes);
      for (const route of deeplinkRoutes) {
        if (route.match(pathname)) {
          const deepLink = route.deepLink(pathname);
          console.debug("[Deeplink] Matching route:", route.name, deepLink);
          tryOpeningApp(deepLink);
          break;
        }
      }
    } catch (error) {
      console.error("[Deeplink] Error in routing:", error);
    }
  }

  // Run the script after DOM is fully loaded
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    setTimeout(handleDeeplinkRouting, 0);
  } else {
    document.addEventListener("DOMContentLoaded", handleDeeplinkRouting);
  }
})();
