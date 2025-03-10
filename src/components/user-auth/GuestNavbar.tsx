"use client"
import { useAppSelector } from "@/store/hooks";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    FiHome,
    FiGrid,
    FiMenu,
    FiX,
} from "react-icons/fi";
import Image from "next/image";

const GuestNavbar: React.FC = () => {
    const user = useAppSelector(state => state.users)
    const router = useRouter()
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleNavigation = (route: string) => {
        router.push(route);
        setIsMenuOpen(false); // Close the menu after navigation
    };

    return (
        <nav className="bg-gray-100 shadow-md relative">
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
                {/* Logo Section */}
                <div className="flex items-center space-x-4 cursor-pointer">
                    <div
                        className="h-10 w-10 rounded-md shadow-md cursor-pointer"
                        onClick={() => router.replace("/")}
                    >
                        <Image
                            src="/logo.jpeg"
                            alt="Turf Booking Logo"
                            width={40}
                            height={40}
                            className="rounded-md"
                        />
                    </div>
                    <span className="font-bold text-2xl text-green-700 tracking-wide">
                        Turf Booking {user?.user?.name}
                    </span>
                </div>

                {/* Hamburger Menu for Mobile */}
                <div className="lg:hidden">
                    <button onClick={toggleMenu}>
                        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>

                {/* Desktop Navigation Tabs */}
                <ul className="hidden lg:flex lg:items-center lg:space-x-8 text-sm font-medium">
                    {[
                        { icon: <FiHome size={20} />, label: "Home", route: "/" },
                        { icon: <FiGrid size={20} />, label: "Turfs", route: "/turfs" },
                    ].map((item, index) => (
                        <li key={index} className="relative group" onClick={() => handleNavigation(item.route)}>
                            <span className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition duration-200 cursor-pointer">
                                {item.icon}
                                <span>{item.label}</span>
                            </span>
                            <span className="absolute left-0 right-0 h-0.5 bg-green-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                        </li>
                    ))}
                </ul>

                {/* Desktop Button Section */}
                <div className="hidden lg:flex items-center space-x-2">
                    <button className="bg-white text-green-800 font-medium py-1 px-3 rounded-full shadow hover:bg-gray-100 text-sm"
                        onClick={() => router.replace("/signup")}
                    >
                        Register
                    </button>
                    <button className="bg-white text-green-800 font-medium py-1 px-3 rounded-full shadow hover:bg-gray-100 text-sm"
                        onClick={() => router.replace("/login")}
                    >
                        Sign In
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-16 left-0 right-0 bg-gray-100 z-50 shadow-lg">
                    {/* Mobile Navigation Tabs */}
                    <ul className="text-sm font-medium">
                        {[
                            { icon: <FiHome size={20} />, label: "Home", route: "/" },
                            { icon: <FiGrid size={20} />, label: "Turfs", route: "/turfs" },
                        ].map((item, index) => (
                            <li key={index} className="relative group" onClick={() => handleNavigation(item.route)}>
                                <span className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition duration-200 cursor-pointer p-4">
                                    {item.icon}
                                    <span>{item.label}</span>
                                </span>
                                <span className="absolute left-0 right-0 h-0.5 bg-green-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                            </li>
                        ))}
                    </ul>

                    {/* Mobile Buttons */}
                    <div className="p-4 border-t border-gray-200">
                        <button className="w-full bg-white text-green-800 font-medium py-2 px-4 rounded-full shadow hover:bg-gray-100 text-sm mb-2"
                            onClick={() => handleNavigation("/signup")}
                        >
                            Register
                        </button>
                        <button className="w-full bg-white text-green-800 font-medium py-2 px-4 rounded-full shadow hover:bg-gray-100 text-sm"
                            onClick={() => handleNavigation("/login")}
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default GuestNavbar;