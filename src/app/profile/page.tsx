import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import React from 'react';

const ProfilePage = () => {
    return (
        <>
            <Navbar />
            <div className="bg-gray-100 p-10 m-6 flex items-center justify-center">
                <div className="bg-green-50 p-10 rounded-lg shadow-lg w-11/12 max-w-3xl">
                    Profile
                    <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6">
                        <div className="md:w-1/3 text-center">
                            <img
                                src="/profile-icon.png"
                                alt="Profile"
                                className="w-28 h-28 mx-auto rounded-full border-4 border-green-500"
                            />
                        </div>
                        <div className="md:w-2/3 w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value="Yaseer"
                                        className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value="Yaseer@EMAIL.COM"
                                        className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        value="8687987978"
                                        className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        readOnly
                                    />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md">
                                        Change Password
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 mb-6 flex justify-center">
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md shadow-lg">
                    Edit Profile
                </button>
            </div>
            <Footer />
        </>
    );
};

export default ProfilePage;
