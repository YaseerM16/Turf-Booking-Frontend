"use client";

import { useEffect, useState } from 'react';
import { useParams } from "next/navigation";
import { axiosInstance } from '@/utils/constants';
import TurfSlots from '@/components/company/management/slot-management/TurfSlots';
import Sidebar from '@/components/company/CompanySidebar';
import Header from '@/components/company/CompanyHeader';
import { TurfData } from '@/utils/type';
import FireLoading from '@/components/FireLoading';

type TurfDetailsProps = {
    turf: TurfData | null; // Define the type for the props
};

export default function TurfDetails() {
    const [turf, setTurf] = useState<TurfData | null>(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const turfId = params?.turfId;

    async function fetchTurfDetails(turfId: any) {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get(
                `/api/v1/company/get-turf-details?turfId=${turfId}`
            );
            if (data?.success) {
                const setTurfDets = { turf: data.turf }
                setTurf(setTurfDets);
                setLoading(false)
            }

        } catch (error) {
            console.error("Error fetching Turfs [] data:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchTurfDetails(turfId);
    }, [turfId]);



    return (
        <>
            <div className="flex h-screen">
                <Sidebar />

                <div className="flex-1 flex flex-col">
                    <Header />
                    {loading ? <FireLoading renders={'Fetching Turf Slots'} /> : <TurfSlots turf={turf!.turf} />}
                </div>
            </div>

            <footer className="bg-green-700 text-white py-4">
                <div className="container mx-auto text-center">
                    <p className="text-sm">© 2024 Turf Booking. All rights reserved.</p>
                </div>
            </footer>
        </>
    );
}
