import AvailableSlots from '@/components/AvailableSlots';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ProfileComponent from '@/components/ProfileComponent';
import TurfDetail from '@/components/TurfDetail';
import TurfList from '@/components/TurfList';
import React from 'react';



const ProfilePage = () => {
    return (
        <>
            <Navbar />
            <TurfDetail />
            <Footer />
        </>
    );
};

export default ProfilePage;
