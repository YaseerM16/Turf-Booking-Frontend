import { NextRequest, NextResponse } from "next/server";

// Define public and protected routes
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

export function companyMiddleware(req: NextRequest) {
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


