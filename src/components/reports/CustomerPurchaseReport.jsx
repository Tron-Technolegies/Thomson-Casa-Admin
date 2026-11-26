
import React, { useEffect, useMemo, useState } from "react";
import {
  FiDollarSign,
  FiShoppingCart,
  FiTrendingUp,
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
import SortDropdown from "../common/SortDropdown";

import {
  sortRecords,
  getAvailableSortFields,
} from "../../utils/sortUtils";

const number = (value) => Number(value) || 0;

const money = (value) =>
  number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function CustomerPurchaseReport({
  period = "Daily",
}) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [sortBy, setSortBy] = useState("az");

  // Keeps existing column-specific sorting
  const [columnSort, setColumnSort] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    let active = true;

    const fetchReport = async () => {
      setLoading(true);
      setCurrentPage(1);

      try {
        const res = await api.get(
          `/admin/reports/customers/?period=${encodeURIComponent(
            period
          )}`
        );

        if (!active) return;

        setCustomers(
          res.success && Array.isArray(res.customers_report)
            ? res.customers_report
            : []
        );
      } catch (err) {
        console.error("Customer purchase report error:", err);

        if (active) {
          setCustomers([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchReport();

    return () => {
      active = false;
    };
  }, [period]);

  const sortingConfig = {
    nameKeys: ["customer"],
    dateKeys: ["last_order_date", "created_at"],
    amountKeys: ["total_spent"],
    idKeys: ["customer_id", "id"],
  };

  const availableSort = getAvailableSortFields(
    customers,
    sortingConfig
  );

  const handleCommonSort = (value) => {
    setSortBy(value);
    setColumnSort(null);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    setColumnSort((previous) => ({
      key,
      direction:
        previous?.key === key &&
        previous.direction === "asc"
          ? "desc"
          : "asc",
    }));

    setCurrentPage(1);
  };

  const getSortLabel = (key) => {
    if (columnSort?.key !== key) return "";

    return columnSort.direction === "asc"
      ? " ↑"
      : " ↓";
  };

  // Apply sorting to ALL fetched report rows
  const sortedData = useMemo(() => {
    if (!columnSort) {
      return sortRecords(
        customers,
        sortBy,
        sortingConfig
      );
    }

    return [...customers].sort((a, b) => {
      const aValue = a[columnSort.key];
      const bValue = b[columnSort.key];

      const aNumber = Number(aValue);
      const bNumber = Number(bValue);

      let result = 0;

      if (
        aValue != null &&
        aValue !== "" &&
        bValue != null &&
        bValue !== "" &&
        Number.isFinite(aNumber) &&
        Number.isFinite(bNumber)
      ) {
        result = aNumber - bNumber;
      } else {
        result = String(aValue ?? "").localeCompare(
          String(bValue ?? ""),
          "en",
          { numeric: true, sensitivity: "base" }
        );
      }

      return columnSort.direction === "asc"
        ? result
        : -result;
    });
  }, [customers, sortBy, columnSort]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedData.length / itemsPerPage)
  );

  const safePage = Math.min(currentPage, totalPages);

  const startIndex = (safePage - 1) * itemsPerPage;

  const currentData = sortedData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Summary totals are based on all filtered API rows.
  // Sorting never changes the values.
  const totalSpent = customers.reduce(
    (sum, c) => sum + number(c.total_spent),
    0
  );

  const totalOrders = customers.reduce(
    (sum, c) => sum + number(c.total_orders),
    0
  );

  const avgOrderValue =
    totalOrders > 0 ? totalSpent / totalOrders : 0;

  const chartData = [...customers]
    .sort(
      (a, b) =>
        number(b.total_spent) -
        number(a.total_spent)
    )
    .slice(0, 5)
    .map((c) => ({
      name:
        String(c.customer || "").slice(0, 15) +
        (String(c.customer || "").length > 15
          ? "..."
          : ""),
      uv: number(c.total_spent),
    }));

  // Export the same sorted dataset, not one page.
  const handleDownloadPDF = () => {
    const headers = [
      "CUSTOMER NAME",
      "PHONE NUMBER",
      "TOTAL ORDERS",
      "TOTAL WEIGHT",
      "TOTAL SPENT",
    ];

    const data = sortedData.map((c) => [
      c.customer || "",
      c.phone || "",
      String(c.total_orders ?? 0),
      `${number(c.total_weight)} kg`,
      `Rs. ${money(c.total_spent)}`,
    ]);

    exportTableToPDF(
      "Customer Purchase Summary",
      headers,
      data,
      "Customer_Purchase_Report.pdf"
    );
  };

  const stats = [
    {
      label: "TOTAL CUSTOMERS",
      value: String(customers.length),
      detail: "Active this period",
      icon: <FiDollarSign size={20} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "TOTAL PURCHASES",
      value: `₹${money(totalSpent)}`,
      detail: "Total spent by all customers",
      icon: <FiShoppingCart size={20} />,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "AVG ORDER VALUE",
      value: `₹${money(avgOrderValue)}`,
      detail: "Per order",
      icon: <FiTrendingUp size={20} />,
      color: "bg-red-100 text-red-600",
    },
  ];

  return (
    <div className="w-full min-w-0">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-[#00000026] rounded-xl p-5 sm:p-6 shadow-sm"
          >
            <div className="flex justify-between items-start gap-3 mb-5">
              <span className="text-xs font-bold text-gray-400">
                {stat.label}
              </span>

              <div className={`p-2 rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 break-words">
              {stat.value}
            </h3>

            <p className="text-xs text-green-600 mt-3">
              {stat.detail}
            </p>
          </div>
        ))}
      </div>

      {/* Customer Purchase Summary */}
      <div className="bg-white border border-[#00000026] rounded-xl overflow-hidden shadow-sm mb-6">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 p-4 sm:p-6 border-b">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Customer Purchase Summary
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              {period} — {customers.length} customers
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <SortDropdown
              value={columnSort ? "custom" : sortBy}
              onChange={handleCommonSort}
              allowDate={availableSort.allowDate}
              allowAmount={availableSort.allowAmount}
            />

            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={loading || sortedData.length === 0}
              className="flex items-center justify-center gap-2 bg-red-100 text-red-500 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-200 disabled:opacity-50"
            >
              <FiDownload size={16} />
              Download PDF
            </button>
          </div>
        </div>

        {/* Existing column-specific sort options */}
        <div className="md:hidden flex flex-wrap items-center gap-2 p-3 border-b border-gray-200">
          <span className="text-xs text-gray-400 font-semibold">
            SORT BY:
          </span>

          {[
            ["customer", "Customer"],
            ["total_orders", "Orders"],
            ["total_weight", "Weight"],
            ["total_spent", "Spent"],
          ].map(([key, label]) => (
            <button
              type="button"
              key={key}
              onClick={() => handleSort(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                columnSort?.key === key
                  ? "bg-[#4B5EAA] text-white"
                  : "bg-gray-50 text-gray-600"
              }`}
            >
              {label}{getSortLabel(key)}
            </button>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm text-gray-600">
            <thead className="bg-[#F8F9FB] text-xs uppercase text-gray-400 font-bold border-b">
              <tr>
                {[
                  ["customer", "CUSTOMER NAME"],
                  [null, "PHONE NUMBER"],
                  ["total_orders", "TOTAL ORDERS"],
                  ["total_weight", "TOTAL WEIGHT"],
                  ["total_spent", "TOTAL SPENT"],
                ].map(([key, label]) => (
                  <th
                    key={label}
                    className={`px-6 py-4 ${
                      key ? "cursor-pointer hover:bg-gray-100" : ""
                    }`}
                    onClick={
                      key ? () => handleSort(key) : undefined
                    }
                  >
                    {label} {key && getSortLabel(key)}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center">
                    Loading...
                  </td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center">
                    No data available.
                  </td>
                </tr>
              ) : (
                currentData.map((c, index) => (
                  <tr
                    key={c.customer_id ?? index}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-5 font-bold text-gray-900">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs shrink-0">
                          {String(c.customer || "?")
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                        {c.customer}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      {c.phone}
                    </td>

                    <td className="px-6 py-5">
                      {c.total_orders}
                    </td>

                    <td className="px-6 py-5">
                      {c.total_weight} kg
                    </td>

                    <td className="px-6 py-5 font-bold text-[#4B5EAA]">
                      ₹{money(c.total_spent)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden p-3 sm:p-4 space-y-3">
          {loading ? (
            <p className="text-center py-8 text-gray-500">
              Loading...
            </p>
          ) : currentData.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              No data available.
            </p>
          ) : (
            currentData.map((c, index) => (
              <div
                key={c.customer_id ?? index}
                className="border border-gray-200 rounded-xl p-4 space-y-4"
              >
                <div>
                  <p className="text-xs text-gray-400 uppercase">
                    Customer
                  </p>
                  <h3 className="font-bold text-gray-900 break-words">
                    {c.customer}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {c.phone}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">
                      Total Orders
                    </p>
                    <p className="font-bold">
                      {c.total_orders}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">
                      Total Weight
                    </p>
                    <p className="font-bold">
                      {c.total_weight} kg
                    </p>
                  </div>

                  <div className="col-span-2 bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">
                      Total Spent
                    </p>
                    <p className="font-bold text-[#4B5EAA]">
                      ₹{money(c.total_spent)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {!loading && sortedData.length > 0 && (
          <div className="border-t">
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Top Customers Chart — unchanged business meaning */}
      <div className="bg-white border border-[#00000026] rounded-xl p-4 sm:p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-5">
          Top Customers by Revenue
        </h2>

        <div className="h-64 sm:h-72 w-full min-w-0">
          {loading ? (
            <div className="h-full flex items-center justify-center text-gray-500">
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
                />

                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10 }}
                  interval={0}
                />

                <YAxis
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) =>
                    `₹${(value / 1000).toFixed(1)}k`
                  }
                  width={55}
                />

                <Tooltip
                  cursor={{ fill: "transparent" }}
                />

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
