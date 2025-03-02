import { NextRequest, NextResponse } from "next/server";

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
