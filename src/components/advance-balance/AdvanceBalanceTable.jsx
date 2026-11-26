
import React, { useState } from "react";
import { FiDownload } from "react-icons/fi";

import { exportTableToPDF } from "../../utils/pdfGenerator";
import Pagination from "../common/Pagination";
import SortDropdown from "../common/SortDropdown";

import {
  sortRecords,
  getAvailableSortFields,
} from "../../utils/sortUtils";

const money = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const getUtilisationColor = (percent) => {
  const value = Number(percent || 0);

  if (value >= 90) return "bg-red-500";
  if (value >= 70) return "bg-orange-500";
  return "bg-green-500";
};

function UtilisationBar({ percent = 0 }) {
  const value = Math.max(
    0,
    Math.min(100, Number(percent) || 0)
  );

  return (
    <div className="flex items-center gap-3 w-full min-w-0">
      <div className="flex-1 min-w-0 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getUtilisationColor(percent)}`}
          style={{ width: `${value}%` }}
        />
      </div>

      <span className="text-xs font-bold text-gray-500 min-w-[40px] text-right">
        {percent}%
      </span>
    </div>
  );
}

export default function AdvanceBalanceTable({
  balances = [],
  loading = false,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("high");

  const itemsPerPage = 10;

  const sortingConfig = {
    nameKeys: ["customer_name"],
    dateKeys: ["last_tx"],
    amountKeys: ["balance"],
    idKeys: ["customer_id", "id"],
  };

  const availableSort = getAvailableSortFields(
    balances,
    sortingConfig
  );

  const sortedBalances = sortRecords(
    balances,
    sortBy,
    sortingConfig
  );

  const totalPages = Math.max(
    1,
    Math.ceil(sortedBalances.length / itemsPerPage)
  );

  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;

  const currentBalances = sortedBalances.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Export the complete sorted dataset, not one page
  const handleDownloadPDF = () => {
    const headers = [
      "CUSTOMER",
      "ADVANCE RECEIVED",
      "CONSUMED",
      "BALANCE",
      "UTILISATION %",
      "LAST TRANSACTION",
    ];

    const data = sortedBalances.map((row) => [
      row.customer_name || "",
      `Rs. ${money(row.received)}`,
      `Rs. ${money(row.consumed)}`,
      `Rs. ${money(row.balance)}`,
      `${row.percent || 0}%`,
      row.last_tx || "",
    ]);

    exportTableToPDF(
      "Advance Balances",
      headers,
      data,
      "Advance_Balances.pdf"
    );
  };

  return (
    <div className="bg-white border border-[#00000026] rounded-xl overflow-hidden mt-6">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center p-4 sm:p-6 border-b border-[#00000026] gap-4">

        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-[#4B5EAA]">
            Advance Balance Details
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            {sortedBalances.length} customer balances
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">

          <SortDropdown
            value={sortBy}
            onChange={(value) => {
              setSortBy(value);
              setCurrentPage(1);
            }}
            allowDate={availableSort.allowDate}
            allowAmount={availableSort.allowAmount}
          />

          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={loading || sortedBalances.length === 0}
            className="flex items-center justify-center gap-2 bg-red-100 text-red-500 px-4 py-2.5 rounded-lg font-semibold hover:bg-red-200 transition cursor-pointer w-full sm:w-auto disabled:opacity-50"
          >
            <FiDownload />
            PDF
          </button>
        </div>
      </div>

      {/* Loading / Empty */}
      {loading ? (
        <div className="px-4 py-10 text-center text-gray-500">
          Loading balances...
        </div>
      ) : sortedBalances.length === 0 ? (
        <div className="px-4 py-10 text-center text-gray-500">
          No balance records found.
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm text-gray-600">

              <thead className="bg-[#F8F9FB] text-xs uppercase text-gray-400 font-bold border-b border-[#00000026]">
                <tr>
                  <th className="px-6 py-4">
                    CUSTOMER
                  </th>
                  <th className="px-6 py-4">
                    ADVANCE RECEIVED
                  </th>
                  <th className="px-6 py-4">
                    CONSUMED
                  </th>
                  <th className="px-6 py-4">
                    BALANCE
                  </th>
                  <th className="px-6 py-4">
                    UTILISATION %
                  </th>
                  <th className="px-6 py-4">
                    LAST TRANSACTION
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#00000026]">
                {currentBalances.map((row, idx) => (
                  <tr
                    key={row.customer_id ?? row.id ?? idx}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-[#4B5EAA]">
                      {row.customer_name}
                    </td>

                    <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                      ₹ {money(row.received)}
                    </td>

                    <td className="px-6 py-4">
                      <span className="bg-gray-200 text-gray-700 font-bold px-3 py-1 rounded-full text-xs whitespace-nowrap">
                        ₹ {money(row.consumed)}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-bold text-green-500 whitespace-nowrap">
                      ₹ {money(row.balance)}
                    </td>

                    <td className="px-6 py-4 min-w-[180px]">
                      <UtilisationBar percent={row.percent} />
                    </td>

                    <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                      {row.last_tx || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden p-3 sm:p-4 space-y-3">
            {currentBalances.map((row, idx) => (
              <div
                key={row.customer_id ?? row.id ?? idx}
                className="border border-gray-200 rounded-xl p-4 space-y-4 hover:bg-gray-50 transition"
              >
                {/* Customer */}
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 font-semibold uppercase">
                      Customer
                    </p>

                    <h3 className="font-bold text-[#4B5EAA] text-base break-words mt-1">
                      {row.customer_name}
                    </h3>
                  </div>

                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md whitespace-nowrap">
                    #{startIndex + idx + 1}
                  </span>
                </div>

                {/* Amount Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 min-w-0">
                    <p className="text-xs text-gray-500 mb-1">
                      Advance Received
                    </p>

                    <p className="font-bold text-gray-900 text-sm break-words">
                      ₹ {money(row.received)}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 min-w-0">
                    <p className="text-xs text-gray-500 mb-1">
                      Consumed
                    </p>

                    <p className="font-bold text-gray-700 text-sm break-words">
                      ₹ {money(row.consumed)}
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-3 col-span-2">
                    <p className="text-xs text-gray-500 mb-1">
                      Remaining Balance
                    </p>

                    <p className="font-bold text-green-600 text-base break-words">
                      ₹ {money(row.balance)}
                    </p>
                  </div>
                </div>

                {/* Utilisation */}
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-2">
                    Utilisation
                  </p>

                  <UtilisationBar percent={row.percent} />
                </div>

                {/* Last Transaction */}
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-400 font-semibold uppercase">
                    Last Transaction
                  </p>

                  <p className="text-sm font-bold text-gray-900 mt-1">
                    {row.last_tx || "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {!loading && sortedBalances.length > 0 && (
        <div className="border-t border-[#00000026]">
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
