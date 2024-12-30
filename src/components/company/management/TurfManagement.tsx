"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../CompanySidebar";
import { axiosInstance } from "@/utils/constants";
import { toast, ToastContainer } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import Header from "../CompanyHeader";
import { AiOutlinePlus } from "react-icons/ai";
import FireLoading from "@/components/FireLoading";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";

useRouter
Sidebar
useAppDispatch

const TurfManagement: React.FC = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [turfs, setTurfs] = useState<any[]>([]);
    const [spinLoading, setSpinLoading] = useState<boolean>(false)
    const company = useAppSelector((state) => state.companies);

    async function fetchTurfs(companyId: string) {
        try {
            console.log("Comapny ID : ", companyId);

            setLoading(true);
            const { data } = await axiosInstance.get(
                `/api/v1/company/get-turfs?companyId=${companyId}`
            );

            if (data?.success) {
                setTurfs(data.turfs);
            }

        } catch (error) {
            console.log("Error fetching Turfs [] data:", error);
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
                    setSpinLoading(true);
                    const { data } = await axiosInstance.patch(
                        `/api/v1/company/block-turf?turfId=${turfId}`
                    );


                    if (data?.success) {
                        setSpinLoading(false)
                        // setSelectedSlot(null)
                        // fetchSlotsByDay(turf?._id, day)
                        fetchTurfs(company.company?._id as string)
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: "Turf Blocked successfully ✅",
                            showConfirmButton: false,
                            timer: 2000,
                            toast: true,
                        });
                        console.log("Response Data :- ", data);
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
            console.error("Error fetching user data:", error);
        } finally {
            setSpinLoading(false)
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
                    setSpinLoading(true);
                    const { data } = await axiosInstance.patch(
                        `/api/v1/company/Un-block-turf?turfId=${turfId}`
                    );


                    if (data?.success) {
                        setSpinLoading(false)
                        // setSelectedSlot(null)
                        // fetchSlotsByDay(turf?._id, day)
                        fetchTurfs(company.company?._id as string)
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: "Turf Blocked successfully ✅",
                            showConfirmButton: false,
                            timer: 2000,
                            toast: true,
                        });
                        // console.log("Response Data :- ", data);
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
            console.error("Error fetching user data:", error);
        } finally {
            setSpinLoading(false)
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
                                    onClick={() => router.replace("/company/register-turf")}
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
                                                        onClick={() => router.replace(`/company/turf-management/${turf._id}`)}
                                                    >
                                                        View Turf
                                                    </button>

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
