
import React, { useState, useEffect } from "react";
import {
  FiTrendingUp,
  FiDollarSign,
  FiShoppingCart,
  FiAlertCircle,
  FiDownload,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { api } from "../../services/api";
import { exportTableToPDF } from "../../utils/pdfGenerator";
import Pagination from "../common/Pagination";

export default function CustomerPurchaseReport({ period = "Daily" }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(
          `/admin/reports/customers/?period=${period}`
        );

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
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  const sortedData = [...customers].sort((a, b) => {
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

  const totalSpent = customers.reduce(
    (sum, c) => sum + parseFloat(c.total_spent || 0),
    0
  );

  const totalOrders = customers.reduce(
    (sum, c) => sum + parseInt(c.total_orders || 0, 10),
    0
  );

  const avgOrderValue =
    totalOrders > 0 ? totalSpent / totalOrders : 0;

  const chartData = customers
    .map((c) => ({
      name:
        c.customer.substring(0, 15) +
        (c.customer.length > 15 ? "..." : ""),
      uv: c.total_spent,
    }))
    .sort((a, b) => b.uv - a.uv)
    .slice(0, 5);

  const handleDownloadPDF = () => {
    const headers = [
      "CUSTOMER NAME",
      "PHONE NUMBER",
      "TOTAL ORDERS",
      "TOTAL WEIGHT",
      "TOTAL SPENT",
    ];

    const data = customers.map((c) => [
      c.customer,
      c.phone,
      c.total_orders,
      `${c.total_weight} kg`,
      `Rs. ${c.total_spent.toLocaleString()}`,
    ]);

    exportTableToPDF(
      "Customer Purchase Summary",
      headers,
      data,
      "Customer_Purchase_Report.pdf"
    );
  };

  const getSortLabel = (key) => {
    if (sortConfig.key !== key) return "";
    return sortConfig.direction === "asc" ? " ↑" : " ↓";
  };

  return (
    <div className="w-full min-w-0">

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">

        {/* Total Customers */}
        <div className="bg-white border border-[#00000026] rounded-xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4 gap-2">
            <span className="text-xs font-bold text-gray-400 tracking-wider">
              TOTAL CUSTOMERS
            </span>
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600 shrink-0">
              <FiDollarSign size={20} />
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {customers.length}
            </h3>
            <div className="flex items-center text-gray-400 text-xs font-semibold gap-1">
              Active this period
            </div>
          </div>
        </div>

        {/* Total Purchases */}
        <div className="bg-white border border-[#00000026] rounded-xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4 gap-2">
            <span className="text-xs font-bold text-gray-400 tracking-wider">
              TOTAL PURCHASES
            </span>
            <div className="bg-green-100 p-2 rounded-lg text-green-600 shrink-0">
              <FiShoppingCart size={20} />
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 break-words">
              ₹{totalSpent.toLocaleString()}
            </h3>
            <div className="flex items-center text-green-600 text-xs font-semibold gap-1">
              <FiTrendingUp />
              Total spent by all customers
            </div>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white border border-[#00000026] rounded-xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4 gap-2">
            <span className="text-xs font-bold text-gray-400 tracking-wider">
              AVG ORDER VALUE
            </span>
            <div className="bg-red-100 p-2 rounded-lg text-red-500 shrink-0">
              <FiAlertCircle size={20} />
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 break-words">
              ₹
              {avgOrderValue.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </h3>
            <div className="flex items-center text-green-600 text-xs font-semibold gap-1">
              <FiTrendingUp />
              Per order
            </div>
          </div>
        </div>
      </div>

      {/* Customer Purchase Summary */}
      <div className="bg-white border border-[#00000026] rounded-xl overflow-hidden shadow-sm mb-6 sm:mb-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 border-b border-[#00000026] gap-4">
          <h2 className="text-lg font-bold text-gray-900">
            Customer Purchase Summary
          </h2>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center justify-center gap-2 bg-red-100 text-red-500 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-200 transition cursor-pointer w-full sm:w-auto"
          >
            <FiDownload size={16} />
            Download PDF
          </button>
        </div>

        {/* Mobile Sorting */}
        <div className="md:hidden flex flex-wrap items-center gap-2 p-3 border-b border-[#00000026]">
          <span className="text-xs text-gray-400 font-semibold">
            SORT BY:
          </span>

          {[
            { key: "customer", label: "Customer" },
            { key: "total_orders", label: "Orders" },
            { key: "total_weight", label: "Weight" },
            { key: "total_spent", label: "Spent" },
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
          <table className="w-full min-w-[750px] text-left text-sm text-gray-600">
            <thead className="bg-[#F8F9FB] text-xs uppercase text-gray-400 font-bold border-b border-[#00000026]">
              <tr>
                <th
                  className="px-6 py-4 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("customer")}
                >
                  CUSTOMER NAME {getSortLabel("customer")}
                </th>

                <th className="px-6 py-4">
                  PHONE NUMBER
                </th>

                <th
                  className="px-6 py-4 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("total_orders")}
                >
                  TOTAL ORDERS {getSortLabel("total_orders")}
                </th>

                <th
                  className="px-6 py-4 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("total_weight")}
                >
                  TOTAL WEIGHT {getSortLabel("total_weight")}
                </th>

                <th
                  className="px-6 py-4 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("total_spent")}
                >
                  TOTAL SPENT {getSortLabel("total_spent")}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#00000026]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No data available.
                  </td>
                </tr>
              ) : (
                currentData.map((c, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-5 font-bold text-gray-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                          {c.customer.substring(0, 2).toUpperCase()}
                        </div>
                        {c.customer}
                      </div>
                    </td>

                    <td className="px-6 py-5 font-medium text-gray-900 whitespace-nowrap">
                      {c.phone}
                    </td>

                    <td className="px-6 py-5 font-medium text-gray-900">
                      {c.total_orders}
                    </td>

                    <td className="px-6 py-5 font-medium text-gray-900 whitespace-nowrap">
                      {c.total_weight} kg
                    </td>

                    <td className="px-6 py-5 font-bold text-[#4B5EAA] whitespace-nowrap">
                      ₹{c.total_spent.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Customer Cards */}
        <div className="md:hidden p-3 sm:p-4 space-y-3">
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading...
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No data available.
            </div>
          ) : (
            currentData.map((c, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-xl p-4 space-y-4 hover:bg-gray-50 transition"
              >
                {/* Customer Details */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                    {c.customer.substring(0, 2).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-400 font-semibold uppercase">
                      Customer Name
                    </p>
                    <h3 className="font-bold text-gray-900 text-base break-words mt-1">
                      {c.customer}
                    </h3>
                  </div>
                </div>

                {/* Phone */}
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-400 font-semibold uppercase">
                    Phone Number
                  </p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {c.phone}
                  </p>
                </div>

                {/* Purchase Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">
                      Total Orders
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {c.total_orders}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">
                      Total Weight
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {c.total_weight} kg
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3 col-span-2">
                    <p className="text-xs text-gray-500 mb-1">
                      Total Spent
                    </p>
                    <p className="text-base font-bold text-[#4B5EAA] break-words">
                      ₹{c.total_spent.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && customers.length > 0 && (
          <div className="border-t border-[#00000026]">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Top Customers Chart */}
      <div className="bg-white border border-[#00000026] rounded-xl p-4 sm:p-6 shadow-sm">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-5 sm:mb-6">
          Top Customers by Revenue
        </h2>

        <div className="h-64 sm:h-72 w-full min-w-0">
          {loading ? (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              Loading chart...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -10,
                  bottom: 0,
                }}
                barSize={40}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 10 }}
                  dy={10}
                  interval={0}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 10 }}
                  tickFormatter={(value) =>
                    `₹${(value / 1000).toFixed(1)}k`
                  }
                  width={55}
                />

                <Tooltip cursor={{ fill: "transparent" }} />

                <Bar
                  dataKey="uv"
                  fill="#4B5EAA"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
