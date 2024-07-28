import { updateCookieSession, verifyJwt } from "@/lib/session";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/constants";

let verifyRoutes: string[] = ["/verify"];
let authRoutes: string[] = ["/auth"];
let adminRoutes: string[] = ["/admin"];
let userRoutes: string[] = ["/profile"];

/**
 * Checks if the path is protected for resort personnel.
 * @param {string} path - The URL path.
 * @returns {boolean} - True if the path is protected for resort personnel.
 */
const isAdminRoutes = (path: string) =>
  adminRoutes.some((route) => path.startsWith(route));

/**
 * Checks if the path is protected for guests.
 * @param {string} path - The URL path.
 * @returns {boolean} - True if the path is protected for guests.
 */
const isUserRoutes = (path: string): boolean =>
  userRoutes.some((route) => path.startsWith(route));

const isVerifyRoutes = (path: string): boolean =>
  verifyRoutes.some((route) => path.startsWith(route));

/**
 * Checks if the path is an authentication route.
 * @param {string} path - The URL path.
 * @returns {boolean} - True if the path is an authentication route.
 */
const isAuthRoutes = (path: string): boolean =>
  authRoutes.some((route) => path.startsWith(route));

/**
 * Middleware function to handle authentication and authorization.
 * @param {NextRequest} request - The incoming request.
 * @returns {Promise<NextResponse<unknown> | undefined>} - The response or undefined.
 */
export default async function middleware(
  request: NextRequest
): Promise<NextResponse<unknown> | undefined> {
  const { nextUrl, cookies } = request;
  const { pathname } = nextUrl;

  /**
   * Redirects to the specified path.
   * @param {string} path - The URL path to redirect to.
   * @returns {NextResponse} - The redirect response.
   */
  const redirect = (path: string): NextResponse => {
    return NextResponse.redirect(new URL(path, nextUrl.clone()));
  };

  let token = null;
  let user = null;

  token = cookies.get(AUTH_COOKIE_NAME)?.value;

  if (token) {
    const result = await verifyJwt(token);
    user = result.user;

    // if (user.role === Role.USER) {
    //   userRoutes.push("/");
    // } else {
    //   userRoutes.push("/admin");
    // }
  } else {
    userRoutes = userRoutes.filter((route) => route !== "/");
  }

  if (isAdminRoutes(pathname)) {
    if (!user) return redirect("/auth/login/admin");
  }

  if (isUserRoutes(pathname)) {
    if (!user) return redirect("/auth/login");
  }

  // Restrict access to resort personnel dashboard for regular users
  if (isAdminRoutes(pathname) && user) {
    if (user.role == Role.USER) return redirect("/");
  }

  // Redirect guests to the dashboard if they are not regular users
  if (isUserRoutes(pathname) && user) {
    if (user.role != Role.USER) return redirect("/admin/dashboard");
  }

  // Redirect authenticated users from auth routes
  if (isAuthRoutes(pathname)) {
    if (user) {
      const role = user.role;
      return redirect(role == Role.USER ? "/" : "/admin/dashboard");
    }
  }

  if (isVerifyRoutes(pathname)) {
    if (!user) return redirect("/auth/login");

    if (user.mobileVerifiedAt) return redirect("/");
  }

  if (
    pathname === "/" ||
    (!isVerifyRoutes(pathname) &&
      !isAuthRoutes(pathname) &&
      !isAdminRoutes(pathname) &&
      !isUserRoutes(pathname) &&
      user)
  ) {
    if (user && (!user.mobileVerifiedAt)) {
      return redirect("/verify");
    }
  }

  return await updateCookieSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
