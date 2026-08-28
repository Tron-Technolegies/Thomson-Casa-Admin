import React from "react";
import { FiTrendingUp, FiDollarSign, FiAlertCircle } from "react-icons/fi";

export default function AdvanceBalanceStatCards({ balances = [] }) {
  const totalAdvances = balances.reduce((sum, b) => sum + (b.received || 0), 0);
  const totalUsed = balances.reduce((sum, b) => sum + (b.consumed || 0), 0);
  const availableAdvance = balances.reduce((sum, b) => sum + (b.balance || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Advance Collected */}
      <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <span className="text-sm font-bold text-gray-400 tracking-wider">
            ADVANCE COLLECTED
          </span>
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
            <FiDollarSign size={20} />
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">₹ {totalAdvances.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          <div className="flex items-center text-green-600 text-sm font-semibold gap-1">
            <FiTrendingUp /> Total received
          </div>
        </div>
      </div>

      {/* Advance Utilized */}
      <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <span className="text-sm font-bold text-gray-400 tracking-wider">
            ADVANCE UTILIZED
          </span>
          <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600">
            <FiAlertCircle size={20} />
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">₹ {totalUsed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          <div className="flex items-center text-green-600 text-sm font-semibold gap-1">
            <FiTrendingUp /> Applied to invoices
          </div>
        </div>
      </div>

      {/* Available Advance */}
      <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <span className="text-sm font-bold text-gray-400 tracking-wider">
            AVAILABLE ADVANCE
          </span>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">₹ {availableAdvance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          <div className="flex items-center text-green-600 text-sm font-semibold gap-1">
            <FiTrendingUp /> Available balance
          </div>
        </div>
      </div>
    </div>
  );
}
