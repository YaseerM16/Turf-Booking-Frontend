"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "../SideBar";
import { addSubcriptionPlan, deleteSubcriptionPlan, getSubcriptionPlans, updateSubcriptionPlan } from "@/services/adminApi";
import Swal from "sweetalert2";
import { AddSubscriptionModal, EditSubscriptionModal } from "./SubcriptionModals";
import Pagination from "@/components/Pagination";

export interface SubscriptionPlan {
    _id: string;
    name: string;
    price: number;
    duration: "monthly" | "yearly" | undefined;
    features: string;
    isActive: boolean;
    discount: number

}
// Define the type
export type SubscriptionFormData = {
    name: string;
    price: number;
    duration: "monthly" | "yearly" | undefined;
    features: string;
    isActive: boolean;
    register?: string
    discount: number
};

const Subscription = () => {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [editPlan, setEditPlan] = useState<SubscriptionPlan | null>(null);
    const [addPlan, setAddPlan] = useState<boolean | null>(null);
    const [showEdit, setShowEdit] = useState<boolean | null>(null);
    const [loadOperate, setLoadOperate] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPlans, setTotalPlans] = useState<number | null>(10)

    const plansPerPage = 6
    console.log("TotalPlan state :", totalPlans);


    const fetchPlans = useCallback(async () => {
        try {
            const response = await getSubcriptionPlans(currentPage, plansPerPage)
            if (response.success) {
                const { data } = response
                console.log("THsi are all the PLANs toTAL :", data.plans.totalPlans);
                setPlans(data.plans.plans);
                setTotalPlans(prev => (prev !== Math.ceil(data.plans.totalPlans / plansPerPage) ? Math.ceil(data.plans.totalPlans / plansPerPage) : prev));
            }
        } catch (err: unknown) {
            console.log("THIs is the FetchPlans err :", err);
            if (err instanceof Error) {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Error!",
                    text: err?.message || "Something went wrong. Please try again.",
                    showConfirmButton: true,
                    confirmButtonText: "OK",
                    timer: 3000,
                    toast: true,
                });
            }
        }
    }, [currentPage])
    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    const handleAddSubscription = useCallback(async (plan: SubscriptionFormData) => {
        try {
            console.log("Comapny ID : ", plan);

            setLoadOperate(true);
            const response = await addSubcriptionPlan(plan)

            if (response.success) {
                const { data } = response
                console.log("RESponse form the add Subcription api :", data.plans);
                setPlans(data.plans.plans);
                setTotalPlans(prev => (prev !== Math.ceil(data.plans.totalPlans / plansPerPage) ? Math.ceil(data.plans.totalPlans / plansPerPage) : prev));

                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Success!",
                    text: "Subscription added successfully.",
                    showConfirmButton: true,
                    confirmButtonText: "OK",
                    timer: 3000,
                    toast: true,
                });
                setLoadOperate(false)
                setAddPlan(false);
            }
        } catch (err: unknown) {
            console.log("Error add subscription plan:", err);
            if (err instanceof Error) {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Error!",
                    text: err?.message || "Something went wrong. Please try again.",
                    showConfirmButton: true,
                    confirmButtonText: "OK",
                    timer: 3000,
                    toast: true,
                });
            }
        } finally {
            setLoadOperate(false)
        }
    }, []);


    const handleEditSubscription = useCallback(async (plan: SubscriptionFormData, planId: string) => {
        try {
            setLoadOperate(true);
            const response = await updateSubcriptionPlan(plan, planId)

            if (response.success) {
                const { data } = response
                console.log("res the EDIIIT plan Api :", data.updatedPlan);
                setPlans((prevPlans) =>
                    prevPlans.map((plan) => (plan._id === data.updatedPlan._id ? data.updatedPlan : plan))
                );
                // setPlans((prevPlans) => [...prevPlans, data.newPlan]);
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Success!",
                    text: "Subscription Updated successfully.",
                    showConfirmButton: true,
                    confirmButtonText: "OK",
                    timer: 3000,
                    toast: true,
                });
                setLoadOperate(false)
                setShowEdit(false);
            }
        } catch (err: unknown) {
            console.log("Error Editing Plan data:", err);
            if (err instanceof Error) {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Error!",
                    text: err?.message || "Something went wrong. Please try again.",
                    showConfirmButton: true,
                    confirmButtonText: "OK",
                    timer: 3000,
                    toast: true,
                });
            }
        }
    }, []);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleDelete = async (planId: string) => {
        try {
            Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to Delete Plan?',
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
                    const response = await deleteSubcriptionPlan(planId)

                    if (response.success) {
                        console.log("Plan Deleted DUsjjd :)) ");
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: "Success!",
                            text: "Subscription has been Deleted successfully.",
                            showConfirmButton: true,
                            confirmButtonText: "OK",
                            timer: 3000,
                            toast: true,
                        });
                        setPlans((prevPlans) => prevPlans.filter(plan => plan._id !== planId));

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
        } catch (err: unknown) {
            console.error("Error Deleting Plan :", err);
            if (err instanceof Error) {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Error!",
                    text: err?.message || "Something went wrong. Please try again.",
                    showConfirmButton: true,
                    confirmButtonText: "OK",
                    timer: 3000,
                    toast: true,
                });
            }
        }
    };

    return (
        <div className="flex bg-gray-100 h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen">
                <header className="bg-yellow-100 p-6 rounded-lg shadow-md">
                    <h1 className="text-2xl font-semibold text-gray-800">Subscription Management</h1>
                    <p className="text-gray-600">Manage the subscription plans available for the Users.</p>
                </header>

                <main className="flex-1 overflow-y-auto">
                    {/* Subscription Plans Container */}
                    <div className="bg-white p-6 rounded-lg shadow-lg min-h-[700px] max-h-[900px] overflow-y-auto">
                        {/* Add Subscription Button */}
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={() => { setAddPlan(true); setEditPlan(null); setShowEdit(false) }}
                                className="bg-blue-600 text-white font-medium px-5 py-2 rounded-lg shadow-md transition duration-300 hover:bg-blue-700"
                            >
                                + Add Subscription
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {plans.map((plan) => (
                                <div key={plan._id} className="bg-gray-100 p-6 rounded-lg shadow-md">
                                    <h2 className="text-xl font-semibold text-gray-800">{plan.name}</h2>
                                    <p className="text-gray-600 mt-2">Duration: {plan.duration}</p>
                                    <p className="text-gray-600 mt-2">Duration: {plan.discount || "NaN"}</p>
                                    <p className="text-gray-800 font-bold mt-2">₹{plan.price}</p>

                                    {/* Actions */}
                                    <div className="mt-4 flex justify-between">
                                        <button
                                            onClick={() => { setAddPlan(false); setEditPlan(plan); setShowEdit(true); }}
                                            className="bg-green-600 text-white px-4 py-2 rounded-md shadow-md transition duration-300 hover:bg-green-700"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(plan._id)}
                                            className="bg-red-600 text-white px-4 py-2 rounded-md shadow-md transition duration-300 hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </main>
                {/* Pagination */}
                <div className="flex justify-center items-center py-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPlans!}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>

            {/* Add/Edit Modal */}
            {addPlan && (
                <AddSubscriptionModal
                    onClose={() => setAddPlan(false)}
                    onSubmit={handleAddSubscription}
                    load={loadOperate}
                />
            )}

            {showEdit && (
                <EditSubscriptionModal
                    onClose={() => setShowEdit(false)}
                    onSubmit={handleEditSubscription} plan={editPlan || null}
                    load={loadOperate}
                />
            )}
        </div>
    );

};

export default Subscription;
