
import React, { useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { BASE_URL } from "../../services/api";
import SortDropdown from "../common/SortDropdown";

import {
  sortRecords,
  getAvailableSortFields,
} from "../../utils/sortUtils";

const badge = {
  Paid: "bg-green-100 text-green-700",
  Partial: "bg-yellow-100 text-yellow-700",
  Unpaid: "bg-red-100 text-red-700",
};

const formatAmount = (amount) =>
  Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function RecentTransactions({
  sales = [],
  loading = false,
}) {
  const [sortBy, setSortBy] = useState("newest");

  const sortingConfig = {
    nameKeys: ["customer"],
    dateKeys: ["created_at", "date"],
    amountKeys: ["amount"],
    idKeys: ["invoice_no"],
  };

  const availableSort = getAvailableSortFields(
    sales,
    sortingConfig
  );

  // Sort all currently fetched transactions.
  const sortedSales = sortRecords(
    sales,
    sortBy,
    sortingConfig
  );

  // Show first ten after sorting.
  const recentSales = sortedSales.slice(0, 10);

  const handleDownloadPDF = () => {
    const params = new URLSearchParams({
      sort_by: sortBy,
    });

    window.open(
      `${BASE_URL}/accounts/reports/sales/pdf/?${params.toString()}`,
      "_blank"
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden w-full">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3 p-4 sm:p-6 border-b border-[#00000026]">

        <div>
          <h2 className="text-lg sm:text-2xl font-semibold text-gray-900">
            Recent Transactions
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            Showing {recentSales.length} of{" "}
            {sales.length} transactions
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">

          {/* Common Sort */}
          <SortDropdown
            value={sortBy}
            onChange={setSortBy}
            allowDate={availableSort.allowDate}
            allowAmount={availableSort.allowAmount}
          />

          {/* PDF */}
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={loading || recentSales.length === 0}
            className="w-full sm:w-auto flex items-center justify-center bg-red-100 text-red-500 px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-red-200 transition cursor-pointer disabled:opacity-50"
          >
            <FaFilePdf className="mr-2" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-10 text-gray-500 text-sm">
          Loading transactions...
        </div>
      ) : recentSales.length === 0 ? (
        <div className="text-center py-10 text-gray-500 text-sm">
          No transactions found.
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm">
                <tr>
                  <th className="p-4 font-semibold">
                    Invoice No
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
                {recentSales.map((item, index) => (
                  <tr
                    key={item.invoice_no ?? index}
                    className="border-t border-[#00000026] hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-bold text-[#4B5EAA]">
                      {item.invoice_no}
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
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                          badge[item.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden p-3 sm:p-4 space-y-3">
            {recentSales.map((item, index) => (
              <div
                key={item.invoice_no ?? index}
                className="border border-gray-200 rounded-xl p-4 shadow-sm hover:bg-gray-50 transition"
              >

                {/* Invoice & Status */}
                <div className="flex justify-between items-start gap-3 mb-4">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Invoice No
                    </p>

                    <h3 className="text-sm font-bold text-[#4B5EAA] break-words">
                      {item.invoice_no}
                    </h3>
                  </div>

                  <span
                    className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold ${
                      badge[item.status] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Customer & Date */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                      Customer
                    </p>

                    <p className="text-sm font-medium text-gray-800 break-words">
                      {item.customer}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                      Date
                    </p>

                    <p className="text-sm text-gray-600 break-words">
                      {item.date}
                    </p>
                  </div>
                </div>

                {/* Amount */}
                <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                  <span className="text-xs font-bold text-gray-400 uppercase">
                    Amount
                  </span>

                  <span className="text-base font-bold text-gray-900">
                    ₹{formatAmount(item.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default RecentTransactions;
