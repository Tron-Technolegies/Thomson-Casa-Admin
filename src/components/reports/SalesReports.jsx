import React, { useState, useEffect } from "react";
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiShoppingCart, FiAlertCircle, FiDownload } from "react-icons/fi";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { api } from "../../services/api";
import { exportTableToPDF } from "../../utils/pdfGenerator";

export default function SalesReports() {
  const [stats, setStats] = useState({ revenue: 0, orders: 0 });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, chartsRes] = await Promise.all([
          api.get("/admin/dashboard/stats/"),
          api.get("/admin/dashboard/charts/")
        ]);
        
        if (statsRes.success) {
          setStats({
            revenue: statsRes.revenue,
            orders: statsRes.orders
          });
        }
        
        if (chartsRes.success) {
          setChartData(chartsRes.chartData || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDownloadPDF = () => {
    const headers = ["DAY", "REVENUE", "ORDERS", "AVG REVENUE"];
    const data = chartData.map(row => [
      row.name,
      `Rs. ${row.revenue.toLocaleString()}`,
      row.orders,
      `Rs. ${row.orders > 0 ? (row.revenue / row.orders).toFixed(0) : 0}`
    ]);
    exportTableToPDF("Sales Report", headers, data, "Sales_Report.pdf");
  };

  return (
    <div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">TOTAL REVENUE</span>
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><FiDollarSign size={20} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">₹{stats.revenue.toLocaleString()}</h3>
            <div className="flex items-center text-green-600 text-xs font-semibold gap-1"><FiTrendingUp /> Validated</div>
          </div>
        </div>

        <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">ORDERS</span>
            <div className="bg-green-100 p-2 rounded-lg text-green-600"><FiShoppingCart size={20} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.orders}</h3>
            <div className="flex items-center text-green-600 text-xs font-semibold gap-1"><FiTrendingUp /> Validated</div>
          </div>
        </div>

        <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">RETURNS</span>
            <div className="bg-red-100 p-2 rounded-lg text-red-500"><FiAlertCircle size={20} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">0</h3>
            <div className="flex items-center text-green-600 text-xs font-semibold gap-1"><FiTrendingDown /> No returns</div>
          </div>
        </div>

        <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">AVG ORDER VALUE</span>
            <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><FiTrendingUp size={20} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">₹{stats.orders > 0 ? (stats.revenue / stats.orders).toFixed(0) : 0}</h3>
            <div className="flex items-center text-green-600 text-xs font-semibold gap-1"><FiTrendingUp /> Validated</div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Revenue Overview</h2>
        <div className="h-72 w-full">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-400">Loading chart...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUv2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4B5EAA" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4B5EAA" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#4B5EAA" strokeWidth={2} fillOpacity={1} fill="url(#colorUv2)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-[#00000026] rounded-xl overflow-hidden shadow-sm">
        <div className="flex justify-between items-center p-6 border-b border-[#00000026]">
          <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
          <div className="flex gap-4">
            <button 
              onClick={() => alert("Excel download not implemented yet.")}
              className="flex items-center gap-2 bg-green-100 text-green-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-200 transition cursor-pointer">
              <FiDownload size={16} /> Excel
            </button>
            <button 
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-red-100 text-red-500 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-200 transition cursor-pointer">
              <FiDownload size={16} /> PDF
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-[#F8F9FB] text-xs uppercase text-gray-400 font-bold border-b border-[#00000026]">
              <tr>
                <th className="px-6 py-4">DAY</th>
                <th className="px-6 py-4">REVENUE</th>
                <th className="px-6 py-4">ORDERS</th>
                <th className="px-6 py-4 text-right">AVG REVENUE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#00000026]">
              {loading ? (
                <tr><td colSpan="4" className="text-center py-4">Loading...</td></tr>
              ) : chartData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-medium text-gray-900">{row.name}</td>
                  <td className="px-6 py-5 font-medium text-gray-900">₹{row.revenue.toLocaleString()}</td>
                  <td className="px-6 py-5 font-medium text-gray-900">{row.orders}</td>
                  <td className="px-6 py-5 font-medium text-gray-900 text-right">
                    ₹{row.orders > 0 ? (row.revenue / row.orders).toFixed(0) : 0}
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
