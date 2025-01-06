"use client";
import React from "react";
import Header from "../../CompanyHeader";
import Sidebar from "../../CompanySidebar";
import { TurfData } from "../../../../utils/type"
import TurfSlots from "./TurfSlots";

type TurfDetailsProps = {
    turf: TurfData; // Define the type for the props
};


const SlotDetailsPage: React.FC<TurfDetailsProps> = ({ turf }) => {

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
