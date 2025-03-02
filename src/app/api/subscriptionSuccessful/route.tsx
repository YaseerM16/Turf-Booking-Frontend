// import PayUApiCalls from "@/utils/apiCalls/PayUApiCalls";
import { subscribeByPayU } from "@/services/userApi";
import { PaymentData } from "@/utils/PayUApiCalls";
import { AxiosError } from "axios";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";


export async function POST(req: NextRequest) {
    // const contentType = req.headers.get("content-type") || "";
    const { searchParams } = req.nextUrl;
    const subscription = searchParams.get('subscription');
    const token = searchParams.get("token")
    const accessToken: string | null = decodeURIComponent(token || "");  // Decode and parse the JSON string

    let subscriptionData = null;
    if (subscription && token) {
        try {
            subscriptionData = JSON.parse(decodeURIComponent(subscription));  // Decode and parse the JSON string
        } catch (e) {
            console.error('Error parsing subscriptionData:', e);
            subscriptionData = null;
        }
    }
    // console.log("SEARCH Params -->> Toekn :", accessToken);
    // console.log("SEARCH Params -->> SSLOT :", subscriptionData);

    const formData = await req.formData();
    const data: Partial<PaymentData> = {};
    formData.forEach((value, key) => {
        (data as Record<string, unknown>)[key] = value; // Treat data as a generic object
    });

    // console.log(data, 'this and all things')
    let plan;
    // data.subscriptionData = subscriptionData
    // console.log("subscriptionData Data :", data);
    // console.log("FORM RESpon form SUccEss ====> :: > ", data)

    try {
        console.log("THIS is the Data in SubscriptionDATA :", subscriptionData);
        // console.log("THIS is the Data in SubscriptionSuccessFull :", data);

        const response = await subscribeByPayU(data.udf1 as string, subscriptionData, accessToken)
        if (response.success) {
            const { data } = response
            console.log("The Successive Respon of subscribeByPayU :", data.subscribe);
            plan = data.subscribe
        }
        // const savedBooking = await PayUApiCalls.saveBooking(data as PaymentData, accessToken);
        // console.log("Response form saveBooking!! :", savedBooking);

        // bookingDetails = savedBooking.isBooked
        // console.log("RESULT from save :", savedBooking);

    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.log("Error while SAVE-BOOKING", error);
        }
    }
    // console.log("BOOKINGDETS to SuccessPage :", bookingDetails);

    redirect(`/subscription-success?subscriptionDets=${encodeURIComponent(JSON.stringify(plan))}`);

}