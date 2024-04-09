// import NextAuth from "next-auth";
// import { authConfig } from "./auth.config";
// import Credentials from "next-auth/providers/credentials";
// import CredentialsProvider from "next-auth/providers/credentials";

// export const { auth, signIn, signOut } = NextAuth({
//   ...authConfig,
//   secret: "l24F9+mWXm0423Xc7dReus8SUKEJW72TY9XisEwgedc=",
//   session: {
//     strategy: "jwt",
//   },
//   pages: {
//     signIn: "/login",
//   },
//   providers: [
//     CredentialsProvider({
//       credentials: {
//         identifier: {},
//         password: {},
//       },
//       async authorize(credentials, req) {
//         console.log({ credentials }, "credentials");
//         return null;
//       },
//     }),
//   ],
// });
