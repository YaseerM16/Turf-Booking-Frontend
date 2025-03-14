import { NextRequest, NextResponse } from "next/server";
export const userPublicRoutes = ["/login", "/signup", "/verifymail", "/checkmail", "/forgotpassword"];
export const userProtectedRoutes = ["/profile", "/my-bookings", "/my-wallet", "/messages", "/bookingSuccess"];
export function middleware(req: NextRequest) {
    // Call userMiddleware and return response if it handles the request
    const token = req.cookies.get("token")?.value;
    const currentPath = req.nextUrl.pathname;

    console.log("UserMiddleware executed for:", currentPath);
    console.log("Token in the UserMiddleware:", token);

    let isUserAuthenticated = false;

    if (token) {
        try {
            const decodedToken = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
            console.log("Decoded Token:", decodedToken);

            isUserAuthenticated = decodedToken?.userRole === "user";
        } catch (err) {
            console.error("Error decoding token:", err);
            return NextResponse.redirect(new URL("/login", req.url), { headers: req.headers });
        }
    }

    // ✅ Redirect authenticated users away from public routes
    if (isUserAuthenticated && userPublicRoutes.includes(currentPath)) {
        return NextResponse.redirect(new URL("/", req.url), { headers: req.headers });
    }

    // ✅ Protect user routes
    if (userProtectedRoutes.includes(currentPath) && !isUserAuthenticated) {
        return NextResponse.redirect(new URL("/login", req.url), { headers: req.headers });
    }

    return NextResponse.next();
}

// ✅ Apply middleware to all pages
export const config = {
    matcher: "/((?!_next|api|favicon.ico).*)", // Prevents middleware from running on Next.js internals
};
