import { NextRequest, NextResponse } from "next/server";
import { userMiddleware } from "./src/middleware/userMiddleware";
import { companyMiddleware } from "./src/middleware/companyMiddleware";
import { adminMiddleware } from "./src/middleware/adminMiddleware";
console.error("HIIIII  FRoommmyy fht YYYSSSSRRRRRRR ");


export function middleware(req: NextRequest) {
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