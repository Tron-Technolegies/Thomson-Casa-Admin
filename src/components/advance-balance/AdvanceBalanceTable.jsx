import React from "react";
import { FiDownload, FiPrinter } from "react-icons/fi";

const balanceDetails = [
  { received: "₹ 1,50,000", consumed: "₹ 84,000", balance: "₹ 66,000", percent: 56, lastTx: "09 Jul 2026" },
  { received: "₹ 2,00,000", consumed: "₹ 74,000", balance: "₹ 15,000", percent: 93, lastTx: "08 Jul 2026" },
  { received: "₹ 1,00,000", consumed: "₹ 24,000", balance: "₹ 37,000", percent: 63, lastTx: "06 Jul 2026" },
  { received: "₹ 75,000", consumed: "₹ 94,000", balance: "₹ 19,000", percent: 75, lastTx: "08 Jul 2026" },
  { received: "₹ 50,000", consumed: "₹ 44,000", balance: "₹ 29,000", percent: 42, lastTx: "07 Jul 2026" },
];

export default function AdvanceBalanceTable() {
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
              <th className="px-6 py-4">ADVANCE RECEIVED</th>
              <th className="px-6 py-4">CONSUMED</th>
              <th className="px-6 py-4">BALANCE</th>
              <th className="px-6 py-4">UTILISATION %</th>
              <th className="px-6 py-4">LAST TRANSACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#00000026]">
            {balanceDetails.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-gray-900">{row.received}</td>
                <td className="px-6 py-4">
                  <span className="bg-gray-200 text-gray-700 font-bold px-3 py-1 rounded-full text-xs">
                    {row.consumed}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-green-500">{row.balance}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-[#4B5EAA] h-2 rounded-full" style={{ width: `${row.percent}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-gray-400">{row.percent}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">{row.lastTx}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
