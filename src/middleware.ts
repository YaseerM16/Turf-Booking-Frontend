import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const userRole = req.cookies.get("userRole")?.value

    // Define public and protected routes
    const publicRoutes = ["/login", "/signup", "/verifymail", "/checkmail", "/forgotpassword"];
    const protectedRoutes = ["/profile"];

    const currentPath = req.nextUrl.pathname;

    // If the user is authenticated
    if (token) {
        // Redirect authenticated users away from public routes
        if (publicRoutes.includes(currentPath)) {
            return NextResponse.redirect(new URL("/", req.url));
        }
    } else {
        // Redirect unauthenticated users away from protected routes
        if (protectedRoutes.includes(currentPath)) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    // Allow access to the requested route
    return NextResponse.next();
}

// Define which routes the middleware applies to
export const config = {
    matcher: ["/login", "/signup", "/verifymail", "/checkmail", "/profile", "/forgotpassword"],
};