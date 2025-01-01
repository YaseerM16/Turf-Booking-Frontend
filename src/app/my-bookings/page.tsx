import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import MyBooking from '@/components/user-component/MyBookings';
import React from 'react';

const ProfilePage = () => {
    return (
        <>
            <Navbar />
            <MyBooking />
            <Footer />
        </>
    );
};

export default ProfilePage;
