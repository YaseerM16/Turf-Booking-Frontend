import { NextRequest, NextResponse } from "next/server";

export const adminPublicRoutes = ["/admin/login"];
export const adminProtectedRoutes = [
    "/admin/dashboard",
    "/admin/user-management",
    "/admin/registered-companies",
    "/admin/approved-companies",
    "/admin/sales-report",
    "/admin/subscription-management",
];

export function adminMiddleware(req: NextRequest) {
    const token = req.cookies.get("AdminToken")?.value;
    const currentPath = req.nextUrl.pathname;

    let isAdminUser = false;

    if (token) {
        try {
            const decodedToken = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
            isAdminUser = decodedToken?.userRole === "admin";
        } catch (err) {
            console.error("Error decoding token:", err);
            return NextResponse.redirect(new URL("/admin/login", req.url));
        }
    }

    // ✅ Fix: Use `includes()` for exact match
    if (isAdminUser && adminPublicRoutes.includes(currentPath)) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    if (adminProtectedRoutes.includes(currentPath) && !isAdminUser) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    return NextResponse.next();
}
