"use server";

import { API_BASE_URL, API_ENPOINTS } from "@/services/api";
import { CACHE_TIMES } from "@/shared/Constants";
import { sanitizeStrapiData } from "@/shared/Utilies";

export const fetchBlogs = async () => {
  "use server";
  try {
    const URL = API_BASE_URL + API_ENPOINTS.BLOGS + `?populate=*`;
    // const URL = "http://localhost:3000" + API_ENPOINTS.BLOGS + `?populate=*`;

    const response = await fetch(URL, {
      next: { revalidate: CACHE_TIMES.BLOGS },
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch banks");
    }

    const responseResult = await response.json();
    return sanitizeStrapiData(responseResult?.data, true);
  } catch (e) {
    console.error(e, "Banks error");
    return null;
  }
};

export const fetchBlogBySlug = async (slug: string) => {
  "use server";
  try {
    const URL =
      API_BASE_URL + API_ENPOINTS.BLOGS + `?populate=*&filters[slug]=${slug}`;
    // const URL =
    //   "http://localhost:3000" +
    //   API_ENPOINTS.BLOGS +
    //   `?populate=*&filters[slug]=${slug}`;

    const response = await fetch(URL, {
      next: { revalidate: CACHE_TIMES.BLOGS },
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch banks");
    }

    const responseResult = await response.json();
    return sanitizeStrapiData(responseResult?.data, true);
  } catch (e) {
    console.error(e, "Banks error");
    return null;
  }
};
