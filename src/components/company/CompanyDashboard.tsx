"use client";
import { useAppSelector } from "@/store/hooks";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "./CompanyHeader";
import Sidebar from "./CompanySidebar";
import { companyDashboardData, getMonthlyRevenue, getRevenueByRange, getRevenuesOfTurf } from "@/services/companyApi";
import Swal from "sweetalert2";
import { TurfDetails } from "@/utils/type";
import { getTurfs } from "@/services/TurfApis";
// import FireLoading from "../FireLoading";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { NextArrow, PrevArrow } from "@/utils/Arrows";
import Image from "next/image";


// export const carouselSettings = {
//     dots: false, // Disable dots for better visibility of arrows
//     infinite: true,
//     speed: 500,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//     vertical: true,
//     verticalSwiping: true,
//     nextArrow: <NextArrow />,
//     prevArrow: <PrevArrow />,
//     responsive: [
//         { breakpoint: 1024, settings: { slidesToShow: 2 } },
//         { breakpoint: 768, settings: { slidesToShow: 1 } },
//     ],
// };
export const carouselSettings = {
    dots: false, // Disable dots for better arrow visibility
    infinite: false, // Prevent looping for better UX
    speed: 500,
    slidesToShow: 2, // Show only 2 turfs at a time
    slidesToScroll: 1, // Move 1 slide at a time
    autoplay: false, // Disable autoplay for manual control
    vertical: true,
    verticalSwiping: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
        {
            breakpoint: 1024,
            settings: { slidesToShow: 2 },
        },
        {
            breakpoint: 768,
            settings: { slidesToShow: 1 }, // Show 1 turf per slide on mobile
        },
    ],
};


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


