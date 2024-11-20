"use client"
import React from "react";
import {
    FiHome,
    FiGrid,
    FiMessageSquare,
    FiBell,
    FiUser,
    FiHeart,
    FiLogOut,
} from "react-icons/fi";

const Navbar: React.FC = () => {
    return (
        <nav className="bg-gray-100 shadow-md">
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
                {/* Logo Section */}
                <div className="flex items-center space-x-4">
                    <img
                        src="/logo.jpeg"
                        alt="Turf Booking Logo"
                        className="h-10 w-10 rounded-md shadow-md"
                    />
                    <span className="font-bold text-2xl text-green-700 tracking-wide">
                        Turf Booking
                    </span>
                </div>

                {/* Navigation Tabs */}
                <ul className="flex items-center space-x-8 text-sm font-medium">
                    {[
                        { icon: <FiHome size={20} />, label: "Home" },
                        { icon: <FiGrid size={20} />, label: "Turfs" },
                        { icon: <FiHeart size={20} />, label: "Favourite Turf" },
                        { icon: <FiMessageSquare size={20} />, label: "Messages" },
                        { icon: <FiBell size={20} />, label: "Notification" },
                        { icon: <FiUser size={20} />, label: "MyBookings" },
                    ].map((item, index) => (
                        <li key={index} className="relative group">
                            <span className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition duration-200 cursor-pointer">
                                {item.icon}
                                <span>{item.label}</span>
                            </span>
                            <span className="absolute left-0 right-0 h-0.5 bg-green-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                        </li>
                    ))}
                </ul>

                {/* Account Section */}
                <div className="flex items-center space-x-6">
                    {/* Profile Icon */}
                    <img
                        src="/profile-icon.png"
                        alt="Profile"
                        className="h-10 w-10 rounded-full border-2 border-gray-300 shadow-md transition-transform transform hover:scale-110"
                    />

                    {/* Logout Button */}
                    <button
                        className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 shadow-md transition duration-200"
                        onClick={() => alert("Logged out successfully")}
                    >
                        <FiLogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;