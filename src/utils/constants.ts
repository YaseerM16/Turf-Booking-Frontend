import axios from "axios";

axios
// const token = req.cookies.get("token")?.value;

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_HOST,
    withCredentials: true,
});


export const SERVER_USER_URL = `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/user`
export const SERVER_COMPANY_URL = `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/company`
export const SERVER_ADMIN_URL = `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/admin`

export const APIKEY = process.env.NEXT_PUBLIC_APIKEY
export const AUTH_DOMAIN = process.env.NEXT_PUBLIC_AUTH_DOMAIN
export const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID
export const STORAGE_BUCKET = process.env.NEXT_PUBLIC_STORAGE_BUCKET
export const MESSAGING_SENDER_ID = process.env.MESSAGING_SENDER_ID
export const MESSAGING_APP_ID = process.env.MESSAGING_APP_ID
export const MEASUREMENT_ID = process.env.MEASUREMENT_ID


export const availableFacilities = [
    "Lighting",
    "Seating",
    "Changing Rooms",
    "Washrooms",
    "Parking",
    "Refreshment Kiosk",
    "Wi-Fi",
    "Coaching",
    "Equipment Rentals",
    "Rest Areas",
];

export const availableGames = [
    "Cricket",
    "Football",
    "Multi-purpose",
    "Basketball",
    "Tennis",
    "Badminton",
    "Hockey",
    "Volleyball",
];

export const daysOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];



export const PayU = {
    merchantKey: '2PhDCt',
};

export const FRONTEND_DOMAIN = "http://localhost:3000";
