import React from "react";
import { FiTrendingUp, FiShoppingCart } from "react-icons/fi";

export default function AccountsStatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Purchases */}
      <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <span className="text-sm font-bold text-gray-400 tracking-wider">
            TOTAL PURCHASES
          </span>
          <div className="bg-green-100 p-2 rounded-lg text-green-600">
            <FiShoppingCart size={20} />
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">₹ 1,46,40,000</h3>
          <div className="flex items-center text-green-600 text-sm font-semibold gap-1">
            <FiTrendingUp /> +9.2% vs last month
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <span className="text-sm font-bold text-gray-400 tracking-wider">
            ORDERS
          </span>
          <div className="bg-green-100 p-2 rounded-lg text-green-600">
            <FiShoppingCart size={20} />
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">379</h3>
          <div className="flex items-center text-green-600 text-sm font-semibold gap-1">
            <FiTrendingUp /> +8.1% vs last period
          </div>
        </div>
      </div>

      {/* Market Prices */}
      <div className="flex flex-col gap-4">
        <div className="bg-white border border-[#00000026] rounded-xl p-4 shadow-sm flex-1">
          <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase">Market Price — Dressed</h4>
          <div className="bg-indigo-50 rounded-lg py-2 flex justify-center items-center">
            <span className="text-orange-500 font-bold text-sm">₹150/kg</span>
          </div>
        </div>
        <div className="bg-white border border-[#00000026] rounded-xl p-4 shadow-sm flex-1">
          <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase">Market Price — Full</h4>
          <div className="bg-indigo-50 rounded-lg py-2 flex justify-center items-center">
            <span className="text-orange-500 font-bold text-sm">₹130/kg</span>
          </div>
        </div>
      </div>
    </div>
  );
}
