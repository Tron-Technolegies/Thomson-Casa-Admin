import React from 'react';
import { FiChevronDown } from 'react-icons/fi';

export default function CreateOrderModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="border-b border-gray-200 px-8 py-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Create New Order
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Customer Name */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Customer Name
              </label>
              <div className="relative">
                <select className="h-13 w-full appearance-none rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA] bg-white">
                  <option>Raj Enterprises</option>
                  <option>Fresh Mart</option>
                  <option>Spicyzone Pvt Ltd</option>
                </select>
                <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Delivery Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Delivery Date
              </label>
              <input
                type="date"
                className="h-13 w-full rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA]"
              />
            </div>

            {/* Weight (Kg) */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Weight (Kg)
              </label>
              <input
                type="number"
                placeholder="0"
                className="h-13 w-full rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA]"
              />
            </div>

            {/* Chicken Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Chicken Type
              </label>
              <div className="relative">
                <select className="h-13 w-full appearance-none rounded-2xl border border-gray-300 pl-10 pr-5 outline-none focus:border-[#4B5EAA] bg-white">
                  <option>Full Chicken</option>
                  <option>Dressed Chicken</option>
                  <option>Boneless Chicken</option>
                </select>
                <div className="absolute left-5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#4B5EAA]"></div>
                <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Status
              </label>
              <div className="relative">
                <select className="h-13 w-full appearance-none rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA] bg-white">
                  <option>Delivered</option>
                  <option>Pending</option>
                  <option>Ready</option>
                  <option>Cutting</option>
                  <option>Cancelled</option>
                </select>
                <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Notes
              </label>
              <textarea
                rows="3"
                className="w-full rounded-2xl border border-gray-300 px-5 py-4 resize-none outline-none focus:border-[#4B5EAA]"
              />
            </div>

          </div>

          {/* Footer */}
          <div className="mt-10 flex flex-col-reverse gap-4 md:flex-row md:justify-center">
            <button
              type="button"
              onClick={onClose}
              className="w-full md:w-44 rounded-2xl border border-[#4B5EAA] py-3 font-semibold text-[#4B5EAA] transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full md:w-44 rounded-2xl bg-[#4B5EAA] py-3 font-semibold text-white transition hover:bg-[#3d4f92]"
            >
              Save Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
