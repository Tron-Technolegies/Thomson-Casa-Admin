import React from 'react';
import { FiChevronDown } from 'react-icons/fi';

export default function PricingModal({ isOpen, onClose, account }) {
  if (!isOpen || !account) return null;

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
            Pricing
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Customer Name */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Customer
              </label>
              <input
                type="text"
                defaultValue={account.customer || "Sanjay Das"}
                readOnly
                className="h-13 w-full rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA]"
              />
            </div>

            {/* Chicken Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Chicken Type
              </label>
              <div className="relative">
                <select defaultValue={account.type || "Full Chicken"} className="h-13 w-full appearance-none rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA] bg-white">
                  <option>Full Chicken</option>
                  <option>Dressed Chicken</option>
                  <option>Boneless Chicken</option>
                </select>
                <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Weight */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Weight
              </label>
              <input
                type="text"
                defaultValue={account.weight || ""}
                className="h-13 w-full rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA]"
              />
            </div>

            {/* Selling Price */}
            <div className="md:col-span-2 relative">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-600">
                  Selling Price
                </label>
                <span className="text-xs text-gray-500 font-medium">Market: <span className="text-orange-500 font-bold">₹150/kg</span> - Default: <span className="text-blue-500 font-bold">₹120/kg</span></span>
              </div>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="₹----"
                  className="h-13 flex-1 rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA]"
                />
                <button type="button" className="h-13 px-6 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition">
                  Use Default
                </button>
              </div>
            </div>

            {/* GST */}
            <div>
              <input
                type="text"
                placeholder="GST /-"
                className="h-13 w-full rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA]"
              />
            </div>

            {/* Total */}
            <div>
              <input
                type="text"
                placeholder="Total"
                className="h-13 w-full rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA]"
              />
            </div>

          </div>

          {/* Footer */}
          <div className="mt-10">
            <button
              type="submit"
              className="w-full rounded-2xl bg-[#4B5EAA] py-4 font-semibold text-white transition hover:bg-[#3d4f92]"
            >
              Save Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
