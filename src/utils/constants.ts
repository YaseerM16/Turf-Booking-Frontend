import axios from "axios";

axios
export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_HOST,
    withCredentials: true,
});


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