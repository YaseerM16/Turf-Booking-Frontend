import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface GeolocationPosition {
    latitude: number;
    longitude: number;
}

export default function useGeolocation() {
    const [position, setPosition] = useState<GeolocationPosition>({
        latitude: 0,
        longitude: 0,
    });
    const [isLocationAvailable, setIsLocationAvailable] = useState(true);

    useEffect(() => {
        const geo = navigator.geolocation;

        function onSuccess(position: any): void {
            setPosition({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
            setIsLocationAvailable(true);
        }

        function onError(error: GeolocationPositionError): void {
            console.log("Error retrieving geolocation:", error.code);
            setIsLocationAvailable(false); // Update availability state
            if (error.code === 1) {
                toast.error(
                    "Location access is required. Please enable location services.",
                    { autoClose: 3000, position: "top-center", hideProgressBar: false }
                );
            } else {
                toast.error("Unable to retrieve location. Please try again.", {
                    position: "top-center",
                });
            }
        }

        const watcher = geo.watchPosition(onSuccess, onError);

        return () => geo.clearWatch(watcher);
    }, []);

    return { position, isLocationAvailable };
}
