import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ProfileComponent from '@/components/ProfileComponent';
import TurfList from '@/components/TurfList';
import React from 'react';


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
