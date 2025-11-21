import { useEffect, useState } from "react";

// Detect if opened in mobile app WebView
export const useIsMobileApp = (): boolean => {
    const [isMobileApp, setIsMobileApp] = useState(false);
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setIsMobileApp(urlParams.get('source') === 'mobile_app');
    }, []);
    return isMobileApp;
};
