"use client";

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from "next/navigation";
import TurfSlots from '@/components/company/management/slot-management/TurfSlots';
import Sidebar from '@/components/company/CompanySidebar';
import Header from '@/components/company/CompanyHeader';
import { TurfData } from '@/utils/type';
import FireLoading from '@/components/FireLoading';
import { useAppSelector } from '@/store/hooks';
import { getTurfDetails } from '@/services/TurfApis';
import Swal from 'sweetalert2';

export default function TurfDetails() {
    const [turf, setTurf] = useState<TurfData | null>(null);
    const [loading, setLoading] = useState(true);
    const company = useAppSelector(state => state.companies.company)
    const router = useRouter()


    const params = useParams();
    const turfId = params?.turfId;

    const fetchTurfDetails = useCallback(async (turfId: string) => {
        try {
            // "/get-turf-details/${companyId}/${turfId}"
            setLoading(true);
            // const { data } = await axiosInstance.get(
            //     `/api/v1/company/get-turf-details?turfId=${turfId}`
            // );
            // if (data?.success) {
            //     const setTurfDets = { turf: data.turf }
            //     setTurf(setTurfDets);
            //     setLoading(false)
            // }
            const response = await getTurfDetails(company?._id as string, turfId)
            if (response.success) {
                const { data } = response
                const setTurfDets = { turf: data.turf }
                setTurf(setTurfDets);
                setLoading(false)
            }

        } catch (error) {
            console.log("Error fetching Turfs [] data:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error Fetching!',
                text: `${(error as Error).message}` || "something went wrong while fetching turf details :(",
                confirmButtonText: 'Go Back',
            }).then((result) => {
                if (result.isConfirmed) {
                    router.back()
                    console.log("User acknowledged the failure.");
                    // Handle retry logic or additional actions here
                }
            });
        } finally {
            setLoading(false);
        }
    }, [company?._id, router]);


    useEffect(() => {
        if (company?._id && turfId) {  // Ensure company ID is available
            fetchTurfDetails(turfId as string);
        }
    }, [turfId, company?._id, fetchTurfDetails]);




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
