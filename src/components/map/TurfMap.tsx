import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

type Turf = {
    name: string;
    latitude: number;
    longitude: number;
    address: string;
    rate: string;
};

type TurfMapProps = {
    turfCollection: Turf[];
};

const TurfMap: React.FC<TurfMapProps> = ({ turfCollection }) => {
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [filteredTurfs, setFilteredTurfs] = useState<Turf[]>([]);

    // Haversine formula to calculate distance between two lat-lng pairs
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371; // Radius of the Earth in km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };

    useEffect(() => {
        // Get user's current location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });

                // Filter turfs within 5 km
                const turfsWithinRadius = turfCollection.filter((turf) => {
                    const distance = calculateDistance(
                        latitude,
                        longitude,
                        turf.latitude,
                        turf.longitude
                    );
                    return distance <= 5; // 5 km radius
                });

                setFilteredTurfs(turfsWithinRadius);
            },
            (error) => {
                console.error("Error getting user location:", error);
            }
        );
    }, [turfCollection]);

    return (
        <div>
            {userLocation ? (
                <MapContainer
                    center={[userLocation.lat, userLocation.lng]}
                    zoom={13}
                    style={{ height: "100vh", width: "100%" }}
                >
                    {/* Base Map */}
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {/* User's Location Marker */}
                    <Marker position={[userLocation.lat, userLocation.lng]}>
                        <Popup>You are here</Popup>
                    </Marker>

                    {/* Turf Markers */}
                    {filteredTurfs.map((turf, index) => (
                        <Marker
                            key={index}
                            position={[turf.latitude, turf.longitude]}
                        >
                            <Popup>
                                <strong>{turf.name}</strong>
                                <br />
                                {turf.address}
                                <br />
                                {turf.rate} per hour
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            ) : (
                <p>Loading map...</p>
            )}
        </div>
    );
};

export default TurfMap;
