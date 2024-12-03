"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../CompanySidebar";
import { axiosInstance } from "@/utils/constants";
import { logout } from "@/store/slices/UserSlice";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { setCompany } from "@/store/slices/CompanySlice";
import Header from "../CompanyHeader";
import { AiOutlinePlus } from "react-icons/ai";
import FireLoading from "@/components/FireLoading";

useRouter
Sidebar
useAppDispatch

const TurfManagement: React.FC = () => {
    const dispatch = useAppDispatch()
    // const company = useAppSelector((state) => state.companies);
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const company: any = JSON.parse(localStorage.getItem("companyAuth") as any)
    console.log("Company @ localstorage :", company);
    const [turfs, setTurfs] = useState<any[]>([]);


    // useEffect(() => {
    //     const storedCompany = localStorage.getItem("companyAuth");
    //     if (storedCompany) {
    //         dispatch(setCompany(JSON.parse(storedCompany)));
    //     }
    // }, [dispatch]);


    async function fetchTurfs() {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get(
                `/api/v1/company/get-turfs?companyId=${company?._id}`
            );

            if (data?.success) {
                setTurfs(data.turfs);
                setLoading(false)
            }

        } catch (error) {
            console.error("Error fetching Turfs [] data:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchTurfs();
    }, []);



    // const [turfs, setTurfs] = useState([
    //     { id: 1, size: "5v5", type: "Close Turf", price: 750, workingHours: "5 AM - 12 PM" },
    //     { id: 2, size: "7v7", type: "Open Turf", price: 1000, workingHours: "5 AM - 12 PM" },
    //     { id: 3, size: "7v7", type: "Open Turf", price: 1000, workingHours: "5 AM - 12 PM" },
    // ]);

    const handleEdit = (id: number) => {
        console.log("Edit turf with ID:", id);
        // Logic to edit turf
    };

    const handleDelete = (id: number) => {
        console.log("Delete turf with ID:", id);
        // Logic to delete turf
    };

    const handleAddTurf = () => {
        console.log("Add a new turf");
        // Logic to add a new turf
    };
    // const company = useAppSelector((state) => state.companies);

    // useEffect(() => {
    //     const storedCompany = localStorage.getItem("companyAuth");
    //     if (storedCompany) {
    //         dispatch(setCompany(JSON.parse(storedCompany)));
    //     }
    // }, [dispatch]);

    return (
        <>
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
                                < div className="w-full mt-8 overflow-y-auto">
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

                                                {/* View Button */}
                                                <div className="flex justify-center mt-4">
                                                    <button
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium flex items-center"
                                                        onClick={() => router.replace(`/company/turf-management/${turf._id}`)}
                                                    >
                                                        View Turf
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>)}
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
