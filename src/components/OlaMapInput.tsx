'use client'

import { OlaMaps } from '../../public/olamaps/dist/olamaps-js-sdk.es';
import { useEffect, useRef, useState } from 'react';
import '../../public/olamaps/dist/style.css'
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Swal from 'sweetalert2';


interface PlacePrediction {
    structured_formatting: any;
    place_id: string;
    description: string;
    formatted_address: string;
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
    };
}

export interface Location {
    lat: number;
    lng: number;
}

interface MapComponentProps {
    onConfrimAndClose: (location: Location | null, address: string | null) => void;
    mapView: boolean;
    toggleMapView: () => void;
    mapStyle?: object;
}

const MapComponent: React.FC<MapComponentProps> = ({ mapView, onConfrimAndClose, toggleMapView }) => {
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
    const [searchResults, setSearchResults] = useState<PlacePrediction[]>([]);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [removeCurrentLoc, setRemoveCurrentLoc] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null); // Store the address

    const [errorMessage, setErrorMessage] = useState('');
    const [query, setQuery] = useState('');
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const geoLocateRef = useRef<any>(null); // Store the geoLocate instance
    const geoLocateInitializedRef = useRef(false); // Track initialization
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null); // Reference to the marker

    console.log("Coordinate :", coordinates);



    const handleGeoLocateError = (error: any) => {
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
    }

    const handleGeoLocateSuccess = (event: any) => {
        console.log("GEOLocale inside CallBAck :", event);
        const lat = event.coords.latitude
        const lng = event.coords.longitude
        setCoordinates({ lat, lng })
        getReverseGeocode(lat, lng)
        // markerRef.current?.setLngLat([lat, lng])
        if (markerRef.current) {
            markerRef.current.setLngLat([lng, lat]);
        }
        setRemoveCurrentLoc(true)
        console.log("AFTER settin the REVMOVe LOCCa");

    }


    const setCurrentLocation = () => {
        // console.log("HEELLOO");

        if (geoLocateRef.current) {
            geoLocateRef.current.trigger();
        } else {
            toast.warn("Geolocation is not Initiated");
            console.error('GeoLocate control is not initialized.');
        }
    }

    const removeCurrentLocation = () => {
        setRemoveCurrentLoc(false)
        setCoordinates(null)
        setSelectedAddress(null)
        setCurrentLocation()
    }


    useEffect(() => {
        if (mapView) {
            const olaMaps = new OlaMaps({
                apiKey: process.env.NEXT_PUBLIC_OLA_API_KEY,
            });



            const map = olaMaps.init({
                style: 'https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json', // Replace with tiles JSON URL
                container: mapContainerRef.current?.id || '', // Map container ID
                center: coordinates ? [coordinates.lng, coordinates.lat] : [77.5946, 12.9716],
                zoom: 12, // Zoom level
            });

            // <GeoLocate>
            const geoLocate = olaMaps.addGeolocateControls({
                positionOptions: {
                    enableHighAccuracy: true,
                },
                trackUserLocation: true,
            })

            geoLocate.on('geolocate', (event: Event) => handleGeoLocateSuccess(event))
            geoLocate.on('error', handleGeoLocateError)
            // if (!geoLocateInitializedRef.current) {
            //     geoLocateInitializedRef.current = true;
            // }

            geoLocateRef.current = geoLocate; // Save geoLocate instance to ref
            map.addControl(geoLocate);
            // map.on('load', () => {
            //     geoLocate.trigger()
            // })



            //     toast.info("Please enable location services for a more precise location.");
            //     console.log('An error event has occurred.', error)
            // })

            // geoLocate.on('trackuserlocationstart', () => {
            //     console.log('User location tracking has started.');
            // })

            // geoLocate.on('trackuserlocationend', () => {
            //     console.log('User location tracking has ended.');
            // })

            // geoLocate.on('userlocationfocus', () => {
            //     console.log('User location is focused on the map.');
            // })

            // geoLocate.on('userlocationlostfocus', () => {
            //     console.log('User location has lost focus on the map.');
            // })

            // geoLocate.on('outofmaxbounds', () => {
            //     console.warn('User location is out of the maximum bounds.');
            // })
            mapRef.current = map
            if (coordinates) {
                markerRef.current = olaMaps
                    .addMarker({
                        color: '#FF0000', // Red marker
                        draggable: true, // Enable dragging
                    })
                    .setLngLat([coordinates.lng, coordinates.lat]) // Use updated coordinates or default
                    .addTo(map);
            } else {
                markerRef.current = olaMaps
                    .addMarker({
                        color: '#FF0000', // Red marker
                        draggable: true, // Enable dragging
                    })
                    .setLngLat([77.5946, 12.9716]) // Use updated coordinates or default
                    .addTo(map);
            }



            // Event listener for marker drag
            const onDrag = () => {
                const lngLat = markerRef.current.getLngLat(); // Returns an object { lng: ..., lat: ... }
                const lat = lngLat.lat; // Access latitude
                const lng = lngLat.lng; // Access longitude
                setCoordinates({ lat, lng }); // Update state with new coordinates
                getReverseGeocode(lat, lng)
            };

            // markerRef.current.on('drag', onDrag);
            markerRef.current?.on('dragend', onDrag);
            return () => {
                map?.remove(); // Cleanup map on unmount
                geoLocate.off("error", handleGeoLocateError)
                geoLocate.off("geolocate", handleGeoLocateSuccess)
            };
        }
    }, [mapView]);

    // Reverse Geocode to get the address
    const getReverseGeocode = async (lat: number, lng: number): Promise<string | undefined> => {
        if (!lat || !lng) {
            console.log("Lat or Long is not PROVI in getReverseGeoCODE !!");
        }
        // console.log("THE ReverseGeoCode is Call <.>");

        try {

            const response = await fetch(
                `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${lat},${lng}&api_key=${process.env.NEXT_PUBLIC_OLA_API_KEY}`
            );
            // console.log("Retrieved RESPONEDE :", response);
            if (response.ok) {
                const data = await response.json();
                // console.log("ReverseCode : ", data);

                if (data.status == "ok") {
                    // console.log("Add this is ADDRESS :", data.results[0].formatted_address);
                    setSelectedAddress(data.results[0].formatted_address);
                    return data.results[0].formatted_address
                } else {
                    setErrorMessage('Address not found.');
                }
            } else {
                setErrorMessage('Failed to fetch address.');
            }
        } catch (error) {
            console.error('Error fetching reverse geocode:', error);
            setErrorMessage('An error occurred while fetching the address.');
        }
    };

    const searchPlaces = async (searchQuery: string) => {
        if (!searchQuery) {
            setSearchResults([]);
            setDropdownVisible(false);
            return;
        }

        try {
            const response = await fetch(
                `https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(
                    searchQuery
                )}&api_key=${process.env.NEXT_PUBLIC_OLA_API_KEY}`,
                { headers: { 'X-Request-Id': 'request-123' } }
            );



            if (response.ok) {
                const data = await response.json();
                console.log("RES data by AutoComplete :", data);
                if (data && data.predictions.length > 0) {
                    setSearchResults(data.predictions);
                    setDropdownVisible(true);
                    setErrorMessage('');
                } else {
                    setSearchResults([]);
                    setDropdownVisible(false);
                    setErrorMessage('No results found.');
                }
            } else {
                setErrorMessage('Failed to fetch data.');
                setDropdownVisible(false);
            }
        } catch (error) {
            console.error('Error during fetch operation:', error);
            setErrorMessage('An error occurred while fetching data.');
            setDropdownVisible(false);
        }
    };

    // Fetch Place Details to get the location (lat/lng)
    const fetchPlaceDetails = async (placeId: string) => {
        try {
            // console.log("Fetching PLaCe Dets !!");

            const response = await fetch(
                `https://api.olamaps.io/places/v1/details?place_id=${placeId}&api_key=${process.env.NEXT_PUBLIC_OLA_API_KEY}`,
                { headers: { 'X-Request-Id': 'request-123' } }
            );

            // const resDet = await response.json()



            if (response.ok) {
                const data = await response.json();
                // console.log("After Full Fetched PlaceDet Res :", data);
                if (data && data.result.geometry) {
                    const { lat, lng } = data.result.geometry.location;
                    return { lat, lng };
                }
            }
        } catch (error) {
            console.error('Error fetching place details:', error);
        }
        return null;
    };

    // Debounced search
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
            searchPlaces(value);
        }, 500);
    };

    // Handle location selection
    const handleLocationSelect = async (place: PlacePrediction) => {
        setQuery(place.description);
        setDropdownVisible(false);
        // console.log("PlAcE :", place.structured_formatting.secondary_text);

        const location = await fetchPlaceDetails(place.place_id);
        if (location) {
            setSelectedAddress(place.structured_formatting.secondary_text)
            setCoordinates(location)
            // console.log("Location gEometry : ", location, "ADDress::", address);
            if (mapRef.current) {
                console.log("Flying to:", location);

                // Use flyTo for smooth navigation
                mapRef.current.flyTo({
                    center: [location.lng, location.lat],
                    zoom: 15, // Zoom level
                });
            } else {
                console.error("Map reference is not initialized.");
            }


            if (markerRef.current) {
                markerRef.current.setLngLat([location.lng, location.lat]);
            }

        }
    };


    const submitMap = () => {
        toggleMapView()
        onConfrimAndClose(coordinates, selectedAddress)
        // map?.remove(); // Cleanup map on unmount
        // console.log("CAliing the parentCallback :", coordinates, selectedAddress);
    }

    return (
        <>
            <ToastContainer position="bottom-center" autoClose={2400} hideProgressBar={true} />
            <div>
                {/* Company Registration Form */}
                <div>
                    {/* Existing form fields */}
                    <button
                        type="button"
                        onClick={toggleMapView}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        Set the Company Location
                    </button>
                </div>

                {/* Map Modal */}
                {mapView && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '0px',
                            left: 0,
                            width: '100%',
                            height: '100vh',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            paddingLeft: "18%",
                            paddingTop: "150px", // Optional top padding
                            // paddingRight: "50%",
                            // transform: "translateX(-25%)",
                            // paddingTop: "205px",
                            // paddingBottom: "200px"
                            // display: 'flex',
                            // justifyContent: 'center',
                            // alignItems: 'center',
                        }}
                    >
                        <div
                            style={{
                                width: '90%',
                                maxWidth: '1000px',
                                height: '500px',
                                backgroundColor: '#fff',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                position: 'relative',
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            {/* Search Input */}
                            <input
                                type="text"
                                placeholder="Search places..."
                                value={query}
                                onChange={handleSearchChange}
                                onFocus={() => setDropdownVisible(true)}
                                style={{
                                    padding: '12px',
                                    width: '320px',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
                                    outline: 'none',
                                    position: 'absolute',
                                    top: '15px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    zIndex: 2,
                                }}
                            />
                            {/* Dropdown Suggestions */}
                            {isDropdownVisible && searchResults.length > 0 && (
                                <ul
                                    style={{
                                        position: 'absolute',
                                        top: '55px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        backgroundColor: 'white',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        maxHeight: '250px',
                                        overflowY: 'auto',
                                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                        zIndex: 10,
                                        listStyle: 'none',
                                        margin: 0,
                                        padding: '10px',
                                        width: '320px',
                                    }}
                                >
                                    {searchResults.map((place) => (
                                        <li
                                            key={place.place_id}
                                            onClick={() => handleLocationSelect(place)}
                                            style={{
                                                padding: '12px',
                                                cursor: 'pointer',
                                                borderBottom: '1px solid #f0f0f0',
                                                fontSize: '14px',
                                            }}
                                            onMouseEnter={(e) =>
                                                (e.currentTarget.style.backgroundColor = '#f8f8f8')
                                            }
                                            onMouseLeave={(e) =>
                                                (e.currentTarget.style.backgroundColor = 'white')
                                            }
                                        >
                                            <strong>{place.description}</strong>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {/* Map */}
                            <div
                                id="ola-map"
                                ref={mapContainerRef}
                                style={{
                                    width: '100%',
                                    height: 'calc(100% - 150px)', // Reserve space for the buttons and address box
                                }}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: '5px', // Adjust the vertical position
                                    left: '50%',
                                    transform: 'translateX(-50%)', // Center horizontally
                                    display: 'flex',
                                    justifyContent: 'center', // Align buttons horizontally
                                    gap: '10px', // Add space between buttons
                                    zIndex: 2, // Ensure the buttons are above other elements
                                    width: '100%', // Ensure it spans full width if needed
                                    paddingTop: '10px'
                                }}
                            >
                                {/* Set Current Location Button */}
                                {removeCurrentLoc ? <button onClick={removeCurrentLocation} className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none shadow-lg transition duration-200 ease-in-out"
                                >  Remove Current Location
                                </button> : <button
                                    type="button"
                                    style={{
                                        padding: '12px 24px',
                                        backgroundColor: '#2196F3',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        transition: 'background-color 0.3s',
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.backgroundColor = '#1976D2')
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.backgroundColor = '#2196F3')
                                    }
                                    onClick={setCurrentLocation}
                                >
                                    Set Current Location
                                </button>}


                                {/* Confirm and Close Button */}
                                <button
                                    onClick={() => submitMap()}
                                    style={{
                                        padding: '12px 24px',
                                        backgroundColor: '#4CAF50',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        transition: 'background-color 0.3s',
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.backgroundColor = '#45A049')
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.backgroundColor = '#4CAF50')
                                    }
                                >
                                    Confirm and Close
                                </button>
                            </div>



                            {/* Display Selected Address */}
                            {selectedAddress && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        bottom: '55px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        padding: '10px 40px', // Increased horizontal padding for a balanced look
                                        backgroundColor: '#f9f9f9',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                        maxWidth: '95%', // Increased the maximum width to make it wider
                                        textAlign: 'center',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                    }}
                                >
                                    <strong>Selected Address:</strong>
                                    <p style={{ margin: '5px 0', color: '#333' }}>{selectedAddress}</p>
                                </div>
                            )}
                        </div>

                    </div>
                )}

            </div>
        </>
    );

};

export default MapComponent;
