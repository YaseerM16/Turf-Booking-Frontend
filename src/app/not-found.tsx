import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-6">
            {/* Turf-Themed 404 Text */}
            {/* <h1 className="text-6xl font-extrabold text-green-600">404</h1> */}
            <Image
                src="/404-turf.png"
                alt="Lost Turf"
                width={288} // 72 * 4 (Tailwind width in pixels)
                height={162} // Adjust height proportionally if needed
                className="mt-6 rounded-lg"
            />            <h2 className="text-2xl font-semibold text-gray-800 mt-2">
                Oops! This turf doesn’t exist.
            </h2>
            <p className="text-lg text-gray-600 mt-2">
                Looks like you’ve stepped onto an empty field. Let’s get you back to the game!
            </p>

            {/* Go Home Button */}
            <Link href="/" className="mt-6 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium rounded-lg shadow-lg transition-all duration-300">
                🏠 Return to Home
            </Link>

            {/* Optional: Turf Image */}
        </div>
    );
}
