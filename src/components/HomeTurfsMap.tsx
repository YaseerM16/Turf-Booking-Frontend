'use client'

import { OlaMaps } from '../../public/olamaps/dist/olamaps-js-sdk.es';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Map_2, GeolocateControl } from "../../public/olamaps/dist/index"
import polyline from "polyline"
import Swal from 'sweetalert2';
import '../../public/olamaps/dist/style.css'
import { Company, TurfDetails } from '@/utils/type';
import Image from 'next/image';
import { FaMapMarkerAlt } from 'react-icons/fa';


interface MapComponentProps {
    turfs: TurfDetails[]
}

interface RouteDetails {
    companyPhone: number;
    companyName: string;
    turfName: string | undefined;
    images: string[];
    duration: string | number;  // Assuming duration is a string (e.g., "10 mins")
    distance: number;  // Assuming distance is a number (e.g., 10)
    polyline?: string;
    location: { latitude: number, longitude: number }
}
// curl--location--request POST "https://api.olamaps.io/routing/v1/directions?origin=18.76029027465273,73.3814242364375&destination=18.73354223011708,73.44587966939002&api_key=${your_api_key}" --header "X-Request-Id: XXX"
const MapComponent: React.FC<MapComponentProps> = ({ turfs }) => {
    // console.log("Location GiveN :: ", location);

    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const [mapView, setMapView] = useState<boolean>(false)
    const mapRef = useRef<Map_2 | null>(null);
    // const [routeDets, setRouteDets] = useState<RouteDetails | null>(null)
    const geoLocateRef = useRef<GeolocateControl | null>(null); // Store the geoLocate instance
    const [polyLine, setPolyLine] = useState<number[][] | null>(null)
    const [allRouteDets, setAllRouteDets] = useState<RouteDetails[] | []>([])
    const [filteredRouteDets, setfilteredRouteDets] = useState<RouteDetails[] | []>([])
    // const destLocation = useRef<{ latitude: number; longitude: number } | null>(null);
    const userLocation = useRef<{ latitude: number; longitude: number } | null>(null);
    const [userLocateState, setUserLocateState] = useState<{ latitude: number; longitude: number } | null>(null);
    const [selectedDistance, setSelectedDistance] = useState<number | null>(null);



    const flyToTheLocation = (lng: number, lat: number) => {
        if (!mapRef.current) return;

        // Fly to the random location
        mapRef.current.flyTo({
            center: [lng, lat],
            zoom: 14,
        });
    };


    const setDistanceFilter = useCallback((km: number) => { // Change km type to number
        if (!allRouteDets.length) return; // Ensure there's data

        const filtered = allRouteDets.filter(route => {
            const kms = parseFloat(route.distance.toString().trim().split(" ")[0]); // Ensure correct conversion
            console.log("Filtering: kms =", kms, "Comparing with km =", km, "TorF", kms <= km);

            return kms <= km; // Use <= to include equal values
        });

        console.log("Filtered Routes:", filtered);
        setfilteredRouteDets(filtered);
    }, [allRouteDets]); // Ensure correct dependency




    const clearFilter = () => {
        setSelectedDistance(null);
        setfilteredRouteDets(allRouteDets); // Reset to original list
    };

    const setUserLocation = (location: { latitude: number; longitude: number } | null) => {
        userLocation.current = location;
    };

    // console.log("AllRoutes :", allRouteDets);

    //Distance Matrix
    // "https://api.olamaps.io/routing/v1/distanceMatrix?origins=12.931627594462489%2C77.61594443652996%7C12.94526954617208%2C77.63695879085383&destinations=12.92526954617208%2C77.63695879085383%7C12.961627594462489%2C77.61594443652996&api_key=${your_api_key}" 

    const duengDisMat = useCallback(async (destinationsString: string) => {
        try {
            console.log("UserLocation Ref:", userLocation);
            console.log("DEST STR :", destinationsString);

            if (!userLocation.current?.latitude || !userLocation.current?.longitude) {
                console.log("User Location is not Getting while searching for the Turf Routes..!");
                alert("User Location is not Getting while searching for the Turf Routes..!")
                return
            }

            const response = await fetch(
                `https://api.olamaps.io/routing/v1/distanceMatrix?origins=${userLocation.current?.latitude}%2C${userLocation.current?.longitude}&destinations=${destinationsString}&api_key=${process.env.NEXT_PUBLIC_OLA_API_KEY}`,
                {
                    method: 'GET',
                    headers: { 'X-Request-Id': 'XXX' }
                }
            );
            const data = await response.json();

            console.log("THE successive OF DeistMatrix :", data.rows[0].elements);
            const elements = data.rows[0].elements;

            const convertedElements = elements.map((el: RouteDetails, index: number) => ({
                distance: `${((el.distance as number) / 1000).toFixed(2)}`, // Convert meters to km
                duration: `${Math.floor((el.duration as number) / 3600)} hrs ${Math.floor(((el.duration as number) % 3600) / 60)} min`, // Convert seconds to hrs & min
                polyline: el.polyline, // Preserve polyline
                turfName: turfs[index]?.turfName || "Unknown", // Add turf details
                images: turfs[index]?.images || [],
                companyName: (turfs[index]?.companyId as Company)?.companyname || "Unknown",
                companyPhone: (turfs[index]?.companyId as Company)?.phone || "N/A",
                location: turfs[index]?.location || "N/A",
            }));

            setAllRouteDets(convertedElements);
            setfilteredRouteDets(convertedElements)

            console.log("Converted Elements:", convertedElements);


            // const polyglonStr = data.rows[0].elements[0].polyline
            // const decodedPolyglon = polyline.decode(polyglonStr)
            // const swappedPolyline = decodedPolyglon.map(([lat, lng]) => [lng, lat]);

            // setPolyLine(swappedPolyline)

        } catch (error) {
            console.log("Error while Dist Mtatrix :", error);

        }
    }, [turfs])

    const handleGeoLocateError = useCallback((error: { PERMISSION_DENIED: number }) => {
        if (error.PERMISSION_DENIED) {
            Swal.fire({
                icon: 'info',
                title: 'Location Services Required',
                text: 'Please enable your location services to set your current location.',
                showConfirmButton: false,
                timer: 3000, // Auto-close after 3 seconds
                toast: true, // Makes it look more like a toast notification
                position: 'top-end', // Position the toast
            });

        }
        console.log('An error event has occurred.', error)
    }, [])

    // console.log("GEOLocale inside CallBAck :", event);
    const handleGeoLocateSuccess = useCallback(async (event: { coords: { latitude: number, longitude: number } }) => {
        const lat = event.coords.latitude
        const lng = event.coords.longitude
        // if (!destLocation.current?.latitude || !destLocation.current?.longitude) return
        // console.log("Coords :", lat, lng);
        // console.log("Dests :", destLocation?.latitude, destLocation?.longitude);

        try {
            // mapRef.current.map.flyTo({
            //     center: [userLocation.current.longitude, userLocation.current.latitude],
            //     zoom: 15,
            // });
            setUserLocation({ latitude: Number(lat), longitude: Number(lng) })
            setUserLocateState({ latitude: Number(lat), longitude: Number(lng) })
            console.log("This is the Turfs :", turfs);
            flyToTheLocation(lng, lat)
            const locationString = turfs
                .map(turf => `${turf.location.latitude}%2C${turf.location.longitude}`)
                .join('%7C');
            console.log("This si the locatio string passing ::) ", locationString)
            duengDisMat(locationString)
            // location ? [location.longitude, location.latitude]
            // const response = await fetch(
            //     `https://api.olamaps.io/routing/v1/directions?origin=${lat},${lng}&destination=${destLocation.current?.latitude},${destLocation.current?.longitude}&api_key=${process.env.NEXT_PUBLIC_OLA_API_KEY}`,
            //     {
            //         method: 'POST',
            //         headers: { 'X-Request-Id': 'XXX' }
            //     }
            // );
            // const data = await response.json();
            // // console.log(data);

            // // console.log("route dets:", data.routes[0].legs[0].readable_distance, data.routes[0].legs[0].readable_duration);
            // const routeDets = { distance: data.routes[0].legs[0].readable_distance, duration: data.routes[0].legs[0].readable_duration }
            // setRouteDets(routeDets)
            // const polyglonStr = data.routes[0].overview_polyline
            // const decodedPolyglon = polyline.decode(polyglonStr)
            // const swappedPolyline = decodedPolyglon.map(([lat, lng]) => [lng, lat]);

            // setPolyLine(swappedPolyline)
        } catch (error) {
            console.log("Error while attempt to routing :", error);
        }
    }, [turfs, duengDisMat])


    const getDirections = async (polyglonStr: string) => {
        try {
            // const response = await fetch(
            //     `https://api.olamaps.io/routing/v1/directions?origin=${userLocation.current?.latitude},${userLocation.current?.longitude}&destination=${destination.lat},${destination.lng}&api_key=${process.env.NEXT_PUBLIC_OLA_API_KEY}`,
            //     {
            //         method: 'POST',
            //         headers: { 'X-Request-Id': 'XXX' }
            //     }
            // );
            // const data = await response.json();
            // // console.log(data);

            // // console.log("route dets:", data.routes[0].legs[0].readable_distance, data.routes[0].legs[0].readable_duration);
            // const routeDets = { distance: data.routes[0].legs[0].readable_distance, duration: data.routes[0].legs[0].readable_duration }
            // setRouteDets(routeDets)
            // const polyglonStr = data.routes[0].overview_polyline
            const decodedPolyglon = polyline.decode(polyglonStr)
            const swappedPolyline = decodedPolyglon.map(([lat, lng]) => [lng, lat]);

            setPolyLine(swappedPolyline)
            // if (polyLine) {
            //     setUserLocateState({ latitude: destination.latitude, longitude: destination.longitude })
            // }

        } catch (error) {
            console.log("Error While Getting Directions", error);
        }
    }

    const drawPolyline = (map: Map_2, coordinates: number[][]) => {
        if (map && map.getSource('route')) {
            // console.log("Source 'route' already exists. Updating the source.");
            // Update the existing source
            const source = map.getSource('route');
            if (source) {
                source.setData({
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates,
                    },
                });
            }
        } else if (map) {
            // console.log("Adding new source 'route'.");
            // Add the new source and layer
            map.addSource('route', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates,
                    },
                },
            });

            map.addLayer({
                id: 'route',
                type: 'line',
                source: 'route',
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: {
                    'line-color': '#f00',
                    'line-width': 4,
                },
            });
        }
    };

    useEffect(() => {
        if (polyLine && mapRef.current) {
            // console.log("IAM cAllinG to Dreow");
            drawPolyline(mapRef.current, polyLine);
        }
    }, [polyLine]);

    // console.log("HTis is te Destinvation location :", destLocation);

    useEffect(() => {
        if (mapView && turfs.length > 0) {
            // Initialize Ola Maps
            // const locationString = turfs
            //     .map(turf => `${turf.location.latitude}%2C${turf.location.longitude}`)
            //     .join('%7C');

            // duengDisMat(locationString)
            // console.log("THE Location BIG Stringggg :", locationString);

            const olaMaps = new OlaMaps({
                apiKey: process.env.NEXT_PUBLIC_OLA_API_KEY!,
            });

            // Create the map instance
            const map = olaMaps.init({
                style: 'https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json',
                container: mapContainerRef.current,
                center: userLocation.current ? [userLocation.current?.longitude, userLocation.current?.latitude] : [77.5946, 12.9716], // Default to Bengaluru
                zoom: 12,
            });

            // Store map instance in ref
            mapRef.current = map;

            // Fly to the initial location
            // map.flyTo({
            //     center: userLocateState ? [userLocateState.longitude, userLocateState.latitude] : [77.5946, 12.9716],
            //     zoom: 15,
            // });

            // Loop through each turf and add markers dynamically
            turfs.forEach((turf) => {
                // Create a custom marker element
                const customMarker = document.createElement('div');
                customMarker.classList.add('customMarkerClass');
                customMarker.style.backgroundImage = turf.images?.[0] ? `url(${turf.images[0]})` : `url(/logo.jpeg)`;
                customMarker.style.backgroundSize = 'cover';
                customMarker.style.backgroundPosition = 'center';
                customMarker.style.height = '60px';
                customMarker.style.width = '60px';
                customMarker.style.borderRadius = '50%';
                customMarker.style.border = '2px solid #FF0000';

                // Create a popup for the marker
                const popup = olaMaps.addPopup({ offset: [0, -30], anchor: 'bottom' })
                    .setHTML(`
                    <div>
                        <strong>${turf.turfName}</strong><br>
                        💰 Price: <strong>₹${turf.price}</strong><br>
                        <button class="directions-btn bg-blue-500 text-white px-3 py-1 mt-2 rounded-md hover:bg-blue-600 transition" 
                                data-lat="${turf.location.latitude}" 
                                data-lng="${turf.location.longitude}">
                            🚗 Directions
                        </button>
                    </div>
                `);

                // Add the marker to the map
                olaMaps
                    .addMarker({
                        element: customMarker,
                        color: '#FF0000',
                        draggable: false,
                    })
                    .setLngLat([turf.location.longitude, turf.location.latitude])
                    .setPopup(popup)
                    .addTo(map);
            });

            // Event delegation for popup buttons (avoids timing issues)
            document.addEventListener('click', (event) => {
                if ((event.target as HTMLElement).classList.contains('directions-btn')) {
                    const lat = (event.target as HTMLElement).getAttribute('data-lat');
                    const lng = (event.target as HTMLElement).getAttribute('data-lng');
                    if (lat && lng) {
                        // window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
                        // console.log("THis is the turrf Loccation :", lat, lng);
                        // setDestLocation({ latitude: Number(lat), longitude: Number(lng) })
                        // setCurrentLocation()
                        // setDestLocation({ latitude: Number(lat), longitude: Number(lng) })
                    }
                }
            });

            // Add geolocation controls
            const geoLocate = olaMaps.addGeolocateControls({
                positionOptions: { enableHighAccuracy: true },
                trackUserLocation: true,
            });

            geoLocate.on('geolocate', (event: Event) =>
                handleGeoLocateSuccess(event as unknown as { coords: { latitude: number; longitude: number } })
            );

            geoLocate.on('error', handleGeoLocateError);
            geoLocateRef.current = geoLocate;
            map.addControl(geoLocate);

            setCurrentLocation()

            // Cleanup
            return () => {
                geoLocate.off('error', handleGeoLocateError);
                geoLocate.off('geolocate', handleGeoLocateSuccess);
                if (mapRef.current) {
                    mapRef.current.remove();
                    mapRef.current = null;
                }
            };
        }
    }, [mapView, turfs, userLocateState?.longitude, userLocateState?.latitude, handleGeoLocateSuccess, handleGeoLocateError]);


    const setCurrentLocation = () => {
        // console.log("HEELLOO");

        if (geoLocateRef.current) {
            geoLocateRef.current.trigger();
            return
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Location Services Required',
                text: 'Please enable your location services to set your current location.',
                showConfirmButton: false,
                timer: 3000, // Auto-close after 3 seconds
                toast: true, // Makes it look more like a toast notification
                position: 'top-end', // Position the toast
            });
            console.log('GeoLocate control is not initialized.');
            return
        }
    }

    return (
        <div>
            <div className="flex justify-center py-10">
                <div
                    className="relative w-[90%] max-w-5xl h-72 bg-cover bg-center flex items-center justify-center rounded-xl overflow-hidden shadow-lg"
                    style={{ backgroundImage: `url('/map-background2.jpg')` }}
                >
                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>

                    {/* Content */}
                    <div className="relative z-10 text-center px-6">
                        <h2 className="text-4xl font-extrabold text-white drop-shadow-lg mb-3 tracking-wide">
                            Find the Best Turfs Near You
                        </h2>
                        <p className="text-lg text-gray-300 drop-shadow-md max-w-xl mx-auto">
                            Locate and book your perfect turf effortlessly with our advanced map service.
                        </p>

                        {/* Search by Location Button */}
                        <button
                            type="button"
                            onClick={() => setMapView(true)}
                            className="relative mt-6 px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-green-700 rounded-lg shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_15px_#4CAF50] hover:brightness-110"
                        >
                            {/* Frosted Glass Effect */}
                            <div className="absolute inset-0 bg-white bg-opacity-10 rounded-lg backdrop-blur-md transition-all duration-300 hover:bg-opacity-20"></div>

                            {/* Button Content */}
                            <span className="relative flex items-center gap-3 z-10">
                                <FaMapMarkerAlt className="text-white text-xl animate-pulse" />
                                Search by Your Location
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col">
                <div>
                    {mapView && (
                        <div
                            style={{
                                position: "fixed",
                                top: 0,
                                left: 0,
                                width: "100vw",
                                height: "100vh",
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 9999, // High z-index for modal
                            }}
                        >

                            <div style={{ width: "95%", maxWidth: "980px", height: "100vh", backgroundColor: "#fff", borderRadius: "8px", overflow: "hidden", position: "relative", display: "flex", flexDirection: "column" }}>
                                {/* Map Container */}
                                <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />

                                {/* Turf List & Filters Container */}
                                <div className="absolute bottom-0 left-0 w-full bg-white shadow-md text-xs">
                                    {!userLocateState && (
                                        <div className="flex justify-center items-center p-2 bg-yellow-100 text-yellow-800 rounded-md font-semibold shadow">
                                            📍 Turf on your Location
                                        </div>
                                    )}

                                    {/* Distance Filter Section */}
                                    <div className="p-2 bg-gray-100 flex justify-center space-x-2 border-b">
                                        {[3, 5, 6, 7, 10, 15].map((distance) => (
                                            <button
                                                key={distance}
                                                className={`px-2 py-1 rounded text-xs font-medium ${selectedDistance === distance ? "bg-green-600 text-white" : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                                                    }`}
                                                onClick={() => {
                                                    setDistanceFilter(distance);
                                                    setSelectedDistance(distance);
                                                }}
                                            >
                                                {distance} km
                                            </button>
                                        ))}
                                        <button onClick={clearFilter} className="px-2 py-1 rounded text-xs bg-red-500 text-white hover:bg-red-700">
                                            Clear
                                        </button>
                                    </div>

                                    {/* Turf List */}
                                    <div className="flex overflow-x-auto space-x-1 p-1 scrollbar-hide">
                                        {filteredRouteDets.length > 0 ? (
                                            filteredRouteDets.map((turf, index) => (
                                                <div key={index} className="bg-white shadow-sm rounded overflow-hidden w-48 flex-shrink-0 hover:shadow-md transition p-1 flex flex-col">
                                                    <div className="flex items-center">
                                                        <Image
                                                            src={turf.images[0]}
                                                            alt={turf.turfName || turf.companyName}
                                                            width={56}
                                                            height={56}
                                                            className="object-cover rounded"
                                                        />
                                                        <div className="ml-2 flex-1">
                                                            <h2 className="text-xs font-semibold text-gray-800 truncate">{turf.turfName}</h2>
                                                            <p className="text-[10px] text-gray-600 truncate">{turf.companyName}</p>
                                                            <p className="text-[10px] text-gray-600">📍 {turf.distance} km</p>
                                                            <p className="text-[10px] text-gray-600">⏳ {turf.duration}</p>
                                                            <p className="text-[10px] text-gray-600">📞 {turf.companyPhone}</p>
                                                        </div>
                                                    </div>

                                                    <button
                                                        className="mt-1 bg-green-600 text-white px-2 py-1 rounded w-full hover:bg-green-700 text-[10px]"
                                                        onClick={() => flyToTheLocation(turf.location.longitude, turf.location.latitude)}
                                                    >
                                                        View on Map
                                                    </button>

                                                    <button
                                                        className="mt-1 bg-green-600 text-white px-2 py-1 rounded w-full hover:bg-green-700 text-[10px]"
                                                        onClick={() => {
                                                            getDirections(turf.polyline || "")
                                                            flyToTheLocation(userLocateState?.longitude || 77.33, userLocateState?.latitude || 12.454)
                                                        }}
                                                    >
                                                        Directions
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-gray-500 text-xs font-medium p-2">
                                                No Turf For the Filter..
                                            </div>
                                        )}
                                    </div>

                                    {/* Close Button */}
                                    <button
                                        className="px-3 py-1 bg-red-500 text-white rounded text-xs font-semibold hover:bg-red-700 transition w-full"
                                        onClick={() => setMapView(false)}
                                    >
                                        Close Map
                                    </button>
                                </div>

                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MapComponent;