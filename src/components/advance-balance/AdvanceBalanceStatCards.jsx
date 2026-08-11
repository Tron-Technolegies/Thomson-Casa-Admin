import React from "react";
import { FiTrendingUp, FiDollarSign, FiAlertCircle } from "react-icons/fi";

export default function AdvanceBalanceStatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Payment Recorded */}
      <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <span className="text-sm font-bold text-gray-400 tracking-wider">
            PAYMENT RECORDED
          </span>
          <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600">
            <FiDollarSign size={20} />
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">₹ 1,46,40,000</h3>
          <div className="flex items-center text-green-600 text-sm font-semibold gap-1">
            <FiTrendingUp /> +9.2% vs last month
          </div>
        </div>
      </div>

      {/* Advance Collected */}
      <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <span className="text-sm font-bold text-gray-400 tracking-wider">
            ADVANCE COLLECTED
          </span>
          <div className="bg-red-100 p-2 rounded-lg text-red-500">
            <FiAlertCircle size={20} />
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">₹ 1,46,40,000</h3>
          <div className="flex items-center text-green-600 text-sm font-semibold gap-1">
            <FiTrendingUp /> +8.1% vs last period
          </div>
        </div>
      </div>

      {/* Available Advance */}
      <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <span className="text-sm font-bold text-gray-400 tracking-wider">
            ADVANCE COLLECTED
          </span>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">₹ 1,46,40,000</h3>
          <div className="flex items-center text-green-600 text-sm font-semibold gap-1">
            <FiTrendingUp /> Available advance
          </div>
        </div>
      </div>
    </div>
  );
}
