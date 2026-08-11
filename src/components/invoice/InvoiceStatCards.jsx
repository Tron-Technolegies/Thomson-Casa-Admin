import React from "react";
import { FiTrendingUp, FiFileText, FiDollarSign, FiCreditCard } from "react-icons/fi";

export default function InvoiceStatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {/* Total Invoiced */}
      <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-bold text-gray-400 tracking-wider">
            TOTAL INVOICED
          </span>
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
            <FiFileText size={20} />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">₹ 4,18,500</h3>
          <div className="flex items-center text-green-600 text-xs font-semibold gap-1">
            <FiTrendingUp /> Net amount
          </div>
        </div>
      </div>

      {/* Total Tax */}
      <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-bold text-gray-400 tracking-wider">
            TOTAL TAX
          </span>
          <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600">
            <FiFileText size={20} />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">₹ 41,850</h3>
          <div className="flex items-center text-gray-500 text-xs font-semibold gap-1">
            GST collected
          </div>
        </div>
      </div>

      {/* Gross Total */}
      <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-bold text-gray-400 tracking-wider">
            GROSS TOTAL
          </span>
          <div className="bg-green-100 p-2 rounded-lg text-green-600">
            <FiDollarSign size={20} />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">₹ 4,60,350</h3>
          <div className="flex items-center text-green-600 text-xs font-semibold gap-1">
            <FiTrendingUp /> Incl. taxes
          </div>
        </div>
      </div>

      {/* Amount Paid */}
      <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-bold text-gray-400 tracking-wider">
            AMOUNT PAID
          </span>
          <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
            <FiCreditCard size={20} />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">₹ 2,51,350</h3>
          <div className="flex items-center text-green-600 text-xs font-semibold gap-1">
            <FiTrendingUp /> 4 invoices cleared
          </div>
        </div>
      </div>
    </div>
  );
}
