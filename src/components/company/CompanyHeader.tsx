import React from 'react';

const Header = () => {
    return (
        <header className="bg-green-500 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <img src="/logo.jpeg"
                        alt="Logo" className="w-12   
 h-12 mr-4" />
                    <h1 className="text-2xl font-bold">Kowai Arena</h1>
                </div>

                <div className="flex items-center">
                    <button className="bg-white text-green-500 hover:bg-green-600 text-sm font-bold py-2 px-4 rounded-md mr-4">
                        Notifications
                    </button>
                    <button className="bg-white text-green-500 hover:bg-green-600 text-sm font-bold py-2 px-4 rounded-md">
                        Profile
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;