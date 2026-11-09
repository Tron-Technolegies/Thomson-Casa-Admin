
import React, { useState, useEffect } from "react";
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

export default function InvoiceReport({ period = "Daily" }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);

      try {
        const res = await api.get(`/admin/invoices/?period=${period}`);

        if (res.success) {
          setData(res.invoices || []);
          setCurrentPage(1);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [period]);

  const handleSort = (key) => {
    let direction = "asc";

    if (
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }

    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const sortedData = [...data].sort((a, b) => {
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

  const totalAmount = data.reduce(
    (sum, item) => sum + parseFloat(item.amount || 0),
    0
  );

  const totalTax = data.reduce(
    (sum, item) => sum + parseFloat(item.tax || 0),
    0
  );

  const grossTotal = data.reduce(
    (sum, item) => sum + parseFloat(item.total || 0),
    0
  );

  const paidInvoices = data.filter((i) => i.status === "Paid");

  const amountPaid = paidInvoices.reduce(
    (sum, item) => sum + parseFloat(item.total || 0),
    0
  );

  const formatAmount = (amount) =>
    `₹ ${parseFloat(amount || 0).toLocaleString()}`;

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

    const tableData = data.map((row) => [
      row.id,
      row.customer,
      row.date,
      `Rs. ${parseFloat(row.amount || 0).toLocaleString()}`,
      `Rs. ${parseFloat(row.tax || 0).toLocaleString()}`,
      `Rs. ${parseFloat(row.total || 0).toLocaleString()}`,
      row.status,
    ]);

    exportTableToPDF(
      "Invoice Register Report",
      headers,
      tableData,
      "Invoice_Report.pdf"
    );
  };

  const getStatusStyle = (status) => {
    if (status === "Paid") {
      return "bg-green-100 text-green-600";
    }

    if (status === "Partial") {
      return "bg-yellow-100 text-yellow-600";
    }

    return "bg-red-100 text-red-500";
  };

  const SortButton = ({ label, sortKey }) => (
    <button
      type="button"
      onClick={() => handleSort(sortKey)}
      className={`px-3 py-2 rounded-lg text-xs font-semibold border transition ${
        sortConfig.key === sortKey
          ? "bg-[#4B5EAA] text-white border-[#4B5EAA]"
          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
      }`}
    >
      {label}

      {sortConfig.key === sortKey && (
        <span className="ml-1">
          {sortConfig.direction === "asc" ? "↑" : "↓"}
        </span>
      )}
    </button>
  );

  return (
    <div className="w-full space-y-5 sm:space-y-6">

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">

        {/* Total Invoiced */}
        <div className="bg-white border border-[#00000026] rounded-xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">
              TOTAL INVOICED
            </span>

            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <FiFileText size={20} />
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 break-words">
              ₹ {totalAmount.toLocaleString()}
            </h3>

            <div className="flex items-center text-green-600 text-xs font-semibold gap-1">
              <FiTrendingUp />
              Net amount
            </div>
          </div>
        </div>

        {/* Total Tax */}
        <div className="bg-white border border-[#00000026] rounded-xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">
              TOTAL TAX
            </span>

            <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600">
              <FiFileText size={20} />
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 break-words">
              ₹ {totalTax.toLocaleString()}
            </h3>

            <div className="flex items-center text-gray-500 text-xs font-semibold gap-1">
              GST collected
            </div>
          </div>
        </div>

        {/* Gross Total */}
        <div className="bg-white border border-[#00000026] rounded-xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">
              GROSS TOTAL
            </span>

            <div className="bg-green-100 p-2 rounded-lg text-green-600">
              <FiDollarSign size={20} />
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 break-words">
              ₹ {grossTotal.toLocaleString()}
            </h3>

            <div className="flex items-center text-green-600 text-xs font-semibold gap-1">
              <FiTrendingUp />
              Incl. taxes
            </div>
          </div>
        </div>

        {/* Amount Paid */}
        <div className="bg-white border border-[#00000026] rounded-xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">
              AMOUNT PAID
            </span>

            <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
              <FiCreditCard size={20} />
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 break-words">
              ₹ {amountPaid.toLocaleString()}
            </h3>

            <div className="flex items-center text-green-600 text-xs font-semibold gap-1">
              <FiTrendingUp />
              {paidInvoices.length} invoices cleared
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Register */}
      <div className="bg-white border border-[#00000026] rounded-xl overflow-hidden shadow-sm">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-4 sm:p-6 border-b border-[#00000026]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Invoice Register
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              View and manage invoice report details
            </p>
          </div>

          <button
            onClick={handleDownload}
            disabled={loading || data.length === 0}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-100 text-red-500 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-200 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiDownload size={16} />
            Download PDF
          </button>
        </div>

        {/* Mobile Sorting */}
        {!loading && data.length > 0 && (
          <div className="lg:hidden px-4 py-3 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-400 mb-2">
              SORT BY
            </p>

            <div className="flex flex-wrap gap-2">
              <SortButton label="Invoice No" sortKey="id" />
              <SortButton label="Customer" sortKey="customer" />
              <SortButton label="Date" sortKey="date" />
              <SortButton label="Amount" sortKey="amount" />
              <SortButton label="Tax" sortKey="tax" />
              <SortButton label="Total" sortKey="total" />
              <SortButton label="Status" sortKey="status" />
            </div>
          </div>
        )}

        {/* Loading and Empty States */}
        {loading ? (
          <div className="py-12 text-center text-gray-500 text-sm">
            Loading invoices...
          </div>
        ) : data.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm">
            No data available.
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-[#F8F9FB] text-xs uppercase text-gray-400 font-bold border-b border-[#00000026]">
                  <tr>
                    <th
                      className="px-6 py-4 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("id")}
                    >
                      INVOICE NO
                    </th>

                    <th
                      className="px-6 py-4 text-center cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("customer")}
                    >
                      CUSTOMER
                    </th>

                    <th
                      className="px-6 py-4 text-center cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("date")}
                    >
                      DATE
                    </th>

                    <th
                      className="px-6 py-4 text-center cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("amount")}
                    >
                      AMOUNT
                    </th>

                    <th
                      className="px-6 py-4 text-center cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("tax")}
                    >
                      TAX
                    </th>

                    <th
                      className="px-6 py-4 text-center cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("total")}
                    >
                      TOTAL
                    </th>

                    <th
                      className="px-6 py-4 text-right cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("status")}
                    >
                      STATUS
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#00000026]">
                  {currentData.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-5 font-medium text-blue-400">
                        {row.id}
                      </td>

                      <td className="px-6 py-5 font-medium text-gray-900 text-center">
                        {row.customer}
                      </td>

                      <td className="px-6 py-5 font-medium text-gray-900 text-center whitespace-nowrap">
                        {row.date}
                      </td>

                      <td className="px-6 py-5 font-medium text-gray-900 text-center whitespace-nowrap">
                        {formatAmount(row.amount)}
                      </td>

                      <td className="px-6 py-5 font-medium text-gray-900 text-center whitespace-nowrap">
                        {formatAmount(row.tax)}
                      </td>

                      <td className="px-6 py-5 font-bold text-gray-900 text-center whitespace-nowrap">
                        {formatAmount(row.total)}
                      </td>

                      <td className="px-6 py-5 text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getStatusStyle(
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

            {/* Mobile and Tablet Invoice Cards */}
            <div className="lg:hidden p-3 sm:p-4 space-y-3">
              {currentData.map((row, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white"
                >
                  {/* Invoice Header */}
                  <div className="flex justify-between items-start gap-3 mb-4">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Invoice No
                      </p>

                      <h3 className="text-sm sm:text-base font-bold text-blue-500 break-words">
                        {row.id}
                      </h3>
                    </div>

                    <span
                      className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(
                        row.status
                      )}`}
                    >
                      {row.status}
                    </span>
                  </div>

                  {/* Customer and Date */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                        Customer
                      </p>

                      <p className="text-sm font-semibold text-gray-900 break-words">
                        {row.customer}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                        Date
                      </p>

                      <p className="text-sm font-semibold text-gray-900">
                        {row.date}
                      </p>
                    </div>
                  </div>

                  {/* Amount Details */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-[10px] font-semibold text-gray-500 uppercase mb-1">
                        Amount
                      </p>

                      <p className="text-sm font-bold text-gray-900 break-words">
                        {formatAmount(row.amount)}
                      </p>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-3">
                      <p className="text-[10px] font-semibold text-gray-500 uppercase mb-1">
                        Tax
                      </p>

                      <p className="text-sm font-bold text-gray-900 break-words">
                        {formatAmount(row.tax)}
                      </p>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                    <span className="text-xs font-bold text-gray-500 uppercase">
                      Total
                    </span>

                    <span className="text-base font-bold text-gray-900">
                      {formatAmount(row.total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {!loading && data.length > 0 && (
          <div className="border-t border-gray-100">
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
