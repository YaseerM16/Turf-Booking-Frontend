"use client";
import { useEffect, useState } from 'react';
// import PayUApiCalls from '@/utils/PayUApiCalls';

const PaymentSuccess = () => {
    // const [error, setError] = useState<string | null>(null);
    // const [loading, setLoading] = useState<boolean>(false);

    const [queryObj, setQueryObj] = useState<Record<string, string> | null>(null);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const queryObject = Object.fromEntries(searchParams.entries()); // Get query parameters
        setQueryObj(queryObject as Record<string, string>); // Set query parameters state
    }, []);

    console.log("QUERYObj in PAymOUtn SUUCEss :", queryObj);


    // const handlePaymentSuccess = async (slots: string | string[]) => {
    //     setLoading(true);
    //     try {
    //         const formData = new FormData();
    //         formData.append('slots', JSON.stringify(slots));

    //         // Call your backend API or PayU API
    //         const data = { slots: slots };  // Here, you would include additional data
    //         const PayUOrderId = await PayUApiCalls.saveBooking(data);  // Save booking to backend

    //         console.log("PayU Order ID:", PayUOrderId);

    //         // Redirect to booking success page (if needed)
    //         window.location.href = `/bookingSuccess?orderId=${PayUOrderId}`;
    //     } catch (error) {
    //         console.error('Error processing payment success:', error);
    //         setError('Payment processing failed.');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // if (loading) {
    //     return <div>Processing your payment...</div>;
    // }

    // if (error) {
    //     return <div>{error}</div>;
    // }

    return (
        <div>
            <h1>Payment Success</h1>
            <p>Thank you for your payment!</p>
        </div>
    );
};

export default PaymentSuccess;
