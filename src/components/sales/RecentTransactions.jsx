
import React, { useEffect, useMemo, useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { FiSearch, FiX } from "react-icons/fi";

import { api } from "../../services/api";
import { exportTableToPDF } from "../../utils/pdfGenerator";
import SortDropdown from "../common/SortDropdown";

import {
  sortRecords,
  getAvailableSortFields,
} from "../../utils/sortUtils";

const statusBadge = {
  Paid: "bg-green-100 text-green-700",
  Partial: "bg-yellow-100 text-yellow-700",
  Unpaid: "bg-red-100 text-red-700",
};

const formatAmount = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const getDateKey = (transaction) => {
  // Prefer ISO date from backend for accurate comparisons.
  if (transaction.created_at) {
    return String(transaction.created_at).slice(0, 10);
  }

  // Fallback for previously fetched records.
  // Format: "26 Nov 2026, 05:16 AM"
  const parsed = new Date(transaction.date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const year = parsed.getFullYear();
  const month = String(
    parsed.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    parsed.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function RecentTransactions({
  sales = [],
  loading = false,
}) {
  const [searchName, setSearchName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const [rangeSales, setRangeSales] = useState(null);
  const [rangeLoading, setRangeLoading] = useState(false);
  const [rangeError, setRangeError] = useState("");

  const hasRange = Boolean(fromDate && toDate);
  const incompleteRange = Boolean(
    (fromDate && !toDate) ||
    (!fromDate && toDate)
  );
  const invalidRange = hasRange && fromDate > toDate;

  // Fetch records across the selected date range.
  // This does not modify the dashboard chart or cards.
  useEffect(() => {
    if (!hasRange || invalidRange) {
      setRangeSales(null);
      setRangeError("");
      setRangeLoading(false);
      return;
    }

    let active = true;

    const fetchRange = async () => {
      setRangeLoading(true);
      setRangeSales(null);
      setRangeError("");

      try {
        const query = new URLSearchParams({
          from_date: fromDate,
          to_date: toDate,
        });

        const response = await api.get(
          `/accounts/reports/sales/?${query.toString()}`
        );

        if (!active) return;

        if (!response.success) {
          throw new Error(
            response.message ||
            "Unable to load transactions."
          );
        }

        setRangeSales(
          Array.isArray(response.sales)
            ? response.sales
            : []
        );
      } catch (error) {
        if (!active) return;

        console.error(
          "Recent Transactions range error:",
          error
        );

        setRangeSales([]);
        setRangeError(
          error.message ||
          "Failed to load selected dates."
        );
      } finally {
        if (active) {
          setRangeLoading(false);
        }
      }
    };

    fetchRange();

    return () => {
      active = false;
    };
  }, [fromDate, toDate, hasRange, invalidRange]);

  const sourceSales = hasRange
    ? rangeSales || []
    : sales;

  const sortingConfig = {
    nameKeys: ["customer"],
    dateKeys: ["created_at", "date"],
    amountKeys: ["amount"],
    idKeys: ["id"],
  };

  const availableSort = getAvailableSortFields(
    sourceSales,
    sortingConfig
  );

  // Filter BEFORE sorting.
  const filteredSales = useMemo(() => {
    const query = searchName.trim().toLowerCase();

    return sourceSales.filter((transaction) => {
      const customerName = String(
        transaction.customer || ""
      ).toLowerCase();

      const matchesName =
        !query || customerName.includes(query);

      const transactionDate = getDateKey(
        transaction
      );

      const matchesFrom =
        !fromDate ||
        (transactionDate &&
          transactionDate >= fromDate);

      const matchesTo =
        !toDate ||
        (transactionDate &&
          transactionDate <= toDate);

      return (
        matchesName &&
        matchesFrom &&
        matchesTo
      );
    });
  }, [
    sourceSales,
    searchName,
    fromDate,
    toDate,
  ]);

  // Sort the complete filtered dataset.
  const sortedSales = useMemo(
    () =>
      sortRecords(
        filteredSales,
        sortBy,
        sortingConfig
      ),
    [filteredSales, sortBy]
  );

  // Keep the default recent view at 10 records.
  // When filtering, show all matching records.
  const filtersActive = Boolean(
    searchName.trim() || fromDate || toDate
  );

  const visibleSales = filtersActive
    ? sortedSales
    : sortedSales.slice(0, 10);
  const totalAmount = visibleSales.reduce(
      (sum, transaction) =>
        sum + Number(transaction.amount || 0),
      0
    );

  const isLoading = loading && !hasRange
    ? true
    : rangeLoading;

  const clearFilters = () => {
    setSearchName("");
    setFromDate("");
    setToDate("");
    setSortBy("newest");
    setRangeSales(null);
    setRangeError("");
  };

  // PDF exports exactly the currently displayed rows.
  const handleDownloadPDF = () => {
    const headers = [
      "ID",
      "Customer",
      "Date",
      "Amount",
      "Status",
    ];

    const rows = visibleSales.map(
      (transaction) => [
        String(transaction.id ?? "-"),
        transaction.customer || "-",
        transaction.date || "-",
        `Rs. ${formatAmount(
          transaction.amount
        )}`,
        transaction.status || "-",
      ]
    );
    rows.push([
          "",
          "",
          "TOTAL AMOUNT",
          `Rs. ${formatAmount(totalAmount)}`,
          "",
        ]);

    const title = hasRange
      ? `Recent Transactions (${fromDate} to ${toDate})`
      : "Recent Transactions";

    exportTableToPDF(
      title,
      headers,
      rows,
      `Recent_Transactions_${sortBy}.pdf`
    );
  };

  const renderStatus = (status) => (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
        statusBadge[status] ||
        "bg-gray-100 text-gray-700"
      }`}
    >
      {status || "-"}
    </span>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden w-full">

      {/* Header */}
      <div className="flex flex-col gap-4 p-4 sm:p-6 border-b border-gray-200">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-2xl font-semibold text-gray-900">
              Recent Transactions
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Showing {visibleSales.length} of{" "}
              {filteredSales.length} transactions
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={
              isLoading ||
              incompleteRange ||
              invalidRange ||
              !!rangeError ||
              visibleSales.length === 0
            }
            className="flex items-center justify-center gap-2 bg-red-100 text-red-500 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-200 disabled:opacity-50"
          >
            <FaFilePdf />
            Download PDF
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[minmax(150px,1fr)_170px_170px_auto_auto] gap-3 items-end">

          {/* Customer search */}
          <div className="min-w-0">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Customer Name
            </label>

            <div className="relative">
              <FiSearch
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={searchName}
                onChange={(e) =>
                  setSearchName(e.target.value)
                }
                placeholder="Search customer..."
                className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none focus:border-[#4B5EAA]"
              />
            </div>
          </div>

          {/* From Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              From Date
            </label>

            <input
              type="date"
              value={fromDate}
              max={toDate || undefined}
              onChange={(e) =>
                setFromDate(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
            />
          </div>

          {/* To Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              To Date
            </label>

            <input
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(e) =>
                setToDate(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
            />
          </div>

          {/* Sort */}
          <div className="min-w-0">
            <SortDropdown
              value={sortBy}
              onChange={setSortBy}
              allowDate={availableSort.allowDate}
              allowAmount={availableSort.allowAmount}
            />
          </div>

          {/* Clear */}
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <FiX />
            Clear
          </button>
        </div>

        {incompleteRange && (
          <p className="text-xs text-amber-600">
            Select both From Date and To Date to
            search the complete date range.
          </p>
        )}

        {invalidRange && (
          <p className="text-xs text-red-600">
            From Date cannot be after To Date.
          </p>
        )}

        {rangeError && (
          <p className="text-xs text-red-600">
            {rangeError}
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500 text-sm">
          Loading transactions...
        </div>
      ) : visibleSales.length === 0 ? (
        <div className="text-center py-12 text-gray-500 text-sm">
          No transactions found.
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="p-4 font-semibold">
                    ID
                  </th>

                  <th className="p-4 font-semibold">
                    Customer
                  </th>

                  <th className="p-4 font-semibold">
                    Date
                  </th>

                  <th className="p-4 font-semibold">
                    Amount
                  </th>

                  <th className="p-4 font-semibold">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleSales.map((item, index) => (
                  <tr
                    key={item.id ?? item.invoice_no ?? index}
                    className="border-t border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-bold text-[#4B5EAA]">
                      {item.id ?? "-"}
                    </td>

                    <td className="p-4 font-medium text-gray-800">
                      {item.customer}
                    </td>

                    <td className="p-4 text-gray-600 whitespace-nowrap">
                      {item.date}
                    </td>

                    <td className="p-4 font-bold text-gray-900 whitespace-nowrap">
                      ₹{formatAmount(item.amount)}
                    </td>

                    <td className="p-4">
                      {renderStatus(item.status)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-blue-100 border-t-2 border-blue-300">
                    <td
                      colSpan={3}
                      className="p-4 font-bold text-blue-900"
                    >
                      TOTAL AMOUNT
                    </td>

                    <td className="p-4 font-bold text-blue-900 whitespace-nowrap">
                      ₹{formatAmount(totalAmount)}
                    </td>

                    <td />
                  </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden p-3 sm:p-4 space-y-3">
            {visibleSales.map((item, index) => (
              <div
                key={item.id ?? item.invoice_no ?? index}
                className="border border-gray-200 rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-400">
                      ID
                    </p>

                    <h3 className="font-bold text-[#4B5EAA]">
                      {item.id ?? "-"}
                    </h3>
                  </div>

                  {renderStatus(item.status)}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">
                      Customer
                    </p>

                    <p className="text-sm font-medium text-gray-800 break-words">
                      {item.customer}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Date
                    </p>

                    <p className="text-sm text-gray-700">
                      {item.date}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-gray-100 mt-4 pt-3">
                  <span className="text-xs text-gray-400 font-bold">
                    AMOUNT
                  </span>

                  <span className="font-bold text-gray-900">
                    ₹{formatAmount(item.amount)}
                  </span>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between gap-3 rounded-xl bg-blue-100 p-4">
            <span className="font-bold text-blue-900">
              TOTAL AMOUNT
            </span>

            <span className="font-bold text-blue-900">
              ₹{formatAmount(totalAmount)}
            </span>
          </div>
          </div>
        </>
      )}
    </div>
  );
}
