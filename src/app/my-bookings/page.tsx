import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ProfileComponent from '@/components/ProfileComponent';
import MyBooking from '@/components/user-component/MyBookings';
import React from 'react';
MyBooking

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
