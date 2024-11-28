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
    console.log("User Role :", userRole);


    // Define route groups
    const publicRoutes = ["/login", "/signup", "/verifymail", "/checkmail", "/forgotpassword"];
    const userRoutes = ["/profile"];
    const companyPublic = ["/company/login", "/company/register"];
    const companyProtected = ["/company/dashboard"];
    const adminPublic = ["/admin/login"];
    const adminProtected = ["/admin/dashboard"];

    const currentPath = req.nextUrl.pathname;

    // Handle routing if no token or userRole
    if (!token || !userRole) {
        // Restrict access to userRoutes, companyProtected, and adminProtected
        if (userRoutes.includes(currentPath)) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        if (companyProtected.includes(currentPath)) {
            return NextResponse.redirect(new URL("/company/login", req.url));
        }
        if (adminProtected.includes(currentPath)) {
            return NextResponse.redirect(new URL("/admin/login", req.url));
        }
    }

    // Additional handling for authenticated users
    if (token && userRole) {
        if (userRole === "user" && !userRoutes.includes(currentPath)) {
            return NextResponse.redirect(new URL("/profile", req.url));
        }
        if (userRole === "company" && companyPublic.includes(currentPath)) {
            return NextResponse.redirect(new URL("/company/dashboard", req.url));
        }
        if (userRole === "admin" && adminPublic.includes(currentPath)) {
            return NextResponse.redirect(new URL("/admin/dashboard", req.url));
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
