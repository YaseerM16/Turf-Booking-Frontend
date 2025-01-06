import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import MyWallet from '@/components/user-component/MyWallet';
import React from 'react';

const ProfilePage = () => {
    return (
        <>
            <Navbar />
            <MyWallet />
            <Footer />
        </>
    );
};

export default ProfilePage;
