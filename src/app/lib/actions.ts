// import { signIn } from "@/auth";
import { ILogin } from "@/interfaces/Auth";
import { AuthError } from "next-auth";

// import { signIn } from "next-auth/react";


// export async function authenticate(payload: { formData: ILogin }) {
//   try {
//     const { formData } = payload;
//     await signIn("credentials", {
//       identifier: "saurabh+2gmai.com",
//       password: "123",
//       redirect: false,
//     });
//   } catch (error) {
//     if (error instanceof AuthError) {
//       switch (error.type) {
//         case "CredentialsSignin":
//           return "Invalid credentials.";
//         default:
//           return "Something went wrong.";
//       }
//     }
//     throw error;
//   }
// }
