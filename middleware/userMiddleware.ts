import { NextRequest, NextResponse } from "next/server";


// Define public and protected routes
export const userPublicRoutes = ["/login", "/signup", "/verifymail", "/checkmail", "/forgotpassword"];
export const userProtectedRoutes = ["/profile", "/my-bookings", "/my-wallet", "/messages", "/bookingSuccess"];

export function userMiddleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const currentPath = req.nextUrl.pathname;

    let isUserAuthenticated = false;

    // ✅ Decode token and verify user role **only if token exists**
    if (token) {
        try {
            const decodedToken = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
            isUserAuthenticated = decodedToken?.userRole === "user";
        } catch (err) {
            console.error("Error decoding token:", err);
            // ❌ If token exists but is invalid, **treat the user as NOT authenticated**
            isUserAuthenticated = false;
        }
    }

    // ✅ If the user **is authenticated** and tries to access a **public route**, redirect to `/profile`
    if (isUserAuthenticated && userPublicRoutes.includes(currentPath)) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // ✅ If the user is on a **protected route**
    if (userProtectedRoutes.includes(currentPath)) {
        // ❌ If **not authenticated**, redirect to login
        if (!isUserAuthenticated) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return NextResponse.next();
}

