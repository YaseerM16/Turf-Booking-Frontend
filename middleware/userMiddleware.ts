import { NextRequest, NextResponse } from "next/server";

export function userMiddleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const currentPath = req.nextUrl.pathname;

    // Define public and protected routes
    const publicRoutes = ["/login", "/signup", "/verifymail", "/checkmail", "/forgotpassword"];
    const protectedRoutes = ["/profile", "/my-bookings"];

    // Check if the request is for a protected route
    if (protectedRoutes.some((route) => currentPath.startsWith(route))) {
        // If no token is present, redirect to the login page
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // Decode token and verify user role
        try {
            const decodedToken = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
            const userRole = decodedToken?.userRole;

            // Redirect if the token does not have the 'user' role
            if (userRole !== "user") {
                return NextResponse.redirect(new URL("/login", req.url));
            }
        } catch (err) {
            console.error("Error decoding token:", err);
            // Redirect to login if the token is invalid
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    // Allow access for public routes and all other requests
    return NextResponse.next();
}
