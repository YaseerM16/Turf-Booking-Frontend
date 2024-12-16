"use client";
import React, { useEffect, useState } from "react";
// import Sidebar from "../CompanySidebar";
Sidebar
import { axiosInstance } from "@/utils/constants";
import { logout } from "@/store/slices/UserSlice";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { setCompany } from "@/store/slices/CompanySlice";
// import Header from "../CompanyHeader";
Header
import { AiOutlinePlus } from "react-icons/ai";
import FireLoading from "@/components/FireLoading";
import Header from "../../CompanyHeader";
import Sidebar from "../../CompanySidebar";
import { TurfData } from "../../../../utils/type"
import TurfDetailsForm from "../turf-management/TurfDetailsForm";
import TurfSlots from "./TurfSlots";
import { WorkingSlots } from "./TurfSlots"

useRouter
Sidebar
useAppDispatch

type TurfDetailsProps = {
    turf: TurfData; // Define the type for the props
};


const SlotDetailsPage: React.FC<TurfDetailsProps> = ({ turf }) => {
    const dispatch = useAppDispatch()
    // const company = useAppSelector((state) => state.companies);
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const company: any = JSON.parse(localStorage.getItem("companyAuth") as any)
    const [turfs, setTurfs] = useState<any[]>([]);
    // console.log("Turf in the SlotListPage :", turf);


    // useEffect(() => {
    //     const storedCompany = localStorage.getItem("companyAuth");
    //     if (storedCompany) {
    //         dispatch(setCompany(JSON.parse(storedCompany)));
    //     }
    // }, [dispatch]);


    // async function fetchTurfs() {
    //     try {
    //         setLoading(true);
    //         const { data } = await axiosInstance.get(
    //             `/api/v1/company/get-turfs?companyId=${company?._id}`
    //         );

    //         if (data?.success) {
    //             setTurfs(data.turfs);
    //             setLoading(false)
    //         }

    //     } catch (error) {
    //         console.error("Error fetching Turfs [] data:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    // useEffect(() => {
    //     fetchTurfs();
    // }, []);


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
                    <TurfSlots turf={turf.turf} />

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

export default SlotDetailsPage;
