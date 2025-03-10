"use client";

import { TurfDetails } from "@/utils/type";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";
import Pagination from "./Pagination";
import FireLoading from "./FireLoading";
import Image from "next/image";
import { getTurfsApi } from "@/services/userApi"
import { throttle } from "lodash"
import "react-toastify/dist/ReactToastify.css";


const TurfList: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const [turfs, setTurfs] = useState<TurfDetails[] | null>([])
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [typeFilters, setTypeFilters] = useState<string[]>([]); // e.g., "open", "indoor"
    const [sizeFilters, setSizeFilters] = useState<string[]>([]); // e.g., "5s", "7s"
    const [priceFilters, setPriceFilters] = useState<string[]>([]); // e.g., "500-1000", "1000-1300"
    const [totalTurfs, setTotalTurfs] = useState<number | null>(10)

    const turfsPerPage = 6

    const router = useRouter()

    const fetchTurfs = useCallback(async (page: number, searchQuery: string, typeFilter: string[], sizeFilter: string[], priceFilter: string[]) => {
        try {
            setLoading(true);

            let query = `page=${page}&limit=${turfsPerPage}`;

            if (searchQuery) {
                query += `&searchQry=${searchQuery}`;
            }
            query += `&type=${typeFilter.join(",")}`;
            query += `&size=${sizeFilter.join(",")}`;
            query += `&price=${priceFilter.join(",")}`;

            const response = await getTurfsApi(query)

            if (response?.success) {
                const { data } = response
                setTurfs(prev => (JSON.stringify(prev) !== JSON.stringify(data.turfs) ? data.turfs : prev));
                setTotalTurfs(prev => (prev !== Math.ceil(data.totalTurfs / turfsPerPage) ? Math.ceil(data.totalTurfs / turfsPerPage) : prev));
            }

        } catch (err) {
            console.error("Error fetching user data:", err);
            if (err instanceof Error) {
                toast.error((err as Error).message || "Something went wrong!");
            }
        } finally {
            setLoading(false)
        }
    }, [])

    const throttledFetchTurfs = useMemo(() => throttle(fetchTurfs, 2000), [fetchTurfs])
    const memoizedTypeFilters = useMemo(() => [...typeFilters], [typeFilters]);
    const memoizedSizeFilters = useMemo(() => [...sizeFilters], [sizeFilters]);
    const memoizedPriceFilters = useMemo(() => [...priceFilters], [priceFilters]);


    useEffect(() => {
        console.log("Fetching turfs...");
        throttledFetchTurfs(currentPage, searchQuery, memoizedTypeFilters, memoizedSizeFilters, memoizedPriceFilters)
    }, [currentPage, searchQuery, memoizedTypeFilters, memoizedSizeFilters, memoizedPriceFilters, throttledFetchTurfs]);

    // const handleApplyFilter = () => {
    //     // const filters = {
    //     //     type: typeFilters,
    //     //     size: sizeFilters,
    //     //     price: priceFilters,
    //     // };

    //     // Pass the filters to the fetchTurfs function
    //     fetchTurfs(currentPage, searchQuery, typeFilters, sizeFilters, priceFilters);
    // };


    const handleTypeFilterChange = (value: string) => {
        setTypeFilters((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
    };

    const handleSizeFilterChange = (value: string) => {
        setSizeFilters((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
    };

    const handlePriceFilterChange = (value: string) => {
        setPriceFilters((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // console.log("SearchQuery :", searchQuery);
    // console.log("Filters :", typeFilters);


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
            <div className="min-h-screen bg-gradient-to-br from-green-200 via-yellow-100 to-green-50 flex flex-col">
                {/* Header Section */}
                <header className="bg-green-700 text-white p-4 md:p-6 shadow-md">
                    <h1 className="text-xl md:text-3xl font-bold text-center">Find Your Perfect Turf</h1>
                </header>

                {/* Search Bar */}
                <div className="container w-11/12 md:w-3/4 mx-auto flex flex-col items-center py-3 md:py-4">
                    <div className="flex items-center gap-2 md:gap-4 bg-white rounded-lg shadow-lg p-3 md:p-4 w-full">
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            type="text"
                            placeholder="Search by Turf"
                            className="flex-grow p-2 md:p-3 border-none rounded-md focus:outline-none text-gray-700 text-sm md:text-base"
                        />
                        <button className="px-4 md:px-6 py-2 md:py-3 bg-green-700 text-white font-medium rounded-md hover:bg-green-800 shadow-md">
                            Search
                        </button>
                    </div>
                </div>

                <div className="container w-full md:w-[90%] mx-auto grid grid-cols-1 md:grid-cols-12 gap-x-4 md:gap-x-6 gap-y-6 h-full">
                    {/* Filters Sidebar */}
                    <aside className="col-span-1 md:col-span-3 lg:col-span-2 bg-white p-3 md:p-4 rounded-lg shadow-md h-full max-h-[80vh] overflow-y-auto">
                        <h2 className="text-lg md:text-xl font-bold text-green-700 mb-3 md:mb-4">Filters</h2>
                        <div className="space-y-4">
                            {/* Type Filter */}
                            <div>
                                <h3 className="text-green-600 font-medium mb-1 md:mb-2">Type</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center text-gray-700 text-sm md:text-base">
                                        <input type="checkbox" className="mr-2 text-green-600" onChange={() => handleTypeFilterChange("Open")} />
                                        Open
                                    </label>
                                    <label className="flex items-center text-gray-700 text-sm md:text-base">
                                        <input type="checkbox" className="mr-2 text-green-600" onChange={() => handleTypeFilterChange("Closed")} />
                                        Indoor
                                    </label>
                                </div>
                            </div>

                            {/* Size Filter */}
                            <h3 className="text-green-600 font-medium mb-1 md:mb-2">Size</h3>
                            <div className="space-y-2">
                                {["5s", "7s", "11s"].map((size) => (
                                    <label key={size} className="flex items-center text-gray-700 text-sm md:text-base">
                                        <input type="checkbox" className="mr-2 text-green-600" onChange={() => handleSizeFilterChange(size)} />
                                        {size}
                                    </label>
                                ))}
                            </div>

                            {/* Price Filter */}
                            <h3 className="text-green-600 font-medium mb-1 md:mb-2">Price</h3>
                            <div className="space-y-2">
                                {["500-1000", "1000-1300", "1200-1600"].map((price) => (
                                    <label key={price} className="flex items-center text-gray-700 text-sm md:text-base">
                                        <input type="checkbox" className="mr-2 text-green-600" onChange={() => handlePriceFilterChange(price)} />
                                        {price}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Turf Cards Section */}
                    <main className="col-span-1 md:col-span-9 lg:col-span-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6 cursor-pointer">
                        {loading ? (
                            <div className="col-span-full flex justify-center">
                                <FireLoading renders={"Fetching Turfs"} />
                            </div>
                        ) : turfs && turfs.length > 0 ? (
                            turfs.map((turf: TurfDetails, idx: number) => (
                                <div
                                    key={turf._id || idx}
                                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-transform transform hover:scale-105 w-full max-w-xs mx-auto md:mx-0"
                                    onClick={() => router.push(`/turfs/${turf._id}`)}
                                >
                                    {/* Image Section */}
                                    <div className="relative h-24 md:h-28">
                                        <Image
                                            src={turf.images[0] || "/logo.jpeg"}
                                            alt={turf.turfName || "Turf"}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                                            priority
                                            className="object-cover rounded-t-lg"
                                        />
                                        <span className="absolute top-1 left-1 px-2 py-1 bg-green-700 text-white text-xs font-bold rounded-full shadow-lg">
                                            ₹{turf.price}/hour
                                        </span>
                                    </div>

                                    {/* Details Section */}
                                    <div className="p-2 md:p-3 flex flex-col justify-between h-full">
                                        {/* Turf Details */}
                                        <div className="space-y-1">
                                            <h3 className="text-sm md:text-md font-semibold text-green-700 truncate">
                                                {turf.turfName || `Turf Name #${idx + 1}`}
                                            </h3>
                                            <p className="text-xs text-gray-500 flex items-center gap-1 h-6 md:h-8 overflow-hidden truncate">
                                                <FaMapMarkerAlt className="text-green-500" />
                                                {turf.address || `Turf City #${idx + 1}`}
                                            </p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <FaClock className="text-green-500" />
                                                {turf.workingSlots.fromTime} - {turf.workingSlots.toTime}
                                            </p>
                                        </div>

                                        {/* Book Now Button */}
                                        <button
                                            className="w-full py-1.5 md:py-2 bg-green-600 text-white text-xs md:text-sm font-medium rounded-md shadow-lg hover:bg-green-700 hover:shadow-xl transition-all"
                                            onClick={() => router.push(`/turfs/${turf._id}`)}
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center col-span-full text-gray-500">No turfs available</p>
                        )}
                    </main>
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center py-3 md:py-4">
                    <Pagination currentPage={currentPage} totalPages={totalTurfs!} onPageChange={handlePageChange} />
                </div>
            </div>

        </>
    );



};


export default TurfList;
