"use client";
import { useRouter } from "next/navigation";
import React from "react";

const AuthNavbar: React.FC = () => {
    const router = useRouter()
    return (
        <nav className="bg-green-800 h-16 flex items-center justify-between px-6">
            {/* Logo Section */}
            <div className="flex items-center cursor-pointer">
                <img
                    src="/logo.jpeg"
                    alt="Turf Logo"
                    className="h-12 w-12 object-cover rounded-md bg-white p-1 shadow-md"
                />
                <span className="text-white text-md font-bold ml-2">Turf Booking</span>
            </div>

            {/* Links Section */}
            <div className="flex items-center space-x-6">
                <a
                    href="/"
                    className="text-white text-xs font-medium hover:text-yellow-400"
                >
                    Home
                </a>
                <a
                    href="/turfs"
                    className="text-white text-xs font-medium hover:text-yellow-400"
                >
                    Discover
                </a>
            </div>

            {/* Button Section */}
            <div className="flex items-center space-x-2">
                <button className="bg-white text-green-800 font-medium py-1 px-3 rounded-full shadow hover:bg-gray-100 text-sm"
                    onClick={() => router.replace("/signup")}
                >
                    Register
                </button>
                <button className="bg-white text-green-800 font-medium py-1 px-3 rounded-full shadow hover:bg-gray-100 text-sm"
                    onClick={() => router.push("/login")}
                >
                    Sign In
                </button>
            </div>
        </nav>
    );
};

export default AuthNavbar;
