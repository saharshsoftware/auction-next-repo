// "use server";

// import { API_BASE_URL, API_ENPOINTS } from "@/services/api";
// import {
//   deleteRequest,
//   getRequest,
//   postRequest,
//   putRequest,
// } from "@/shared/Axios";
// import { COOKIES } from "@/shared/Constants";
// import { cookies } from "next/headers";

// export const fetchFavoriteList = async () => {
//   try {
//     const cookieStore = cookies();
//     const token = cookieStore.get(COOKIES.TOKEN_KEY)?.value; // Replace with your actual cookie name

//     const URL = API_BASE_URL + API_ENPOINTS.FAVOURITE_LIST;

//     const response = await fetch(URL, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token ? `Bearer ${token}` : "",
//       },
//     });

//     if (!response.ok) {
//       throw new Error("Failed to fetch faviourite list");
//     }

//     const responseResult = await response.json();
//     return responseResult;
//   } catch (e) {
//     console.log(e, "fetchfav error");
//   }
// };