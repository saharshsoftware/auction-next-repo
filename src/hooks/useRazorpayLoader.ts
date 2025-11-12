import { useEffect, useState } from "react";
import { STRING_DATA } from "@/shared/Constants";
import { logInfo, logError } from "@/shared/Utilies";

const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";
const RAZORPAY_SCRIPT_ID = "razorpay-checkout-script";

/**
 * Custom hook to load Razorpay checkout script
 */
export const useRazorpayLoader = (): { isReady: boolean, message: string } => {
  const [isReady, setIsReady] = useState(false);
  const [message, setMessage] = useState(STRING_DATA.PAYMENT_GATEWAY_LOADING);

  useEffect(() => {
    if (typeof window === "undefined") {
      logInfo("Skipping Razorpay script load on server render");
      return;
    }
    
    if (window.Razorpay) {
      setIsReady(true);
      setMessage(STRING_DATA.EMPTY);
      logInfo("Razorpay already available on window");
      return;
    }
    
    const existingScript = document.getElementById(RAZORPAY_SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      const handleLoad = () => {
        setIsReady(true);
        setMessage(STRING_DATA.EMPTY);
        logInfo("Razorpay script finished loading (existing element)");
      };
      const handleError = () => {
        setMessage(STRING_DATA.PAYMENT_GATEWAY_ERROR);
        logError("Razorpay script failed to load (existing element)");
      };
      existingScript.addEventListener("load", handleLoad);
      existingScript.addEventListener("error", handleError);
      return () => {
        existingScript.removeEventListener("load", handleLoad);
        existingScript.removeEventListener("error", handleError);
      };
    }
    
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_SRC;
    script.id = RAZORPAY_SCRIPT_ID;
    script.async = true;
    script.onload = () => {
      setIsReady(true);
      setMessage(STRING_DATA.EMPTY);
      logInfo("Razorpay script successfully loaded");
    };
    script.onerror = () => {
      setMessage(STRING_DATA.PAYMENT_GATEWAY_ERROR);
      logError("Razorpay script failed to load");
    };
    document.body.appendChild(script);
    logInfo("Razorpay script injected", { src: RAZORPAY_SCRIPT_SRC });
    
    return () => {
      script.onload = null;
      script.onerror = null;
    };
  }, []);

  return { isReady, message };
};