const CompanyDashboard: React.FC = () => {
    const company = useAppSelector((state) => state.companies.company);
    const [searchQuery, setSearchQuery] = useState<string>("");
    // const [loadingDash, setLoadingDash] = useState<boolean>(false);
    // const [loadingTurfs, setLoadingTurfs] = useState<boolean>(false);
    // console.log("loadin trfs :", loadingDash);
    // console.log("loadin trfs :", loadingTurfs);

    const [turfs, setTurfs] = useState<TurfDetails[]>([]);
    const [dashboardData, setDashboardData] = useState({
        completedBookings: 0,
        last7DaysRevenue: [],
        totalBookings: 0,
        totalRevenue: 0,
        upcomingBookings: 0,
    });
    const [turfData, setTurfData] = useState({
        completedBookings: 0,
        last7DaysRevenue: [],
        totalBookings: 0,
        totalRevenue: 0,
        upcomingBookings: 0,
    });
    const [monthlyRevenue, setMonthlyRevenue] = useState<{ month: string, revenue: number }[]>([])
    const [rangeRenvenue, setRangeRevenue] = useState<{ date: string, revenue: number }[]>([])
    const [filter, setFilter] = useState<string>("7days");
    // const [turfFilter, setTurfFilter] = useState<string>("7days");
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);
    // setTurfFilter("7days")
    const [selectedTurf, setSelectedTurf] = useState<null | TurfDetails>(null);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0; // Reset scroll to top on every search
        }
    }, [searchQuery]);

    const fetchTurfRevenue = useCallback(async (companyId: string, turfId: string) => {
        try {
            // setLoadingDash(true);
            const response = await getRevenuesOfTurf(companyId, turfId);
            if (response?.success) {
                const { data } = response
                // console.log("This is the TufDat : ", data);
                const { revenues } = data
                console.log("Revenues of TURD :", revenues);

                setTurfData({
                    completedBookings: revenues.completedBookings || 0,
                    last7DaysRevenue: revenues.last7DaysRevenue || [],
                    totalBookings: revenues.totalBookings || 0,
                    totalRevenue: revenues.totalRevenue || 0,
                    upcomingBookings: revenues.upcomingBookings || 0,
                });
                // console.log("found TUrf :", turfs);
                const turf = turfs.find(turf => turf._id == turfId)
                setSelectedTurf(turf || null);
                // setLoadingDash(false)
            }
        } catch (err: unknown) {
            console.log("Error while Got the COmpanyDashBoard :", err);
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
            // setLoadingDash(false)
        }
    }, [turfs])




    const getDashboardData = useCallback(async (companyId: string) => {
        try {
            // setLoadingDash(true);
            const response = await companyDashboardData(companyId);
            if (response?.success) {
                const { data } = response
                const { dashboardData } = data;
                setDashboardData({
                    completedBookings: dashboardData.completedBookings || 0,
                    last7DaysRevenue: dashboardData.last7DaysRevenue || [],
                    totalBookings: dashboardData.totalBookings || 0,
                    totalRevenue: dashboardData.totalRevenue || 0,
                    upcomingBookings: dashboardData.upcomingBookings || 0,
                });
                // setLoadingDash(false)
            }
        } catch (err: unknown) {
            console.log("Error while Got the COmpanyDashBoard :", err);
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
            // setLoadingDash(false)
        }
    }, [])

    const getMonthlyData = useCallback(async (companyId: string) => {
        try {
            // setLoadingDash(true);
            const response = await getMonthlyRevenue(companyId);
            if (response?.success) {
                const { data } = response
                const { monthlyRevenue } = data
                setMonthlyRevenue(monthlyRevenue)
                setFilter("month");
                // setLoadingDash(false)
            }
        } catch (err: unknown) {
            console.log("Error while Got the COmpanyDashBoard :", err);
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
            // setLoadingDash(false)
        }
    }, [])

    const fetchTurfs = useCallback(async (companyId: string) => {
        try {
            console.log("Comapny ID : ", companyId);

            // setLoadingTurfs(true);
            const response = await getTurfs(companyId)

            if (response.success) {
                const { data } = response
                setTurfs(data.turfs);
                // setLoadingTurfs(false)
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
            // setLoadingTurfs(false)
        }
    }, [])


    const fetchRevenueByRanges = useCallback(async (companyId: string) => {
        try {
            // console.log("FormDate :", fromDate, "ToDate :", toDate);

            if (fromDate == null || toDate == null) {
                return
            }

            // setLoadingTurfs(true);
            const response = await getRevenueByRange(companyId, fromDate, toDate)

            if (response?.success) {
                const { data } = response
                const { revenue } = data
                setRangeRevenue(revenue)
                setFilter("range");
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
            // setLoadingTurfs(false)
        }
    }, [fromDate, toDate])

    useEffect(() => {
        if (company?._id) {
            getDashboardData(company._id)
            fetchTurfs(company._id)
        }
    }, [company, fetchTurfs, getDashboardData]);

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

    const turfFilteredRevenue = () => {
        return turfData.last7DaysRevenue;
        // if (turfFilter === "7days") {
        //     return turfData.last7DaysRevenue;
        // }
        // if (turfFilter === "month") {
        //     return monthlyRevenue;  // Use monthlyRevenue here
        // }
        // if (turfFilter === "range") {
        //     return rangeRenvenue;  // Use monthlyRevenue here
        // }
        // return dashboardData.last7DaysRevenue;
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

    //TurfLabels
    const getFormattedLabelsTurf = () => {
        return turfFilteredRevenue().map((entry: { revenue: number; month?: string; date?: string }) => {
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

    const turfChartData = {
        labels: getFormattedLabelsTurf(),
        datasets: [
            {
                label: "Revenue (₹)",
                data: turfFilteredRevenue().map((entry: { revenue: number }) => entry.revenue),
                borderColor: "#16a34a",
                backgroundColor: "rgba(22, 163, 74, 0.2)",
                tension: 0.4,
            },
        ],
    };

    const filteredTurfs = [...turfs]
        .sort((a, b) => {
            const aMatches = a.turfName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.address.toLowerCase().includes(searchQuery.toLowerCase());
            const bMatches = b.turfName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.address.toLowerCase().includes(searchQuery.toLowerCase());

            return Number(bMatches) - Number(aMatches); // Matches appear first
        });

    return (
        <div className="flex h-screen overflow-hidden w-full">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-auto">
                <Header />
                <div className="flex-1 overflow-y-auto bg-gray-100">
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        {company?.isApproved ? (
                            <>
                                {/* Stats Section */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                    <div className="bg-green-100 shadow-md p-4 rounded-md text-center">
                                        <h3 className="text-lg font-semibold">Total Revenue</h3>
                                        <p className="text-gray-700 text-xl font-bold">₹{dashboardData.totalRevenue}</p>
                                    </div>
                                    <div className="bg-blue-100 shadow-md p-4 rounded-md text-center">
                                        <h3 className="text-lg font-semibold">Total Bookings</h3>
                                        <p className="text-gray-700 text-xl font-bold">{dashboardData.totalBookings}</p>
                                    </div>
                                    <div className="bg-yellow-100 shadow-md p-4 rounded-md text-center">
                                        <h3 className="text-lg font-semibold">Upcoming Bookings</h3>
                                        <p className="text-gray-700 text-xl font-bold">{dashboardData.upcomingBookings}</p>
                                    </div>
                                    <div className="bg-red-100 shadow-md p-4 rounded-md text-center">
                                        <h3 className="text-lg font-semibold">Completed Bookings</h3>
                                        <p className="text-gray-700 text-xl font-bold">{dashboardData.completedBookings}</p>
                                    </div>
                                </div>

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
                                            onClick={() => getMonthlyData(company._id)}
                                        >
                                            Monthly
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <DatePicker selected={fromDate} onChange={(date) => setFromDate(date)} placeholderText="From Date" className="px-4 py-2 border rounded-md" />
                                        <DatePicker selected={toDate} onChange={(date) => setToDate(date)} placeholderText="To Date" className="px-4 py-2 border rounded-md" />
                                        <button className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={() => fetchRevenueByRanges(company._id)}>
                                            Apply
                                        </button>
                                    </div>
                                </div>

                                {/* Chart */}
                                <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-3xl mx-auto">
                                    <h2 className="text-xl font-semibold mb-4 text-center">Revenue Analysis</h2>
                                    <div className="w-full h-[350px]">
                                        <Line data={chartData} options={{ maintainAspectRatio: false }} />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-md shadow-md">
                                <p className="text-yellow-800 text-lg font-semibold">
                                    Your company is awaiting approval. Please check back later!
                                </p>
                            </div>
                        )}
                    </div>


                    <div className="bg-white p-6 rounded-lg shadow-md max-w-7xl mx-auto">

                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Left Section - Registered Turfs (Vertical Slider) */}
                            <div className="w-full lg:w-1/3 p-0 m-0">
                                <h3 className="text-lg font-semibold text-center mb-4">Your Registered Turfs</h3>
                                {/* Search Bar */}
                                <div className="container w-11/12 md:w-3/4 mx-auto flex flex-col items-center py-4">
                                    <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg p-4 w-full relative">
                                        <input
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            type="text"
                                            placeholder="Search by Turf"
                                            className="flex-grow p-3 border-none rounded-md focus:outline-none text-gray-700 pr-10"
                                        />
                                        {searchQuery && (
                                            <button
                                                onClick={() => setSearchQuery("")}
                                                className="absolute right-4 text-gray-500 hover:text-red-500 transition"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="relative h-[400px] overflow-y-auto scroll-smooth snap-y snap-mandatory">
                                    <div
                                        ref={scrollContainerRef}
                                        className="relative h-[400px] overflow-y-auto scroll-smooth snap-y snap-mandatory"
                                    >
                                        {filteredTurfs.map((turf) => (
                                            <div
                                                key={turf._id}
                                                className="snap-start flex justify-center"
                                                onClick={() => fetchTurfRevenue(company?._id as string, turf._id)}
                                            >
                                                <div className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition text-xs p-2 mb-2 w-[90%] max-w-[280px]">

                                                    {/* Image */}
                                                    <Image
                                                        src={turf.images[0]}
                                                        alt={turf.turfName}
                                                        width={400}  // Adjust width as needed
                                                        height={96}  // Adjust height as needed (h-24 = 96px)
                                                        className="w-full h-24 object-cover rounded-md"
                                                        priority  // Improves LCP by loading the image faster
                                                    />

                                                    {/* Name & Pricing */}
                                                    <div className="flex justify-between mt-1">
                                                        <h3 className="font-semibold flex items-center gap-1">
                                                            <i className="fas fa-futbol text-green-500"></i> {turf.turfName}
                                                        </h3>
                                                        <p className="text-green-600 font-semibold">₹{turf.price}/Hr</p>
                                                    </div>

                                                    {/* Address */}
                                                    <p className="text-gray-500 flex items-center gap-1 text-[10px]">
                                                        <i className="fas fa-map-marker-alt text-red-500"></i> {turf.address}
                                                    </p>

                                                    {/* Turf Details (Badges) */}
                                                    <div className="flex flex-wrap gap-1 mt-1 text-[10px]">
                                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md flex items-center gap-1">
                                                            <i className="fas fa-ruler-combined"></i> {turf.turfSize}
                                                        </span>
                                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md flex items-center gap-1">
                                                            <i className="fas fa-tree"></i> {turf.turfType}
                                                        </span>
                                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md flex items-center gap-1">
                                                            <i className="fas fa-clock"></i> {turf.workingSlots?.fromTime} - {turf.workingSlots?.toTime}
                                                        </span>
                                                    </div>

                                                    {/* Working Days */}
                                                    <div className="mt-1 flex flex-wrap gap-1 text-[10px]">
                                                        {turf.workingSlots?.workingDays.map(dayObj => (
                                                            <span key={dayObj.day} className="bg-green-100 text-green-700 px-2 py-1 rounded-md flex items-center gap-1">
                                                                <i className="fas fa-calendar-alt"></i> {dayObj.day.substring(0, 3)}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Section - Turf Stats & Chart */}
                            <div className="w-full lg:w-1/2">
                                <h2 className="text-xl w-full font-semibold text-center">Turf Revenue Dashboard</h2>

                                {selectedTurf ? (
                                    <div className="ml-10 mt-5">
                                        {/* Selected Turf Name */}
                                        <div
                                            className="relative shadow-md p-2 rounded-md text-center mt-8 bg-cover bg-center bg-no-repeat"
                                            style={{
                                                backgroundImage: `url(${selectedTurf.images[0]})`,
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                                height: "100px",
                                            }}
                                        >
                                            {/* Overlay for readability */}
                                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-md"></div>

                                            {/* Turf Details */}
                                            <div className="relative z-10">
                                                <h2 className="text-lg font-bold text-white flex items-center justify-center gap-2">
                                                    <i className="fas fa-futbol text-green-400"></i> {selectedTurf.turfName}
                                                </h2>
                                                <p className="text-gray-300 text-xs flex items-center justify-center gap-1">
                                                    <i className="fas fa-map-marker-alt text-red-400"></i> {selectedTurf.address}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Stats Section */}
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 mt-2">
                                            <div className="bg-green-100 shadow-md p-2 rounded-md text-center">
                                                <h3 className="text-md font-semibold">Total Revenue</h3>
                                                <p className="text-gray-700 text-lg font-bold">₹{turfData.totalRevenue}</p>
                                            </div>
                                            <div className="bg-blue-100 shadow-md p-2 rounded-md text-center">
                                                <h3 className="text-md font-semibold">Total Bookings</h3>
                                                <p className="text-gray-700 text-lg font-bold">{turfData.totalBookings}</p>
                                            </div>
                                            <div className="bg-yellow-100 shadow-md p-2 rounded-md text-center">
                                                <h3 className="text-md font-semibold">Upcoming Bookings</h3>
                                                <p className="text-gray-700 text-lg font-bold">{turfData.upcomingBookings}</p>
                                            </div>
                                            <div className="bg-red-100 shadow-md p-2 rounded-md text-center">
                                                <h3 className="text-md font-semibold">Completed Bookings</h3>
                                                <p className="text-gray-700 text-lg font-bold">{turfData.completedBookings}</p>
                                            </div>
                                        </div>

                                        {/* Chart Section */}
                                        <div className="bg-white p-8 rounded-xl shadow-lg w-full">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Revenue Trend</h3>
                                            <div className="h-56">
                                                <Line data={turfChartData} options={{ maintainAspectRatio: false }} />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-md text-center mt-6">Please click on a turf to see revenue data.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDashboard;
