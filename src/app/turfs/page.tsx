"use client";
export const dynamic = "error";  // ✅ Prevents pre-rendering

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
// import TurfList from '@/components/TurfList';
import React from 'react';
import TurfList from '@/components/TurfList';


const ProfilePage = () => {
    return (
        <>
            <Navbar />
            <TurfList />
            <Footer />
        </>
    );
};

export default ProfilePage;
