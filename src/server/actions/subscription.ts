import { API_ENPOINTS } from "@/services/api";
import { sanitizedAuctionData } from "@/shared/Utilies";

export const fetchSubscriptions = async () => {
  "use server";
  try {
    // const URL = API_BASE_URL + API_ENPOINTS.RAZORPAY_PLAN;
    const URL = "http://localhost:1009" + API_ENPOINTS.RAZORPAY_PLAN;

    const response = await fetch(URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch fetchSubscriptions");
    }

    const data = await response.json();
    const razorpayPlans = sanitizedAuctionData(data.data);
    return razorpayPlans;
  } catch (e) {
    console.error(e, "fetchSubscriptions error");
    return null;
  }
};