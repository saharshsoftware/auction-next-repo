import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIES } from "./shared/Constants";
import { AUTH_ROUTES } from "./routes/AuthRoutes";
import { ROUTE_CONSTANTS } from "./shared/Routes";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  let isAuthenticated = request.cookies.has(COOKIES.TOKEN_KEY); // => true
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => request.nextUrl.pathname === route.path
  );
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL(ROUTE_CONSTANTS.DASHBOARD, request.url));
  }
}

// import NextAuth from "next-auth";
// import { authConfig } from "./auth.config";

// export default NextAuth(authConfig).auth;

// export const config = {
//   // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
//   matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
// };