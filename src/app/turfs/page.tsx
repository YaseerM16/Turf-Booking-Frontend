import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ProfileComponent from '@/components/ProfileComponent';
import TurfList from '@/components/TurfList';
import { axiosInstance } from '@/utils/constants';
import { useParams } from "next/navigation";
import React, { useEffect, useState } from 'react';
import { TurfData } from "@/utils/type"
import FireLoading from '@/components/FireLoading';
FireLoading

const ProfilePage = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const [turf, setTurf] = useState<TurfData>()

    async function fetchTurfs() {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get(
                `/api/v1/user/get-turfs`
            );
            if (data?.success) {
                const setTurfDets = { turf: data.turf }
                setTurf(setTurfDets);
                // const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${data.turf.location.latitude}%2C${data.turf.location.longitude}&key=ba8938b3f8ce4c78bc0b4fda6c81b721`)
                // setAddress(response.data.results[0].formatted)
                // console.log("Adress Response :", response.data.results[0].formatted);
                setLoading(false)
            }

        } catch (error) {
            console.error("Error fetching Turfs [] data:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchTurfs();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!turf) {
        return <p>Turf not found.</p>;
    }

    return (
        <>
            <Navbar />
            {loading ? <FireLoading renders={'Fetching Turfs'} /> : <TurfList />}
            <Footer />
        </>
    );
};

export default ProfilePage;
