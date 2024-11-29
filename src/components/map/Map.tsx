import { useEffect, useRef, useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import useGeolocation from "./hooks/useGeolocation";
import "leaflet/dist/leaflet.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


let leaflet: typeof import("leaflet"); // Declare a variable to hold the leaflet module

interface Marker {
    latitude: number;
    longitude: number;
}

interface MapProps {
    onPinLocation: (location: Marker) => void;
}

export default function Map({ onPinLocation }: MapProps) {
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    const [userPosition, setUserPosition] = useLocalStorage<Marker>("USER_MARKER", {
        latitude: 0,
        longitude: 0,
    });

    const { position: location, isLocationAvailable } = useGeolocation();
    const [showMap, setShowMap] = useState(false);

    useEffect(() => {
        // Dynamically load Leaflet when needed
        (async () => {
            if (!leaflet) {
                leaflet = await import("leaflet");
                // Set default icons
                leaflet.Icon.Default.mergeOptions({
                    iconRetinaUrl: "/leaflet-assets/marker-icon-2x.png",
                    iconUrl: "/leaflet-assets/marker-icon.png",
                    shadowUrl: "/leaflet-assets/marker-shadow.png",
                });
            }
        })();
    }, []);

    useEffect(() => {
        if (showMap) {
            (async () => {
                const initialLat = userPosition.latitude || location.latitude || 0;
                const initialLng = userPosition.longitude || location.longitude || 0;

                if (!mapRef.current && leaflet) {
                    // Initialize map
                    mapRef.current = leaflet.map("map").setView([initialLat, initialLng], 16);

                    // Add OpenStreetMap tiles
                    leaflet
                        .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                            maxZoom: 19,
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                        })
                        .addTo(mapRef.current);

                    // Add initial marker
                    updateMarker(initialLat, initialLng, "Your Location");

                    // Add click event listener for marker updates
                    mapRef.current.on("click", (e: L.LeafletMouseEvent) => {
                        const { lat, lng } = e.latlng;
                        updateMarker(lat, lng, `lat: ${lat.toFixed(2)}, long: ${lng.toFixed(2)}`);
                        setUserPosition({ latitude: lat, longitude: lng });
                        onPinLocation({ latitude: lat, longitude: lng });
                    });
                }
            })();

            return () => {
                // Cleanup on unmount
                if (mapRef.current) {
                    mapRef.current.off();
                    mapRef.current.remove();
                    mapRef.current = null;
                }
            };
        }
    }, [showMap, userPosition, location, setUserPosition, onPinLocation]);

    useEffect(() => {
        setShowMap(isLocationAvailable);
    }, [isLocationAvailable]);

    useEffect(() => {
        if (location.latitude && location.longitude && mapRef.current && leaflet) {
            updateMarker(location.latitude, location.longitude, "Your Location");
            mapRef.current.setView([location.latitude, location.longitude]);
            setUserPosition({
                latitude: location.latitude,
                longitude: location.longitude,
            });
        }
        localStorage.setItem(
            "USER_LOCATION",
            JSON.stringify({
                latitude: location.latitude,
                longitude: location.longitude,
            })
        );
    }, [location, setUserPosition]);

    const updateMarker = (lat: number, lng: number, popupText: string) => {
        if (markerRef.current) {
            markerRef.current.remove(); // Remove the previous marker
        }
        if (leaflet && mapRef.current) {
            markerRef.current = leaflet
                .marker([lat, lng])
                .addTo(mapRef.current)
                .bindPopup(popupText)
                .openPopup();
        }
    };
    const handleSetCurrentLocation = () => {
        if (location.latitude && location.longitude && mapRef.current && leaflet) {
            // Update the marker position
            updateMarker(location.latitude, location.longitude, "Your Current Location");

            // Center the map at the current location
            mapRef.current.setView([location.latitude, location.longitude], 16);

            // Save the location in local storage and propagate it to the parent
            setUserPosition({ latitude: location.latitude, longitude: location.longitude });
            onPinLocation({ latitude: location.latitude, longitude: location.longitude });

            toast.success("Current location set successfully!");
        } else {
            toast.error("Unable to fetch current location. Please enable location services.");
        }
    };


    return (
        <>
            <div>
                {showMap ? (
                    <div>
                        <div id="map" className="w-full h-[350px] mb-4"></div>
                        <button
                            className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 transition"
                            onClick={handleSetCurrentLocation}
                        >
                            Set Current Location
                        </button>
                    </div>
                ) : (
                    <p className="text-center text-red-500">
                        Waiting for location access to load the map...
                    </p>
                )}
            </div>
        </>
    );
}
