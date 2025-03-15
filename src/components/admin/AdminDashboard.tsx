"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { format } from "date-fns";
import Sidebar from "./SideBar";
import { getDashboardData, getMonthlyRevenue, getRevenuesByRange } from "@/services/adminApi";
import Swal from "sweetalert2";
import FireLoading from "../FireLoading";
import { useRouter } from "next/navigation";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
import Cookies from "js-cookie";

const AdminDashboard: React.FC = () => {
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(true);
    const [filter, setFilter] = useState<string>("7days");
    const [monthlyRevenue, setMonthlyRevenue] = useState<{ month: string, revenue: number }[]>([])
    const [rangeRenvenue, setRangeRevenue] = useState<{ date: string, revenue: number }[]>([])

    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);
    const [dashboardData, setDashboardData] = useState({
        totalCompanies: 0,
        totalUsers: 0,
        totalTurfs: 0,
        last7DaysRevenue: [],
        totalRevenue: 0,
        completedBookings: 0,
        upcomingBookings: 0,
        totalBookings: 0,
    });

    useEffect(() => {
        const token = Cookies.get("AdminToken"); // Replace 'authToken' with your actual cookie name

        if (!token) {
            router.push("/admin/login"); // Redirect to login if token is missing
        }
    }, []);

    const getDashBoardMetrics = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getDashboardData();
            if (response.success) {
                setLoading(false)
                const { data } = response
                const { dashboard } = data
                const { companyCount, turfsCount, usersCount, metricsDet } = dashboard
                const metrics = {
                    totalCompanies: companyCount,
                    totalUsers: usersCount,
                    totalTurfs: turfsCount,
                    last7DaysRevenue: metricsDet.last7DaysRevenue,
                    totalRevenue: metricsDet.totalRevenue,
                    completedBookings: metricsDet.completedBookings,
                    upcomingBookings: metricsDet.upcomingBookings,
                    totalBookings: metricsDet.totalBookings,
                }
                setDashboardData(metrics)
                console.log("THSI was the Det of AdminDashDet :", data);
            }

        } catch (error) {
            console.log("Error while Got the ADmINDashBoard :", error);
            if (error instanceof Error) {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Error!",
                    text: error?.message || "Something went wrong. Please try again.",
                    showConfirmButton: true,
                    confirmButtonText: "OK",
                    timer: 3000,
                    toast: true,
                });
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const getMonthlyRevenues = useCallback(async () => {
        try {
            const response = await getMonthlyRevenue();
            if (response.success) {
                const { data } = response
                const { revenues } = data
                setMonthlyRevenue(revenues)
                setFilter("month")
                console.log("THSI was the Det of AdminDashDet :", data);
            }

        } catch (error) {
            console.log("Error while Got the ADmINDashBoard :", error);
            if (error instanceof Error) {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Error!",
                    text: error?.message || "Something went wrong. Please try again.",
                    showConfirmButton: true,
                    confirmButtonText: "OK",
                    timer: 3000,
                    toast: true,
                });
            }
        }
    }, []);

    const getRevenueByRange = useCallback(async () => {
        try {
            if (fromDate == null || toDate == null) {
                return
            }
            const response = await getRevenuesByRange(fromDate, toDate);
            if (response.success) {
                const { data } = response
                const { revenues } = data
                setRangeRevenue(revenues)
                setFilter("range")
                console.log("THSI was the Det of AdminDashDet :", data);
            }

        } catch (error) {
            console.log("Error while Got the ADmINDashBoard :", error);
            if (error instanceof Error) {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Error!",
                    text: error?.message || "Something went wrong. Please try again.",
                    showConfirmButton: true,
                    confirmButtonText: "OK",
                    timer: 3000,
                    toast: true,
                });
            }
        }
    }, [fromDate, toDate]);


    useEffect(() => {
        getDashBoardMetrics()
    }, [getDashBoardMetrics]);

    const filteredRevenue = () => {
        if (filter === "7days") {
            return dashboardData.last7DaysRevenue;
        }
        if (filter === "month") {
            return monthlyRevenue;  // Use monthlyRevenue here
        }
        if (filter === "range") {
            return rangeRenvenue;  // Use monthlyRevenue here
        }
        return dashboardData.last7DaysRevenue;
    };

    // Format labels dynamically based on the selected filter
    const getFormattedLabels = () => {
        return filteredRevenue().map((entry: { revenue: number; month?: string; date?: string }) => {
            if (filter === "month") {
                return format(new Date(entry.month + "-01"), "MMM yyyy"); // Monthly format (Jan 2024)
            }
            return format(new Date(entry.date || ""), "dd MMM"); // Daily format (05 Feb)
        });
    };

    const chartData = {
        labels: getFormattedLabels(),
        datasets: [
            {
                label: "Revenue (₹)",
                data: filteredRevenue().map((entry: { revenue: number }) => entry.revenue),
                borderColor: "#16a34a",
                backgroundColor: "rgba(22, 163, 74, 0.2)",
                tension: 0.4,
            },
        ],
    };

    return (
        <div className="flex flex-col bg-gray-100 min-h-screen overflow-auto">
            {/* Sidebar */}
            <div className="flex">
                <Sidebar />

                {/* Main Content */}
                <main className="flex-1 p-8 overflow-auto h-screen">
                    {/* Header */}
                    <header className="bg-yellow-100 p-6 rounded-lg shadow-md flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800">Welcome, Admin!</h2>
                            <p className="text-gray-600">Here&apos;s our operation statistic report</p>
                        </div>
                    </header>

                    {loading ? (
                        <FireLoading renders={"Loading Metrics.."} />
                    ) : (
                        <>
                            {/* Statistics Cards */}
                            <div className="grid grid-cols-4 gap-6 mt-6">
                                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                                    <h3 className="text-lg font-semibold text-gray-600">Total Users</h3>
                                    <p className="text-2xl font-bold text-green-700">{dashboardData.totalUsers}</p>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                                    <h3 className="text-lg font-semibold text-gray-600">Total Revenue</h3>
                                    <p className="text-2xl font-bold text-green-700">₹{dashboardData.totalRevenue}</p>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                                    <h3 className="text-lg font-semibold text-gray-600">Completed Bookings</h3>
                                    <p className="text-2xl font-bold text-green-700">{dashboardData.completedBookings}</p>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                                    <h3 className="text-lg font-semibold text-gray-600">Upcoming Bookings</h3>
                                    <p className="text-2xl font-bold text-green-700">{dashboardData.upcomingBookings}</p>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                                    <h3 className="text-lg font-semibold text-gray-600">Approved Companies</h3>
                                    <p className="text-2xl font-bold text-green-700">{dashboardData.totalCompanies}</p>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                                    <h3 className="text-lg font-semibold text-gray-600">Active Turfs</h3>
                                    <p className="text-2xl font-bold text-green-700">{dashboardData.totalTurfs}</p>
                                </div>
                            </div>

                            {/* Graph Section */}
                            <div className="bg-white p-8 mt-8 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                                    Revenue Analysis
                                </h3>
                                {/* Filter Section */}
                                <div className="flex flex-col items-center gap-4 mb-8">
                                    <div className="flex gap-4">
                                        <button
                                            className={`px-4 py-2 rounded-md ${filter === "7days" ? "bg-green-500 text-white" : "bg-gray-300"}`}
                                            onClick={() => setFilter("7days")}
                                        >
                                            Last 7 Days
                                        </button>
                                        <button
                                            className={`px-4 py-2 rounded-md ${filter === "month" ? "bg-green-500 text-white" : "bg-gray-300"}`}
                                            onClick={() => getMonthlyRevenues()}
                                        >
                                            Monthly
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <DatePicker selected={fromDate} onChange={(date) => setFromDate(date)} placeholderText="From Date" className="px-4 py-2 border rounded-md" />
                                        <DatePicker selected={toDate} onChange={(date) => setToDate(date)} placeholderText="To Date" className="px-4 py-2 border rounded-md" />
                                        <button className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={() => getRevenueByRange()}>
                                            Apply
                                        </button>
                                    </div>
                                </div>

                                {/* Chart */}
                                <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-3xl mx-auto">
                                    <h2 className="text-xl font-semibold mb-4 text-center">Revenue Chart</h2>
                                    <div className="w-full h-[350px] overflow-hidden">
                                        <Line data={chartData} options={{ maintainAspectRatio: false }} />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );

};

export default AdminDashboard;
