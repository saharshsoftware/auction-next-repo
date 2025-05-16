import { postRequest } from "@/shared/Axios";
import { API_BASE_URL, API_ENPOINTS } from "./api";

export const createUserSubscription = async (props: {
    formData: { razorpayPlanId: string, planId: string };
}) => {
    try {
        const { formData } = props;
        // const URL = API_BASE_URL + API_ENPOINTS.RAZORPAY_PLAN;
        const URL = "http://localhost:1009" + API_ENPOINTS.CREATE_RAZORPAY_ORDER;

        const { data } = await postRequest({ API: URL, DATA: formData });

        console.log(data, "responsefetch");
        return data;
    } catch (e: any) {
        // return e?.response?.data?.error?.message
        console.log(e, "auctionDetail error collection");
        return e;
    }
};