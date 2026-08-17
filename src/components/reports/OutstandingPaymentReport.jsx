import React from "react";
import { FiDollarSign, FiAlertCircle, FiClock, FiTrendingDown, FiDownload } from "react-icons/fi";

const paymentData = [
  { id: "INV-2026-0441", customer: "Name", amount: "₹ 4,70,000", date: "01 Jul 2026", overdue: "8 days", status: "Overdue" },
  { id: "INV-2026-0437", customer: "Name", amount: "₹ 2,80,000", date: "05 Jul 2026", overdue: "4 days", status: "Overdue" },
  { id: "INV-2026-0451", customer: "Name", amount: "₹ 1,50,000", date: "15 Jul 2026", overdue: "—", status: "Due Soon" },
  { id: "INV-2026-0448", customer: "Name", amount: "₹ 3,90,000", date: "20 Jul 2026", overdue: "—", status: "Due Soon" },
  { id: "INV-2026-0455", customer: "Name", amount: "₹ 3,40,000", date: "25 Jul 2026", overdue: "—", status: "Pending" },
  { id: "INV-2026-0460", customer: "Name", amount: "₹ 1,85,000", date: "30 Jul 2026", overdue: "—", status: "Pending" },
];

export default function OutstandingPaymentReport() {
  return (
    <div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">TOTAL OUTSTANDING</span>
            <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600"><FiDollarSign size={20} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">₹3,67,500</h3>
            <div className="flex items-center text-gray-400 text-xs font-semibold gap-1">6 invoices</div>
          </div>
        </div>

        <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">OVERDUE AMOUNT</span>
            <div className="bg-red-100 p-2 rounded-lg text-red-500"><FiAlertCircle size={20} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">₹1,36,000</h3>
            <div className="flex items-center text-red-500 text-xs font-semibold gap-1"><FiTrendingDown /> 2 overdue invoices</div>
          </div>
        </div>

        <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">DUE THIS WEEK</span>
            <div className="bg-blue-100 p-2 rounded-lg text-blue-500"><FiClock size={20} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">₹2,31,500</h3>
            <div className="flex items-center text-blue-400 text-xs font-semibold gap-1">4 invoices due soon</div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-[#00000026] rounded-xl overflow-hidden shadow-sm">
        <div className="flex justify-between items-center p-6 border-b border-[#00000026]">
          <h2 className="text-lg font-bold text-gray-900">Outstanding Payment Details</h2>
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
                <th className="px-6 py-4">INVOICE</th>
                <th className="px-6 py-4 text-center">CUSTOMER</th>
                <th className="px-6 py-4 text-center">AMOUNT</th>
                <th className="px-6 py-4 text-center">DUE DATE</th>
                <th className="px-6 py-4 text-center">DAYS OVERDUE</th>
                <th className="px-6 py-4 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#00000026]">
              {paymentData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-medium text-blue-400">{row.id}</td>
                  <td className="px-6 py-5 font-medium text-gray-900 text-center">{row.customer}</td>
                  <td className="px-6 py-5 font-medium text-gray-900 text-center">{row.amount}</td>
                  <td className="px-6 py-5 font-medium text-blue-400 text-center">{row.date}</td>
                  <td className={`px-6 py-5 font-medium text-center ${row.overdue !== '—' ? 'text-red-500 font-bold' : 'text-gray-400'}`}>{row.overdue}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold 
                      ${row.status === 'Overdue' ? 'bg-red-100 text-red-500' : 
                        row.status === 'Due Soon' ? 'bg-orange-100 text-orange-500' : 'bg-yellow-100 text-yellow-600'}`}>
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
