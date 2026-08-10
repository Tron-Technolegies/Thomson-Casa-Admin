import React from 'react';
import { FiChevronDown } from 'react-icons/fi';

export default function EditCuttingOrderModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 gap-y-6">
            
            {/* Order Number */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Order Number
              </label>
              <input
                type="text"
                defaultValue={order.order}
                readOnly
                className="h-13 w-full rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA] bg-gray-50 text-gray-700"
              />
            </div>

            {/* Customer Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Customer Name
              </label>
              <input
                type="text"
                defaultValue={order.customer}
                readOnly
                className="h-13 w-full rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA] bg-gray-50 text-gray-700"
              />
            </div>

            {/* Chicken Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Chicken Type
              </label>
              <input
                type="text"
                defaultValue={order.type}
                readOnly
                className="h-13 w-full rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA] bg-gray-50 text-gray-700"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Weight
              </label>
              <input
                type="text"
                defaultValue={order.weight}
                readOnly
                className="h-13 w-full rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA] bg-gray-50 text-gray-700"
              />
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Status
              </label>
              <div className="relative">
                <select defaultValue={order.status} className="h-13 w-full appearance-none rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA] bg-white">
                  <option>Pending</option>
                  <option>Cutting</option>
                  <option>Ready</option>
                </select>
                <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="mt-10 flex flex-col-reverse gap-4 md:flex-row md:justify-center">
            <button
              type="button"
              onClick={onClose}
              className="w-full md:w-40 rounded-2xl border border-[#4B5EAA] py-3 font-semibold text-[#4B5EAA] transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full md:w-40 rounded-2xl bg-[#4B5EAA] py-3 font-semibold text-white transition hover:bg-[#3d4f92]"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
