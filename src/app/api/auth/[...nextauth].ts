import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  pages: {
    signIn: "/login",
    // error: '/auth/error',
    // signOut: '/auth/signout'
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        console.log(credentials, "credentials");
        const authResponse = await fetch("/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });

        if (!authResponse.ok) {
          return null;
        }

        const user = await authResponse.json();

        return user;
      },
    }),
  ],
});
