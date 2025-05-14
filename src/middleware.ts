import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Get the session token
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Redirect authenticated users away from login and register pages
    if (token && (pathname === "/login" || pathname === "/register")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Redirect to login if not authenticated for protected routes
    if (!token && (pathname.startsWith("/profile") || pathname.startsWith("/admin"))) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Role-based access for protected routes
    if (token && (pathname.startsWith("/profile") || pathname.startsWith("/admin"))) {
        const role = token.role as string;

        const accessRules: { [key: string]: string[] } = {
            "/profile": ["general_user", "regular_admin", "super_admin"],
            "/admin/users": ["regular_admin", "super_admin"],
            "/admin/admins": ["super_admin"],
        };

        for (const path in accessRules) {
            if (pathname.startsWith(path)) {
                if (!accessRules[path].includes(role)) {
                    return NextResponse.redirect(new URL("/auth/error?error=AccessDenied", req.url));
                }
            }
        }
    }

    // Allow access if no rules apply
    return NextResponse.next();
}

export const config = {
    matcher: ["/login", "/register", "/profile", "/admin/:path*"],
};