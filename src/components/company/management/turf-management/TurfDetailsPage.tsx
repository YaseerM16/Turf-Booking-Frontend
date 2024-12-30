"use client";
import React from "react";

import Header from "../../CompanyHeader";
import Sidebar from "../../CompanySidebar";
import TurfDetailsForm from "./TurfDetailsForm";
import { TurfData } from "../../../../utils/type"

type TurfDetailsProps = {
    turf: TurfData;
};

const TurfDetailsPage: React.FC<TurfDetailsProps> = ({ turf }) => {

    return (
        <>
            <div className="flex h-screen">
                <Sidebar />

                <div className="flex-1 flex flex-col">
                    <Header />
                    <TurfDetailsForm turf={turf} />
                </div>
            </div>

            <footer className="bg-green-700 text-white py-4">
                <div className="container mx-auto text-center">
                    <p className="text-sm">© 2024 Turf Booking. All rights reserved.</p>
                </div>
            </footer>
        </>
    );
};

export default TurfDetailsPage;
