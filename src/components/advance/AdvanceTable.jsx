import React from "react";
import { FiDownload } from "react-icons/fi";
import { FaMoneyBillWave, FaUniversity } from "react-icons/fa";
import { BiMoney } from "react-icons/bi";

const advanceRecords = [
  { id: "ADV-0021", customer: "Apex Industries", amount: "₹ 1,50,000", method: "Bank Transfer", reference: "RTGS-20260701-004", date: "01 Jul 2026", note: "Advance for Q3 orders" },
  { id: "ADV-0020", customer: "Pinnacle Traders", amount: "₹ 2,00,000", method: "Cheque", reference: "CHQ-440012", date: "28 Jun 2026", note: "Pre-delivery advance" },
  { id: "ADV-0019", customer: "Nexus Solutions", amount: "₹ 1,00,000", method: "UPI", reference: "UPI-8801234500", date: "25 Jun 2026", note: "Project advance" },
];

const getMethodIcon = (method) => {
  switch (method) {
    case "Bank Transfer": return <FaUniversity className="text-gray-500 mr-2" />;
    case "Cheque": return <FiDownload className="text-gray-500 mr-2" />; // Using a proxy icon based on the screenshot
    case "UPI": return <span className="font-bold text-gray-500 mr-2">$</span>;
    default: return <FaMoneyBillWave className="text-gray-500 mr-2" />;
  }
};

export default function AdvanceTable({ onRecordAdvance }) {
  return (
    <div className="bg-white border border-[#00000026] rounded-xl overflow-hidden mt-6">
      <div className="flex justify-between items-center p-6 border-b border-[#00000026]">
        <h2 className="text-xl font-bold text-[#4B5EAA]">Records</h2>
        <div className="flex gap-4">
          <button 
            onClick={onRecordAdvance}
            className="flex items-center gap-2 bg-[#4B5EAA] cursor-pointer text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#3d4f92] transition"
          >
            <BiMoney size={20} /> Record Advance
          </button>
          <button className="flex items-center gap-2 cursor-pointer bg-red-100 text-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-red-200 transition">
            <FiDownload /> PDF
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-[#F8F9FB] text-xs uppercase text-gray-400 font-bold border-b border-[#00000026]">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">CUSTOMER</th>
              <th className="px-6 py-4 text-right">AMOUNT (₹)</th>
              <th className="px-6 py-4">PAYMENT METHOD</th>
              <th className="px-6 py-4">REFERENCE</th>
              <th className="px-6 py-4">DATE</th>
              <th className="px-6 py-4">NOTE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#00000026]">
            {advanceRecords.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{row.id}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{row.customer}</td>
                <td className="px-6 py-4 font-bold text-gray-900 text-right">{row.amount}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center bg-gray-100 px-3 py-1.5 rounded-lg w-fit text-sm font-semibold">
                    {getMethodIcon(row.method)}
                    {row.method}
                  </div>
                </td>
                <td className="px-6 py-4">{row.reference}</td>
                <td className="px-6 py-4">{row.date}</td>
                <td className="px-6 py-4">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
