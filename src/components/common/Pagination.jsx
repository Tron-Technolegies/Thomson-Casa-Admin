import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  // Generate page numbers
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between px-6 py-3 border-t border-[#00000026] bg-white">
      <div className="text-sm text-gray-500">
        Showing Page <span className="font-semibold text-gray-900">{currentPage}</span> of <span className="font-semibold text-gray-900">{totalPages}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg transition ${
            currentPage === 1 
              ? "text-gray-300 cursor-not-allowed" 
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <FiChevronLeft size={20} />
        </button>

        <div className="flex items-center gap-1">
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded-lg text-sm font-semibold transition ${
                currentPage === page
                  ? "bg-[#4B5EAA] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg transition ${
            currentPage === totalPages 
              ? "text-gray-300 cursor-not-allowed" 
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <FiChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
