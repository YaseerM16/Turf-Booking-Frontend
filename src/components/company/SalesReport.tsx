"use client";
import React, { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
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


interface Revenue {
    date: string;
    revenue: number;
    turfName: string;
    images: string[];
}
const SalesReport: React.FC = () => {
    const [loading, setLoading] = useState(false);
    // const [spinLoading, setSpinLoading] = useState<boolean>(false)
    const [revenues, setRevenues] = useState<Revenue[] | []>([])
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalRevenues, setTotalRevenues] = useState<number | null>(10)
    const revenuesPerPage = 6


    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const company = useAppSelector((state) => state.companies.company);

    const fetchRevenues = useCallback(async (companyId: string) => {
        try {
            console.log("Company ID:", companyId);
            setLoading(true);
            const response = await getLastMonthRevenues(companyId, currentPage, revenuesPerPage);
            if (response.success) {
                console.log("Revenues Success:", response.data);
                setRevenues(response.data.revenues.result);
                setTotalRevenues(prev => (prev !== Math.ceil(response.data.revenues.totalRevenues / revenuesPerPage) ? Math.ceil(response.data.revenues.totalRevenues / revenuesPerPage) : prev))
            }
        } catch (err: unknown) {
            console.log("Error fetching revenues:", err);
            if (err instanceof Error) {
                toast.error(err.message || "Something went wrong!");
            }
        } finally {
            setLoading(false);
        }
    }, [currentPage])

    const fetchRevenueByRanges = useCallback(async () => {
        try {
            // console.log("FormDate :", fromDate, "ToDate :", toDate);

            if (fromDate == null || toDate == null) {
                return
            }

            setLoading(true);
            const response = await getRevenuesByInterval(company?._id as string, fromDate, toDate)

            if (response?.success) {
                const { data } = response
                const { revenues } = data
                console.log("Data of Revenues BYY Interval :", revenues);
                setRevenues(revenues)
                // setRangeRevenue(revenue)
                // setFilter("range");
                // console.log("THIS is the Range Revenues :", data);

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
    }, [fromDate, toDate, company?._id])

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Sales Report", 14, 10);

        const tableData = revenues.map((rev) => [
            rev.date,
            rev.turfName,
            `₹${rev.revenue}`,
        ]);

        autoTable(doc, { // ✅ Correct autoTable usage
            head: [["Date", "Turf Name", "Revenue (Rs.)"]],
            body: tableData,
            startY: 20,
        });

        doc.save("Sales_Report.pdf");
    };

    useEffect(() => {
        if (company?._id) {
            fetchRevenues(company?._id as string);
        }
    }, [company?._id, currentPage, fetchRevenues]);

    return (
        <>
            <ToastContainer position="top-center" autoClose={1000} />
            <div className="flex h-screen">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    <Header />
                    <div className="bg-gray-100 flex-1 overflow-y-auto">
                        <div className="bg-white p-3 rounded-lg shadow-md">
                            <div className="flex justify-between items-center mb-4">
                                <h1 className="text-3xl font-semibold text-gray-800">Sales Report</h1>
                                <button
                                    onClick={downloadPDF}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700"
                                >
                                    Download PDF
                                </button>
                            </div>
                            <p className="text-gray-600 text-lg mb-4">Here is the list of your last 30 days revenue details</p>
                            {/* Filter Section */}
                            <div className="flex flex-col items-center gap-4 mb-8">
                                <div className="flex items-center gap-2">
                                    <DatePicker selected={fromDate} onChange={(date) => setFromDate(date)} placeholderText="From Date" className="px-4 py-2 border rounded-md" />
                                    <DatePicker selected={toDate} onChange={(date) => setToDate(date)} placeholderText="To Date" className="px-4 py-2 border rounded-md" />
                                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                        onClick={() => fetchRevenueByRanges()}
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                            {loading ? (
                                <p className="text-center text-gray-500">Loading...</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse border border-gray-300">
                                        <thead>
                                            <tr className="bg-green-600 text-white">
                                                <th className="border border-gray-300 px-4 py-2">Date</th>
                                                <th className="border border-gray-300 px-4 py-2">Turf Name</th>
                                                <th className="border border-gray-300 px-4 py-2">Revenue (₹)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {revenues.length > 0 ? (
                                                revenues.map((rev, index) => (
                                                    <tr key={index} className="border border-gray-300 text-center">
                                                        <td className="border px-4 py-2">{rev.date}</td>
                                                        <td className="border px-4 py-2">{rev.turfName}</td>
                                                        <td className="border px-4 py-2">Rs.{rev.revenue}</td>
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
