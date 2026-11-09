
import { useState, useEffect } from "react";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiShoppingCart,
  FiAlertCircle,
  FiDownload,
} from "react-icons/fi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { api } from "../../services/api";
import { exportTableToPDF } from "../../utils/pdfGenerator";
import Pagination from "../common/Pagination";

export default function SalesReports({ period = "Daily" }) {
  const [stats, setStats] = useState({ revenue: 0, orders: 0 });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, chartsRes] = await Promise.all([
          api.get(`/admin/dashboard/stats/?period=${period}`),
          api.get(`/admin/dashboard/charts/?period=${period}`),
        ]);

        if (statsRes.success) {
          setStats({
            revenue: statsRes.revenue,
            orders: statsRes.orders,
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
  }, [period]);

  const handleSort = (key) => {
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  const sortedData = [...chartData].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }

    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }

    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = sortedData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleDownloadPDF = () => {
    const headers = ["DAY", "REVENUE", "ORDERS", "AVG REVENUE"];

    const data = chartData.map((row) => [
      row.name,
      `Rs. ${row.revenue.toLocaleString()}`,
      row.orders,
      `Rs. ${row.orders > 0 ? (row.revenue / row.orders).toFixed(0) : 0}`,
    ]);

    exportTableToPDF(
      "Sales Report",
      headers,
      data,
      "Sales_Report.pdf"
    );
  };

  const getAverageRevenue = (row) =>
    row.orders > 0 ? (row.revenue / row.orders).toFixed(0) : 0;

  const getSortLabel = (key) => {
    if (sortConfig.key !== key) return "";
    return sortConfig.direction === "asc" ? " ↑" : " ↓";
  };

  return (
    <div className="w-full min-w-0">

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">

        {/* Total Revenue */}
        <div className="bg-white border border-[#00000026] rounded-xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4 gap-2">
            <span className="text-xs font-bold text-gray-400 tracking-wider">
              TOTAL REVENUE
            </span>
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600 shrink-0">
              <FiDollarSign size={20} />
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 break-words">
              ₹{stats.revenue.toLocaleString()}
            </h3>
            <div className="flex items-center text-green-600 text-xs font-semibold gap-1">
              <FiTrendingUp /> Validated
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white border border-[#00000026] rounded-xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4 gap-2">
            <span className="text-xs font-bold text-gray-400 tracking-wider">
              ORDERS
            </span>
            <div className="bg-green-100 p-2 rounded-lg text-green-600 shrink-0">
              <FiShoppingCart size={20} />
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              {stats.orders}
            </h3>
            <div className="flex items-center text-green-600 text-xs font-semibold gap-1">
              <FiTrendingUp /> Validated
            </div>
          </div>
        </div>

        {/* Returns */}
        <div className="bg-white border border-[#00000026] rounded-xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4 gap-2">
            <span className="text-xs font-bold text-gray-400 tracking-wider">
              RETURNS
            </span>
            <div className="bg-red-100 p-2 rounded-lg text-red-500 shrink-0">
              <FiAlertCircle size={20} />
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              0
            </h3>
            <div className="flex items-center text-green-600 text-xs font-semibold gap-1">
              <FiTrendingDown /> No returns
            </div>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white border border-[#00000026] rounded-xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4 gap-2">
            <span className="text-xs font-bold text-gray-400 tracking-wider">
              AVG ORDER VALUE
            </span>
            <div className="bg-purple-100 p-2 rounded-lg text-purple-600 shrink-0">
              <FiTrendingUp size={20} />
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 break-words">
              ₹{stats.orders > 0 ? (stats.revenue / stats.orders).toFixed(0) : 0}
            </h3>
            <div className="flex items-center text-green-600 text-xs font-semibold gap-1">
              <FiTrendingUp /> Validated
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white border border-[#00000026] rounded-xl p-4 sm:p-6 shadow-sm mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-5 sm:mb-6">
          Revenue Overview
        </h2>

        <div className="h-64 sm:h-72 w-full min-w-0">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              Loading chart...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="colorUv2"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#4B5EAA"
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="95%"
                      stopColor="#4B5EAA"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 11 }}
                  dy={10}
                  interval="preserveStartEnd"
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 11 }}
                  width={55}
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4B5EAA"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorUv2)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white border border-[#00000026] rounded-xl overflow-hidden shadow-sm">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 border-b border-[#00000026] gap-4">
          <h2 className="text-lg font-bold text-gray-900">
            Recent Transactions
          </h2>

          <div className="flex flex-col xs:flex-row sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => alert("Excel download not implemented yet.")}
              className="flex items-center justify-center gap-2 bg-green-100 text-green-600 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-200 transition cursor-pointer w-full sm:w-auto"
            >
              <FiDownload size={16} />
              Excel
            </button>

            <button
              onClick={handleDownloadPDF}
              className="flex items-center justify-center gap-2 bg-red-100 text-red-500 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-200 transition cursor-pointer w-full sm:w-auto"
            >
              <FiDownload size={16} />
              PDF
            </button>
          </div>
        </div>

        {/* Mobile Sorting Controls */}
        <div className="md:hidden flex flex-wrap gap-2 p-3 border-b border-[#00000026]">
          <span className="text-xs text-gray-400 font-semibold self-center mr-1">
            SORT BY:
          </span>

          {[
            { key: "name", label: "Day" },
            { key: "revenue", label: "Revenue" },
            { key: "orders", label: "Orders" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => handleSort(item.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                sortConfig.key === item.key
                  ? "bg-[#4B5EAA] text-white border-[#4B5EAA]"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {item.label}
              {getSortLabel(item.key)}
            </button>
          ))}
        </div>

        {/* Desktop / Tablet Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm text-gray-600">
            <thead className="bg-[#F8F9FB] text-xs uppercase text-gray-400 font-bold border-b border-[#00000026]">
              <tr>
                <th
                  className="px-6 py-4 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("name")}
                >
                  DAY {getSortLabel("name")}
                </th>

                <th
                  className="px-6 py-4 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("revenue")}
                >
                  REVENUE {getSortLabel("revenue")}
                </th>

                <th
                  className="px-6 py-4 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("orders")}
                >
                  ORDERS {getSortLabel("orders")}
                </th>

                <th className="px-6 py-4 text-right">
                  AVG REVENUE
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#00000026]">
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : (
                currentData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-5 font-medium text-gray-900">
                      {row.name}
                    </td>

                    <td className="px-6 py-5 font-medium text-gray-900 whitespace-nowrap">
                      ₹{row.revenue.toLocaleString()}
                    </td>

                    <td className="px-6 py-5 font-medium text-gray-900">
                      {row.orders}
                    </td>

                    <td className="px-6 py-5 font-medium text-gray-900 text-right whitespace-nowrap">
                      ₹{getAverageRevenue(row)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden p-3 sm:p-4 space-y-3">
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading...
            </div>
          ) : (
            currentData.map((row, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-xl p-4 space-y-3 hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-center gap-3">
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase">
                      Day
                    </p>
                    <h3 className="text-base font-bold text-gray-900 mt-1">
                      {row.name}
                    </h3>
                  </div>

                  <span className="bg-blue-50 text-[#4B5EAA] text-xs font-bold px-3 py-1.5 rounded-lg">
                    {row.orders} Orders
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">
                      Revenue
                    </p>
                    <p className="text-sm font-bold text-gray-900 break-words">
                      ₹{row.revenue.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">
                      Avg Revenue
                    </p>
                    <p className="text-sm font-bold text-gray-900 break-words">
                      ₹{getAverageRevenue(row)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && sortedData.length > 0 && (
          <div className="border-t border-[#00000026]">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
