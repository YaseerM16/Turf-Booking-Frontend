// "use client";

// import { OlaMaps } from '../../public/olamaps/dist/olamaps-js-sdk.es';
// import { useCallback, useEffect, useRef, useState } from 'react';
// import { Map_2, GeolocateControl } from "../../public/olamaps/dist/index"
// import { TurfDetails } from '@/utils/type';
// import Swal from 'sweetalert2';


// interface MapComponentProps {
//     location: { latitude: number, longitude: number }
//     turfs: TurfDetails[]
// }

// interface RouteDetails {
//     companyPhone: number;
//     companyName: string;
//     turfName: string | undefined;
//     images: any;
//     duration: string | number;  // Assuming duration is a string (e.g., "10 mins")
//     distance: number;  // Assuming distance is a number (e.g., 10)
//     polyline?: string;
//     location: { latitude: number, longitude: number }
// }
// // curl--location--request POST "https://api.olamaps.io/routing/v1/directions?origin=18.76029027465273,73.3814242364375&destination=18.73354223011708,73.44587966939002&api_key=${your_api_key}" --header "X-Request-Id: XXX"
// const MapComponent: React.FC<MapComponentProps> = ({ location, turfs }) => {
//     // console.log("Location GiveN :: ", location);
//     const mapContainerRef = useRef<HTMLDivElement | null>(null);
//     const [mapView, setMapView] = useState<boolean>(false)
//     const mapRef = useRef<Map_2 | null>(null);
//     const [routeDets, setRouteDets] = useState<RouteDetails | null>(null)
//     const geoLocateRef = useRef<GeolocateControl | null>(null); // Store the geoLocate instance
//     const [polyLine, setPolyLine] = useState<number[][] | null>(null)
//     const [allRouteDets, setAllRouteDets] = useState<RouteDetails[] | []>([])
//     const [filteredRouteDets, setfilteredRouteDets] = useState<RouteDetails[] | []>([])
//     const destLocation = useRef<{ latitude: number; longitude: number } | null>(null);
//     const userLocation = useRef<{ latitude: number; longitude: number } | null>(null);
//     const [userLocateState, setUserLocateState] = useState<{ latitude: number; longitude: number } | null>(null);
//     const mapInstance = useRef<any>(null); // Store the map instance

//     const handleGeoLocateSuccess = useCallback(async (event: { coords: { latitude: number, longitude: number } }) => {
//         try {
//             const lat = event.coords.latitude
//             const lng = event.coords.longitude
//             flyToTheLocation(lng, lat)
//         } catch (error) {
//             console.log("Error while attempt to routing :", error);
//         }
//     }, [])

//     const handleGeoLocateError = useCallback((error: { PERMISSION_DENIED: number }) => {
//         if (error.PERMISSION_DENIED) {
//             Swal.fire({
//                 icon: 'info',
//                 title: 'Location Services Required',
//                 text: 'Please enable your location services to set your current location.',
//                 showConfirmButton: false,
//                 timer: 3000,
//                 toast: true,
//                 position: 'top-end',
//             });
//         }
//         console.log('An error event has occurred.', error)
//     }, [])

//     useEffect(() => {
//         if (!mapView || !mapContainerRef.current || mapInstance.current) return; // Prevent re-initialization

//         const olaMaps = new OlaMaps({
//             apiKey: process.env.NEXT_PUBLIC_OLA_API_KEY!,
//         });

//         // Initialize the map only once
//         mapInstance.current = olaMaps.init({
//             style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
//             container: mapContainerRef.current,
//             center: [77.61648476788898, 12.931423492103944],
//             zoom: 15,
//         });

//         const geoLocate = olaMaps.addGeolocateControls({
//             positionOptions: { enableHighAccuracy: true },
//             trackUserLocation: true,
//         });

//         geoLocate.on('geolocate', (event: Event) =>
//             handleGeoLocateSuccess(event as unknown as { coords: { latitude: number; longitude: number } })
//         );

//         geoLocate.on('error', handleGeoLocateError);
//         geoLocateRef.current = geoLocate;
//         mapInstance.current.addControl(geoLocate);

//     }, [mapView]);


//     const flyToTheLocation = (lng: number, lat: number) => {
//         if (!mapInstance.current) return;

//         const randomLat = 12.9 + Math.random() * 0.2;
//         const randomLng = 77.5 + Math.random() * 0.2;

//         // Fly to the random location
//         mapInstance.current.flyTo({
//             center: [lng, lat],
//             zoom: 15,
//         });
//     };

//     const onCurrentLocation = () => {
//         try {
//             geoLocateRef.current.trigger();
//         } catch (error) {
//             console.log("Error while Triggering the Geolocation :", error);
//         }
//     }

//     return (
//         <div>
//             {/* Company Registration Form */}
//             <div>
//                 {/* Existing form fields */}
//                 <button
//                     type="button"
//                     onClick={() => {
//                         setMapView(true)
//                         // toggleview()
//                     }
//                     }
//                     style={{
//                         padding: '10px 20px',
//                         backgroundColor: '#4CAF50',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: '5px',
//                         cursor: 'pointer',
//                     }}
//                 >
//                     Company Location
//                 </button>
//             </div>
//             <div className="flex flex-col">
//                 <div>
//                     {mapView && (
//                         <>
//                             <div
//                                 style={{
//                                     position: 'fixed',
//                                     top: 0,
//                                     left: 0,
//                                     width: '100vw',
//                                     height: '100vh',
//                                     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//                                     display: 'flex',
//                                     justifyContent: 'center',
//                                     alignItems: 'center',
//                                     zIndex: 9999, // High z-index for modal
//                                 }}
//                             >

//                                 <div
//                                     style={{
//                                         width: '95%',
//                                         maxWidth: '980px',
//                                         height: '100vh',
//                                         backgroundColor: '#fff',
//                                         borderRadius: '8px',
//                                         overflow: 'hidden',
//                                         position: 'relative',
//                                         display: 'flex',
//                                         flexDirection: 'column',
//                                     }}
//                                 >
//                                     {/* Buttons Section */}
//                                     <div className="absolute bottom-4 right-4 flex gap-3">
//                                         <button
//                                             className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md text-sm font-semibold hover:bg-green-700 transition"
//                                         // onClick={() => setCurrentLocation()}
//                                         >
//                                             {/* <FaMapMarkerAlt size={14} /> */}
//                                             Get Directions
//                                             {/* <FaArrowRight size={14} /> */}
//                                         </button>

//                                         <button
//                                             className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-semibold hover:bg-red-700 transition"
//                                             onClick={() => {
//                                                 setMapView(false);
//                                                 // setRouteDets(null);
//                                             }}
//                                         >
//                                             Close
//                                         </button>
//                                         {/* Fly To Random Location Button */}
//                                         <button
//                                             onClick={() => flyToTheLocation(77.45, 12.343)}
//                                             className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//                                         >
//                                             Fly to Random Location
//                                         </button>
//                                         {/* Fly To Random Location Button */}
//                                         <button
//                                             onClick={onCurrentLocation}
//                                             className="mt-4 bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//                                         >
//                                             current Location
//                                         </button>
//                                     </div>
//                                     {/* Map Container */}
//                                     <div ref={mapContainerRef} className="w-full h-[500px]"></div>

//                                 </div>
//                             </div>

//                         </>

//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default MapComponent;