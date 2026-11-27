
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FiDollarSign,
  FiCreditCard,
  FiAlertCircle,
  FiUsers,
  FiDownload,
  FiSearch,
  FiX,
} from "react-icons/fi";

import { api } from "../../services/api";
import { exportTableToPDF } from "../../utils/pdfGenerator";
import Pagination from "../common/Pagination";
import SortDropdown from "../common/SortDropdown";

import {
  sortRecords,
  getAvailableSortFields,
} from "../../utils/sortUtils";

// ====================================================
// HELPERS
// ====================================================

const num = (value) => {
  const result = Number(value);
  return Number.isFinite(result) ? result : 0;
};

const money = (value) =>
  num(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const EMPTY_SUMMARY = {
  total_customers: 0,
  total_invoices: 0,
  total_invoiced: 0,
  total_paid: 0,
  total_balance: 0,
};

const STATUS_COLORS = {
  Paid: "bg-green-100 text-green-700",
  Partial: "bg-yellow-100 text-yellow-700",
  Unpaid: "bg-red-100 text-red-700",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
        STATUS_COLORS[status] ||
        "bg-gray-100 text-gray-700"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}

function StatCard({
  label,
  value,
  description,
  icon,
  color,
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-bold uppercase text-gray-400">
          {label}
        </span>

        <span className={`rounded-lg p-2 ${color}`}>
          {icon}
        </span>
      </div>

      <p className="mt-5 break-words text-xl font-bold text-gray-900 sm:text-2xl">
        {value}
      </p>

      <p className="mt-2 text-xs text-gray-500">
        {description}
      </p>
    </div>
  );
}

// ====================================================
// MAIN COMPONENT
// ====================================================

export default function BalanceAmountReport({
  period = "Daily",
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("az");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // All invoices by default.
  // The Reports page's Daily / Weekly / Monthly
  // selector becomes active in "Selected Period" mode.
  const [rangeMode, setRangeMode] = useState("all");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [outstandingOnly, setOutstandingOnly] =
    useState(false);

  const invalidRange =
    rangeMode === "custom" &&
    Boolean(fromDate && toDate) &&
    fromDate > toDate;

  const incompleteRange =
    rangeMode === "custom" &&
    (!fromDate || !toDate);

  const canFetch =
    !invalidRange && !incompleteRange;

  // ====================================================
  // FETCH
  // ====================================================

  useEffect(() => {
    if (!canFetch) {
      setData([]);
      setLoading(false);
      return;
    }

    let active = true;

    const fetchReport = async () => {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (rangeMode === "all") {
        params.set("period", "All");
      } else if (rangeMode === "period") {
        params.set("period", period);
      } else {
        params.set("period", "All");
        params.set("from_date", fromDate);
        params.set("to_date", toDate);
      }

      try {
        const response = await api.get(
          `/accounts/reports/balance-details/?${params.toString()}`,
          false
        );

        if (!active) return;

        if (
          !response?.success ||
          !Array.isArray(response.results)
        ) {
          throw new Error(
            response?.message ||
            "Invalid balance report response."
          );
        }

        setData(response.results);
      } catch (err) {
        if (!active) return;

        console.error(
          "Balance Amount Report error:",
          err
        );

        setData([]);
        setError(
          err?.message ||
          "Unable to load balance details."
        );
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
  }, [
    rangeMode,
    period,
    fromDate,
    toDate,
    canFetch,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    sortBy,
    rangeMode,
    period,
    fromDate,
    toDate,
    outstandingOnly,
  ]);

  // ====================================================
  // FILTER & SORT
  // ====================================================

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();

    return data.filter((row) => {
      const name = String(
        row.customer_name || ""
      ).toLowerCase();

      const phone = String(
        row.phone_number || ""
      );

      const matchesSearch =
        !query ||
        name.includes(query) ||
        phone.includes(query);

      const matchesBalance =
        !outstandingOnly ||
        num(row.total_balance) > 0;

      return matchesSearch && matchesBalance;
    });
  }, [data, search, outstandingOnly]);

  const sortingConfig = {
    nameKeys: ["customer_name"],
    dateKeys: ["last_invoice_date"],
    amountKeys: ["total_balance"],
    idKeys: ["customer_id"],
  };

  const availableSort = getAvailableSortFields(
    filteredData,
    sortingConfig
  );

  const sortedData = useMemo(
    () =>
      sortRecords(
        filteredData,
        sortBy,
        sortingConfig
      ),
    [filteredData, sortBy]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(sortedData.length / itemsPerPage)
  );

  const safePage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safePage - 1) * itemsPerPage;

  const pageData = sortedData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // ====================================================
  // SUMMARY TOTALS
  // Based on all filtered rows, not current page.
  // ====================================================

  const summary = useMemo(() => {
    if (!filteredData.length) {
      return { ...EMPTY_SUMMARY };
    }

    return filteredData.reduce(
      (total, row) => ({
        total_customers:
          total.total_customers + 1,

        total_invoices:
          total.total_invoices +
          num(row.invoice_count),

        total_invoiced:
          total.total_invoiced +
          num(row.total_invoiced),

        total_paid:
          total.total_paid +
          num(row.total_paid),

        total_balance:
          total.total_balance +
          num(row.total_balance),
      }),
      { ...EMPTY_SUMMARY }
    );
  }, [filteredData]);

  // ====================================================
  // EXPORT PDF
  // Uses all filtered, sorted rows.
  // ====================================================

  const handleDownloadPDF = () => {
    const headers = [
      "CUSTOMER NAME",
      "PHONE",
      "INVOICES",
      "INVOICED",
      "PAID",
      "BALANCE",
      "STATUS",
    ];

    const rows = sortedData.map((row) => [
      row.customer_name || "-",
      row.phone_number || "-",
      String(row.invoice_count || 0),
      `Rs. ${money(row.total_invoiced)}`,
      `Rs. ${money(row.total_paid)}`,
      `Rs. ${money(row.total_balance)}`,
      row.status || "-",
    ]);

    rows.push([
      "GRAND TOTAL",
      "",
      String(summary.total_invoices),
      `Rs. ${money(summary.total_invoiced)}`,
      `Rs. ${money(summary.total_paid)}`,
      `Rs. ${money(summary.total_balance)}`,
      "",
    ]);

    let dateLabel = "All_Time";

    if (rangeMode === "period") {
      dateLabel = period;
    }

    if (rangeMode === "custom") {
      dateLabel = `${fromDate}_to_${toDate}`;
    }

    exportTableToPDF(
      `Balance Amount Details - ${dateLabel}`,
      headers,
      rows,
      `Balance_Amount_Details_${dateLabel}.pdf`
    );
  };

  // ====================================================
  // CLEAR FILTERS
  // ====================================================

  const clearFilters = () => {
    setSearch("");
    setSortBy("az");
    setRangeMode("all");
    setFromDate("");
    setToDate("");
    setOutstandingOnly(false);
    setCurrentPage(1);
  };

  const stats = [
    {
      label: "TOTAL CUSTOMERS",
      value: summary.total_customers,
      description: "Customers in selected results",
      icon: <FiUsers size={19} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "TOTAL INVOICED",
      value: `₹${money(summary.total_invoiced)}`,
      description: `${summary.total_invoices} invoices`,
      icon: <FiDollarSign size={19} />,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      label: "TOTAL PAID",
      value: `₹${money(summary.total_paid)}`,
      description: "Advance applied + invoice payments",
      icon: <FiCreditCard size={19} />,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "BALANCE DUE",
      value: `₹${money(summary.total_balance)}`,
      description: "Current unpaid invoice balance",
      icon: <FiAlertCircle size={19} />,
      color: "bg-red-100 text-red-600",
    },
  ];

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="w-full min-w-0">

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            {...stat}
          />
        ))}
      </div>

      {/* Report card */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        {/* Heading */}
        <div className="flex flex-col gap-4 border-b border-gray-200 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Balance Amount Details
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Customer-wise invoiced, paid and
              outstanding balance details
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={
              loading ||
              !!error ||
              !canFetch ||
              sortedData.length === 0
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-red-100 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiDownload size={16} />
            Download PDF
          </button>
        </div>

        {/* Report filters */}
        <div className="space-y-4 border-b border-gray-200 bg-gray-50/40 p-4 sm:p-5">

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

            {/* Search */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                Customer Name / Phone
              </label>

              <div className="relative">
                <FiSearch
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search customer..."
                  className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#4B5EAA]"
                />
              </div>
            </div>

            {/* Date mode */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                Report Date Filter
              </label>

              <select
                value={rangeMode}
                onChange={(e) =>
                  setRangeMode(e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4B5EAA]"
              >
                <option value="all">
                  All Time
                </option>

                <option value="period">
                  Selected Period ({period})
                </option>

                <option value="custom">
                  Custom Date Range
                </option>
              </select>
            </div>

            {/* Sort */}
            <div className="min-w-0">
              <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                Sort Records
              </label>

              <SortDropdown
                value={sortBy}
                onChange={setSortBy}
                allowDate={availableSort.allowDate}
                allowAmount={availableSort.allowAmount}
              />
            </div>
          </div>

          {/* Custom dates */}
          {rangeMode === "custom" && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                  From Date
                </label>

                <input
                  type="date"
                  value={fromDate}
                  max={toDate || undefined}
                  onChange={(e) =>
                    setFromDate(e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                  To Date
                </label>

                <input
                  type="date"
                  value={toDate}
                  min={fromDate || undefined}
                  onChange={(e) =>
                    setToDate(e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm"
                />
              </div>
            </div>
          )}

          {/* Outstanding toggle and clear */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={outstandingOnly}
                onChange={(e) =>
                  setOutstandingOnly(e.target.checked)
                }
                className="h-4 w-4 accent-[#4B5EAA]"
              />

              Show only customers with balance due
            </label>

            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              <FiX size={15} />
              Clear Filters
            </button>
          </div>

          {incompleteRange && (
            <p className="text-xs text-amber-600">
              Select both From Date and To Date.
            </p>
          )}

          {invalidRange && (
            <p className="text-xs text-red-600">
              From Date cannot be after To Date.
            </p>
          )}

          <p className="text-xs text-gray-500">
            Date filters select invoices by creation date.
            Paid and balance reflect their current recorded
            payments, including applied advances.
          </p>
        </div>

        {/* Results count */}
        <div className="border-b border-gray-200 px-4 py-3 text-xs text-gray-500 sm:px-6">
          Showing {sortedData.length} customer records
        </div>

        {loading ? (
          <div className="px-4 py-12 text-center text-sm text-gray-500">
            Loading balance details...
          </div>
        ) : error ? (
          <div
            role="alert"
            className="px-4 py-12 text-center text-sm text-red-600"
          >
            {error}
          </div>
        ) : !canFetch ? (
          <div className="px-4 py-12 text-center text-sm text-gray-500">
            Select a valid date range.
          </div>
        ) : sortedData.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-gray-500">
            No balance records found.
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1050px] text-left text-sm text-gray-600">
                <thead className="border-b border-gray-200 bg-[#F8F9FB] text-xs font-bold uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-4">
                      Customer Name
                    </th>
                    <th className="px-5 py-4">
                      Phone Number
                    </th>
                    <th className="px-5 py-4 text-center">
                      Invoices
                    </th>
                    <th className="px-5 py-4 text-right">
                      Total Invoiced
                    </th>
                    <th className="px-5 py-4 text-right">
                      Total Paid
                    </th>
                    <th className="px-5 py-4 text-right">
                      Balance Due
                    </th>
                    <th className="px-5 py-4 text-center">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {pageData.map((row) => (
                    <tr
                      key={row.customer_id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-5 py-4 font-semibold text-gray-900">
                        {row.customer_name}
                      </td>

                      <td className="px-5 py-4">
                        {row.phone_number || "-"}
                      </td>

                      <td className="px-5 py-4 text-center">
                        {row.invoice_count}
                      </td>

                      <td className="px-5 py-4 text-right font-semibold text-gray-900">
                        ₹{money(row.total_invoiced)}
                      </td>

                      <td className="px-5 py-4 text-right font-semibold text-green-700">
                        ₹{money(row.total_paid)}
                      </td>

                      <td className="px-5 py-4 text-right font-bold text-red-600">
                        ₹{money(row.total_balance)}
                      </td>

                      <td className="px-5 py-4 text-center">
                        <StatusBadge
                          status={row.status}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot>
                  <tr className="border-t-2 border-blue-200 bg-[#DCEBFF] font-bold text-blue-900">
                    <td
                      colSpan={2}
                      className="px-5 py-4"
                    >
                      GRAND TOTAL
                    </td>

                    <td className="px-5 py-4 text-center">
                      {summary.total_invoices}
                    </td>

                    <td className="px-5 py-4 text-right">
                      ₹{money(summary.total_invoiced)}
                    </td>

                    <td className="px-5 py-4 text-right">
                      ₹{money(summary.total_paid)}
                    </td>

                    <td className="px-5 py-4 text-right">
                      ₹{money(summary.total_balance)}
                    </td>

                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Mobile / Tablet cards */}
            <div className="space-y-3 p-3 sm:p-4 lg:hidden">
              {pageData.map((row) => (
                <div
                  key={row.customer_id}
                  className="space-y-4 rounded-xl border border-gray-200 bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="break-words font-bold text-gray-900">
                        {row.customer_name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {row.phone_number || "-"}
                      </p>
                    </div>

                    <StatusBadge
                      status={row.status}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">
                        Invoices
                      </p>

                      <p className="mt-1 font-bold">
                        {row.invoice_count}
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">
                        Total Invoiced
                      </p>

                      <p className="mt-1 font-bold">
                        ₹{money(row.total_invoiced)}
                      </p>
                    </div>

                    <div className="rounded-lg bg-green-50 p-3">
                      <p className="text-xs text-gray-500">
                        Total Paid
                      </p>

                      <p className="mt-1 font-bold text-green-700">
                        ₹{money(row.total_paid)}
                      </p>
                    </div>

                    <div className="rounded-lg bg-red-50 p-3">
                      <p className="text-xs text-gray-500">
                        Balance Due
                      </p>

                      <p className="mt-1 font-bold text-red-600">
                        ₹{money(row.total_balance)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="rounded-xl bg-[#DCEBFF] p-4">
                <p className="text-xs font-bold text-blue-900">
                  GRAND TOTAL BALANCE
                </p>

                <p className="mt-2 text-xl font-bold text-blue-900">
                  ₹{money(summary.total_balance)}
                </p>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-gray-200">
                <Pagination
                  currentPage={safePage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
