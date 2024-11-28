"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "./SideBar";
import { axiosInstance } from "@/utils/constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from 'sweetalert2';




const RegisteredCompanies: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>("/dashboard");
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [spinLoading, setSpinLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const usersPerPage = 10;

    const fetchUsers = async (page: number) => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get(
                `/api/v1/admin/get-registered-companies?page=${page}&limit=${usersPerPage}`
            );

            if (data?.success) {
                toast.success("Companies Data is Getting")
                console.log("Companies :", data);

                setCompanies(data.companies);
                setTotalUsers(data.totalCompany);
                // setTotalPages(Math.ceil(data.totalUsers / usersPerPage));
            }


        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    // Function to handle tab click and set active tab
    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-green-700 border-solid"></div>
            </div>
        );
    }

    const handleApprove = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to proceed?',
            icon: 'warning',
            showCancelButton: true, // Only define this once
            confirmButtonText: 'Yes, proceed!',
            cancelButtonText: 'No, cancel!',
            toast: true, // For toast-style
            position: 'top-end',
            timer: 3000, // Optional: Duration for the toast
            timerProgressBar: true,
        }).then((result) => {
            if (result.isConfirmed) {
                // Handle confirmed action here

            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // Handle cancellation
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
    }

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
            <div className="flex min-h-screen">
                <Sidebar activeTab={activeTab} handleTabClick={handleTabClick} />
                <div className="flex-1 flex flex-col">
                    <header className="bg-yellow-100 p-6 rounded-lg shadow-md">
                        <h1 className="text-2xl font-semibold text-gray-800">Registered Companies</h1>
                        <p className="text-gray-600">List of companies registered in the system</p>
                    </header>

                    <main className="flex-1 overflow-auto mt-6 p-6">
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-green-700 text-white">
                                        <th className="px-4 py-3">#</th>
                                        <th className="px-4 py-3">Company Name</th>
                                        <th className="px-4 py-3">Email</th>
                                        <th className="px-4 py-3">Phone</th>
                                        <th className="px-4 py-3">Action</th>
                                        <th className="px-4 py-3">Location</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {companies.map((company, index) => (
                                        <tr
                                            key={index}
                                            className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                                                } hover:bg-yellow-50`}
                                        >
                                            <td className="border px-4 py-3">{index + 1}</td>
                                            <td className="border px-4 py-3">{company.companyname}</td>
                                            <td className="border px-4 py-3">{company.companyemail}</td>
                                            <td className="border px-4 py-3">{company.phone}</td>
                                            <td className="border px-4 py-3">
                                                <button
                                                    className=" text-white px-4 py-2 rounded-md font-medium bg-green-500 hover:bg-green-600"
                                                    onClick={() => handleApprove()}
                                                >
                                                    {/* {user.isActive ? "Block" : "Unblock"} */}
                                                    Approve
                                                </button>
                                            </td>
                                            {/* <td className="border px-4 py-3">{company.location}</td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="flex justify-between items-center mt-4">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="bg-green-700 text-white px-4 py-2 rounded-md font-medium disabled:bg-gray-400"
                                >
                                    Previous
                                </button>

                                <span className="text-gray-700 font-semibold">
                                    Page {currentPage} of {totalPages}
                                </span>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="bg-green-700 text-white px-4 py-2 rounded-md font-medium disabled:bg-gray-400"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <footer className="bg-gray-800 text-white py-4">
                <div className="container mx-auto text-center">
                    <p>© 2024 Turf Booking. All rights reserved.</p>
                    <p>
                        <a href="/terms" className="underline">
                            Terms & Conditions
                        </a>
                    </p>
                </div>
            </footer>
        </>
    );

};

export default RegisteredCompanies;
