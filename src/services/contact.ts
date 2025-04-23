import { API_BASE_URL, API_ENPOINTS } from "@/services/api";
import { postRequest } from "@/shared/Axios";

interface IPayload {
  email: string;
  message: string;
  subject: string;
}

interface IContactUs {
  formData: IPayload;
  onSettled?: () => void;
}

interface IPartnerContactForm {
  formData: {
    name: string;
    mobile: string;
    email: string;
    cities: string;
    reasonToJoin?: string;
    background?: string;
    experience?: string;
    isActiveForAuction?: boolean;
  };
}

export const ConatctUsClient = async (payload: IContactUs) => {
  const { formData, onSettled } = payload;
  try {
    const URL = API_BASE_URL + API_ENPOINTS.CONTACT_USER;
    console.log(URL);
    const { data } = await postRequest({
      API: URL,
      DATA: { data: formData },
    });
    console.log(data);
    onSettled?.();
    return data;
  } catch (error: any) {
    return error?.response?.data;
  }
};

export const partnerConatctClient = async (payload: IPartnerContactForm) => {
  const { formData } = payload;
  try {
    const URL = API_BASE_URL + API_ENPOINTS.CONTACT_BROKERS;
    console.log(URL);
    const { data } = await postRequest({
      API: URL,
      DATA: { data: formData },
    });
    console.log(data);
    return data;
  } catch (error: any) {
    throw error?.response?.data?.error;
  }
};
