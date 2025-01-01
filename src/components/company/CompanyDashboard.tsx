"use client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCompany } from "@/store/slices/CompanySlice";
import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./CompanyHeader";
import Sidebar from "./CompanySidebar";


const CompanyDashboard: React.FC = () => {
    // const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    // const router = useRouter();
    const company = useAppSelector((state) => state.companies);

    useEffect(() => {
        const storedCompany = localStorage.getItem("companyAuth");
        if (storedCompany) {
            dispatch(setCompany(JSON.parse(storedCompany)));
        }
    }, [dispatch]);


    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            <div className="flex min-h-screen">
                {/* Sidebar */}
                <Sidebar />
                <div className="flex-1 p-6 bg-gray-100">
                    {/* Header */}
                    <Header />
                    {/* Dashboard Statistics */}
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        {company?.company?.isApproved ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-green-100 shadow-md p-4 rounded-md border-t-4 border-green-500">
                                    <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
                                    <p className="text-gray-500 mt-2 text-xl font-bold">₹10,000</p>
                                </div>
                                <div className="bg-green-100 shadow-md p-4 rounded-md border-t-4 border-green-500">
                                    <h3 className="text-lg font-semibold text-gray-700">Total Bookings</h3>
                                    <p className="text-gray-500 mt-2 text-xl font-bold">50</p>
                                </div>
                                <div className="bg-green-100 shadow-md p-4 rounded-md border-t-4 border-green-500">
                                    <h3 className="text-lg font-semibold text-gray-700">Active Users</h3>
                                    <p className="text-gray-500 mt-2 text-xl font-bold">100</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-md shadow-md">
                                <p className="text-yellow-800 text-lg font-semibold">
                                    Your company is awaiting approval. Please check back later!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Footer */}
            <footer className="bg-green-700 text-white text-center py-4 mt-auto">
                <p className="text-sm">© 2024 Turf Booking. All rights reserved.</p>
            </footer>
        </>
    );
};

export default CompanyDashboard;
