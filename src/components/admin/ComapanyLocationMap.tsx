import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

let leaflet: typeof import("leaflet"); // Declare a variable to hold the Leaflet module

interface Marker {
    latitude: number;
    longitude: number;
}

interface MapProps {
    location: Marker; // The company's location
    profilePicture: string; // URL of the company's profile picture
    companyName: string; // Name of the company
}

const Map: React.FC<MapProps> = ({ location, profilePicture, companyName }) => {
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

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

            if (!mapRef.current && leaflet) {
                // Initialize the map
                mapRef.current = leaflet
                    .map("map")
                    .setView([location.latitude, location.longitude], 14);

                // Add OpenStreetMap tiles
                leaflet
                    .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                        maxZoom: 19,
                        attribution:
                            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                    })
                    .addTo(mapRef.current);

                // Add marker with popup
                updateMarker(location.latitude, location.longitude);
            }
        })();

        return () => {
            // Cleanup the map on unmount
            if (mapRef.current) {
                mapRef.current.off();
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [location]);

    const updateMarker = (lat: number, lng: number) => {
        if (markerRef.current) {
            markerRef.current.remove(); // Remove any existing marker
        }
        if (leaflet && mapRef.current) {
            const popupContent = `
      <div class="text-center">
        <img src="${profilePicture}" alt="${companyName}" 
             class="w-10 h-10 rounded-full mx-auto mb-1" 
             style="width: 40px; height: 40px;" />
        <p class="font-semibold text-sm">${companyName}</p>
      </div>
    `;
            markerRef.current = leaflet
                .marker([lat, lng])
                .addTo(mapRef.current)
                .bindPopup(popupContent, { minWidth: 150 })
                .openPopup();
        }
    };

    return (
        <div className="border p-4 rounded shadow-md bg-white">
            <div id="map" className="w-full h-[350px]"></div>
        </div>
    );
};

export default Map;
