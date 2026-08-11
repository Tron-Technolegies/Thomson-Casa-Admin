import React from "react";
import { FiDownload } from "react-icons/fi";

const invoiceData = [
  { id: "INV-2026-0461", customer: "Apex Industries", date: "09 Jul 2026", amount: "₹ 84,000", tax: "₹ 8,400", total: "₹ 92,400", status: "Paid", advanceUsed: "₹ 84,000", balance: "₹ 66,000" },
  { id: "INV-2026-0460", customer: "Pinnacle Traders", date: "09 Jul 2026", amount: "₹ 1,13,000", tax: "₹ 11,300", total: "₹ 1,24,300", status: "Unpaid", advanceUsed: "₹ 74,000", balance: "₹ 66,000" },
  { id: "INV-2026-0459", customer: "Vertex Corp", date: "08 Jul 2026", amount: "₹ 37,500", tax: "₹ 3,750", total: "₹ 41,250", status: "Paid", advanceUsed: "₹ 24,000", balance: "₹ 66,000" },
  { id: "INV-2026-0458", customer: "Meridian Ltd", date: "08 Jul 2026", amount: "₹ 56,000", tax: "₹ 5,600", total: "₹ 61,600", status: "Partial", advanceUsed: "₹ 94,000", balance: "₹ 66,000" },
  { id: "INV-2026-0457", customer: "Falcon Enterprises", date: "07 Jul 2026", amount: "₹ 44,000", tax: "₹ 4,400", total: "₹ 48,400", status: "Paid", advanceUsed: "₹ 44,000", balance: "₹ 66,000" },
  { id: "INV-2026-0456", customer: "Summit Holdings", date: "07 Jul 2026", amount: "₹ 21,000", tax: "₹ 2,100", total: "₹ 23,100", status: "Unpaid", advanceUsed: "₹ 44,000", balance: "₹ 66,000" },
  { id: "INV-2026-0455", customer: "Nexus Solutions", date: "06 Jul 2026", amount: "₹ 63,000", tax: "₹ 6,300", total: "₹ 69,300", status: "Paid", advanceUsed: "₹ 24,000", balance: "₹ 66,000" },
];

const getStatusStyle = (status) => {
  switch (status) {
    case "Paid": return "bg-green-100 text-green-600";
    case "Unpaid": return "bg-red-100 text-red-500";
    case "Partial": return "bg-yellow-100 text-yellow-600";
    default: return "bg-gray-100 text-gray-600";
  }
};

export default function InvoiceTable({ onOpenModal }) {
  return (
    <div className="bg-white border border-[#00000026] rounded-xl overflow-hidden mt-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-[#F8F9FB] text-xs uppercase text-gray-400 font-bold border-b border-[#00000026]">
            <tr>
              <th className="px-6 py-4">INVOICE NO</th>
              <th className="px-6 py-4">CUSTOMER</th>
              <th className="px-6 py-4">DATE</th>
              <th className="px-6 py-4">AMOUNT</th>
              <th className="px-6 py-4">TAX</th>
              <th className="px-6 py-4">TOTAL</th>
              <th className="px-6 py-4 text-center">STATUS</th>
              <th className="px-6 py-4">ADVANCE USED</th>
              <th className="px-6 py-4">BALANCE</th>
              <th className="px-6 py-4 text-center">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#00000026]">
            {invoiceData.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-[#4B5EAA]">{row.id}</td>
                <td className="px-6 py-4 font-bold text-gray-900">{row.customer}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{row.date}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{row.amount}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{row.tax}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{row.total}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(row.status)}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">{row.advanceUsed}</td>
                <td className="px-6 py-4 font-bold text-green-500">{row.balance}</td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => onOpenModal(row)}
                    className="flex items-center gap-2 bg-[#4B5EAA] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#3d4f92] transition mx-auto"
                  >
                    <FiDownload size={14} /> PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
