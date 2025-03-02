'use client'

import { useEffect, useRef, useState } from "react";
import { FRONTEND_DOMAIN, PayU } from "@/utils/constants"
import { generateTxnId } from "@/utils/generateTxnld";
import { toast } from "react-toastify";
import { PaymentData } from "@/utils/PayUApiCalls";
import Cookies from "js-cookie";
import 'react-toastify/dist/ReactToastify.css';
import { SubscriptionPlan } from "@/utils/type";
import { useAppSelector } from "@/store/hooks";
import { getSubscriptPaymentHash } from "@/services/userApi";
import Swal from "sweetalert2";


type Props = {
    BookedData: SubscriptionPlan | null;
};
const accessToken = Cookies.get("token")

const PayUComponent = ({ BookedData }: Props) => {
    // console.log("BookedData prop :", BookedData);
    const user = useAppSelector(state => state.users.user)
    const [hash, setHash] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null); // State to track error
    // const userDet = JSON.parse(localStorage.getItem("auth") as string);
    const txnidRef = useRef(generateTxnId(8)); // txnid is created once
    const txnid = txnidRef.current;

    // console.log("BookedData.selectedSlots: in PayUComp :", BookedData);

    const amount = BookedData?.price || 0;
    const productinfo = BookedData?._id || "";
    const udf1 = user?._id || "";
    const { name = "", email = "", phone = "" } = user || {};
    const surl = `${FRONTEND_DOMAIN}/api/subscriptionSuccessful?subscription=${encodeURIComponent(JSON.stringify(BookedData))}&token=${encodeURIComponent(accessToken!)}`;
    const furl = `${FRONTEND_DOMAIN}/api/paymentFailure`;
    const udf2 = BookedData?._id || "nil";
    const udf3 = BookedData?.name || "nil";
    const udf4 = BookedData?.price || "nil";
    const udf5 = BookedData?.duration || "nil";
    const udf6 = BookedData?.discount || "nil";
    const udf7 = BookedData?.features || "nil";

    const key = PayU.merchantKey;

    // console.log("BoookedDATA :", BookedData);


    const requestSentRef = useRef(false);
    useEffect(() => {
        const data: PaymentData = {
            txnid,
            amount,
            productinfo,
            name,
            email,
            phone,
            udf1,
            udf2,
            udf3,
            udf4,
            udf5,
            udf6,
            udf7,
        };

        console.log("Retrieved DATA :", data);


        const makePaymentRequest = async () => {
            try {
                // console.log("Sending Payment Request:", data);
                // const res = await PayUApiCalls.paymentReq(data);
                const response = await getSubscriptPaymentHash(data);
                if (response.success) {
                    const { data } = response
                    console.log("Respos :", data);
                    setHash(data.hash);
                    requestSentRef.current = true;

                }

                toast.success("Payment hash generated successfully!");
            } catch (error: unknown) {
                // if (error instanceof Error) {
                //     console.error("Payment Error: " + error.message);
                //     toast.error(error.message);
                // }
                Swal.fire({
                    icon: 'error',
                    title: 'Subscription Failed!',
                    text: `${(error as Error).message}` || "Something went wrong while generating link",
                    confirmButtonText: 'Try Again',
                }).then((result) => {
                    if (result.isConfirmed) {
                        console.log("User acknowledged the failure.");
                        // Handle retry logic or additional actions here
                    }
                });
                // setError("Failed to generate payment hash. Please try again.");
            }
        };

        if (!requestSentRef.current) {
            makePaymentRequest();
        }
    }, [amount, email, phone, productinfo, txnid, udf1, udf2, udf3, udf4, udf5, udf6, udf7, name]);




    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (hash) {
            event.currentTarget.submit();
        } else {
            setError("Hash not generated yet, form submission blocked.");
            console.error("Hash not generated yet, form submission blocked.");
        }
    };

    return (
        <div>
            {/* Conditionally render error messages */}
            {error && <div className="mb-4 text-red-500 font-medium">{error}</div>}

            <form action="https://test.payu.in/_payment" method="post" onSubmit={handleFormSubmit}>
                <input type="hidden" name="key" value={key} />
                <input type="hidden" name="txnid" value={txnid} />
                <input type="hidden" name="productinfo" value={productinfo} />
                <input type="hidden" name="amount" value={amount} />
                <input type="hidden" name="email" value={email} />
                <input type="hidden" name="firstname" value={name} />
                <input type="hidden" name="phone" value={phone} />
                <input type="hidden" name="udf1" value={udf1} />
                <input type="hidden" name="udf2" value={udf2} />
                <input type="hidden" name="udf3" value={udf3} />
                <input type="hidden" name="udf4" value={udf4} />
                <input type="hidden" name="udf5" value={udf5} />
                <input type="hidden" name="udf6" value={udf6} />
                <input type="hidden" name="udf7" value={udf7} />
                <input type="hidden" name="surl" value={surl} />
                <input type="hidden" name="furl" value={furl} />
                <input type="hidden" name="hash" value={hash || ""} />

                {hash ? (
                    <button
                        type="submit"
                        value="submit"
                        className="w-full bg-pink-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-pink-600 transition"
                    >
                        Pay with PayU
                    </button>
                ) : (
                    <button
                        type="button"
                        className="w-full bg-gray-300 text-white px-4 py-3 rounded-lg font-medium cursor-not-allowed"
                        disabled
                    >
                        Generating Payment Link...
                    </button>
                )}
            </form>
        </div>
    );
};

export default PayUComponent;