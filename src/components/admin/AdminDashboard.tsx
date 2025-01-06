"use client";

import React from "react";
import Sidebar from "./SideBar";
import Image from "next/image";


const AdminDashboard: React.FC = () => {

    // Function to handle tab click and set active tab
    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Sidebar */}
            <div className="flex">
                <Sidebar />

                {/* Main Content */}
                <main className="flex-1 p-8">
                    {/* Header */}
                    <header className="bg-yellow-100 p-6 rounded-lg shadow-md flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800">Welcome, Admin!</h2>
                            <p className="text-gray-600">Here&apos;s our operation statistic report</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Image
                                src="/admin-avatar.png"
                                alt="Admin Avatar"
                                className="h-16 w-16 rounded-full border-2 border-green-600"
                                width={64} // Specify the width explicitly
                                height={64} // Specify the height explicitly
                                priority // Optional: If this image is critical for the page load
                            />
                            <div>
                                <p className="text-xl font-medium text-gray-700">Admin Tester</p>
                                <p className="text-sm text-gray-500">Admin</p>
                            </div>
                        </div>
                    </header>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-4 gap-6 mt-6">
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <h3 className="text-lg font-semibold text-gray-600">Total Users</h3>
                            <p className="text-2xl font-bold text-green-700">205</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <h3 className="text-lg font-semibold text-gray-600">Total Revenue</h3>
                            <p className="text-2xl font-bold text-green-700">$3,43,700</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <h3 className="text-lg font-semibold text-gray-600">Completed Bookings</h3>
                            <p className="text-2xl font-bold text-green-700">105</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <h3 className="text-lg font-semibold text-gray-600">Pending Bookings</h3>
                            <p className="text-2xl font-bold text-green-700">55</p>
                        </div>
                    </div>

                    {/* Graph Section */}
                    <div className="bg-white p-8 mt-8 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            Booking Response
                        </h3>
                        {/* Graph Placeholder */}
                        <div className="h-64 flex justify-center items-center">
                            <p className="text-gray-500">Graph goes here...</p>
                        </div>
                    </div>
                </main>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-4">
                <div className="container mx-auto text-center">
                    <p>© 2024 Turf Booking. All rights reserved.</p>
                    <p>
                        <a href="/terms" className="underline">
                            Terms & Conditions
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default AdminDashboard;
