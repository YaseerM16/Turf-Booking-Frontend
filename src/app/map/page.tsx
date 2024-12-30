import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import OlaAutoComplete from "@/components/OlaAutoComplete"
import MapComponent from '@/components/OlaMapInput';
import MapComp from "@/components/OlaMapComponent"
import ProfileComponent from '@/components/ProfileComponent';
import MyBooking from '@/components/user-component/MyBookings';
import React from 'react';
MyBooking


const ProfilePage = () => {
    const handleLocationSelect = (locationData: { latitude: number; longitude: number; address: string }) => {
        console.log('Selected Location:', locationData);
        // You can handle the location data here, such as updating state or calling an API
    };

    return (
        <>
            <Navbar />
            <MapComp />
            {/* <OlaAutoComplete onLocationSelect={handleLocationSelect} /> */}
            {/* <MapComponent /> */}
            <Footer />
        </>
    );
};

export default ProfilePage;


