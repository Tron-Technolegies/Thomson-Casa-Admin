import React from "react";
import { FiTrendingUp, FiDollarSign, FiAlertCircle } from "react-icons/fi";

export default function AdvanceStatCards({ advances = [] }) {
  const totalAdvances = advances.reduce((sum, a) => sum + (parseFloat(a.amount) || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
      {/* Advance Collected */}
      <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <span className="text-sm font-bold text-gray-400 tracking-wider">
            TOTAL ADVANCE COLLECTED
          </span>
          <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600">
            <FiDollarSign size={20} />
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">₹ {totalAdvances.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          <div className="flex items-center text-green-600 text-sm font-semibold gap-1">
            <FiTrendingUp /> Total received to date
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <span className="text-sm font-bold text-gray-400 tracking-wider">
            ADVANCE TRANSACTIONS
          </span>
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
            <FiAlertCircle size={20} />
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{advances.length}</h3>
          <div className="flex items-center text-gray-500 text-sm font-semibold gap-1">
            Total recorded advances
          </div>
        </div>
      </div>
    </div>
  );
}
