import { NextRequest, NextResponse } from "next/server";

export function companyMiddleware(req: NextRequest) {
    const token = req.cookies.get("CompanyToken")?.value;
    const currentPath = req.nextUrl.pathname;

    // Define public and protected routes
    const companyPublic = ["/company/login", "/company/register"];
    const companyProtected = ["/company/dashboard", "/company/register-turf", "/company/turf-management", "/company/slot-management"];

    // Check if the request is for a protected route
    if (companyProtected.some((route) => currentPath.startsWith(route))) {
        // If no token is present, redirect to the company login page
        if (!token) {
            return NextResponse.redirect(new URL("/company/login", req.url));
        }

        // Decode token and verify company role
        try {
            const decodedToken = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
            const userRole = decodedToken?.userRole;

            // Redirect if the token does not have the 'company' role
            if (userRole !== "company") {
                return NextResponse.redirect(new URL("/company/login", req.url));
            }
        } catch (err) {
            console.error("Error decoding token:", err);
            // Redirect to login if the token is invalid
            return NextResponse.redirect(new URL("/company/login", req.url));
        }
    }

    // Allow access for public routes and all other requests
    return NextResponse.next();
}
