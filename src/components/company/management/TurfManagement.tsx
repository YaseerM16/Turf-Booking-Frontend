"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../CompanySidebar";
import { ToastContainer } from "react-toastify";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import Header from "../CompanyHeader";
import { AiOutlinePlus } from "react-icons/ai";
import FireLoading from "@/components/FireLoading";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import { TurfDetails } from "@/utils/type";
import Spinner from "@/components/Spinner";
import { blockTurf, getTurfs, unbBlockTurf } from "@/services/TurfApis";
import Cookies from "js-cookie";

const TurfManagement: React.FC = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [turfs, setTurfs] = useState<TurfDetails[]>([]);
    // const [spinLoading, setSpinLoading] = useState<boolean>(false)
    const [loadingBlock, setLoadingBlock] = useState<Record<string, boolean>>({});

    const company = useAppSelector((state) => state.companies);

    useEffect(() => {
        const token = Cookies.get("CompanyToken"); // Replace 'authToken' with your actual cookie name

        if (!token) {
            router.push("/company/login"); // Redirect to login if token is missing
        }
    }, []);

    async function fetchTurfs(companyId: string) {
        try {
            console.log("Comapny ID : ", companyId);

            setLoading(true);
            const response = await getTurfs(companyId)
            console.log("RESpony by getTurfs :", response);

            if (response.success) {
                const { data } = response
                console.log("Turf DAta : ", data);

                setTurfs(data.turfs);
            }
        } catch (err: unknown) {
            console.log("Error fetching Turfs [] data:", err);
            if (err instanceof Error) {
                // toast.error((err as Error).message || "Something went wrong!");
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Error!",
                    text: (err as Error)?.message || "Something went wrong. Please try again.",
                    showConfirmButton: true,
                    confirmButtonText: "OK",
                    timer: 3000,
                    toast: true,
                });
            }
        } finally {
            setLoading(false)
        }
    };


    useEffect(() => {
        if (company.company?._id) {
            fetchTurfs(company.company?._id as string);
        }
    }, [company.company?._id]);


    // Sample implementation of block/unblock methods
    const handleBlockTurf = async (turfId: string) => {
        try {
            Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to proceed?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, proceed!',
                cancelButtonText: 'No, cancel!',
                toast: true,
                position: 'top-end',
                timer: 3000,
                timerProgressBar: true,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setLoadingBlock((prev) => ({ ...prev, [turfId]: true }));

                    const response = await blockTurf(turfId)
                    // console.log("RESpon of BlockTurf :", response);

                    if (response.success) {
                        const { data } = response
                        const updatedTurf = data.isBlocked.data
                        setTurfs((prevTurfs) =>
                            prevTurfs.map((turf) =>
                                turf._id === updatedTurf._id ? { ...turf, isBlocked: updatedTurf.isBlocked } : turf
                            )
                        );
                        setLoadingBlock((prev) => ({ ...prev, [turfId]: false }));
                        // fetchTurfs(company.company?._id as string)
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: "Turf Blocked successfully ✅",
                            showConfirmButton: false,
                            timer: 2000,
                            toast: true,
                        });
                    }

                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'info',
                        title: 'Action canceled.',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            });

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("Error While Block the Turf :", error);
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
            setLoadingBlock((prev) => ({ ...prev, [turfId]: false }));
        }
    };

    const handleUnblockTurf = async (turfId: string) => {
        try {
            Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to proceed?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, proceed!',
                cancelButtonText: 'No, cancel!',
                toast: true,
                position: 'top-end',
                timer: 3000,
                timerProgressBar: true,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setLoadingBlock((prev) => ({ ...prev, [turfId]: true }));

                    const response = await unbBlockTurf(turfId)

                    if (response.success) {
                        setLoadingBlock((prev) => ({ ...prev, [turfId]: false }));
                        const { data } = response
                        const updatedTurf = data.isBlocked.data

                        setTurfs((prevTurfs) =>
                            prevTurfs.map((turf) =>
                                turf._id === updatedTurf._id ? { ...turf, isBlocked: updatedTurf.isBlocked } : turf
                            )
                        );
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: "Turf Un-Blocked successfully ✅",
                            showConfirmButton: false,
                            timer: 2000,
                            toast: true,
                        });
                    }

                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'info',
                        title: 'Action canceled.',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            });

        } catch (error) {
            if (error instanceof Error) {
                console.log("Error While Un-Block the Turf :", error);
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
            setLoadingBlock((prev) => ({ ...prev, [turfId]: false }));
        }
    };

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="flex h-screen">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    <Header />

                    <div className="bg-gray-100 flex-1 p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 150px)' }}>
                        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col mb-8">
                            <div className="flex flex-col text-left space-y-2">
                                <h1 className="text-3xl font-semibold text-gray-800">Turf Management</h1>
                                <p className="text-gray-600 text-lg">
                                    Here is the list of your available turfs
                                </p>
                            </div>

                            {/* Add Turf Button */}
                            <div className="w-full flex justify-start mt-6">
                                <button
                                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium text-lg flex items-center space-x-2"
                                    onClick={() => router.push("/company/register-turf")}
                                >
                                    <AiOutlinePlus className="text-2xl" />
                                    <span>Add Turf</span>
                                </button>
                            </div>
                            {loading ? <FireLoading renders={"Fetching Turfs"} /> : (
                                <div className="w-full mt-8 overflow-y-auto">
                                    <div className="space-y-6">
                                        {turfs.map((turf) => (
                                            <div
                                                key={turf._id}
                                                className="bg-green-50 p-6 rounded-lg shadow-md"
                                            >
                                                {/* Turf Details */}
                                                <div className="grid grid-cols-4 gap-6">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Turf Name</p>
                                                        <h1 className="text-lg font-semibold text-gray-800">{turf.turfName}</h1>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Turf Size</p>
                                                        <h2 className="text-lg font-semibold text-gray-800">{turf.turfSize}</h2>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Price Per Hour</p>
                                                        <h2 className="text-lg font-semibold text-gray-800">Rs.{turf.price}</h2>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Workings</p>
                                                        <h2 className="text-lg font-semibold text-gray-800">
                                                            {turf.workingSlots.fromTime} - {turf.workingSlots.toTime}
                                                        </h2>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex justify-center mt-4 gap-4">
                                                    {/* View Button */}
                                                    <button
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium flex items-center"
                                                        onClick={() => router.push(`/company/turf-management/${turf._id}`)}
                                                    >
                                                        View Turf
                                                    </button>
                                                    {loadingBlock[turf._id] ? <Spinner /> :
                                                        <>
                                                            {/* Block/Unblock Button */}
                                                            {turf.isBlocked ? (
                                                                <button
                                                                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md font-medium flex items-center"
                                                                    onClick={() => handleUnblockTurf(turf._id)}
                                                                >
                                                                    Unblock Turf
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-md font-medium flex items-center"
                                                                    onClick={() => handleBlockTurf(turf._id)}
                                                                >
                                                                    Block Turf
                                                                </button>
                                                            )}
                                                        </>
                                                    }
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}


                        </div>
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

export default TurfManagement;
