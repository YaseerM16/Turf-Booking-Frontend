import React from "react";
import { CustomArrowProps } from "react-slick";

export const NextArrow: React.FC<CustomArrowProps> = ({ onClick }) => (
    <div
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full cursor-pointer z-30 shadow-lg"
        onClick={onClick} // <-- Use the provided onClick from react-slick
    >
        ➡
    </div>
);

export const PrevArrow: React.FC<CustomArrowProps> = ({ onClick }) => (
    <div
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full cursor-pointer z-30 shadow-lg"
        onClick={onClick}
    >
        ⬅
    </div>
);



