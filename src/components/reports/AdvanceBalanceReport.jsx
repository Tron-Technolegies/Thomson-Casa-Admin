import React from "react";
import { FiTrendingUp, FiCreditCard, FiShoppingCart, FiDownload } from "react-icons/fi";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";

const advanceData = [
  { customer: "Name", received: "₹ 4,70,000", consumed: "₹ 84,000", balance: "₹ 66,000", percent: 56, lastTx: "09 Jul 2026" },
  { customer: "Name", received: "₹ 2,80,000", consumed: "₹ 1,85,000", balance: "₹ 15,000", percent: 93, lastTx: "09 Jul 2026" },
  { customer: "Name", received: "₹ 1,50,000", consumed: "₹ 63,000", balance: "₹ 37,000", percent: 63, lastTx: "08 Jul 2026" },
  { customer: "Name", received: "₹ 3,90,000", consumed: "₹ 56,000", balance: "₹ 19,000", percent: 75, lastTx: "08 Jul 2026" },
  { customer: "Name", received: "₹ 3,40,000", consumed: "₹ 21,000", balance: "₹ 29,000", percent: 42, lastTx: "07 Jul 2026" },
];

export default function AdvanceBalanceReport() {
  return (
    <div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">ADVANCE RECEIVED</span>
            <div className="bg-blue-100 p-2 rounded-lg text-blue-500"><FiCreditCard size={20} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">₹5,75,500</h3>
            <div className="flex items-center text-green-600 text-xs font-semibold gap-1"><FiTrendingUp /> Total collected</div>
          </div>
        </div>

        <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">CONSUMED</span>
            <div className="bg-purple-100 p-2 rounded-lg text-purple-400"><FiShoppingCart size={20} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">₹4,09,000</h3>
            <div className="flex items-center text-gray-400 text-xs font-semibold gap-1">Applied to orders</div>
          </div>
        </div>

        <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">REMAINING BALANCE</span>
            <div className="bg-green-100 p-2 rounded-lg text-green-500"><MdOutlineAccountBalanceWallet size={20} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">₹1,66,000</h3>
            <div className="flex items-center text-green-600 text-xs font-semibold gap-1"><FiTrendingUp /> Available advance</div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-[#00000026] rounded-xl overflow-hidden shadow-sm">
        <div className="flex justify-between items-center p-6 border-b border-[#00000026]">
          <h2 className="text-lg font-bold text-gray-900">Advance Balance Details</h2>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 bg-green-100 text-green-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-200 transition">
              <FiDownload size={16} /> Excel
            </button>
            <button className="flex items-center gap-2 bg-red-100 text-red-500 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-200 transition">
              <FiDownload size={16} /> PDF
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-[#F8F9FB] text-xs uppercase text-gray-400 font-bold border-b border-[#00000026]">
              <tr>
                <th className="px-6 py-4">CUSTOMER</th>
                <th className="px-6 py-4 text-center">ADVANCE RECEIVED</th>
                <th className="px-6 py-4 text-center">CONSUMED</th>
                <th className="px-6 py-4 text-center">BALANCE</th>
                <th className="px-6 py-4 text-center">UTILIZATION</th>
                <th className="px-6 py-4 text-right">LAST TRANSACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#00000026]">
              {advanceData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-medium text-gray-900">{row.customer}</td>
                  <td className="px-6 py-5 font-medium text-gray-900 text-center">{row.received}</td>
                  <td className="px-6 py-5 font-medium text-gray-900 text-center">{row.consumed}</td>
                  <td className="px-6 py-5 font-bold text-gray-900 text-center">{row.balance}</td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center items-center gap-3">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-[#4B5EAA] h-2 rounded-full" style={{ width: `${row.percent}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-gray-400 w-6">{row.percent}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-medium text-gray-900 text-right">{row.lastTx}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
