
import React, { useEffect, useMemo, useState } from "react";
import {
  FiTrendingUp,
  FiCreditCard,
  FiShoppingCart,
  FiDownload,
} from "react-icons/fi";

import { api } from "../../services/api";
import { exportTableToPDF } from "../../utils/pdfGenerator";
import Pagination from "../common/Pagination";
import SortDropdown from "../common/SortDropdown";

import {
  sortRecords,
  getAvailableSortFields,
} from "../../utils/sortUtils";

const num = (value) => Number(value) || 0;

const money = (value) =>
  num(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const utilization = (row) =>
  num(row.received) > 0
    ? Math.round(
        (num(row.consumed) / num(row.received)) * 100
      )
    : 0;

const getUtilizationColor = (value) => {
  if (value >= 90) return "bg-red-500";
  if (value >= 70) return "bg-orange-500";
  return "bg-green-500";
};

function UtilizationBar({ value }) {
  return (
    <div className="flex items-center gap-3 w-full min-w-0">
      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full ${getUtilizationColor(
            value
          )}`}
          style={{
            width: `${Math.min(
              100,
              Math.max(0, value)
            )}%`,
          }}
        />
      </div>

      <span className="text-xs font-bold text-gray-500">
        {value}%
      </span>
    </div>
  );
}

export default function AdvanceBalanceReport({
  period = "Daily",
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [sortBy, setSortBy] = useState("az");
  const [columnSort, setColumnSort] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    let active = true;

    const fetchBalances = async () => {
      setLoading(true);
      setCurrentPage(1);

      try {
        const res = await api.get(
          `/admin/advances/balance/?period=${encodeURIComponent(
            period
          )}`
        );

        if (!active) return;

        setData(
          res.success && Array.isArray(res.balances)
            ? res.balances
            : []
        );
      } catch (err) {
        console.error("Advance balance report error:", err);
        if (active) setData([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchBalances();

    return () => {
      active = false;
    };
  }, [period]);

  const sortingConfig = {
    nameKeys: ["customer_name"],
    dateKeys: ["last_tx", "last_transaction_date"],
    amountKeys: ["balance"],
    idKeys: ["customer_id", "id"],
  };

  const availableSort = getAvailableSortFields(
    data,
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

  const sortedData = useMemo(() => {
    if (!columnSort) {
      return sortRecords(
        data,
        sortBy,
        sortingConfig
      );
    }

    return [...data].sort((a, b) => {
      const first = a[columnSort.key];
      const second = b[columnSort.key];

      const firstNumber = Number(first);
      const secondNumber = Number(second);

      let result;

      if (
        first != null &&
        first !== "" &&
        second != null &&
        second !== "" &&
        Number.isFinite(firstNumber) &&
        Number.isFinite(secondNumber)
      ) {
        result = firstNumber - secondNumber;
      } else {
        result = String(first ?? "").localeCompare(
          String(second ?? ""),
          "en",
          { numeric: true, sensitivity: "base" }
        );
      }

      return columnSort.direction === "asc"
        ? result
        : -result;
    });
  }, [data, sortBy, columnSort]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedData.length / itemsPerPage)
  );

  const safePage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex = (safePage - 1) * itemsPerPage;

  const currentData = sortedData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Totals remain based on entire report dataset.
  const totalReceived = data.reduce(
    (sum, row) => sum + num(row.received),
    0
  );

  const totalConsumed = data.reduce(
    (sum, row) => sum + num(row.consumed),
    0
  );

  const totalBalance = data.reduce(
    (sum, row) => sum + num(row.balance),
    0
  );

  const handleDownloadPDF = () => {
    const headers = [
      "CUSTOMER",
      "ADVANCE RECEIVED",
      "CONSUMED",
      "BALANCE",
      "UTILIZATION",
    ];

    const pdfData = sortedData.map((row) => [
      row.customer_name,
      `Rs. ${money(row.received)}`,
      `Rs. ${money(row.consumed)}`,
      `Rs. ${money(row.balance)}`,
      `${utilization(row)}%`,
    ]);

    exportTableToPDF(
      "Advance Balance Report",
      headers,
      pdfData,
      "Advance_Balance_Report.pdf"
    );
  };

  const stats = [
    {
      label: "ADVANCE RECEIVED",
      value: totalReceived,
      detail: "Total collected",
      icon: <FiCreditCard size={20} />,
      color: "bg-blue-100 text-blue-500",
    },
    {
      label: "CONSUMED",
      value: totalConsumed,
      detail: "Applied to orders",
      icon: <FiShoppingCart size={20} />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "REMAINING BALANCE",
      value: totalBalance,
      detail: "Available advance",
      icon: <FiTrendingUp size={20} />,
      color: "bg-green-100 text-green-600",
    },
  ];

  const columnOptions = [
    ["customer_name", "Customer"],
    ["received", "Received"],
    ["consumed", "Consumed"],
    ["balance", "Balance"],
  ];

  return (
    <div className="w-full space-y-5 sm:space-y-6">

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-[#00000026] rounded-xl p-4 sm:p-6 shadow-sm"
          >
            <div className="flex justify-between items-start gap-3 mb-5">
              <span className="text-xs font-bold text-gray-400">
                {stat.label}
              </span>

              <div className={`${stat.color} p-2 rounded-lg`}>
                {stat.icon}
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900">
              ₹{money(stat.value)}
            </h3>

            <p className="flex items-center gap-1 text-xs text-green-600 mt-3">
              <FiTrendingUp />
              {stat.detail}
            </p>
          </div>
        ))}
      </div>

      {/* Advance Balance Details */}
      <div className="bg-white border border-[#00000026] rounded-xl overflow-hidden shadow-sm">

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 p-4 sm:p-6 border-b">

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Advance Balance Details
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Customer-wise advance and utilization details
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
              disabled={loading || data.length === 0}
              className="flex items-center justify-center gap-2 bg-red-100 text-red-500 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-200 disabled:opacity-50"
            >
              <FiDownload size={16} />
              Download PDF
            </button>
          </div>
        </div>

        {/* Mobile column sorting */}
        {!loading && data.length > 0 && (
          <div className="lg:hidden px-4 py-3 border-b">
            <p className="text-xs font-bold text-gray-400 mb-2">
              SORT BY
            </p>

            <div className="flex flex-wrap gap-2">
              {columnOptions.map(([key, label]) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => handleSort(key)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border ${
                    columnSort?.key === key
                      ? "bg-[#4B5EAA] text-white"
                      : "bg-white text-gray-600"
                  }`}
                >
                  {label}
                  {getSortLabel(key)}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-center py-12 text-gray-500">
            Loading advance balances...
          </p>
        ) : data.length === 0 ? (
          <p className="text-center py-12 text-gray-500">
            No data available.
          </p>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-[#F8F9FB] text-xs uppercase text-gray-400 font-bold border-b">
                  <tr>
                    {[
                      ["customer_name", "CUSTOMER"],
                      ["received", "ADVANCE RECEIVED"],
                      ["consumed", "CONSUMED"],
                      ["balance", "BALANCE"],
                    ].map(([key, label]) => (
                      <th
                        key={key}
                        onClick={() => handleSort(key)}
                        className="px-6 py-4 cursor-pointer hover:bg-gray-100"
                      >
                        {label}
                        {getSortLabel(key)}
                      </th>
                    ))}

                    <th className="px-6 py-4">
                      UTILIZATION
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {currentData.map((row, index) => (
                    <tr
                      key={row.customer_id ?? index}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-5 font-medium text-gray-900">
                        {row.customer_name}
                      </td>

                      <td className="px-6 py-5">
                        ₹{money(row.received)}
                      </td>

                      <td className="px-6 py-5">
                        ₹{money(row.consumed)}
                      </td>

                      <td className="px-6 py-5 font-bold text-[#4B5EAA]">
                        ₹{money(row.balance)}
                      </td>

                      <td className="px-6 py-5 w-48">
                        <UtilizationBar
                          value={utilization(row)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile / Tablet */}
            <div className="lg:hidden p-3 sm:p-4 space-y-3">
              {currentData.map((row, index) => (
                <div
                  key={row.customer_id ?? index}
                  className="border border-gray-200 rounded-xl p-4 space-y-4"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400">
                        Customer
                      </p>
                      <h3 className="font-bold text-gray-900 break-words">
                        {row.customer_name}
                      </h3>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-400">
                        Balance
                      </p>
                      <p className="font-bold text-[#4B5EAA]">
                        ₹{money(row.balance)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">
                        Advance Received
                      </p>
                      <p className="font-semibold">
                        ₹{money(row.received)}
                      </p>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">
                        Consumed
                      </p>
                      <p className="font-semibold">
                        ₹{money(row.consumed)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-2">
                      Utilization
                    </p>
                    <UtilizationBar
                      value={utilization(row)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

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
    </div>
  );
}
