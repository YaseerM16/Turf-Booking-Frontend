import Image from "next/image";
import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="bg-black text-white py-8">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-4 gap-8">
                {/* Brand Section */}
                <div className="flex flex-col items-start">
                    <div className="flex items-center space-x-3">
                        <Image
                            src="/logo.jpeg"
                            alt="Turf_Book Logo"
                            width={40} // Equivalent to w-10 (10 * 4 = 40px)
                            height={40} // Equivalent to h-10 (10 * 4 = 40px)
                            className="w-10 h-10"
                        />
                        <span className="text-lg font-bold text-green-500">
                            Turf_Book
                        </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-3 leading-relaxed">
                        Great platform for the job seeker that’s passionate
                        about sports. Find your dream job easier.
                    </p>
                </div>

                {/* About Section */}
                <div>
                    <h4 className="text-base font-semibold mb-4">About</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li className="hover:text-gray-200 cursor-pointer">
                            Companies
                        </li>
                        <li className="hover:text-gray-200 cursor-pointer">
                            Subscriptions
                        </li>
                        <li className="hover:text-gray-200 cursor-pointer">
                            Terms
                        </li>
                        <li className="hover:text-gray-200 cursor-pointer">
                            Privacy Policy
                        </li>
                    </ul>
                </div>

                {/* Resources Section */}
                <div>
                    <h4 className="text-base font-semibold mb-4">Resources</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li className="hover:text-gray-200 cursor-pointer">
                            Help Docs
                        </li>
                        <li className="hover:text-gray-200 cursor-pointer">
                            Guides
                        </li>
                        <li className="hover:text-gray-200 cursor-pointer">
                            Updates
                        </li>
                        <li className="hover:text-gray-200 cursor-pointer">
                            Contact Us
                        </li>
                    </ul>
                </div>

                {/* Connect With Us */}
                <div>
                    <h4 className="text-base font-semibold mb-4">Connect with us</h4>
                    <div className="flex space-x-4">
                        <a
                            href="#"
                            className="text-gray-400 hover:text-white transition"
                            aria-label="Facebook"
                        >
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a
                            href="#"
                            className="text-gray-400 hover:text-white transition"
                            aria-label="Instagram"
                        >
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a
                            href="#"
                            className="text-gray-400 hover:text-white transition"
                            aria-label="Twitter"
                        >
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a
                            href="#"
                            className="text-gray-400 hover:text-white transition"
                            aria-label="LinkedIn"
                        >
                            <i className="fab fa-linkedin"></i>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
