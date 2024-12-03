"use client";

import { useEffect, useState } from 'react';
import { useParams } from "next/navigation";


export default function TurfDetails() {
    // const { turfId } = router.query; // Access `turfId` from the URL
    const [turf, setTurf] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const turfId = params?.turfId;

    useEffect(() => {
        if (turfId) { // Ensure `turfId` is defined /get-turf-details
            // Fetch turf details from API
            console.log("Turf Id :", turfId);

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
        }
    }, [turfId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!turf) {
        return <p>Turf not found.</p>;
    }

    return (
        <div>
            <h1>{turf.turfName}</h1>
            <p>Size: {turf.turfSize}</p>
            <p>Price: {turf.price}</p>
            <p>Workings: {turf.workingSlots.fromTime} - {turf.workingSlots.toTime}</p>
        </div>
    );
}
