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
    // Specific deep link routes can be added here
    {
      name: "Generic fallback",
      match: (path) => true,
      deepLink: (path) => `${CONFIG.APP_SCHEME}${path}`,
    },

    {
      name: "Auction Details",
      match: (path) => path.startsWith("auctions/"),
      deepLink: (path) => `${CONFIG.APP_SCHEME}${path}`,
    },
    {
      name: "Manage Alert",
      match: (path) => path.startsWith("manage-alert/"),
      deepLink: (path) => `${CONFIG.APP_SCHEME}alerts/`,
    },

  ];

  // Enhanced app opening function with fallback
  function tryOpeningApp(deepLink) {
    if (!isMobileDevice()) return;

    // Check if user has set a permanent preference
    const userChoice = sessionStorage.getItem(
      CONFIG.STORAGE_KEYS.USER_PREFERENCE
    );

    if (userChoice === "web") return;
    if (userChoice === "app") {
      window.location.href = deepLink;
      return;
    }

    // If no choice made yet, proceed with detection
    let appOpened = false;
    const visibilityChangeHandler = () => {
      if (document.hidden) {
        appOpened = true;
        document.removeEventListener(
          "visibilitychange",
          visibilityChangeHandler
        );
      }
    };

    document.addEventListener("visibilitychange", visibilityChangeHandler);

    // Try to open app
    window.location.href = deepLink;

    setTimeout(() => {
      document.removeEventListener("visibilitychange", visibilityChangeHandler);

      if (!appOpened) {
        showInstallModal(deepLink);
      }
    }, CONFIG.MODAL_TIMEOUT);
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
