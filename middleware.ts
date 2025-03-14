import { NextRequest, NextResponse } from "next/server";
import { userMiddleware } from "@/middleware/userMiddleware"; // Import user-specific middleware

export function middleware(req: NextRequest) {
    // Call userMiddleware and return response if it handles the request
    const userResponse = userMiddleware(req);
    if (userResponse) return userResponse;

    return NextResponse.next();
}

// ✅ Apply middleware to all pages
export const config = {
    matcher: "/:path*",
};
