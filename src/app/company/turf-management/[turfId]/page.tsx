"use client";

import { useEffect, useState } from 'react';
import { useParams } from "next/navigation";
import { axiosInstance } from '@/utils/constants';
import TurfDetailsForm from '@/components/company/management/turf-management/TurfDetailsForm';
import TurfDetailsPage from '@/components/company/management/turf-management/TurfDetailsPage';
import axios from 'axios';


export default function TurfDetails() {
    // const { turfId } = router.query; // Access `turfId` from the URL
    const [turf, setTurf] = useState<any>(null);
    const [address, setAddress] = useState<string>("")
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
                const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${data.turf.location.latitude}%2C${data.turf.location.longitude}&key=ba8938b3f8ce4c78bc0b4fda6c81b721`)
                setAddress(response.data.results[0].formatted)
                // console.log("Adress Response :", response.data.results[0].formatted);
                setLoading(false)
            }

        } catch (error) {
            console.error("Error fetching Turfs [] data:", error);
        } finally {
            setLoading(false);
        }
    };

    console.log("ADDRESS in state :", address);



    useEffect(() => {
        fetchTurfs(turfId);
    }, [turfId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!turf) {
        return <p>Turf not found.</p>;
    }

    // useEffect(() => {
    //     if (turf) retrieveAddress();
    //     else {
    //         console.log("Turf is not getting and returnring :");
    //         return
    //     }
    // }, [])

    return (
        <div>
            <TurfDetailsPage turf={turf} />
        </div>
    );
}
