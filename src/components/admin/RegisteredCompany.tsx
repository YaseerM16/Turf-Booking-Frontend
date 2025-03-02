"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "./SideBar";
import { axiosInstance } from "@/utils/constants";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import Map from "./ComapanyLocationMap";
import "react-toastify/dist/ReactToastify.css";
import FireLoading from "../FireLoading";
import MapComponent from "../OlaMapComponent";
import { Company } from "@/utils/type";
import Image from "next/image";


const RegisteredCompanies: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [totalPages, setTotalPages] = useState<number>(1);

    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null); // For the modal display
    const companiesPerPage = 10;

    const fetchUsers = async (page: number, searchQry: string) => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get(
                `/api/v1/admin/get-registered-companies?page=${page}&limit=${companiesPerPage}&searchQry=${searchQry}`
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
    };

    useEffect(() => {
        fetchUsers(currentPage, searchQuery);
    }, [currentPage, searchQuery]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleApprove = async (companyId: string, companyEmail: string) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to proceed?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, proceed!",
            cancelButtonText: "No, cancel!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const { data } = await axiosInstance.patch(
                        "/api/v1/admin/approve-company",
                        {
                            companyId,
                            companyEmail,
                        }
                    );

                    if (data?.success) {
                        toast.success("Company approved successfully!", {
                            onClose: () => fetchUsers(currentPage, searchQuery)
                        });
                    }
                } catch (error) {
                    console.error("Error approving the company:", error);
                    toast.error("Failed to approve the company.");
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                toast.info("Action canceled.");
            }
        });
    };

    const closeModal = () => {
        setSelectedCompany(null);
    };
    console.log("Company :", companies);



    return (
        <>
            <ToastContainer position="top-center" autoClose={1000} />
            <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <header className="bg-yellow-100 p-6 rounded-lg shadow-md">
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Registered Companies
                        </h1>
                        <p className="text-gray-600">
                            List of companies registered in the system
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
                            {loading ? <FireLoading renders={"Retrieveing Registered Companies"} /> : (<table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-green-700 text-white">
                                        <th className="px-4 py-3 text-center">#</th>
                                        <th className="px-4 py-3 text-center">Company Name</th>
                                        <th className="px-4 py-3 text-center">Email</th>
                                        <th className="px-4 py-3 text-center">Phone</th>
                                        <th className="px-4 py-3 text-center">Action</th>
                                        <th className="px-4 py-3 text-center">Location</th>
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
                                                <button
                                                    className="text-white px-4 py-2 rounded-md font-medium bg-green-500 hover:bg-green-600 inline-block"
                                                    onClick={() => handleApprove(company._id, company.companyemail)}
                                                >
                                                    Approve
                                                </button>
                                            </td>
                                            <td className="border px-4 py-3 text-center">
                                                <MapComponent location={company.location} company={{ images: company?.profilePicture ? [company.profilePicture] : [], companyname: company?.companyname || "Turf company", phone: company?.phone || "N/A" }} />
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

export default RegisteredCompanies;
