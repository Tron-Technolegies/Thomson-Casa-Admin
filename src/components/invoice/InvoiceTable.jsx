import React from "react";
import { FiDownload } from "react-icons/fi";

const getStatusStyle = (status) => {
  switch (status) {
    case "Paid": return "bg-green-100 text-green-600";
    case "Unpaid": return "bg-red-100 text-red-500";
    case "Partial": return "bg-yellow-100 text-yellow-600";
    default: return "bg-gray-100 text-gray-600";
  }
};

export default function InvoiceTable({ invoices = [], loading, onOpenModal }) {
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
            {loading ? (
              <tr>
                <td colSpan="10" className="px-6 py-4 text-center text-gray-500">Loading invoices...</td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan="10" className="px-6 py-4 text-center text-gray-500">No invoices found.</td>
              </tr>
            ) : (
              invoices.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-[#4B5EAA]">{row.id}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{row.customer}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{row.date}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">₹ {row.amount}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">₹ {row.tax}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">₹ {row.total}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">₹ {row.advance_used}</td>
                  <td className="px-6 py-4 font-bold text-green-500">₹ {row.balance}</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => onOpenModal(row)}
                      className="flex items-center gap-2 bg-[#4B5EAA] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#3d4f92] transition mx-auto cursor-pointer"
                    >
                      <FiDownload size={14} /> PDF
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
