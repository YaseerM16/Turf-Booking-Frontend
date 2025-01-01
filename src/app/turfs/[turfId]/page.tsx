"use client";

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import TurfDetail from '@/components/TurfDetail';
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from 'react';
import FireLoading from '@/components/FireLoading';
import { axiosInstance } from '@/utils/constants';
import { TurfDetails } from '@/utils/type';

const ProfilePage = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [turf, setTurf] = useState<TurfDetails | null>(null)
    const params = useParams();
    const turfId = params?.turfId;

    const fetchTurf = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get(
                `/api/v1/user/get-turf-details/${turfId}`
            );
            if (data?.success) {
                setTurf(data.turf);
            }
        } catch (error) {
            console.error("Error fetching Turfs [] data:", error);
        } finally {
            setLoading(false);
        }
    }, [turfId]);

    useEffect(() => {
        fetchTurf();
    }, [fetchTurf]);

    return (
        <>
            <Navbar />
            {loading ? <FireLoading renders={'Fetching Turf Details'} /> : <TurfDetail turf={turf} />}
            <Footer />
        </>
    );
};

export default ProfilePage;
