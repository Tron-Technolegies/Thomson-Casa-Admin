import React from "react";
import { FiTrendingUp, FiFileText, FiDollarSign, FiCreditCard, FiDownload } from "react-icons/fi";

const invoiceData = [
  { id: "INV-2026-0461", customer: "Name", date: "09 Jul 2026", amount: "₹ 84,000", tax: "₹ 8,400", total: "₹ 92,400", status: "Paid" },
  { id: "INV-2026-0460", customer: "Name", date: "09 Jul 2026", amount: "₹ 1,13,000", tax: "₹ 11,300", total: "₹ 1,24,300", status: "Unpaid" },
  { id: "INV-2026-0459", customer: "Name", date: "08 Jul 2026", amount: "₹ 37,500", tax: "₹ 3,750", total: "₹ 41,250", status: "Paid" },
  { id: "INV-2026-0458", customer: "Name", date: "08 Jul 2026", amount: "₹ 56,000", tax: "₹ 5,600", total: "₹ 61,600", status: "Paid" },
  { id: "INV-2026-0457", customer: "Name", date: "07 Jul 2026", amount: "₹ 44,000", tax: "₹ 4,400", total: "₹ 48,400", status: "Unpaid" },
];

export default function InvoiceReport() {
  return (
    <div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">TOTAL INVOICED</span>
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><FiFileText size={20} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">₹ 4,18,500</h3>
            <div className="flex items-center text-green-600 text-xs font-semibold gap-1"><FiTrendingUp /> Net amount</div>
          </div>
        </div>

        <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">TOTAL TAX</span>
            <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600"><FiFileText size={20} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">₹ 41,850</h3>
            <div className="flex items-center text-gray-500 text-xs font-semibold gap-1">GST collected</div>
          </div>
        </div>

        <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">GROSS TOTAL</span>
            <div className="bg-green-100 p-2 rounded-lg text-green-600"><FiDollarSign size={20} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">₹ 4,60,350</h3>
            <div className="flex items-center text-green-600 text-xs font-semibold gap-1"><FiTrendingUp /> Incl. taxes</div>
          </div>
        </div>

        <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">AMOUNT PAID</span>
            <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><FiCreditCard size={20} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">₹ 2,51,350</h3>
            <div className="flex items-center text-green-600 text-xs font-semibold gap-1"><FiTrendingUp /> 4 invoices cleared</div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-[#00000026] rounded-xl overflow-hidden shadow-sm">
        <div className="flex justify-between items-center p-6 border-b border-[#00000026]">
          <h2 className="text-lg font-bold text-gray-900">Invoice Register</h2>
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
                <th className="px-6 py-4">INVOICE NO</th>
                <th className="px-6 py-4 text-center">CUSTOMER</th>
                <th className="px-6 py-4 text-center">DATE</th>
                <th className="px-6 py-4 text-center">AMOUNT</th>
                <th className="px-6 py-4 text-center">TAX</th>
                <th className="px-6 py-4 text-center">TOTAL</th>
                <th className="px-6 py-4 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#00000026]">
              {invoiceData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-medium text-blue-400">{row.id}</td>
                  <td className="px-6 py-5 font-medium text-gray-900 text-center">{row.customer}</td>
                  <td className="px-6 py-5 font-medium text-gray-900 text-center">{row.date}</td>
                  <td className="px-6 py-5 font-medium text-gray-900 text-center">{row.amount}</td>
                  <td className="px-6 py-5 font-medium text-gray-900 text-center">{row.tax}</td>
                  <td className="px-6 py-5 font-bold text-gray-900 text-center">{row.total}</td>
                  <td className="px-6 py-5 text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${row.status === 'Paid' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
                      {row.status}
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
