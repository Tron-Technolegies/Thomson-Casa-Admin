import React from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { BiMoney } from 'react-icons/bi';

export default function RecordAdvanceModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="px-8 py-4">
          <h2 className="text-xl font-bold text-gray-900">
            Record Advance
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-6">
            
            {/* Customer Name */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-500">
                Customer
              </label>
              <input
                type="text"
                defaultValue="Apex Industries"
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 outline-none focus:border-[#4B5EAA] focus:bg-white text-gray-700 font-medium"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-500">
                Amount (₹)
              </label>
              <input
                type="number"
                placeholder="0.00"
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 outline-none focus:border-[#4B5EAA] focus:bg-white text-gray-700 font-medium"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-500">
                Payment Method
              </label>
              <div className="relative">
                <select className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-9 outline-none focus:border-[#4B5EAA] focus:bg-white text-gray-700 font-medium">
                  <option>Cash</option>
                  <option>Bank Transfer</option>
                  <option>Cheque</option>
                  <option>UPI</option>
                </select>
                <BiMoney className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Reference No. */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-500">
                Reference No.
              </label>
              <input
                type="text"
                placeholder="e.g. NEFT-20260709-001"
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 outline-none focus:border-[#4B5EAA] focus:bg-white text-gray-700 font-medium"
              />
            </div>

            {/* Note */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-medium text-gray-500">
                Note
              </label>
              <input
                type="text"
                placeholder="Optional note"
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 outline-none focus:border-[#4B5EAA] focus:bg-white text-gray-700 font-medium"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold mr-4 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#4B5EAA] text-white font-semibold hover:bg-[#3d4f92] transition"
            >
              <span>+</span> Record Advance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
