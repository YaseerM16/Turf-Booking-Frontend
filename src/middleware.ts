import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    // Decode the token
    let decodedToken: { userRole?: string } | null = null;
    if (token) {
        try {
            decodedToken = jwt.decode(token) as { userRole?: string };
        } catch (err) {
            console.error("Error decoding token:", err);
        }
    }

    const userRole = decodedToken?.userRole;

    // Define route groups
    const publicRoutes = ["/login", "/signup", "/verifymail", "/checkmail", "/forgotpassword"];
    const userRoutes = ["/profile"];
    const companyRoutes = ["/company/login", "/company/register", "/company/dashboard"];
    const adminRoutes = ["/admin/login", "/admin/dashboard"];

    const currentPath = req.nextUrl.pathname;

    // Handle routing based on user role
    if (token) {
        // Redirect users away from public routes
        if (publicRoutes.includes(currentPath)) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        if (userRole === "user") {
            // Restrict access to user-only routes
            if (!userRoutes.includes(currentPath)) {
                return NextResponse.redirect(new URL("/profile", req.url));
            }
        } else if (userRole === "company") {
            // Redirect away from company login if already logged in
            if (currentPath === "/company/login") {
                return NextResponse.redirect(new URL("/company/dashboard", req.url));
            }
            // Restrict access to company-only routes
            if (!companyRoutes.includes(currentPath)) {
                return NextResponse.redirect(new URL("/company/dashboard", req.url));
            }
        } else if (userRole === "admin") {
            // Redirect away from admin login if already logged in
            if (currentPath === "/admin/login") {
                return NextResponse.redirect(new URL("/admin/dashboard", req.url));
            }
            // Restrict access to admin-only routes
            if (!adminRoutes.includes(currentPath)) {
                return NextResponse.redirect(new URL("/admin/dashboard", req.url));
            }
        }
    } else {
        // If no token, restrict access to protected routes
        if (
            [...userRoutes, ...companyRoutes, ...adminRoutes].includes(currentPath)
        ) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/login",
        "/signup",
        "/verifymail",
        "/checkmail",
        "/forgotpassword",
        "/profile",
        "/company/login",
        "/company/register",
        "/company/dashboard",
        "/admin/login",
        "/admin/dashboard",
    ],
};
