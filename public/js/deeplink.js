(function () {
  function isMobileDevice() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /android|iphone|ipad|ipod/i.test(userAgent);
  }

  function getAppStoreLink() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent)) {
      return "https://play.google.com/store/apps/details?id=com.eauctiondekho"; // Replace with your Play Store URL
    } else if (/iphone|ipad|ipod/i.test(userAgent)) {
      return ""; // Replace with your App Store URL
    }
    return null;
  }

  function showModal(message, onContinue, onCancel) {
    // Create the modal HTML structure
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

  function openingApp(deepLink) {
    console.log("Opening app with deeplink", deepLink);
    if (isMobileDevice()) {
      setTimeout(() => {
        // App not installed, show options
        showModal(
          "It seems you don't have the eauctiondekho app installed. Would you like to install it or continue on the website?",
          () => {
            const appStoreLink = getAppStoreLink();
            if (appStoreLink) {
              window.location.href = appStoreLink;
            }
          },
          () => {
            console.log("User chose to continue on the website.");
          }
        );
      }, 2000);
    }
  }

  const currentUrl = window.location.href;
  const urlObj = new URL(currentUrl);
  const pathname = urlObj.pathname.slice(1);
  const [segment1, segment2] = pathname.split("/");

  console.log("(INFO:: Deeplink)", {
    urlObj,
    currentUrl,
    pathname,
  });
  if (pathname.startsWith("app")) {
    let deepLink = `com.eauctiondekho://${pathname}`;

    const appStoreLink = getAppStoreLink();
    console.log("(INFO:: Deeplink) INFO:: Deeplink", {
      deepLink,
      appStoreLink,
    });
    // openingApp(deepLink);
  }
  if (segment1 === "auctions" && segment2 !== "find-auctions" && segment2) {
    let deepLink = `com.eauctiondekho://auction-details/${segment2}`;

    const appStoreLink = getAppStoreLink();
    console.log("(INFO:: Deeplink) INFO:: Deeplink", {
      deepLink,
      appStoreLink,
    });
    // openingApp(deepLink);
  }
})();
