import React from "react";
import { FaFilePdf } from "react-icons/fa";
import { BASE_URL } from "../../services/api";

const badge = {
  Paid: "bg-green-100 text-green-700",
  Partial: "bg-yellow-100 text-yellow-700",
  Unpaid: "bg-red-100 text-red-700",
};

function RecentTransactions({ sales = [], loading = false }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-[#00000026]">
        <h2 className="text-2xl font-semibold">Recent Transactions</h2>
        <button 
          onClick={() => window.open(`${BASE_URL}/accounts/reports/sales/pdf/`, '_blank')}
          className="bg-red-100 text-red-500 px-4 py-2 rounded-lg font-medium hover:bg-red-200 transition cursor-pointer"
        >
          <FaFilePdf className="inline mr-2" /> PDF
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-gray-500 text-sm">
            <tr>
              <th className="p-4 text-left font-semibold">Invoice No</th>
              <th className="p-4 text-left font-semibold">Customer</th>
              <th className="p-4 text-left font-semibold">Date</th>
              <th className="p-4 text-left font-semibold">Amount</th>
              <th className="p-4 text-left font-semibold">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center py-6 text-gray-500">Loading transactions...</td></tr>
            ) : sales.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-6 text-gray-500">No transactions found.</td></tr>
            ) : (
              sales.slice(0, 10).map((item, index) => (
                <tr key={index} className="border-t border-[#00000026] hover:bg-gray-50 transition">
                  <td className="p-4 font-bold text-[#4B5EAA]">{item.invoice_no}</td>
                  <td className="p-4 font-medium text-gray-800">{item.customer}</td>
                  <td className="p-4 text-gray-600">{item.date}</td>
                  <td className="p-4 font-bold text-gray-900">₹{item.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge[item.status] || "bg-gray-100 text-gray-700"}`}>
                      {item.status}
                    </span>
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

export default RecentTransactions;
