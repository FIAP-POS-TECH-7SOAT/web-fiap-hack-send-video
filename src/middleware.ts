import { auth } from "@/auth";

export default auth((req: any) => {
  if (!req.auth && req.nextUrl.pathname !== "/user" && req.nextUrl.pathname !== "/login") {
    const newUrl = new URL("/login", req.nextUrl.origin); // Redireciona para "/login"
    return Response.redirect(newUrl);
  }
});

export { auth as middleware, signOut } from "./auth";

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.svg$|user|login|api/auth/csrf).*)",
  ],
};
