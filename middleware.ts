import { NextRequest, NextResponse } from "next/server";
import { userMiddleware } from "./src/middleware/userMiddleware";
import { companyMiddleware } from "./src/middleware/companyMiddleware";
import { adminMiddleware } from "./src/middleware/adminMiddleware";
console.error("HIIIII  FRoommmyy fht YYYSSSSRRRRRRR ");
console.error("HIIIII  FRoommmyy fht YYYSSSSRRRRRRR ");


export function middleware(req: NextRequest) {
    const currentPath = req.nextUrl.pathname;
    const userRoutes = [
        "/profile",
        "/my-bookings",
        "/my-wallet",
        "/messages",
        "/bookingSuccess",
        "/login",
        "/signup",
        "/verifymail",
        "/checkmail",
        "/forgotpassword",
    ];

    if (currentPath.startsWith("/admin")) {
        return adminMiddleware(req);
    }
    if (currentPath.startsWith("/company")) {
        return companyMiddleware(req);
    }
    if (userRoutes.includes(currentPath)) {
        return userMiddleware(req);
    }

    return NextResponse.next();
}