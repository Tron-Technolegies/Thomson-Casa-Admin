import React from "react";
import { FiTrendingUp, FiDollarSign, FiShoppingCart, FiAlertCircle, FiDownload } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: 'Hotel Saravana', uv: 3200000 },
  { name: 'Fresh Mart', uv: 2800000 },
  { name: 'Hotel Grand Palace', uv: 2100000 },
  { name: 'Vertex Corp', uv: 1800000 },
  { name: 'Nexus Solutions', uv: 1700000 },
];

const customerData = [
  { name: "Name", orders: "40", amount: "50,000", avg: "50,000", last: "09 Jul 2026" },
  { name: "Name", orders: "30", amount: "58,000", avg: "58,000", last: "09 Jul 2026" },
  { name: "Name", orders: "20", amount: "50,000", avg: "50,000", last: "08 Jul 2026" },
  { name: "Name", orders: "50", amount: "52,000", avg: "52,000", last: "08 Jul 2026" },
  { name: "Name", orders: "40", amount: "54,000", avg: "54,000", last: "07 Jul 2026" },
  { name: "Name", orders: "30", amount: "50,000", avg: "50,000", last: "07 Jul 2026" },
  { name: "Name", orders: "20", amount: "58,000", avg: "58,000", last: "06 Jul 2026" },
];

export default function CustomerPurchaseReport() {
  return (
    <div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">TOTAL CUSTOMERS</span>
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><FiDollarSign size={20} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">7</h3>
            <div className="flex items-center text-gray-400 text-xs font-semibold gap-1">active this period</div>
          </div>
        </div>

        <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">TOTAL PURCHASES</span>
            <div className="bg-green-100 p-2 rounded-lg text-green-600"><FiShoppingCart size={20} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">₹1,46,40,000</h3>
            <div className="flex items-center text-green-600 text-xs font-semibold gap-1"><FiTrendingUp /> +9.2% vs last month</div>
          </div>
        </div>

        <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">AVG DAILY USAGE</span>
            <div className="bg-red-100 p-2 rounded-lg text-red-500"><FiAlertCircle size={20} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">₹54,611</h3>
            <div className="flex items-center text-green-600 text-xs font-semibold gap-1"><FiTrendingUp /> Per order</div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-[#00000026] rounded-xl overflow-hidden shadow-sm mb-8">
        <div className="flex justify-between items-center p-6 border-b border-[#00000026]">
          <h2 className="text-lg font-bold text-gray-900">Customer Purchase Summary</h2>
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
                <th className="px-6 py-4 text-center">TOTAL ORDERS</th>
                <th className="px-6 py-4 text-center">TOTAL AMOUNT</th>
                <th className="px-6 py-4 text-center">AVG ORDER</th>
                <th className="px-6 py-4 text-right">LAST PURCHASE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#00000026]">
              {customerData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-medium text-gray-900">{row.name}</td>
                  <td className="px-6 py-5 font-medium text-gray-900 text-center">{row.orders}</td>
                  <td className="px-6 py-5 font-medium text-gray-900 text-center">{row.amount}</td>
                  <td className="px-6 py-5 font-medium text-gray-900 text-center">{row.avg}</td>
                  <td className="px-6 py-5 font-medium text-gray-900 text-right">{row.last}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Top Customers by Revenue</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }} barSize={60}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} tickFormatter={(value) => `₹${(value/1000000).toFixed(1)}M`} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="uv" fill="#4B5EAA" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
