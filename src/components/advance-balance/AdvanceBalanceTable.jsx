import React from "react";
import { FiDownload, FiPrinter } from "react-icons/fi";

export default function AdvanceBalanceTable({ balances = [], loading }) {
  return (
    <div className="bg-white border border-[#00000026] rounded-xl overflow-hidden mt-6">
      <div className="flex justify-between items-center p-6 border-b border-[#00000026]">
        <h2 className="text-xl font-bold text-[#4B5EAA]">Advance Balance Details</h2>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-[#4B5EAA] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#3d4f92] transition">
            <FiPrinter /> Print
          </button>
          <button className="flex items-center gap-2 bg-red-100 text-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-red-200 transition">
            <FiDownload /> PDF
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-[#F8F9FB] text-xs uppercase text-gray-400 font-bold border-b border-[#00000026]">
            <tr>
              <th className="px-6 py-4">CUSTOMER</th>
              <th className="px-6 py-4">ADVANCE RECEIVED</th>
              <th className="px-6 py-4">CONSUMED</th>
              <th className="px-6 py-4">BALANCE</th>
              <th className="px-6 py-4">UTILISATION %</th>
              <th className="px-6 py-4">LAST TRANSACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#00000026]">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">Loading balances...</td>
              </tr>
            ) : balances.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No balance records found.</td>
              </tr>
            ) : (
              balances.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-[#4B5EAA]">{row.customer_name}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">₹ {row.received.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-200 text-gray-700 font-bold px-3 py-1 rounded-full text-xs">
                      ₹ {row.consumed.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-green-500">₹ {row.balance.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-[#4B5EAA] h-2 rounded-full" style={{ width: `${row.percent}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-gray-400">{row.percent}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">{row.last_tx}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
