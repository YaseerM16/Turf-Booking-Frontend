"use client"; // Ensure this runs only on the client side

import { useEffect } from "react";

const UpdatedMap = () => {
    useEffect(() => {
        try {
            import("olamaps-web-sdk").then((module) => {
                const { OlaMaps } = module;

                const olaMaps = new OlaMaps({
                    apiKey: process.env.NEXT_PUBLIC_OLA_API_KEY!,
                });

                const myMap = olaMaps.init({
                    style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard-mr/style.json",
                    container: "map", // This div must exist
                    center: [77.61648476788898, 12.931423492103944],
                    zoom: 15,
                });

                // Wait for the map to load, then remove the '3d_model_data' layer
                myMap.on("load", () => {
                    if (myMap.getLayer("3d_model_data")) {
                        console.log("Remocig the 3D_Model_DTA :)");

                        myMap.removeLayer("3d_model_data");
                    }
                });

            });
        } catch (error) {
            console.log("Thisis error :", error);
        }
    }, []); // Run only once when the component mounts

    return <div className="w-full h-[80vh] max-w-4xl mx-auto rounded-lg shadow-lg border border-gray-300" id="map" />

};

export default UpdatedMap;
