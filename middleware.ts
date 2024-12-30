// import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// export function middleware(req: NextRequest) {
//     const token = req.cookies.get("token")?.value;

//     // Decode the token
//     let decodedToken: { userRole?: string } | null = null;
//     if (token) {
//         try {
//             decodedToken = jwt.decode(token) as { userRole?: string };
//         } catch (err) {
//             console.error("Error decoding token:", err);
//         }
//     }

//     const userRole = decodedToken?.userRole;
//     console.log("User Role :", userRole);

//     // Define route groups
//     const publicRoutes = ["/login", "/signup", "/verifymail", "/checkmail", "/forgotpassword"];
//     const userRoutes = ["/profile"];
//     const companyPublic = ["/company/login", "/company/register"];
//     const companyProtected = ["/company/dashboard", "/company/register-turf"];
//     const adminPublic = ["/admin/login"];
//     const adminProtected = ["/admin/dashboard"];

//     const currentPath = req.nextUrl.pathname;

//     console.log("Heeelllooo from the mIddleWare ::");


//     // Handle routing if no token
//     if (!token) {
//         console.warn(`Unauthorized access attempt to ${currentPath}. Redirecting.`);
//         if (userRoutes.includes(currentPath)) {
//             return NextResponse.redirect(new URL("/login", req.url));
//         }
//         if (companyProtected.includes(currentPath)) {
//             return NextResponse.redirect(new URL("/company/login", req.url));
//         }
//         if (adminProtected.includes(currentPath)) {
//             return NextResponse.redirect(new URL("/admin/login", req.url));
//         }
//     }

//     // Handle routes based on user role
//     if (token && userRole) {
//         if (userRole === "user" && !userRoutes.includes(currentPath)) {
//             return NextResponse.redirect(new URL("/profile", req.url));
//         }
//         if (userRole === "company" && companyPublic.includes(currentPath)) {
//             return NextResponse.redirect(new URL("/company/dashboard", req.url));
//         }
//         if (userRole === "admin" && adminPublic.includes(currentPath)) {
//             return NextResponse.redirect(new URL("/admin/dashboard", req.url));
//         }
//     }

//     // Default to allowing request
//     return NextResponse.next();
// }

// export const config = {
//     matcher: [
//         "/login",
//         "/signup",
//         "/verifymail",
//         "/checkmail",
//         "/forgotpassword",
//         "/profile",
//         "/company/login",
//         "/company/register",
//         "/company/dashboard",
//         "/admin/login",
//         "/admin/dashboard",
//     ],
// };


import { NextRequest, NextResponse } from "next/server";
import { userMiddleware } from "./middleware/userMiddleware";
import { companyMiddleware } from "./middleware/companyMiddleware";
import { adminMiddleware } from "./middleware/adminMiddleware";

export function middleware(req: NextRequest) {
    const currentPath = req.nextUrl.pathname;
    const token = req.cookies.get("token")?.value;
    const decodedToken = token ? JSON.parse(Buffer.from(token.split(".")[1], "base64").toString()) : undefined;
    const userRole = decodedToken?.userRole;
    console.log("USUUUSERERERERE ROOOOOOLLLLLEEE  ::: ", userRole);


    // Define route groups
    const userRoutes = ["/profile"];
    const companyRoutes = ["/company/dashboard", "/company/register-turf"];
    const adminRoutes = ["/admin/dashboard"];

    // Delegate to role-specific middleware
    if (userRoutes.some((route) => currentPath.startsWith(route))) {
        return userMiddleware(req);
    }
    if (companyRoutes.some((route) => currentPath.startsWith(route))) {
        return companyMiddleware(req);
    }
    if (adminRoutes.some((route) => currentPath.startsWith(route))) {
        return adminMiddleware(req);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/profile",
        "/company/dashboard",
        "/company/register-turf",
        "/admin/dashboard",
    ],
};
