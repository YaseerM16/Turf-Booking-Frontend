"use client";

import { useEffect, useState } from 'react';
import { useParams } from "next/navigation";
import { axiosInstance } from '@/utils/constants';
import TurfDetailsForm from '@/components/company/management/turf-management/TurfDetailsForm';
import TurfDetailsPage from '@/components/company/management/turf-management/TurfDetailsPage';


export default function TurfDetails() {
    // const { turfId } = router.query; // Access `turfId` from the URL
    const [turf, setTurf] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const turfId = params?.turfId;

    // useEffect(() => {
    // if (turfId) { // Ensure `turfId` is defined /get-turf-details
    // Fetch turf details from API
    // console.log("Turf Id :", turfId);

    // fetch(`/api/turfs/${turfId}`) // Replace with your actual API endpoint
    //     .then((res) => res.json())
    //     .then((data) => {
    //         setTurf(data);
    //         setLoading(false);
    //     })
    //     .catch((err) => {
    //         console.error(err);
    //         setLoading(false);
    //     });
    // try {
    //     setLoading(true);
    //     const { data } = await axiosInstance.get(
    //         `/api/v1/company/get-turfs?companyId=${company?._id}`
    //     );

    //     if (data?.success) {
    //         setTurfs(data.turfs);
    //         setLoading(false)
    //     }

    // } catch (error) {
    //     console.error("Error fetching Turfs [] data:", error);
    // } finally {
    //     setLoading(false);
    // }
    // }
    // }, [turfId]);

    async function fetchTurfs(turfId: any) {
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
        fetchTurfs(turfId);
    }, [turfId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!turf) {
        return <p>Turf not found.</p>;
    }

    return (
        <div>
            <TurfDetailsPage turf={turf} />
        </div>
    );
}
