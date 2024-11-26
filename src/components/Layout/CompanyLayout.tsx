import React from "react";
// import SideBar from "../admin/sidebar";
// import AdminHeader from "../admin/AdminHeader";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden">
            {/* <SideBar /> */}
            <div className="flex flex-col w-full overflow-auto">
                {/* <AdminHeader /> */}
                <div className="bg-[#F3F4F8] min-h-[calc(100vh-64px)] rounded-md p-5 overflow-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}