'use client'


import { useEffect, useRef, useState } from "react";
import { FRONTEND_DOMAIN, PayU } from "@/utils/constants"
import { generateTxnId } from "@/utils/generateTxnld";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import PayUApiCalls from "@/utils/PayUApiCalls";

type Props = {
    BookedData: any;
};

const PayUComponent = ({ BookedData }: Props) => {
    const [hash, setHash] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null); // State to track error
    const userDet = JSON.parse(localStorage.getItem("auth") as string);
    const txnidRef = useRef(generateTxnId(8)); // txnid is created once
    const txnid = txnidRef.current;

    // console.log("BookedData:", BookedData);

    const amount = BookedData.amount || 0;
    const productinfo = BookedData.productinfo || "";
    const udf1 = BookedData.userId || "";
    const { name = "", email = "", phone = "" } = BookedData.userDet || {};
    const surl = `${FRONTEND_DOMAIN}/api/paymentSuccess?slots=${encodeURIComponent(JSON.stringify(BookedData.selectedSlots))}`;
    const furl = `${FRONTEND_DOMAIN}/api/paymentFailure`;
    const udf2 = BookedData.companyId || "nil";
    const udf3 = BookedData.selectedSlots || "nil";
    const udf4 = BookedData.turfId || "nil";
    const udf5 = BookedData.category || "nil";
    const udf6 = BookedData.eventType || "nil";
    const udf7 = BookedData.EndingDate || "nil";

    const key = PayU.merchantKey;

    // console.log("BoookedDATA :", BookedData);


    const requestSentRef = useRef(false);
    useEffect(() => {
        const data = {
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
                console.log("Sending Payment Request:", data);
                const res = await PayUApiCalls.paymentReq(data);
                console.log("Respos :", res);
                setHash(res.hash);
                requestSentRef.current = true;

                toast.success("Payment hash generated successfully!");
            } catch (error: any) {
                console.error("Payment Error: " + error.message);
                // setError("Failed to generate payment hash. Please try again.");
                toast.error(error.message);
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