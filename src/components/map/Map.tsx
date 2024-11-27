import { useEffect, useRef, useState } from "react";
import * as leaflet from "leaflet";
import useLocalStorage from "./hooks/useLocalStorage";
import useGeolocation from "./hooks/useGeolocation";
import "leaflet/dist/leaflet.css";

leaflet.Icon.Default.mergeOptions({
    iconRetinaUrl: "/leaflet-assets/marker-icon.png",
    iconUrl: "/leaflet-assets/marker-icon-2x.png",
    shadowUrl: "/leaflet-assets/marker-shadow.png",
});

interface Marker {
    latitude: number;
    longitude: number;
}

interface MapProps {
    onPinLocation: (location: Marker) => void;
}

export default function Map({ onPinLocation }: MapProps) {
    const mapRef = useRef<leaflet.Map | null>(null);
    const markerRef = useRef<leaflet.Marker | null>(null);

    const [userPosition, setUserPosition] = useLocalStorage<Marker>("USER_MARKER", {
        latitude: 0,
        longitude: 0,
    });

    const { position: location, isLocationAvailable } = useGeolocation();
    const [showMap, setShowMap] = useState(false);

    useEffect(() => {
        if (showMap) {
            // Use userPosition or fallback to a default location (e.g., 0, 0 or any specific coordinates)
            const initialLat = userPosition.latitude || location.latitude || 0; // Default latitude
            const initialLng = userPosition.longitude || location.longitude || 0; // Default longitude

            // Initialize the map only if it is not already initialized
            if (!mapRef.current) {
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

                // Add click event listener for overwriting marker
                mapRef.current.on("click", (e: leaflet.LeafletMouseEvent) => {
                    const { lat, lng } = e.latlng;
                    updateMarker(lat, lng, `lat: ${lat.toFixed(2)}, long: ${lng.toFixed(2)}`);
                    setUserPosition({ latitude: lat, longitude: lng });
                    onPinLocation({ latitude: lat, longitude: lng });
                });
            }

            return () => {
                // Cleanup map when component unmounts
                mapRef.current?.off();
                mapRef.current?.remove();
                mapRef.current = null;
            };
        }

        return undefined;
    }, [showMap, userPosition, location, setUserPosition, onPinLocation]);

    useEffect(() => {
        if (!isLocationAvailable) {
            setShowMap(false);
        } else {
            setShowMap(true);
        }
    }, [isLocationAvailable]);

    // Update marker when geolocation changes
    useEffect(() => {
        if (location.latitude && location.longitude && mapRef.current) {
            updateMarker(location.latitude, location.longitude, "Your Location");
            mapRef.current.setView([location.latitude, location.longitude]);

            // Update the position in localStorage
            setUserPosition({
                latitude: location.latitude,
                longitude: location.longitude,
            });
        }
    }, [location, setUserPosition]);

    // Helper function to update the marker
    const updateMarker = (lat: number, lng: number, popupText: string) => {
        if (markerRef.current) {
            mapRef.current?.removeLayer(markerRef.current);
        }
        markerRef.current = leaflet
            .marker([lat, lng])
            .addTo(mapRef.current!)
            .bindPopup(popupText)
            .openPopup();
    };

    return (
        <div>
            {showMap ? (
                <div id="map" className="w-full h-[350px]"></div>
            ) : (
                <p className="text-center text-red-500">
                    Waiting for location access to load the map...
                </p>
            )}
        </div>
    );
}
