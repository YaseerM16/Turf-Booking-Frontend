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

    console.log("HELLO From ");


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
            <div className="h-[120vh] bg-gradient-to-br from-green-200 via-yellow-100 to-green-50 flex flex-col">
                {/* Header Section */}
                <header className="bg-green-700 text-white p-6 shadow-md">
                    <h1 className="text-3xl font-bold text-center">Find Your Perfect Turf</h1>
                </header>

                {/* Search Bar */}
                <div className="container w-11/12 md:w-3/4 mx-auto flex flex-col items-center py-4">
                    <div className="flex items-center gap-4 bg-white rounded-lg shadow-lg p-4 w-full">
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            type="text"
                            placeholder="Search by Turf "
                            className="flex-grow p-3 border-none rounded-md focus:outline-none text-gray-700"
                        />
                        <button className="px-6 py-3 bg-green-700 text-white font-medium rounded-md hover:bg-green-800 shadow-md">
                            Search
                        </button>
                    </div>
                </div>



                <div className="container w-full md:w-[90%] mx-auto grid grid-cols-12 gap-x-6 gap-y-8 h-full">
                    {/* Filters Sidebar */}
                    <aside className="col-span-12 md:col-span-2 bg-white p-4 rounded-lg shadow-md h-full overflow-y-auto">
                        <h2 className="text-lg font-bold text-green-700 mb-4">Filters</h2>
                        <div className="space-y-6">
                            {/* Type Filter */}
                            <div>
                                <h3 className="text-green-600 font-medium mb-2">Type</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center text-gray-700">
                                        <input
                                            type="checkbox"
                                            className="mr-2 text-green-600"
                                            onChange={() => handleTypeFilterChange("Open")}
                                        />
                                        Open
                                    </label>
                                    <label className="flex items-center text-gray-700">
                                        <input
                                            type="checkbox"
                                            className="mr-2 text-green-600"
                                            onChange={() => handleTypeFilterChange("Closed")}
                                        />
                                        Indoor
                                    </label>
                                </div>
                            </div>

                            {/* Size Filter */}
                            <h3 className="text-green-600 font-medium mb-2">Size</h3>
                            <div className="space-y-2">
                                <label className="flex items-center text-gray-700">
                                    <input
                                        type="checkbox"
                                        className="mr-2 text-green-600"
                                        onChange={() => handleSizeFilterChange("5s")}
                                    />
                                    5s
                                </label>
                                <label className="flex items-center text-gray-700">
                                    <input
                                        type="checkbox"
                                        className="mr-2 text-green-600"
                                        onChange={() => handleSizeFilterChange("7s")}
                                    />
                                    7s
                                </label>
                                <label className="flex items-center text-gray-700">
                                    <input
                                        type="checkbox"
                                        className="mr-2 text-green-600"
                                        onChange={() => handleSizeFilterChange("11s")}
                                    />
                                    11s
                                </label>
                            </div>

                            {/* Price Filter */}
                            <h3 className="text-green-600 font-medium mb-2">Price</h3>
                            <div className="space-y-2">
                                <label className="flex items-center text-gray-700">
                                    <input
                                        type="checkbox"
                                        className="mr-2 text-green-600"
                                        onChange={() => handlePriceFilterChange("500-1000")}
                                    />
                                    500 - 1000
                                </label>
                                <label className="flex items-center text-gray-700">
                                    <input
                                        type="checkbox"
                                        className="mr-2 text-green-600"
                                        onChange={() => handlePriceFilterChange("1000-1300")}
                                    />
                                    1000 - 1300
                                </label>
                                <label className="flex items-center text-gray-700">
                                    <input
                                        type="checkbox"
                                        className="mr-2 text-green-600"
                                        onChange={() => handlePriceFilterChange("1200-1600")}
                                    />
                                    1200 - 1600
                                </label>
                            </div>
                        </div>
                    </aside>
                    {loading ?
                        <div className="col-span-2 md:col-span-10">
                            <FireLoading renders={"Fetching Turfs"} />
                        </div>
                        :
                        <main className="col-span-12 md:col-span-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 cursor-pointer">
                            {turfs && turfs.length > 0 ? (
                                turfs.map((turf: TurfDetails, idx: number) => (
                                    <div
                                        key={turf._id || idx}
                                        className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-transform transform hover:scale-105"
                                        style={{ height: "15rem", width: "20rem" }}
                                        onClick={() => router.push(`/turfs/${turf._id}`)}
                                    >
                                        {/* Image Section */}
                                        <div className="relative h-28">
                                            <Image
                                                src={turf.images[0] || "/logo.jpeg"}
                                                alt={turf.turfName || "Turf"}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                                                priority
                                                className="object-cover rounded-t-lg"
                                            />

                                            <span className="absolute top-2 left-2 px-3 py-1 bg-green-700 text-white text-xs font-bold rounded-full shadow-lg">
                                                ₹{turf.price}/hour
                                            </span>
                                        </div>

                                        {/* Details Section */}
                                        <div className="p-3 flex flex-col justify-between h-full">
                                            {/* Turf Details */}
                                            <div className="space-y-2">
                                                <h3 className="text-md font-semibold text-green-700 truncate">
                                                    {turf.turfName || `Turf Name #${idx + 1}`}
                                                </h3>
                                                <p
                                                    className="text-xs text-gray-500 flex items-center gap-2 h-8 overflow-hidden"
                                                    style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}
                                                >
                                                    <FaMapMarkerAlt className="text-green-500" />
                                                    {turf.address || `Turf City #${idx + 1}`}
                                                </p>
                                                <p className="text-xs text-gray-500 flex items-center gap-2">
                                                    <FaClock className="text-green-500" />
                                                    {turf.workingSlots.fromTime} - {turf.workingSlots.toTime}
                                                </p>
                                            </div>

                                            {/* Book Now Button */}
                                            <button
                                                className="w-full py-2 bg-green-600 text-white text-sm font-medium rounded-md shadow-lg hover:bg-green-700 hover:shadow-xl transition-all"
                                                onClick={() => router.push(`/turfs/${turf._id}`)}
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center col-span-3 text-gray-500">No turfs available</p>
                            )}
                        </main>}
                    {/* Turf Cards Section */}


                </div>


                {/* Pagination */}
                <div className="flex justify-center items-center py-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalTurfs!}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </>
    );



};


export default TurfList;
