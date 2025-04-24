import { putRequest } from "@/shared/Axios";
import { API_BASE_URL, API_ENPOINTS } from "./api";

export const updateBlogLikesClient = async (payload: {
  no_of_likes: number;
  blogId: string;
}) => {
  const { no_of_likes, blogId } = payload;
  try {
    const URL = API_BASE_URL + API_ENPOINTS.BLOGS + `/${blogId}`;
    // const URL = "http://localhost:3000" + API_ENPOINTS.BLOGS + `/${blogId}`;
    console.log(URL);
    const { data } = await putRequest({
      API: URL,
      DATA: { data: { no_of_likes } },
    });
    console.log(data);
    return data;
  } catch (error: any) {
    throw error?.response?.data?.error;
  }
};
