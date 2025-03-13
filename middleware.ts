import { NextRequest, NextResponse } from "next/server";
// import { userMiddleware } from "./src/middleware/userMiddleware";
// import { companyMiddleware } from "./src/middleware/companyMiddleware";
// import { adminMiddleware } from "./src/middleware/adminMiddleware";
console.error("HIIIII  FRoommmyy fht YYYSSSSRRRRRRR ");


export async function middleware(req: NextRequest) {
    const currentPath = req.nextUrl.pathname;

    if (currentPath.startsWith("/admin")) {
        return adminMiddleware(req);
    }
    if (currentPath.startsWith("/company")) {
        return companyMiddleware(req);
    }
    if (currentPath.startsWith("/profile") ||
        currentPath.startsWith("/my-bookings") ||
        currentPath.startsWith("/my-wallet") ||
        currentPath.startsWith("/messages") ||
        currentPath.startsWith("/bookingSuccess") ||
        currentPath.startsWith("/login") ||
        currentPath.startsWith("/signup") ||
        currentPath.startsWith("/verifymail") ||
        currentPath.startsWith("/checkmail") ||
        currentPath.startsWith("/forgotpassword")) {
        return userMiddleware(req);
    }

    return NextResponse.next();
}




//////////// User Middleware //////////////

export const userPublicRoutes = ["/login", "/signup", "/verifymail", "/checkmail", "/forgotpassword"];
export const userProtectedRoutes = ["turfbooking.online/profile", "/profile", "turfbooking.online/my-bookings", "/my-bookings", "/my-wallet", "/messages", "/bookingSuccess"];
function userMiddleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    console.log("Token in the UserMiddleware :", token);

    const currentPath = req.nextUrl.pathname;

    let isUserAuthenticated = false;

    // ✅ Decode token and verify user role **only if token exists**
    if (token) {
        try {
            const decodedToken = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
            console.log("This is DeCODEd TOk :", decodedToken);

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



///////////// Company Middleware //////////////
export const companyPublicRoutes = ["/company/login", "/company/register", "/company/verifymail", "/checkmail"];
export const companyProtectedRoutes = [
    "/company/dashboard",
    "/company/profile",
    "/company/messages",
    "/company/register-turf",
    "/company/turf-management",
    "/company/slot-management",
    "/company/sales-report"
];

function companyMiddleware(req: NextRequest) {
    const token = req.cookies.get("CompanyToken")?.value;
    const currentPath = req.nextUrl.pathname;

    let isCompanyUser = false;

    if (token) {
        try {
            const decodedToken = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
            isCompanyUser = decodedToken?.userRole === "company";
        } catch (err) {
            console.error("Error decoding token:", err);
            return NextResponse.redirect(new URL("/company/login", req.url));
        }
    }

    // ✅ Fix: Use exact match to prevent partial route mismatches
    if (isCompanyUser && companyPublicRoutes.includes(currentPath)) {
        return NextResponse.redirect(new URL("/company/dashboard", req.url));
    }

    if (companyProtectedRoutes.includes(currentPath) && !isCompanyUser) {
        return NextResponse.redirect(new URL("/company/login", req.url));
    }

    return NextResponse.next();
}



/////////////// Admin Middleware ////////////////
export const adminPublicRoutes = ["/admin/login"];
export const adminProtectedRoutes = [
    "/admin/dashboard",
    "/admin/user-management",
    "/admin/registered-companies",
    "/admin/approved-companies",
    "/admin/sales-report",
    "/admin/subscription-management",
    "/admin/sales-report"
];

export function adminMiddleware(req: NextRequest) {
    const token = req.cookies.get("AdminToken")?.value;
    const currentPath = req.nextUrl.pathname;

    let isAdminUser = false;

    // ✅ Decode token and verify admin role before checking routes
    if (token) {
        try {
            const decodedToken = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
            isAdminUser = decodedToken?.userRole === "admin";
        } catch (err) {
            console.error("Error decoding token:", err);
            return NextResponse.redirect(new URL("/admin/login", req.url));
        }
    }

    // ✅ If the user is authenticated and on a **public route**, redirect to `/admin/dashboard`
    if (isAdminUser && adminPublicRoutes.some((route) => currentPath.startsWith(route))) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    // ✅ If the user is on a **protected route**
    if (adminProtectedRoutes.some((route) => currentPath.startsWith(route))) {
        // ❌ If not logged in or not an admin user, redirect to login
        if (!isAdminUser) {
            return NextResponse.redirect(new URL("/admin/login", req.url));
        }
    }

    // ✅ Allow access for all other requests
    return NextResponse.next();
}