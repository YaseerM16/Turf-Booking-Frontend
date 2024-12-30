// import PayUApiCalls from "@/utils/apiCalls/PayUApiCalls";
import PayUApiCalls from "@/utils/PayUApiCalls";
import { redirect } from "next/navigation";


export async function POST(req: any) {
    const contentType = req.headers.get("content-type") || "";
    const { searchParams } = req.nextUrl;
    const slotsString = searchParams.get('slots');
    const token = searchParams.get("token")
    const accessToken = decodeURIComponent(token);  // Decode and parse the JSON string

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

    const data: { [key: string]: any } = {};
    formData.forEach((value: any, key: string) => {
        data[key] = value;
    });
    // console.log(data, 'this and all things')
    let bookingDetails
    data.slots = slots
    // console.log("Slots Data :", data);

    try {
        const savedBooking = await PayUApiCalls.saveBooking(data, accessToken);
        console.log("Response form saveBooking!! :", savedBooking);

        bookingDetails = savedBooking.isBooked
        console.log("RESULT from save :", savedBooking);

    } catch (error: any) {
        console.log("Error while SAVE-BOOKING", error);
    }
    console.log("BOOKINGDETS to SuccessPage :", bookingDetails);

    redirect(`/bookingSuccess?bookingDets=${encodeURIComponent(JSON.stringify(bookingDetails))}`);

}