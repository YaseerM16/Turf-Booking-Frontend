import { NextRequest, NextResponse } from "next/server";

export function adminMiddleware(req: NextRequest) {
    const token = req.cookies.get("AdminToken")?.value;
    const currentPath = req.nextUrl.pathname;

    // Define public and protected routes
    const adminPublic = ["/admin/login"];
    const adminProtected = ["/admin/dashboard", "/admin/user-management", "/admin/registered-companies", "/admin/approved-companies"];

    // Check if the request is for a protected route
    if (adminProtected.some((route) => currentPath.startsWith(route))) {
        // If no token is present, redirect to the admin login page
        if (!token) {
            return NextResponse.redirect(new URL("/admin/login", req.url));
        }

        // Decode token and verify admin role
        try {
            const decodedToken = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
            const userRole = decodedToken?.userRole;

            // Redirect if the token does not have the 'admin' role
            if (userRole !== "admin") {
                return NextResponse.redirect(new URL("/admin/login", req.url));
            }
        } catch (err) {
            console.error("Error decoding token:", err);
            // Redirect to login if the token is invalid
            return NextResponse.redirect(new URL("/admin/login", req.url));
        }
    }

    // Allow access for public routes and all other requests
    return NextResponse.next();
}
