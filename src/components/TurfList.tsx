import React from "react";

const TurfList = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Search Bar */}
            <div className="bg-white shadow p-4 sticky top-0 z-10">
                <div className="container mx-auto flex justify-center items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search Turf/Location/Rate"
                        className="w-2/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700">
                        Search
                    </button>
                </div>
            </div>

            {/* Filters Sidebar */}
            <div className="flex">
                <div className="container mx-auto mt-6 grid grid-cols-4 gap-4">
                    <aside className="col-span-1 bg-white p-4 rounded-lg shadow-md max-w-[70%]">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Filters</h2>

                        {/* Type Filter */}
                        <div className="mb-4">
                            <h3 className="text-gray-600 font-medium mb-2">Type</h3>
                            <div className="space-y-2">
                                <label className="flex items-center text-sm text-gray-600">
                                    <input type="checkbox" className="mr-2" />
                                    Open
                                </label>
                                <label className="flex items-center text-sm text-gray-600">
                                    <input type="checkbox" className="mr-2" />
                                    Indoor
                                </label>
                            </div>
                        </div>

                        {/* Price Filter */}
                        <div className="mb-4">
                            <h3 className="text-gray-600 font-medium mb-2">Price</h3>
                            <div className="space-y-2">
                                <label className="flex items-center text-sm text-gray-600">
                                    <input type="checkbox" className="mr-2" />
                                    750 - 800
                                </label>
                                <label className="flex items-center text-sm text-gray-600">
                                    <input type="checkbox" className="mr-2" />
                                    1000 - 1200
                                </label>
                                <label className="flex items-center text-sm text-gray-600">
                                    <input type="checkbox" className="mr-2" />
                                    1200 - 1600
                                </label>
                            </div>
                        </div>

                        {/* Size Filter */}
                        <div>
                            <h3 className="text-gray-600 font-medium mb-2">Size</h3>
                            <div className="space-y-2">
                                <label className="flex items-center text-sm text-gray-600">
                                    <input type="checkbox" className="mr-2" />
                                    5s
                                </label>
                                <label className="flex items-center text-sm text-gray-600">
                                    <input type="checkbox" className="mr-2" />
                                    6s
                                </label>
                                <label className="flex items-center text-sm text-gray-600">
                                    <input type="checkbox" className="mr-2" />
                                    7s
                                </label>
                                <label className="flex items-center text-sm text-gray-600">
                                    <input type="checkbox" className="mr-2" />
                                    11s
                                </label>
                            </div>
                        </div>
                    </aside>

                    {/* Turf Cards */}
                    <main className="col-span-3 grid grid-cols-3 gap-4">
                        {/* Example Turf Card */}
                        {Array.from({ length: 9 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow transform hover:-translate-y-1"
                            >
                                <img
                                    src="https://via.placeholder.com/300x200"
                                    alt="Turf"
                                    className="rounded-t-lg w-full h-32 object-cover"
                                />
                                <div className="p-4 space-y-3">
                                    <h2 className="text-base font-semibold text-gray-800">Kovai Arena</h2>
                                    <p className="text-sm text-gray-600 flex items-center">
                                        <span className="material-icons text-green-600 mr-2">
                                            location_on
                                        </span>
                                        Ramanathapuram, Kovai
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center">
                                        <span className="material-icons text-green-600 mr-2">
                                            access_time
                                        </span>
                                        6 AM to 12 PM
                                    </p>
                                    <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </main>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6">
                <nav className="flex gap-2">
                    <button className="px-3 py-1 bg-green-600 text-white rounded">
                        Previous
                    </button>
                    <button className="px-3 py-1 bg-white border border-green-600 text-green-600 rounded">
                        1
                    </button>
                    <button className="px-3 py-1 bg-white border border-green-600 text-green-600 rounded">
                        2
                    </button>
                    <button className="px-3 py-1 bg-white border border-green-600 text-green-600 rounded">
                        3
                    </button>
                    <button className="px-3 py-1 bg-green-600 text-white rounded">
                        Next
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default TurfList;
