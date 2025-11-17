"use server";

import { cookies } from "next/headers";
import { API_BASE_URL, API_ENPOINTS } from "@/services/api";
import { COOKIES } from "@/shared/Constants";
import { UserProfileApiResponse } from "@/interfaces/UserProfileApi";

/**
 * Fetches the authenticated user's profile (including subscription details) on the server.
 */
export const fetchUserProfile = async (): Promise<UserProfileApiResponse | null> => {
  const token = cookies().get(COOKIES.TOKEN_KEY)?.value;

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(API_BASE_URL + API_ENPOINTS.USER_ME, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Failed to fetch user profile for subscription data", response.statusText);
      return null;
    }

    const profile: UserProfileApiResponse = await response.json();
    return profile;
  } catch (error) {
    console.error("Error fetching user profile for subscription data", error);
    return null;
  }
};


