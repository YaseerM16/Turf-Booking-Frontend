// import PayUApiCalls from "@/utils/apiCalls/PayUApiCalls";
import PayUApiCalls, { PaymentData } from "@/utils/PayUApiCalls";
import { AxiosError } from "axios";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    // const contentType = req.headers.get("content-type") || "";
    const { searchParams } = req.nextUrl;
    const slotsString = searchParams.get('slots');
    const token = searchParams.get("token")
    const accessToken: string | null = decodeURIComponent(token || "");  // Decode and parse the JSON string

    let slots = null;
    if (slotsString && token) {
        try {
            slots = JSON.parse(decodeURIComponent(slotsString));  // Decode and parse the JSON string
        } catch (e) {
            console.error('Error parsing slots:', e);
            slots = null;
        }
    }
    // console.log("SEARCH Params -->> Toekn :", accessToken);
    // console.log("SEARCH Params -->> SSLOT :", slots);

    const formData = await req.formData();

    const data: Partial<PaymentData> = {};
    formData.forEach((value, key) => {
        if (key in data) {
            (data as Record<string, unknown>)[key] = value; // Treat data as a generic object
        }
    });



    // console.log(data, 'this and all things')
    let bookingDetails
    data.slots = slots
    // console.log("Slots Data :", data);

    try {
        const savedBooking = await PayUApiCalls.saveBooking(data as PaymentData, accessToken);
        console.log("Response form saveBooking!! :", savedBooking);

        bookingDetails = savedBooking.isBooked
        console.log("RESULT from save :", savedBooking);

    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.log("Error while SAVE-BOOKING", error);
        }
    }
    console.log("BOOKINGDETS to SuccessPage :", bookingDetails);

    redirect(`/bookingSuccess?bookingDets=${encodeURIComponent(JSON.stringify(bookingDetails))}`);

}