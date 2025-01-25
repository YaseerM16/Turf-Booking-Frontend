"use client";

import React, { useState, useEffect, useCallback } from 'react';
import FireLoading from '../FireLoading';
import { useAppSelector } from '@/store/hooks';
import { getVerificationMail, getWalletApi } from "@/services/userApi"
import { Wallet, WalletTransaction } from "@/utils/type"
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from 'react-toastify';
import Spinner from '../Spinner';
import "react-toastify/dist/ReactToastify.css";
import Pagination from '../Pagination';


const MyWallet: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter()
    const [spinLoading, setSpinLoading] = useState<boolean>(false);
    const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
    const [currentBalance, setCurrentBalance] = useState<number | null>(null)
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [walletLength, setWalletLength] = useState<number | null>(null)
    const [paginatedTransactions, setPaginatedTransactions] = useState<WalletTransaction[]>([]);

    const user = useAppSelector((state) => state.users.user);
    const transactionPerPage = 6
    // console.log("USER :", user);
    const getTheWallet = useCallback(async (userId: string) => {
        try {
            setLoading(true);

            const response = await getWalletApi(userId);
            if (response.success) {
                const { data } = response
                const wallet: { wallet: Wallet } = data
                const walletTransactions = wallet.wallet.walletTransaction || [];
                setTransactions(walletTransactions); // Set full transaction list
                setCurrentBalance(wallet.wallet.walletBalance);

                const totalPages = Math.ceil(walletTransactions.length / transactionPerPage);
                setWalletLength(totalPages);

                // Paginate initial page
                const startIndex = (currentPage - 1) * transactionPerPage;
                const endIndex = startIndex + transactionPerPage;
                setPaginatedTransactions(walletTransactions.slice(startIndex, endIndex));
            }

        } catch (error) {
            console.log("Error while fetching wallet data:", error);
            toast.error("Error while fetching wallet data")
        } finally {
            setLoading(false);
        }
    }, [currentPage, transactionPerPage]);
    console.log("Pginationesd fWeaers : ", paginatedTransactions);


    const handlePageChange = (page: number) => {
        setCurrentPage(page);

        // Update paginated transactions
        const startIndex = (page - 1) * transactionPerPage;
        const endIndex = startIndex + transactionPerPage;
        setPaginatedTransactions(transactions.slice(startIndex, endIndex));
    };

    useEffect(() => {
        if (user?._id) {
            getTheWallet(user._id)
        }
    }, [user?._id, getTheWallet]);
    // console.log("CUURENT VAlance :", currentBalance);
    // console.log("CUURENT TRans :", transactions);

    const getVerifyMail = async () => {
        try {
            setSpinLoading(true);
            const response = await getVerificationMail(user?._id as string)
            console.log("Res getEamil :", response);

            if (response.success) {
                setSpinLoading(false);
                toast.success("Verification email sent successfully!", {
                    onClose: () => router.replace(`/checkmail?type=verify`),
                });
            }
        } catch (error) {
            console.error("Error updating profile image:", error);
            toast.error("Failed to get verification mail.")
        } finally {
            setSpinLoading(false);
        }
    }

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
            {loading && <FireLoading renders="Fetching Wallet Details" />}

            <div className="h-[120vh] bg-gradient-to-br from-green-200 via-yellow-100 to-green-50 flex flex-col">
                {/* Header Section */}
                {/* <section
                    className="h-64 bg-cover bg-center flex justify-center items-center"
                    style={{ backgroundImage: `url('/turf-background-image.jpg')` }}
                >
                    <h2 className="text-3xl font-bold text-white bg-black bg-opacity-50 p-4 rounded-lg">
                        My Wallet
                    </h2>
                </section> */}



                <div className="bg-gradient-to-b from-gray-100 to-gray-200">
                    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-xl">
                        {/* Header Section */}
                        <div className="h-60 bg-cover bg-center flex justify-around items-center"
                            style={{ backgroundImage: `url('/turf-background-image.jpg')` }}>
                            {/* Title */}
                            <h3 className="text-3xl font-bold text-white bg-black bg-opacity-50 p-4 rounded-lg">
                                Wallet Transactions
                            </h3>

                            {/* Current Balance Section */}
                            <div className="bg-gradient-to-r from-green-600 to-green-400 text-white px-8 py-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                                <div className="text-right">
                                    <h3 className="text-lg font-semibold uppercase">Current Balance</h3>
                                    <p className="text-3xl font-extrabold">₹{currentBalance}</p>
                                </div>
                            </div>
                        </div>
                        {!user?.isVerified ? <>
                            <div className="flex flex-col items-center justify-center h-96 bg-gray-100 rounded-lg shadow-lg p-6">
                                <div className="text-center">
                                    <h2 className="text-3xl font-bold text-gray-800 mb-4">No Wallet Found!</h2>
                                    <p className="text-lg text-gray-600">
                                        You don&apos;t have a wallet yet. Please verify your email to create your wallet and start using our services.
                                    </p>
                                </div>
                                {spinLoading ? <Spinner /> : <button
                                    type='button'
                                    className="mt-6 bg-green-700 text-white text-lg font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300"
                                    onClick={() => getVerifyMail()}
                                >
                                    Verify Email
                                </button>}

                            </div>

                        </> : <>
                            {paginatedTransactions && paginatedTransactions?.length === 0 ? (
                                <p className="text-center text-gray-600 text-lg">You have no transactions yet.</p>
                            ) : (
                                <div className="overflow-x-auto h-[60vh]">
                                    <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
                                        <thead className="bg-gradient-to-r from-green-700 to-green-600 text-white">
                                            <tr>
                                                <th className="py-4 px-6 text-left font-semibold uppercase tracking-wide">
                                                    Date
                                                </th>
                                                <th className="py-4 px-6 text-left font-semibold uppercase tracking-wide">
                                                    Transaction Type
                                                </th>
                                                <th className="py-4 px-6 text-left font-semibold uppercase tracking-wide">
                                                    Method
                                                </th>
                                                <th className="py-4 px-6 text-left font-semibold uppercase tracking-wide">
                                                    Balance
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedTransactions &&
                                                paginatedTransactions.map((transaction, index) => (
                                                    <tr
                                                        key={index}
                                                        className={`transition-colors duration-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                                            } hover:bg-green-50`}
                                                    >
                                                        {/* Correctly map the `transactionDate` field */}
                                                        <td className="py-4 px-6 text-gray-700">
                                                            {new Date(transaction?.transactionDate).toLocaleDateString()}
                                                        </td>

                                                        {/* Correctly map the `transactionType` field */}
                                                        <td className="py-4 px-6 text-gray-700 font-medium">
                                                            <span
                                                                className={`py-1 px-3 rounded-full text-sm ${transaction.transactionType === 'credit'
                                                                    ? 'bg-green-200 text-green-700'
                                                                    : 'bg-red-200 text-red-700'
                                                                    }`}
                                                            >
                                                                {transaction.transactionType.charAt(0).toUpperCase() +
                                                                    transaction.transactionType.slice(1)}
                                                            </span>
                                                        </td>

                                                        {/* Correctly map the `transactionMethod` field */}
                                                        <td className="py-4 px-6 text-gray-700">{transaction.transactionMethod}</td>

                                                        {/* Correctly map the `transactionAmount` field */}
                                                        <td className="py-4 px-6 text-gray-800 font-semibold">
                                                            ₹{transaction.transactionAmount}
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>

                                    </table>
                                </div>
                            )}
                        </>}
                        {/* Transactions Table */}

                    </div>
                </div>
                {/* <div>
                    PaginatedTransaction
                    {paginatedTransactions.map((transaction, index) => (
                        <div key={index}>
                        <p>{transaction.detail}</p>
                        </div>
                        ))}
                        </div> */}
                {/* Pagination */}
                {user?.isVerified && <div className="flex justify-center items-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={walletLength!}
                        onPageChange={handlePageChange}
                    />
                </div>}

            </div>

        </>
    );
};

export default MyWallet;
