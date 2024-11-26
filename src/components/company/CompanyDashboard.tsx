import React from 'react';

interface CompanyDashboardProps {
    // Add any necessary props here, e.g., user data, company details, etc.
}

const CompanyDashboard: React.FC<CompanyDashboardProps> = ({ /* props */ }) => {
    return (
        <div className="min-h-screen bg-green-50 flex">
            {/* Sidebar */}
            <div className="bg-green-500 w-64 p-6">
                <div className="mb-6">
                    <img src="/logo.jpeg" alt="Logo" className="w-24 h-24" />
                    <h2 className="text-white text-xl font-bold">Kowai Arena</h2>
                </div>
                <nav>
                    <ul>
                        <li className="text-white text-lg py-2 hover:bg-green-600">Dashboard</li>
                        <li className="text-white text-lg py-2 hover:bg-green-600">Manage Turfs</li>
                        <li className="text-white text-lg py-2 hover:bg-green-600">Bookings</li>
                        <li className="text-white text-lg py-2 hover:bg-green-600">Reports</li>
                        <li className="text-white text-lg py-2 hover:bg-green-600">Settings</li>
                    </ul>
                </nav>
                <button className="bg-white text-green-500 hover:bg-green-600 text-lg font-bold py-2 px-4 rounded-md mt-6 w-full">
                    Logout
                </button>
            </div>


            {/* Main Content */}
            <div className="flex-1 p-8">
                <h1 className="text-3xl font-bold text-green-700 mb-4">Dashboard</h1>

                {/* Note about Company Registration */}
                <div className="bg-yellow-100 p-4 rounded-md mb-6">
                    <p className="text-lg text-yellow-800 font-semibold">
                        Admin is working on your company registration process. Soon we will be updating and come back to you.
                    </p>
                </div>

                {/* Dashboard Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-md shadow-lg">
                        <h2 className="text-lg font-bold text-gray-800 mb-2">Total Revenue</h2>
                        <p className="text-gray-700">₹10,000</p>
                    </div>
                    <div className="bg-white p-6 rounded-md shadow-lg">
                        <h2 className="text-lg font-bold text-gray-800 mb-2">Total Bookings</h2>
                        <p className="text-gray-700">50</p>
                    </div>
                    <div className="bg-white p-6 rounded-md shadow-lg">
                        <h2 className="text-lg font-bold text-gray-800 mb-2">Active Users</h2>
                        <p className="text-gray-700">100</p>
                    </div>
                </div>

                {/* Add more content here, such as charts, tables, and other relevant information */}
            </div>
        </div>
    );
};

export default CompanyDashboard;
