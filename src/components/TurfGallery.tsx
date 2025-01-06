import { useState } from "react";
import Image from "next/image";

interface GalleryProps {
    images: string[];
}

const TurfGallery: React.FC<GalleryProps> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);

    const closeFullImage = () => {
        setCurrentIndex(null);
    };

    const navigateImage = (direction: "prev" | "next") => {
        setCurrentIndex((prevIndex) => {
            if (prevIndex === null) return null; // Safeguard against null

            if (direction === "prev") {
                return prevIndex === 0 ? images.length - 1 : prevIndex - 1;
            } else {
                return prevIndex === images.length - 1 ? 0 : prevIndex + 1;
            }
        });
    };


    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-green-700 text-lg font-bold mb-4">Gallery</h2>

            {/* Thumbnails Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, idx) => (
                    <div
                        key={idx}
                        className="relative w-full h-40 rounded-lg shadow-md cursor-pointer"
                        onClick={() => setCurrentIndex(idx)}
                    >
                        <Image
                            src={image}
                            alt={`Turf Thumbnail ${idx + 1}`}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                        />
                    </div>
                ))}
            </div>

            {/* Full Image View */}
            {currentIndex !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                    <div className="relative w-11/12 md:w-3/4 lg:w-1/2">
                        <Image
                            src={images[currentIndex]}
                            alt={`Full Turf Image`}
                            layout="responsive"
                            width={16} // Aspect ratio width
                            height={9} // Aspect ratio height
                            className="rounded-lg shadow-lg"
                        />

                        {/* Close Button */}
                        <button
                            onClick={closeFullImage}
                            className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700"
                        >
                            &#x2715;
                        </button>

                        {/* Navigation Arrows */}
                        <button
                            onClick={() => navigateImage("prev")}
                            className="absolute top-1/2 left-4 -translate-y-1/2 bg-green-700 text-white p-2 rounded-full shadow-lg hover:bg-green-800"
                        >
                            &#8592;
                        </button>
                        <button
                            onClick={() => navigateImage("next")}
                            className="absolute top-1/2 right-4 -translate-y-1/2 bg-green-700 text-white p-2 rounded-full shadow-lg hover:bg-green-800"
                        >
                            &#8594;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TurfGallery;
