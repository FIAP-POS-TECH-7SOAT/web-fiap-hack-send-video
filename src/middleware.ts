import { auth } from "@/auth";

export default auth((req: any) => {
  if (!req.auth && req.nextUrl.pathname !== "/user") {
    const newUrl = new URL("/user", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export { auth as middleware,signOut } from "./auth";

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.svg$|user|api/auth/csrf).*)",
  ],
};
