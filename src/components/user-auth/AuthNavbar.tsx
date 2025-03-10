"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const AuthNavbar: React.FC = () => {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false); // ✅ Manage menu state

    return (
        <nav className="bg-green-800 h-16 flex items-center justify-between px-6 relative">
            {/* Logo Section */}
            <div className="flex items-center cursor-pointer">
                <Image
                    src="/logo.jpeg"
                    alt="Logo"
                    width={48}
                    height={48}
                    style={{ objectFit: "contain" }}
                    priority
                />
                <span className="text-white text-md font-bold ml-2">Turf Booking</span>
            </div>

            {/* Hamburger Menu (Mobile) */}
            <button
                className="sm:hidden text-white focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            {/* Links Section (Mobile & Desktop) */}
            <div
                className={`${isOpen ? "fixed top-16 left-0 w-full bg-green-800 shadow-md z-50 flex flex-col items-center space-y-4 py-4" : "hidden"
                    } sm:relative sm:top-0 sm:w-auto sm:bg-transparent sm:flex sm:space-x-6 sm:shadow-none`}
            >
                <ul className="flex flex-col sm:flex-row sm:space-x-6">
                    <li>
                        <Link
                            href="/"
                            className="text-white text-sm font-medium hover:text-yellow-400"
                            onClick={() => setIsOpen(false)}
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/turfs"
                            className="text-white text-sm font-medium hover:text-yellow-400"
                            onClick={() => setIsOpen(false)}
                        >
                            Discover
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Button Section */}
            <div className="hidden sm:flex items-center space-x-2">
                <button
                    className="bg-white text-green-800 font-medium py-1 px-3 rounded-full shadow hover:bg-gray-100 text-sm"
                    onClick={() => router.replace("/signup")}
                >
                    Register
                </button>
                <button
                    className="bg-white text-green-800 font-medium py-1 px-3 rounded-full shadow hover:bg-gray-100 text-sm"
                    onClick={() => router.push("/login")}
                >
                    Sign In
                </button>
            </div>
        </nav>
    )
}

export default AuthNavbar;
