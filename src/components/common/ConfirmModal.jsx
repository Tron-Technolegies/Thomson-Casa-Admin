import React from "react";
import { IoClose, IoWarningOutline } from "react-icons/io5";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-red-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 text-red-600 p-2 rounded-full">
              <IoWarningOutline size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{title || "Confirm Action"}</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-red-100 rounded-full"
          >
            <IoClose size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 text-base">{message || "Are you sure you want to proceed?"}</p>
        </div>
        
        <div className="p-6 pt-0 flex gap-4 justify-end bg-gray-50/50 rounded-b-2xl mt-4 border-t border-gray-100 py-4">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:shadow-sm transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 hover:shadow-md transition-all flex items-center gap-2"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
