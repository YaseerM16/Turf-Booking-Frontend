"use client";

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
// import TurfList from '@/components/TurfList';
import React from 'react';
import TurfList from '@/components/TurfList';


const ProfilePage = () => {

    // const [loading, setLoading] = useState<boolean>(false)
    // const [turfs, setTurfs] = useState<TurfDetails[] | null>(null)
    // console.log("TURFS :", turfs);


    // async function fetchTurfs() {
    //     try {
    //         setLoading(true);
    //         const { data } = await axiosInstance.get(
    //             `/api/v1/user/get-turfs`
    //         );
    //         if (data?.success) {
    //             setTurfs(data.turfs);
    //             setLoading(false)
    //         }

    //     } catch (error) {
    //         console.error("Error fetching Turfs [] data:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     fetchTurfs();
    // }, []);

    return (
        <>
            <Navbar />
            <TurfList />
            <Footer />
        </>
    );
};

export default ProfilePage;
