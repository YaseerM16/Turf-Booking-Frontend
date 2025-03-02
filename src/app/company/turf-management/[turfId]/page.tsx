"use client";

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from "next/navigation";
import TurfDetailsForm from '@/components/company/management/turf-management/TurfDetailsForm';
import FireLoading from '@/components/FireLoading';
import { TurfData } from '@/utils/type';
import Sidebar from '@/components/company/CompanySidebar';
import Header from '@/components/company/CompanyHeader';
import { getTurfDetails } from '@/services/TurfApis';
import { useAppSelector } from '@/store/hooks';
import Swal from 'sweetalert2';


export default function TurfDetails() {
    const [turf, setTurf] = useState<TurfData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const company = useAppSelector(state => state.companies.company)
    const params = useParams();
    const router = useRouter()
    const turfId = params?.turfId;

    const fetchTurfDetails = useCallback(async (turfId: string) => {
        try {
            setLoading(true);
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
    }, [company?._id, router])

    useEffect(() => {
        if (company?._id && turfId) {  // Ensure company ID is available
            fetchTurfDetails(turfId as string);
        }
    }, [turfId, company?._id, fetchTurfDetails]);


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
