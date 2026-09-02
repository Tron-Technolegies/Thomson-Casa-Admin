import React, { useState, useEffect } from "react";
import { FiTrendingUp, FiDollarSign, FiShoppingCart, FiAlertCircle, FiDownload } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { api } from "../../services/api";
import { exportTableToPDF } from "../../utils/pdfGenerator";
import Pagination from "../common/Pagination";

export default function CustomerPurchaseReport({ period = "Daily" }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/admin/reports/customers/?period=${period}`);
        if (res.success) {
          setCustomers(res.customers_report || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [period]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...customers].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const totalSpent = customers.reduce((sum, c) => sum + parseFloat(c.total_spent || 0), 0);
  const totalOrders = customers.reduce((sum, c) => sum + parseInt(c.total_orders || 0, 10), 0);
  const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

  const chartData = customers.map(c => ({
    name: c.customer.substring(0, 15) + (c.customer.length > 15 ? '...' : ''),
    uv: c.total_spent
  })).sort((a, b) => b.uv - a.uv).slice(0, 5);

  const handleDownloadPDF = () => {
    const headers = ["CUSTOMER NAME", "PHONE NUMBER", "TOTAL ORDERS", "TOTAL WEIGHT", "TOTAL SPENT"];
    const data = customers.map(c => [
      c.customer,
      c.phone,
      c.total_orders,
      `${c.total_weight} kg`,
      `Rs. ${c.total_spent.toLocaleString()}`
    ]);
    exportTableToPDF("Customer Purchase Summary", headers, data, "Customer_Purchase_Report.pdf");
  };

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
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{customers.length}</h3>
            <div className="flex items-center text-gray-400 text-xs font-semibold gap-1">active this period</div>
          </div>
        </div>

        <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">TOTAL PURCHASES</span>
            <div className="bg-green-100 p-2 rounded-lg text-green-600"><FiShoppingCart size={20} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">₹{totalSpent.toLocaleString()}</h3>
            <div className="flex items-center text-green-600 text-xs font-semibold gap-1"><FiTrendingUp /> Total spent by all customers</div>
          </div>
        </div>

        <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">AVG ORDER VALUE</span>
            <div className="bg-red-100 p-2 rounded-lg text-red-500"><FiAlertCircle size={20} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">₹{avgOrderValue.toLocaleString(undefined, {maximumFractionDigits: 2})}</h3>
            <div className="flex items-center text-green-600 text-xs font-semibold gap-1"><FiTrendingUp /> Per order</div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-[#00000026] rounded-xl overflow-hidden shadow-sm mb-8">
        <div className="flex justify-between items-center p-6 border-b border-[#00000026]">
          <h2 className="text-lg font-bold text-gray-900">Customer Purchase Summary</h2>
          <div className="flex gap-4">
            <button 
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-red-100 text-red-500 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-200 transition cursor-pointer">
              <FiDownload size={16} /> Download PDF
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-[#F8F9FB] text-xs uppercase text-gray-400 font-bold border-b border-[#00000026]">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('customer')}>CUSTOMER NAME</th>
                <th className="px-6 py-4">PHONE NUMBER</th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('total_orders')}>TOTAL ORDERS</th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('total_weight')}>TOTAL WEIGHT</th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('total_spent')}>TOTAL SPENT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#00000026]">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-4 text-gray-500">No data available.</td></tr>
              ) : (
                currentData.map((c, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-5 font-bold text-gray-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                          {c.customer.substring(0, 2).toUpperCase()}
                        </div>
                        {c.customer}
                      </div>
                    </td>
                    <td className="px-6 py-5 font-medium text-gray-900">{c.phone}</td>
                    <td className="px-6 py-5 font-medium text-gray-900">{c.total_orders}</td>
                    <td className="px-6 py-5 font-medium text-gray-900">{c.total_weight} kg</td>
                    <td className="px-6 py-5 font-bold text-[#4B5EAA]">₹{c.total_spent.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && customers.length > 0 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Chart Section */}
      <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Top Customers by Revenue</h2>
        <div className="h-72 w-full">
          {loading ? (
            <div className="h-full flex items-center justify-center text-gray-400">Loading chart...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }} barSize={60}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} tickFormatter={(value) => `₹${(value/1000).toFixed(1)}k`} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="uv" fill="#4B5EAA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

    </div>
  );
}
