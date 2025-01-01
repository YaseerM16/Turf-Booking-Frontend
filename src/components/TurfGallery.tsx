import Image from "next/image";
import React, { useState } from "react";

interface GalleryProps {
    images: string[];
}

const TurfGallery: React.FC<GalleryProps> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-green-700 text-lg font-bold mb-4">Gallery</h2>

            {/* Highlighted Image */}
            <div className="mb-6 relative">
                <Image
                    src={images[currentIndex]}
                    alt="Highlighted Turf Image"
                    layout="responsive"
                    width={16} // Aspect ratio width
                    height={9} // Aspect ratio height
                    className="rounded-lg shadow-md"
                />

                {/* Navigation Arrows */}
                <button
                    onClick={() => {
                        setCurrentIndex((prevIndex) =>
                            prevIndex === 0 ? images.length - 1 : prevIndex - 1
                        );
                    }}
                    className="absolute top-1/2 left-4 -translate-y-1/2 bg-green-700 text-white p-2 rounded-full shadow-lg hover:bg-green-800"
                >
                    &#8592;
                </button>
                <button
                    onClick={() => {
                        setCurrentIndex((prevIndex) =>
                            prevIndex === images.length - 1 ? 0 : prevIndex + 1
                        );
                    }}
                    className="absolute top-1/2 right-4 -translate-y-1/2 bg-green-700 text-white p-2 rounded-full shadow-lg hover:bg-green-800"
                >
                    &#8594;
                </button>
            </div>

            {/* Thumbnails Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, idx) => (
                    <div
                        key={idx}
                        className={`relative w-full h-40 rounded-lg shadow-md cursor-pointer ${currentIndex === idx ? "border-4 border-green-700" : ""}`}
                        onClick={() => setCurrentIndex(idx)}
                    >
                        <Image
                            src={image}
                            alt={`Turf Thumbnail ${idx + 1}`}
                            layout="fill" // Ensures the image fills the container
                            objectFit="cover" // Mimics `object-cover` behavior
                            className="rounded-lg"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TurfGallery;
