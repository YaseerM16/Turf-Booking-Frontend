import { NextRequest, NextResponse } from "next/server";

export const userPublicRoutes = ["/login", "/signup", "/verifymail", "/checkmail", "/forgotpassword"];
export const userProtectedRoutes = ["/profile", "/my-bookings", "/my-wallet", "/messages", "/bookingSuccess"];

export function userMiddleware(req: NextRequest) {
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
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    // ✅ Redirect authenticated users away from public routes
    if (isUserAuthenticated && userPublicRoutes.includes(currentPath)) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // ✅ Protect user routes
    if (userProtectedRoutes.includes(currentPath) && !isUserAuthenticated) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}
