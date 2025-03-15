"use client";
import React, { useState, useEffect } from "react";
import { axiosInstance } from "@/utils/constants";
import Sidebar from "./SideBar";
import Swal from 'sweetalert2';
import Pagination from "../Pagination";
import FireLoading from "../FireLoading";
import { User } from "@/utils/type";
import { toggleUserBlock } from "@/services/adminApi";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";


const UserManagement: React.FC = () => {
    const router = useRouter()
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filter, setFilter] = useState<string>("all"); // "all", "active", "inactive"

    const usersPerPage = 10;

    useEffect(() => {
        const token = Cookies.get("AdminToken"); // Replace 'authToken' with your actual cookie name

        if (!token) {
            router.push("/admin/login"); // Redirect to login if token is missing
        }
    }, []);

    const fetchUsers = async (page: number, searchQuery: string, filter: string) => {
        try {
            setLoading(true);

            let query = `page=${page}&limit=${usersPerPage}`;
            if (searchQuery) {
                query += `&searchQry=${searchQuery}`;
            }
            if (filter && filter !== "all") {
                query += `&filter=${filter}`;
            }

            const { data } = await axiosInstance.get(
                `/api/v1/admin/get-users?${query}`
            );

            console.log("res Data :", data);


            if (data?.success) {
                setUsers(data.users);
                setTotalPages(Math.ceil(data.totalUsers / usersPerPage));
            }

        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(currentPage, searchQuery, filter);
    }, [currentPage, searchQuery, filter]);


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
                    const response = await toggleUserBlock(email, userId)
                    if (response?.success) {
                        const { data } = response;
                        console.log("there's a response of UserBlockToggle :", data.user._id);

                        setUsers((prevUsers) =>
                            prevUsers.map((user) =>
                                user._id === data.user._id ? { ...user, ...data.user } : user
                            )
                        );
                        Swal.fire({
                            icon: 'success',
                            title: "Success",
                            text: "User Block Status Toggled successfully ✅",
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 2000, // 2 seconds
                            timerProgressBar: true,
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
            console.log("Error fetching user data:", error);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <>

            <div className="flex min-h-screen">
                <Sidebar />
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

                            {/* Filter Dropdown */}
                            <div className="mb-4">
                                <label className="block text-lg font-semibold text-gray-700 mb-2">
                                    Filter by Status
                                </label>
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="all">All</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            {loading ? <FireLoading renders={"Fetching Users"} /> : (<table className="w-full text-left border-collapse">
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
                                                    { }
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


                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

export default UserManagement;
