import React from "react";
import { FiTrendingUp, FiTrendingDown, FiDownload } from "react-icons/fi";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";

const customerBalanceData = [
  { name: "Name", credit: "₹ 5,00,000", debit: "₹ 4,70,000", balance: "₹ 30,000", position: "Credit" },
  { name: "Name", credit: "₹ 2,50,000", debit: "₹ 2,80,000", balance: "₹ 30,000", position: "Debit" },
  { name: "Name", credit: "₹ 1,80,000", debit: "₹ 1,50,000", balance: "₹ 30,000", position: "Credit" },
  { name: "Name", credit: "₹ 4,20,000", debit: "₹ 3,90,000", balance: "₹ 30,000", position: "Credit" },
  { name: "Name", credit: "₹ 3,10,000", debit: "₹ 3,40,000", balance: "₹ 30,000", position: "Debit" },
  { name: "Name", credit: "₹ 1,90,000", debit: "₹ 1,85,000", balance: "₹ 5,000", position: "Credit" },
  { name: "Name", credit: "₹ 2,75,000", debit: "₹ 2,60,000", balance: "₹ 15,000", position: "Credit" },
];

export default function CustomerBalanceReport() {
  return (
    <div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">TOTAL CREDIT</span>
            <div className="bg-green-100 p-2 rounded-lg text-green-600"><FiTrendingUp size={20} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">₹21,25,000</h3>
            <div className="flex items-center text-green-600 text-xs font-semibold gap-1"><FiTrendingUp /> Received from customers</div>
          </div>
        </div>

        <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">TOTAL PURCHASES</span>
            <div className="bg-red-100 p-2 rounded-lg text-red-500"><FiTrendingDown size={20} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">₹1,46,40,000</h3>
            <div className="flex items-center text-gray-400 text-xs font-semibold gap-1">Outstanding balance</div>
          </div>
        </div>

        <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">AVG DAILY USAGE</span>
            <div className="bg-blue-100 p-2 rounded-lg text-blue-500"><MdOutlineAccountBalanceWallet size={20} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">₹54,611</h3>
            <div className="flex items-center text-green-600 text-xs font-semibold gap-1"><FiTrendingUp /> Net credit position</div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-[#00000026] rounded-xl overflow-hidden shadow-sm">
        <div className="flex justify-between items-center p-6 border-b border-[#00000026]">
          <h2 className="text-lg font-bold text-gray-900">Customer Balance Ledger</h2>
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
                <th className="px-6 py-4 text-center">CREDIT</th>
                <th className="px-6 py-4 text-center">DEBIT</th>
                <th className="px-6 py-4 text-center">BALANCE</th>
                <th className="px-6 py-4 text-center">POSITION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#00000026]">
              {customerBalanceData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-medium text-gray-900">{row.name}</td>
                  <td className="px-6 py-5 font-medium text-green-500 text-center">{row.credit}</td>
                  <td className="px-6 py-5 font-medium text-red-500 text-center">{row.debit}</td>
                  <td className="px-6 py-5 font-bold text-gray-900 text-center">{row.balance}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${row.position === 'Credit' ? 'bg-blue-100 text-blue-500' : 'bg-red-100 text-red-400'}`}>
                      {row.position}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
