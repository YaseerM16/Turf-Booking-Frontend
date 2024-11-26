import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ProfileComponent from '@/components/ProfileComponent';
import React from 'react';


const ProfilePage = () => {
    return (
        <>
            <Navbar />
            <ProfileComponent />
            <Footer />
        </>
    );
};

export default ProfilePage;
