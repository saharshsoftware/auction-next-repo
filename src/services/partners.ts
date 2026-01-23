import { API_BASE_URL } from '@/services/api';
import { postRequest } from '@/shared/Axios';

interface ICreatePartnerProps {
  formData: any;
}

export const createPartnerClient = async (payload: ICreatePartnerProps) => {
  const { formData } = payload;
  try {
    const URL = API_BASE_URL + '/api/partner-signup';
    const { data } = await postRequest({ API: URL, DATA: formData });
    return data;
  } catch (error: any) {
    console.log("error", error);
    throw error.response.data?.error || error;
  }
};

export default createPartnerClient;
