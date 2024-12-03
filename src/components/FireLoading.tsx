"use client";
import React, { useState, useEffect } from 'react';
type FireLoadingProps = {
  renders: string; // Define the type for the props
};
const FireLoading: React.FC<FireLoadingProps> = ({ renders }) => {
  const [fireColor, setFireColor] = useState('red');

  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomColor = Math.floor(Math.random() * 360);
      setFireColor(`hsl(${randomColor}, 100%, 50%)`);
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      {/* Fireball Container */}
      <div className="relative flex justify-center items-center h-40 w-40 animate-pulse">
        {/* Fireball with Random Color, replaced with the image */}
        <div
          className="absolute rounded-full h-40 w-40 opacity-70 animate-flame"
          style={{
            backgroundColor: fireColor,
            backgroundImage: 'url("/round-image.jpeg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Centered Logo (static position) */}
        <img
          src="/logo.jpeg"
          alt="Logo"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-20 w-20 object-contain rounded-full"
        />
      </div>

      {/* Loading Text */}
      <p className="mt-4 text-orange-700 text-lg font-medium">{renders}...</p>

      {/* Tailwind's Animation Classes */}
      <style jsx>{`
        .animate-flame {
          animation: flame 2s infinite ease-in-out;
        }

        @keyframes flame {
          0% {
            transform: scale(1) rotate(0deg) translateY(0);
          }
          50% {
            transform: scale(1.2) rotate(10deg) translateY(-5px);
          }
          100% {
            transform: scale(1) rotate(0deg) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default FireLoading;
