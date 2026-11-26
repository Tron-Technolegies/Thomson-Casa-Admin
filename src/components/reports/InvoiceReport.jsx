
import React, { useEffect, useMemo, useState } from "react";
import {
  FiTrendingUp,
  FiFileText,
  FiDollarSign,
  FiCreditCard,
  FiDownload,
} from "react-icons/fi";

import { api } from "../../services/api";
import { exportTableToPDF } from "../../utils/pdfGenerator";
import Pagination from "../common/Pagination";
import SortDropdown from "../common/SortDropdown";

import {
  sortRecords,
  getAvailableSortFields,
  parseSortDate,
} from "../../utils/sortUtils";

const num = (value) => Number(value) || 0;

const money = (value) =>
  num(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const statusStyle = (status) => {
  if (status === "Paid") {
    return "bg-green-100 text-green-600";
  }

  if (status === "Partial") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-red-100 text-red-500";
};

export default function InvoiceReport({
  period = "Daily",
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [sortBy, setSortBy] = useState("newest");
  const [columnSort, setColumnSort] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    let active = true;

    const fetchInvoices = async () => {
      setLoading(true);
      setCurrentPage(1);

      try {
        const res = await api.get(
          `/admin/invoices/?period=${encodeURIComponent(
            period
          )}`
        );

        if (!active) return;

        setData(
          res.success && Array.isArray(res.invoices)
            ? res.invoices
            : []
        );
      } catch (err) {
        console.error("Invoice report error:", err);
        if (active) setData([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchInvoices();

    return () => {
      active = false;
    };
  }, [period]);

  const sortingConfig = {
    nameKeys: ["customer"],
    dateKeys: ["created_at", "date"],
    amountKeys: ["total"],
    idKeys: ["id"],
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
      const aValue = a[columnSort.key];
      const bValue = b[columnSort.key];

      let result;

      // Correct chronological order for invoice dates.
      if (
        columnSort.key === "date" ||
        columnSort.key === "created_at"
      ) {
        const aDate = parseSortDate(aValue);
        const bDate = parseSortDate(bValue);

        result = (aDate ?? 0) - (bDate ?? 0);
      } else {
        const aNumber = Number(aValue);
        const bNumber = Number(bValue);

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

  const safePage = Math.min(currentPage, totalPages);

  const startIndex = (safePage - 1) * itemsPerPage;

  const currentData = sortedData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Preserve original invoice report summary calculations
  const totalAmount = data.reduce(
    (sum, row) => sum + num(row.amount),
    0
  );

  const totalTax = data.reduce(
    (sum, row) => sum + num(row.tax),
    0
  );

  const grossTotal = data.reduce(
    (sum, row) => sum + num(row.total),
    0
  );

  const paidInvoices = data.filter(
    (row) => row.status === "Paid"
  );

  const amountPaid = paidInvoices.reduce(
    (sum, row) => sum + num(row.total),
    0
  );

  // PDF exports all report rows in selected order
  const handleDownload = () => {
    const headers = [
      "INVOICE NO",
      "CUSTOMER",
      "DATE",
      "AMOUNT",
      "TAX",
      "TOTAL",
      "STATUS",
    ];

    const tableData = sortedData.map((row) => [
      row.id,
      row.customer,
      row.date,
      `Rs. ${money(row.amount)}`,
      `Rs. ${money(row.tax)}`,
      `Rs. ${money(row.total)}`,
      row.status,
    ]);

    exportTableToPDF(
      "Invoice Register Report",
      headers,
      tableData,
      "Invoice_Report.pdf"
    );
  };

  const stats = [
    {
      label: "TOTAL INVOICED",
      value: totalAmount,
      detail: "Net amount",
      icon: <FiFileText size={20} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "TOTAL TAX",
      value: totalTax,
      detail: "GST collected",
      icon: <FiFileText size={20} />,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "GROSS TOTAL",
      value: grossTotal,
      detail: "Incl. taxes",
      icon: <FiDollarSign size={20} />,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "AMOUNT PAID",
      value: amountPaid,
      detail: `${paidInvoices.length} invoices cleared`,
      icon: <FiCreditCard size={20} />,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  const columns = [
    ["id", "INVOICE NO"],
    ["customer", "CUSTOMER"],
    ["date", "DATE"],
    ["amount", "AMOUNT"],
    ["tax", "TAX"],
    ["total", "TOTAL"],
    ["status", "STATUS"],
  ];

  return (
    <div className="w-full space-y-5 sm:space-y-6">

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
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

            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
              ₹{money(stat.value)}
            </h3>

            <p className="flex items-center gap-1 text-xs text-green-600 mt-3">
              <FiTrendingUp />
              {stat.detail}
            </p>
          </div>
        ))}
      </div>

      {/* Invoice Register */}
      <div className="bg-white border border-[#00000026] rounded-xl overflow-hidden shadow-sm">

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 p-4 sm:p-6 border-b">

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Invoice Register
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              View and manage invoice report details
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
              onClick={handleDownload}
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
              {columns.map(([key, label]) => (
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
          <p className="py-12 text-center text-gray-500">
            Loading invoices...
          </p>
        ) : data.length === 0 ? (
          <p className="py-12 text-center text-gray-500">
            No data available.
          </p>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-[#F8F9FB] text-xs uppercase text-gray-400 font-bold border-b">
                  <tr>
                    {columns.map(([key, label]) => (
                      <th
                        key={key}
                        onClick={() => handleSort(key)}
                        className={`px-4 py-4 cursor-pointer hover:bg-gray-100 ${
                          key === "customer"
                            ? "text-left"
                            : "text-center"
                        }`}
                      >
                        {label}
                        {getSortLabel(key)}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {currentData.map((row, index) => (
                    <tr
                      key={row.id ?? index}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-5 font-medium text-blue-500">
                        {row.id}
                      </td>

                      <td className="px-4 py-5 font-medium text-gray-900">
                        {row.customer}
                      </td>

                      <td className="px-4 py-5 text-center whitespace-nowrap">
                        {row.date}
                      </td>

                      <td className="px-4 py-5 text-center whitespace-nowrap">
                        ₹{money(row.amount)}
                      </td>

                      <td className="px-4 py-5 text-center whitespace-nowrap">
                        ₹{money(row.tax)}
                      </td>

                      <td className="px-4 py-5 font-bold text-gray-900 text-center whitespace-nowrap">
                        ₹{money(row.total)}
                      </td>

                      <td className="px-4 py-5 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${statusStyle(
                            row.status
                          )}`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden p-3 sm:p-4 space-y-3">
              {currentData.map((row, index) => (
                <div
                  key={row.id ?? index}
                  className="border border-gray-200 rounded-xl p-4 space-y-4"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400">
                        Invoice No
                      </p>

                      <h3 className="font-bold text-blue-500 break-words">
                        {row.id}
                      </h3>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyle(
                        row.status
                      )}`}
                    >
                      {row.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400">
                        Customer
                      </p>
                      <p className="font-medium break-words">
                        {row.customer}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Date
                      </p>
                      <p className="font-medium">
                        {row.date}
                      </p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">
                        Amount
                      </p>
                      <p className="font-semibold">
                        ₹{money(row.amount)}
                      </p>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">
                        Tax
                      </p>
                      <p className="font-semibold">
                        ₹{money(row.tax)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t pt-3">
                    <span className="text-xs text-gray-500 font-bold">
                      TOTAL
                    </span>

                    <span className="font-bold text-gray-900">
                      ₹{money(row.total)}
                    </span>
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
