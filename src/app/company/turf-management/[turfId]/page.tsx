"use client";

import { useEffect, useState } from 'react';
import { useParams } from "next/navigation";
import { axiosInstance } from '@/utils/constants';
import TurfDetailsForm from '@/components/company/management/turf-management/TurfDetailsForm';
import FireLoading from '@/components/FireLoading';
import { TurfData } from '@/utils/type';
import Sidebar from '@/components/company/CompanySidebar';
import Header from '@/components/company/CompanyHeader';


export default function TurfDetails() {
    const [turf, setTurf] = useState<TurfData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const params = useParams();
    const turfId = params?.turfId;

    async function fetchTurfs(turfId: string) {
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
        fetchTurfs(turfId as string);
    }, [turfId]);

    return (
        <div>
            <div className="flex h-screen">
                <Sidebar />

                <div className="flex-1 flex flex-col">
                    <Header />
                    {loading ? <FireLoading renders={'Fetching Turf Details...'} /> : <TurfDetailsForm turf={turf} />}
                </div>
            </div>

        </div>
    );
}
