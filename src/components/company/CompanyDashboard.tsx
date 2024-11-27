"use client";
import { useAppSelector } from "@/store/hooks";
import React from "react";

const CompanyDashboard: React.FC = () => {
    const company = useAppSelector((state) => state.companies.company);
    console.log("Verified:", company?.isVerified);

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <aside className="bg-green-600 w-64 flex flex-col justify-between">
                <div>
                    {/* Logo and App Name */}
                    <div className="flex items-center space-x-4 p-6">
                        <img
                            src="/logo.jpeg"
                            alt="Turf Logo"
                            className="w-14 h-14 rounded-full"
                        />
                        <h2 className="text-white font-semibold text-2xl">Turf Booking</h2>
                    </div>

                    <nav className="mt-6">
                        <ul className="space-y-2">
                            <li className="text-white py-3 px-6 bg-green-700 rounded-md shadow-md hover:bg-green-800">
                                Dashboard
                            </li>
                            {company?.isApproved ? (
                                <>
                                    <li className="text-white py-3 px-6 hover:bg-green-700 rounded-md">
                                        Bookings
                                    </li>
                                    <li className="text-white py-3 px-6 hover:bg-green-700 rounded-md">
                                        Turf Management
                                    </li>
                                    <li className="text-white py-3 px-6 hover:bg-green-700 rounded-md">
                                        Company Profile
                                    </li>
                                    <li className="text-white py-3 px-6 hover:bg-green-700 rounded-md">
                                        Messages
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="text-gray-400 py-3 px-6 bg-gray-300 rounded-md cursor-not-allowed">
                                        Bookings
                                    </li>
                                    <li className="text-gray-400 py-3 px-6 bg-gray-300 rounded-md cursor-not-allowed">
                                        Turf Management
                                    </li>
                                    <li className="text-gray-400 py-3 px-6 bg-gray-300 rounded-md cursor-not-allowed">
                                        Company Profile
                                    </li>
                                    <li className="text-gray-400 py-3 px-6 bg-gray-300 rounded-md cursor-not-allowed">
                                        Messages
                                    </li>
                                </>
                            )}
                        </ul>
                    </nav>
                </div>

                {/* Logout Button */}
                <div className="p-6">
                    <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-md">
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-green-500 text-white py-4 px-6 flex items-center justify-between shadow-md">
                    <div className="flex">
                        <img
                            src={company?.profilePicture || "/logo.jpeg"}
                            alt="Logo"
                            className="w-12 h-12 mr-4 rounded-full"
                        />
                        <div>
                            <h1 className="text-2xl font-bold">
                                Welcome, {company?.companyname || "Company"}
                            </h1>
                            <p className="text-sm text-green-200">
                                Here is your company statistic report
                            </p>
                        </div>
                    </div>
                    <img
                        src="/turf-banner.jpeg"
                        alt="Turf Banner"
                        className="h-10 w-auto"
                    />
                </header>

                {/* Main Dashboard Content */}
                <main className="p-8">
                    {company?.isApproved ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="bg-white shadow-md p-6 rounded-lg border-t-4 border-green-500">
                                <h2 className="text-lg font-bold text-gray-700">Total Revenue</h2>
                                <p className="text-gray-500 mt-2 text-xl font-semibold">₹10,000</p>
                            </div>
                            <div className="bg-white shadow-md p-6 rounded-lg border-t-4 border-green-500">
                                <h2 className="text-lg font-bold text-gray-700">Total Bookings</h2>
                                <p className="text-gray-500 mt-2 text-xl font-semibold">50</p>
                            </div>
                            <div className="bg-white shadow-md p-6 rounded-lg border-t-4 border-green-500">
                                <h2 className="text-lg font-bold text-gray-700">Active Users</h2>
                                <p className="text-gray-500 mt-2 text-xl font-semibold">100</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md mb-6 shadow-md">
                            <p className="text-lg font-semibold">
                                Your company is not yet approved by the "Turf Booking"
                                application. The admin is working on it!
                            </p>
                        </div>
                    )}
                </main>

                {/* Footer */}
                <footer className="bg-green-700 text-white py-4 mt-auto">
                    <div className="container mx-auto text-center">
                        <p className="text-sm">© 2024 Turf Booking. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default CompanyDashboard;
