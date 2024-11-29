"use client";
import React, { useState, useEffect } from "react";
import { axiosInstance } from "@/utils/constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./SideBar";
import Swal from 'sweetalert2';

Sidebar

const UserManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>("/dashboard");
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [spinLoading, setSpinLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const usersPerPage = 10;

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    const fetchUsers = async (page: number, searchQuery: string) => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get(
                `/api/v1/admin/get-users?page=${page}&limit=${usersPerPage}&searchQry=${searchQuery}`
            );

            if (data?.success) {
                setUsers(data.users);
                setTotalUsers(data.totalUsers);
                setTotalPages(Math.ceil(data.totalUsers / usersPerPage));
            }

        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(currentPage, searchQuery);
    }, [currentPage, searchQuery]);


    const handleToggleBlock = async (email: string, userId: string) => {
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
                    const { data } = await axiosInstance.get(
                        `/api/v1/admin/user-toggle-block?email=${email}&userId=${userId}`
                    );

                    if (data?.success) {
                        toast.success("User Block or Unblocked successfully :", { onClose: () => fetchUsers(currentPage, searchQuery) })
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
            setSpinLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
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

            <div className="flex min-h-screen">
                <Sidebar activeTab={activeTab} handleTabClick={handleTabClick} />
                <div className="flex-1 flex flex-col">
                    <header className="bg-yellow-100 p-6 rounded-lg shadow-md">
                        <h1 className="text-2xl font-semibold text-gray-800">User Management</h1>
                        <p className="text-gray-600">Manage the users of the system</p>
                    </header>

                    <main className="flex-1 overflow-auto mt-6 p-6">
                        <div className="bg-white shadow-md rounded-lg p-6">
                            {/* Search Input */}
                            <div className="mb-4">
                                <label className="block text-lg font-semibold text-gray-700 mb-2">
                                    Search by Name or Email
                                </label>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)} // Update the search query on input change
                                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Enter name or email to search..."
                                />
                            </div>


                            {loading ? (<div className="flex justify-center items-center h-screen">
                                <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-green-700 border-solid"></div>
                            </div>) : (<table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-green-700 text-white">
                                        <th className="px-4 py-3">#</th>
                                        <th className="px-4 py-3">Name</th>
                                        <th className="px-4 py-3">Email</th>
                                        <th className="px-4 py-3">Phone</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(users) && users.length > 0 ? (
                                        users.map((user, index) => (
                                            <tr
                                                key={index}
                                                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                                                    } hover:bg-yellow-50`}
                                            >
                                                <td className="border px-4 py-3">
                                                    {(currentPage - 1) * usersPerPage + index + 1}
                                                </td>
                                                <td className="border px-4 py-3">{user.name}</td>
                                                <td className="border px-4 py-3">{user.email}</td>
                                                <td className="border px-4 py-3">{user.phone}</td>
                                                <td className="border px-4 py-3">
                                                    <span
                                                        className={`${user.isActive ? "text-green-600" : "text-red-600"} font-semibold`}
                                                    >
                                                        {user.isActive ? "Active" : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="border px-4 py-3">
                                                    <button
                                                        className={`${user.isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} text-white px-4 py-2 rounded-md font-medium`}
                                                        onClick={() => handleToggleBlock(user.email, user._id)}
                                                    >
                                                        {user.isActive ? "Block" : "Unblock"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (<tr>
                                        <td colSpan={6} className="text-center py-4">
                                            No users found.
                                        </td>
                                    </tr>)}
                                </tbody>
                            </table>)}


                            {/* Pagination controls */}
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
        </>
    );
};

export default UserManagement;
