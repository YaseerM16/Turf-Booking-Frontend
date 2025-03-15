"use client";
import React, { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DatePicker from "react-datepicker";
import Pagination from "../Pagination";
import Sidebar from "./SideBar";
import { getLastMonthRevenues, getRevenuesByDateRange } from "@/services/adminApi";
import FireLoading from "../FireLoading";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";


interface Revenue {
    companyId: string;
    companyEmail: string;
    companyName: string;
    companyPhone: number;
    totalBookings: number;
    totalRevenue: number;
    _id: string;
    date: string
}


const SalesReport: React.FC = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    // const [spinLoading, setSpinLoading] = useState<boolean>(false)
    const [revenues, setRevenues] = useState<Revenue[] | []>([])
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalRevenues, setTotalRevenues] = useState<number | null>(10)

    const [fromDateError, setFromDateError] = useState<string | null>(null);
    const [toDateError, setToDateError] = useState<string | null>(null);
    const revenuesPerPage = 6

    useEffect(() => {
        const token = Cookies.get("AdminToken"); // Replace 'authToken' with your actual cookie name

        if (!token) {
            router.push("/admin/login"); // Redirect to login if token is missing
        }
    }, []);


    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const [isFiltered, setIsFiltered] = useState(false); // Track if date filter is applied

    const fetchRevenues = useCallback(async () => {
        try {
            if (isFiltered) return; // Don't fetch general revenues if filter is applied
            setLoading(true);
            const response = await getLastMonthRevenues(currentPage, revenuesPerPage);
            if (response.success) {
                const { data } = response;
                const { revenues } = data;
                console.log("Revenues Success:", response.data);
                setRevenues(revenues.revenues);
                setTotalRevenues(Math.ceil(response.data.revenues.totalRevenues / revenuesPerPage));
            }
        } catch (err: unknown) {
            handleFetchError(err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, revenuesPerPage, isFiltered]); // Depend on isFiltered

    const fetchRevenueByRanges = useCallback(async (fromDate: Date | null, toDate: Date | null, currentPge: number) => {
        try {
            // console.log("CUren");

            setFromDateError(null);
            setToDateError(null);
            if (!fromDate || !toDate) {
                if (!fromDate) setFromDateError("Provide the From Date");
                if (!toDate) setToDateError("Provide the To Date");
                return;
            }

            setLoading(true);
            const response = await getRevenuesByDateRange(fromDate, toDate, currentPge, revenuesPerPage);
            if (response.success) {
                const { data } = response;
                const { result } = data;
                setRevenues(result.revenues);
                console.log("Resultants:", result.revenues);
                setTotalRevenues(Math.ceil(response.data.result.totalRevenues / revenuesPerPage));
                setIsFiltered(true); // Set filter mode
            }
        } catch (err: unknown) {
            handleFetchError(err);
        } finally {
            setLoading(false);
        }
    }, [])

    const handleFetchError = (err: unknown) => {
        console.log("Error fetching data:", err);
        if (err instanceof Error) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Error!",
                text: err?.message || "Something went wrong. Please try again.",
                showConfirmButton: true,
                confirmButtonText: "OK",
                timer: 3000,
                toast: true,
            });
        }
    };

    useEffect(() => {
        if (isFiltered) {
            fetchRevenueByRanges(fromDate, toDate, currentPage); // Fetch filtered data when paginating
        } else {
            fetchRevenues(); // Fetch general revenues when paginating
        }
    }, [currentPage, isFiltered, fetchRevenueByRanges, fetchRevenues]); // Depend only on `currentPage` to avoid unnecessary triggers


    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Sales Report", 14, 10);

        const tableData = revenues.map((rev) => [
            rev.date,
            rev.totalBookings,
            `₹${rev.totalRevenue}`,
        ]);

        autoTable(doc, { // ✅ Correct autoTable usage
            head: [["Date", "Total Bookings", "Revenue (Rs.)"]],
            body: tableData,
            startY: 20,
        });

        doc.save("Sales_Report.pdf");
    };

    return (
        <>
            <div className="flex h-screen">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* <Header /> */}
                    <header className="bg-yellow-100 p-6 rounded-lg shadow-md">
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Sales Report
                        </h1>
                        <p className="text-gray-600">
                            List of companies Approved in the system
                        </p>
                    </header>
                    <div className="bg-gray-100 flex-1 overflow-y-auto">
                        <div className="bg-white p-3 rounded-lg shadow-md">
                            <div className="flex justify-between items-center mb-4">
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                    📊 Revenue Overview
                                </h3>
                                <p className="text-gray-600 text-sm">Here is the list of your last <span className="font-medium text-blue-600">30 days</span> revenue details.</p>
                            </div>
                            {/* Filter Section */}
                            <div className="flex flex-col space-y-3 p-4 border rounded-md bg-gray-50 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-800">Select Date Range for Revenue</h3>
                                <p className="text-sm text-gray-600">
                                    Choose a start date and an end date below, then click &ldquoApply&ldquo to view revenue data for the selected period.
                                </p>
                                <div className="flex items-center gap-2">
                                    <div className="d-flex flex-col">
                                        <DatePicker
                                            selected={fromDate}
                                            onChange={(date) => setFromDate(date)}
                                            placeholderText="From Date"
                                            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                        {/* Error message for fromTime */}
                                        {fromDateError && (
                                            <div className="text-red-500 text-sm mt-1">
                                                {fromDateError} {/* Display the error message here */}
                                            </div>
                                        )}
                                    </div>
                                    <div className="d-flex flex-col">
                                        <DatePicker
                                            selected={toDate}
                                            onChange={(date) => setToDate(date)}
                                            placeholderText="To Date"
                                            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                        {/* Error message for toTime */}
                                        {toDateError && (
                                            <div className="text-red-500 text-sm mt-1">
                                                {toDateError} {/* Display the error message here */}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition"
                                        onClick={() => fetchRevenueByRanges(fromDate, toDate, currentPage)}
                                    >
                                        Apply
                                    </button>
                                    <div className="flex justify-end">
                                        <button
                                            onClick={downloadPDF}
                                            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700"
                                        >
                                            Download PDF
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {loading ? (
                                // <p className="text-center text-gray-500">Loading...</p>
                                <FireLoading renders="Fetching reports" />
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse border border-gray-300">
                                        <thead>
                                            <tr className="bg-green-600 text-white">
                                                <th className="border border-gray-300 px-4 py-2">Day</th>
                                                <th className="border border-gray-300 px-4 py-2">Total Booking</th>
                                                <th className="border border-gray-300 px-4 py-2">Revenue (₹)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {revenues && revenues.length > 0 ? (
                                                revenues.map((rev, index) => (
                                                    <tr key={index} className="border border-gray-300 text-center">
                                                        <td className="border px-4 py-2">{rev.date}</td>
                                                        <td className="border px-4 py-2">{rev.totalBookings}</td>
                                                        <td className="border px-4 py-2">Rs.{rev.totalRevenue}</td>
                                                        {/* <td className="border px-4 py-2">
                                                            {rev.location.latitude.toFixed(3)}, {rev.location.longitude.toFixed(3)}
                                                        </td> */}
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={4} className="text-center py-4 text-gray-500">
                                                        No revenue data available.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Pagination */}
                    <div className="flex justify-center items-center py-4">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalRevenues!}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-green-700 text-white py-4">
                <div className="container mx-auto text-center">
                    <p className="text-sm">© 2024 Turf Booking. All rights reserved.</p>
                </div>
            </footer>
        </>
    );


};

export default SalesReport;
