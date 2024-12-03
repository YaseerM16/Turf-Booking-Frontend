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
        <div className="flex justify-between items-center mt-4">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-green-700 text-white px-4 py-2 rounded-md font-medium disabled:bg-gray-400"
            >
                Previous
            </button>

            <span className="text-gray-700 font-semibold">
                Page {currentPage} of {totalPages}
            </span>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-green-700 text-white px-4 py-2 rounded-md font-medium disabled:bg-gray-400"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
