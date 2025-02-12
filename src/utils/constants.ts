import axios, { AxiosError } from "axios";
// import { NextArrow, PrevArrow } from "./Arrows";
// import { NextArrow, PrevArrow } from "@/components/Arrows"; // ✅ Adjust the import path if needed
export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_HOST,
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        console.error("API Error:", error.response?.data || error.message);

        if (error.response?.status === 401) {
            window.location.href = "/login";
        }

        return Promise.reject(error);
    })


export const SERVER_USER_URL = `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/user`
export const SERVER_COMPANY_URL = `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/company`
export const SERVER_ADMIN_URL = `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/admin`
export const SERVER_NOTIFICATION_URL = `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/notification`


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
export const BACKEND_USER_URL = "/api/v1/user"
export const BACKEND_COMPANY_URL = "/api/v1/company"
export const BACKEND_NOTIFICATION_URL = "/api/v1/notification"

export type BookedData = {
    amount?: number; // Amount, default is 0
    productinfo?: string; // Product information, default is an empty string
    userId?: string; // User ID, default is an empty string
    userDet?: {
        name?: string; // User name, default is an empty string
        email?: string; // User email, default is an empty string
        phone?: string; // User phone, default is an empty string
    };
    firstname?: string;
    email?: string;
    selectedSlots?: object[]; // Selected slots (array), default is "nil"
    companyId?: string; // Company ID, default is "nil"
    turfId?: string; // Turf ID, default is "nil"
    category?: string; // Category, default is "nil"
    eventType?: string; // Event type, default is "nil"
    EndingDate?: string; // Ending date, default is "nil"
};


export interface FormData {
    images: File[]; // Assuming 'images' is an array of File objects
    workingDays: string[]; // Array of selected working days (e.g., ["Monday", "Tuesday"])
    selectedFacilities: string[]; // Array of selected facilities (e.g., ["Facility 1", "Facility 2"])
    selectedGames: string[]; // Array of selected games (e.g., ["Football", "Basketball"])
}

export interface FormSubmitted {
    images?: File[]; // Optional array of files (images)
    location?: {
        lat: number; // Latitude of the location
        lng: number; // Longitude of the location
    } | null;
    address: string | null; // Turf address
    turfName: string; // Turf name
    price: string; // Turf price
    turfSize: string; // Size of the turf
    turfType: string; // Type of the turf
    workingDays: string[]; // Array of working days
    selectedFacilities: string[]; // Array of selected facilities
    fromTime: string; // Start time
    toTime: string; // End time
    description: string; // Description of the turf
    selectedGames: string[]; // Array of selected games
}


interface SlotDetails {
    date: string; // Assuming the date is in ISO string format
    slot: string; // The time or identifier for the slot
}

interface UserDetails {
    name: string;
    email: string;
    phone: string;
}

interface TurfDetails {
    turfName: string;
    turfType: string;
    turfSize: string;
    price: number;
    facilities: string[];
    address: string;
}

export interface BookingDetails {
    booking: {
        _id: string; // Booking ID
        userDetails: UserDetails;
        paymentTransactionId: string;
        paymentMethod: string;
        totalAmount: number;
        turfId: TurfDetails;
        selectedSlots: SlotDetails[];
    };
}



