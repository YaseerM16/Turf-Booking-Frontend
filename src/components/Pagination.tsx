import React from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {

    return (
        <div className="flex justify-center items-center mt-6 space-x-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-all hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
                Previous
            </button>

            <span className="text-gray-700 font-semibold text-lg">
                Page <span className="text-green-700">{currentPage}</span> of{" "}
                <span className="text-green-700">{totalPages}</span>
            </span>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-all hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
                Next
            </button>
        </div>

    );
};

export default Pagination;
