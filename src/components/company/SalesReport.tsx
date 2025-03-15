"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import Header from "./CompanyHeader";
import Sidebar from "./CompanySidebar";
import { getLastMonthRevenues, getRevenuesByInterval } from "@/services/companyApi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DatePicker from "react-datepicker";
import Pagination from "../Pagination";
import Table from "../Table";
import FireLoading from "../FireLoading";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";


interface Revenue {
    date: string;
    revenue: number;
    turfName: string;
    images: string[];
}
const SalesReport: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter()
    // const [spinLoading, setSpinLoading] = useState<boolean>(false)
    const [revenues, setRevenues] = useState<Revenue[] | []>([])
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalRevenues, setTotalRevenues] = useState<number | null>(10)
    const [summary, setSummary] = useState({ totalBookings: 0, totalRevenue: 0, totalTurfs: 0 });
    const [isFiltered, setIsFiltered] = useState<boolean>(false); // New state to track filtering


    const revenuesPerPage = 6


    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const company = useAppSelector((state) => state.companies.company);

    useEffect(() => {
        const token = Cookies.get("CompanyToken"); // Replace 'authToken' with your actual cookie name

        if (!token) {
            router.push("/company/login"); // Redirect to login if token is missing
        }
    }, []);

    const fetchRevenues = useCallback(async (companyId: string) => {
        if (isFiltered) return; // Prevent fetching when filtered
        try {
            // console.log("Company ID:", companyId);

            setLoading(true);
            const response = await getLastMonthRevenues(companyId, currentPage, revenuesPerPage);
            if (response.success) {
                const { data } = response
                const { revenues } = data
                console.log("Revenues Success:", revenues.totalTurfCount.totalTurfs);
                setSummary({
                    totalBookings: revenues.totalBookings,
                    totalRevenue: revenues.totalRevenue,
                    totalTurfs: revenues.totalTurfCount.totalTurfs
                });
                setRevenues(revenues.result);
                setTotalRevenues(prev => (prev !== Math.ceil(response.data.revenues.totalBookings / revenuesPerPage) ? Math.ceil(response.data.revenues.totalBookings / revenuesPerPage) : prev) || null)
            }
        } catch (err: unknown) {
            console.log("Error fetching revenues:", err);
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
        } finally {
            setLoading(false);
        }
    }, [currentPage])

    const fetchRevenueByRanges = useCallback(async () => {
        try {

            if (fromDate == null || toDate == null) {
                return
            }

            setLoading(true);
            setIsFiltered(true); // Set filtering state

            const response = await getRevenuesByInterval(company?._id as string, fromDate, toDate, currentPage, revenuesPerPage)

            if (response?.success) {
                const { data } = response
                const { revenues } = data
                const { details } = revenues
                // console.log("Total booking :", revenues.totalBookings);
                // console.log("Total revenues :", revenues.totalRevenue);
                console.log("Range Success:", revenues.totalTurfCount.totalTurfs);

                setSummary({
                    totalBookings: revenues.totalBookings,
                    totalRevenue: revenues.totalRevenue,
                    totalTurfs: revenues.totalTurfCount.totalTurfs
                });
                setRevenues(details)
                setTotalRevenues(prev => (prev !== Math.ceil(revenues.totalBookings / revenuesPerPage) ? Math.ceil(revenues.totalBookings / revenuesPerPage) : prev) || null)
            }
        } catch (err: unknown) {
            console.log("Error fetching Turfs [] data:", err);
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
        } finally {
            setLoading(false)
        }
    }, [fromDate, toDate, company?._id, currentPage])

    const downloadPDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(16);
        doc.text("Sales Report", 14, 10);

        // Date Range
        doc.setFontSize(12);
        doc.text(`From: ${fromDate ? fromDate.toLocaleDateString() : "N/A"}`, 14, 20);
        doc.text(`To: ${toDate ? toDate.toLocaleDateString() : "N/A"}`, 100, 20);

        // Summary Section
        doc.setFontSize(12);
        doc.text(`Total Bookings: ${summary.totalBookings}`, 14, 30);
        doc.text(`Total Revenue: ₹${summary.totalRevenue}`, 14, 40);
        doc.text(`Total Turfs: ${summary.totalTurfs}`, 14, 50);

        // Revenue Table
        const tableData = revenues.map((rev) => [
            rev.date,
            rev.turfName,
            `₹${rev.revenue}`,
        ]);

        autoTable(doc, {
            head: [["Date", "Turf Name", "Revenue (Rs.)"]],
            body: tableData,
            startY: 60, // Below summary
        });

        // Page Number
        doc.text(`Page: ${currentPage}`, 180, doc.internal.pageSize.height - 10);

        // Save PDF
        doc.save("Sales_Report.pdf");
    };


    // Reset filter when clearing date range
    const clearFilter = () => {
        setFromDate(null)
        setToDate(null)
        setIsFiltered(false);
        setCurrentPage(1); // Reset to first page
    };

    useEffect(() => {
        if (company?._id && !isFiltered) {
            fetchRevenues(company?._id as string);
        } else {
            fetchRevenueByRanges()
        }
    }, [company?._id, currentPage, fetchRevenues, isFiltered]);

    return (
        <>
            <div className="flex h-screen">
                {/* Sidebar */}
                <Sidebar />
                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    <Header />
                    <div className="bg-gray-100 flex-1 overflow-y-auto mx-3">
                        <div className="bg-white p-2 rounded-lg shadow-md">
                            <div className="flex justify-between items-center mb-4">
                                <h1 className="text-3xl font-semibold text-gray-800">Sales Report</h1>
                                <button
                                    onClick={downloadPDF}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700"
                                >
                                    Download PDF
                                </button>
                            </div>

                            {!fromDate && <p className="text-gray-600 text-lg">Here is the list of your last 30 days revenue details</p>}
                            {/* Filter & Summary Section */}
                            <div className="flex flex-col sm:flex-row items-start gap-4 w-full">

                                {/* Filter Section */}
                                <div className="flex flex-col gap-4 w-full sm:w-1/2 mt-5 bg-white p-4 rounded-xl shadow-md">
                                    <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                                        <DatePicker
                                            selected={fromDate}
                                            onChange={(date) => setFromDate(date)}
                                            placeholderText="From Date"
                                            className="w-full sm:w-auto px-4 py-2 border rounded-md text-sm"
                                        />
                                        <DatePicker
                                            selected={toDate}
                                            onChange={(date) => setToDate(date)}
                                            placeholderText="To Date"
                                            className="w-full sm:w-auto px-4 py-2 border rounded-md text-sm"
                                        />
                                        <button
                                            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                            onClick={fetchRevenueByRanges}
                                        >
                                            Apply
                                        </button>
                                        <button
                                            className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                                            onClick={clearFilter}
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>

                                {/* Summary Section */}
                                <div className="grid grid-cols-3 gap-3 w-full sm:w-1/2 bg-white p-2 mb-2 rounded-xl shadow-md">
                                    <div className="flex flex-col items-center justify-center bg-green-100 p-3 rounded-md shadow">
                                        <h3 className="text-base font-medium text-gray-700">Total Bookings</h3>
                                        <p className="text-xl font-bold text-green-600">{summary.totalBookings}</p>
                                    </div>
                                    <div className="flex flex-col items-center justify-center bg-yellow-100 p-3 rounded-md shadow">
                                        <h3 className="text-base font-medium text-gray-700">Total Revenue</h3>
                                        <p className="text-xl font-bold text-yellow-600">₹{summary.totalRevenue}</p>
                                    </div>
                                    <div className="flex flex-col items-center justify-center bg-blue-100 p-3 rounded-md shadow">
                                        <h3 className="text-base font-medium text-gray-700">Total Turfs</h3>
                                        <p className="text-xl font-bold text-blue-600">{summary.totalTurfs}</p>
                                    </div>
                                </div>

                            </div>




                            {loading ? (
                                <FireLoading renders="Fetching Statistics..." />
                            ) : (
                                <>
                                    <Table columns={[{ key: "date", label: "DATE" }, { key: "turfName", label: "TurfName" }, { key: "revenue", label: "Revenue" },]}
                                        data={revenues || []}></Table>
                                </>
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
