"use client";
import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "./SideBar";
import { axiosInstance } from "@/utils/constants";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import Map from "./ComapanyLocationMap";
import "react-toastify/dist/ReactToastify.css";
import FireLoading from "../FireLoading";
import { Company } from "@/utils/type"
import MapComponent from "../OlaMapComponent";
import Image from "next/image";


const ApprovedCompanies: React.FC = () => {
    const [companies, setCompanies] = useState<Company[] | []>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null); // For the modal display
    const [filter, setFilter] = useState<string>("all");
    const [isMapVisible, setIsMapVisible] = useState(false); // State to control map modal visibility
    console.log("Map is Visible :", isMapVisible);

    const companiesPerPage = 10;

    const fetchCompanies = useCallback(async (page: number, searchQry: string, filter: string) => {
        try {
            setLoading(true);

            let query = `page=${page}&limit=${companiesPerPage}`;
            if (searchQry) {
                query += `&searchQry=${searchQry}`;
            }
            if (filter && filter !== "all") {
                query += `&filter=${filter}`;
            }

            const { data } = await axiosInstance.get(
                `/api/v1/admin/get-approved-companies?${query}`
            );

            if (data?.success) {
                setCompanies(data.companies);
                setTotalPages(Math.ceil(data.totalCompany / companiesPerPage));
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    }, [companiesPerPage])

    useEffect(() => {
        fetchCompanies(currentPage, searchQuery, filter);
    }, [currentPage, searchQuery, filter, fetchCompanies]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const closeModal = () => {
        setSelectedCompany(null);
    };
    const toggleMapState = () => {
        setIsMapVisible(prev => !prev)
    }

    const handleToggleBlock = async (email: string, companyId: string) => {
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
                    setLoading(true);
                    console.log("Email :", email);
                    console.log("CompanID :", companyId);

                    const { data } = await axiosInstance.get(
                        `/api/v1/admin/company-toggle-block?email=${email}&companyId=${companyId}`
                    );

                    if (data?.success) {
                        toast.success("Company Block Status Toggled successfully ✅", { onClose: () => fetchCompanies(currentPage, searchQuery, filter) })
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
            setLoading(false);
        }
    };


    return (
        <>
            <ToastContainer position="top-center" autoClose={1000} />
            <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <header className="bg-yellow-100 p-6 rounded-lg shadow-md">
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Approved Companies
                        </h1>
                        <p className="text-gray-600">
                            List of companies Approved in the system
                        </p>
                    </header>

                    <main className="flex-1 overflow-auto mt-6 p-6">
                        <div className="bg-white shadow-md rounded-lg p-6">
                            {/* Search Input */}
                            <div className="mb-4">
                                <label className="block text-lg font-semibold text-gray-700 mb-2">
                                    Search by Company Name or Email
                                </label>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)} // Update the search query on input change
                                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Enter company name or email to search..."
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
                            {loading ? <FireLoading renders={"Retrieveing Approved Companies"} /> : (<table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-green-700 text-white">
                                        <th className="px-4 py-3 text-center">#</th>
                                        <th className="px-4 py-3 text-center">Company Name</th>
                                        <th className="px-4 py-3 text-center">Email</th>
                                        <th className="px-4 py-3 text-center">Phone</th>
                                        <th className="px-4 py-3 text-center">Location</th>
                                        <th className="px-4 py-3 text-center">Status</th>
                                        <th className="px-4 py-3 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {companies.map((company, index) => (
                                        <tr
                                            key={index}
                                            className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                                                } hover:bg-yellow-50`}
                                        >
                                            <td className="border px-4 py-3 text-center">{index + 1}</td>
                                            <td className="border px-4 py-3 text-center">{company.companyname}</td>
                                            <td className="border px-4 py-3 text-center">{company.companyemail}</td>
                                            <td className="border px-4 py-3 text-center">{company.phone}</td>

                                            <td className="border px-4 py-3 text-center">
                                                {/* <FaMapMarkerAlt
                                                    className="text-green-700 cursor-pointer inline-block"
                                                    onClick={() => handleLocationClick(company)}
                                                /> */}
                                                <td className="border px-4 py-3 text-center">
                                                    <MapComponent location={company.location} company={{ images: company?.profilePicture ? [company.profilePicture] : [], companyname: company?.companyname || "Turf company", phone: company?.phone || "N/A" }} toggleview={toggleMapState} />
                                                </td>
                                            </td>
                                            <td className="border px-4 py-3 text-center">
                                                <span
                                                    className={`${company.isActive ? "text-green-600" : "text-red-600"} font-semibold`}
                                                >
                                                    {company.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="border px-4 py-3 text-center">
                                                <button
                                                    className={`${company.isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} text-white px-4 py-2 rounded-md font-medium`}
                                                    onClick={() => handleToggleBlock(company.companyemail, company._id)}
                                                >
                                                    {company.isActive ? "Block" : "Unblock"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>)}

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

            {/* Modal for Map */}
            {selectedCompany && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-3/4 p-6 relative">
                        <button
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                            onClick={closeModal}
                        >
                            &times;
                        </button>
                        <div className="flex gap-4">
                            <Image
                                src={selectedCompany.profilePicture || '/logo.jpeg'}
                                alt={selectedCompany.companyname}
                                width={96}
                                height={96}
                                className="object-cover rounded-lg"
                            />

                            <div>
                                <h2 className="text-2xl font-bold">{selectedCompany.companyname}</h2>
                                <p>Email: {selectedCompany.companyemail}</p>
                                <p>Phone: {selectedCompany.phone}</p>
                            </div>
                        </div>
                        <Map location={selectedCompany.location} profilePicture={"/logo.jpeg"} companyName={selectedCompany.companyname} />
                    </div>
                </div>
            )}
        </>
    );
};

export default ApprovedCompanies;
