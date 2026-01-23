import { API_BASE_URL, API_ENPOINTS } from '@/services/api';
import { postRequest } from '@/shared/Axios';

interface ICreatePartnerProps {
  formData: any;
}

export const createPartnerClient = async (payload: ICreatePartnerProps) => {
  const { formData } = payload;
  try {
    const URL = API_BASE_URL + API_ENPOINTS.PARTNER_SIGNUP;
    const { data } = await postRequest({
      API: URL, DATA: {
        ...formData,
        allowedCategories: [],
        allowedCities: [],
        allowedPincodes: [],
        supportedServices: [],
      }
    });
    return data;
  } catch (error: any) {
    console.log("error", error);
    throw error.response.data?.error || error;
  }
};

export default createPartnerClient;
