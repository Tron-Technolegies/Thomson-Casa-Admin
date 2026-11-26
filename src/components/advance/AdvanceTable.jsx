
import React, { useState } from "react";
import { FiDownload } from "react-icons/fi";
import { FaMoneyBillWave, FaUniversity } from "react-icons/fa";
import { BiMoney } from "react-icons/bi";

import { exportTableToPDF } from "../../utils/pdfGenerator";
import Pagination from "../common/Pagination";
import SortDropdown from "../common/SortDropdown";

import {
  sortRecords,
  getAvailableSortFields,
} from "../../utils/sortUtils";

const getMethodIcon = (method) => {
  switch (method) {
    case "Bank Transfer":
      return <FaUniversity className="text-gray-500 mr-2 shrink-0" />;

    case "Cheque":
      return <FiDownload className="text-gray-500 mr-2 shrink-0" />;

    case "UPI":
      return (
        <span className="font-bold text-gray-500 mr-2 shrink-0">
          $
        </span>
      );

    default:
      return <FaMoneyBillWave className="text-gray-500 mr-2 shrink-0" />;
  }
};

const formatAmount = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function AdvanceTable({
  advances = [],
  loading = false,
  onRecordAdvance,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");

  const itemsPerPage = 10;

  // Field mapping based on existing Admin advance API
  const sortingConfig = {
    nameKeys: ["customer"],
    dateKeys: ["created_at", "date"],
    amountKeys: ["amount"],
    idKeys: ["id"],
  };

  const availableSort = getAvailableSortFields(
    advances,
    sortingConfig
  );

  // Sorting happens before pagination
  const sortedAdvances = sortRecords(
    advances,
    sortBy,
    sortingConfig
  );

  const totalPages = Math.max(
    1,
    Math.ceil(sortedAdvances.length / itemsPerPage)
  );

  const safePage = Math.min(currentPage, totalPages);

  const startIndex = (safePage - 1) * itemsPerPage;

  const currentAdvances = sortedAdvances.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // PDF uses exactly the same sorted dataset
  const handleDownloadPDF = () => {
    const headers = [
      "ID",
      "CUSTOMER",
      "AMOUNT",
      "PAYMENT METHOD",
      "REFERENCE",
      "DATE",
      "NOTE",
    ];

    const data = sortedAdvances.map((row) => [
      row.id,
      row.customer,
      `Rs. ${formatAmount(row.amount)}`,
      row.payment_method,
      row.reference_no || "",
      row.date || "",
      row.note || "",
    ]);

    exportTableToPDF(
      "Advance Records",
      headers,
      data,
      "Advance_Records.pdf"
    );
  };

  return (
    <div className="mt-4 sm:mt-6 bg-white border border-[#00000026] rounded-xl overflow-hidden">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center p-4 sm:p-6 border-b border-[#00000026] gap-4">

        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-[#4B5EAA]">
            Records
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            Showing {sortedAdvances.length} advance records
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center w-full lg:w-auto gap-3">

          {/* Sorting */}
          <SortDropdown
            value={sortBy}
            onChange={(value) => {
              setSortBy(value);
              setCurrentPage(1);
            }}
            allowDate={availableSort.allowDate}
            allowAmount={availableSort.allowAmount}
          />

          {/* Record Advance */}
          <button
            type="button"
            onClick={onRecordAdvance}
            className="flex items-center justify-center gap-2 bg-[#4B5EAA] cursor-pointer text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#3d4f92] transition w-full sm:w-auto"
          >
            <BiMoney size={20} />
            Record Advance
          </button>

          {/* Download sorted PDF */}
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={loading || sortedAdvances.length === 0}
            className="flex items-center justify-center gap-2 cursor-pointer bg-red-100 text-red-500 px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-red-200 transition w-full sm:w-auto disabled:opacity-50"
          >
            <FiDownload />
            PDF
          </button>
        </div>
      </div>

      {/* Desktop / Tablet */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[950px] text-left text-sm text-gray-600">
          <thead className="bg-[#F8F9FB] text-xs uppercase text-gray-400 font-bold border-b border-[#00000026]">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">CUSTOMER</th>
              <th className="px-6 py-4 text-right">
                AMOUNT (₹)
              </th>
              <th className="px-6 py-4">
                PAYMENT METHOD
              </th>
              <th className="px-6 py-4">
                REFERENCE
              </th>
              <th className="px-6 py-4">
                DATE
              </th>
              <th className="px-6 py-4">
                NOTE
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#00000026]">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  Loading advances...
                </td>
              </tr>
            ) : sortedAdvances.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No advances recorded yet.
                </td>
              </tr>
            ) : (
              currentAdvances.map((row, idx) => (
                <tr
                  key={row.id ?? idx}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {row.id}
                  </td>

                  <td className="px-6 py-4 font-medium text-gray-900">
                    {row.customer}
                  </td>

                  <td className="px-6 py-4 font-bold text-gray-900 text-right whitespace-nowrap">
                    ₹ {formatAmount(row.amount)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center bg-gray-100 px-3 py-1.5 rounded-lg w-fit text-sm font-semibold whitespace-nowrap">
                      {getMethodIcon(row.payment_method)}
                      {row.payment_method}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {row.reference_no || "—"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {row.date || "—"}
                  </td>

                  <td className="px-6 py-4">
                    {row.note || "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-[#00000026]">
        {loading ? (
          <div className="px-4 py-10 text-center text-sm text-gray-500">
            Loading advances...
          </div>
        ) : sortedAdvances.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-gray-500">
            No advances recorded yet.
          </div>
        ) : (
          currentAdvances.map((row, idx) => (
            <div
              key={row.id ?? idx}
              className="p-4 space-y-4"
            >
              {/* ID and Amount */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 font-medium">
                    ADVANCE ID
                  </p>

                  <h3 className="text-sm font-bold text-gray-900">
                    #{row.id}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-400 font-medium">
                    AMOUNT
                  </p>

                  <p className="text-base font-bold text-gray-900">
                    ₹ {formatAmount(row.amount)}
                  </p>
                </div>
              </div>

              {/* Customer */}
              <div>
                <p className="text-xs text-gray-400 mb-1">
                  Customer
                </p>

                <p className="text-sm font-semibold text-gray-800 break-words">
                  {row.customer}
                </p>
              </div>

              {/* Payment Method and Date */}
              <div className="grid grid-cols-2 gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 mb-2">
                    Payment Method
                  </p>

                  <div className="inline-flex items-center bg-gray-100 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-700 max-w-full">
                    {getMethodIcon(row.payment_method)}

                    <span className="break-words">
                      {row.payment_method}
                    </span>
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-400 mb-1">
                    Date
                  </p>

                  <p className="text-sm font-medium text-gray-800 break-words">
                    {row.date || "—"}
                  </p>
                </div>
              </div>

              {/* Reference */}
              <div>
                <p className="text-xs text-gray-400 mb-1">
                  Reference
                </p>

                <p className="text-sm text-gray-700 break-all">
                  {row.reference_no || "—"}
                </p>
              </div>

              {/* Note */}
              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs text-gray-400 mb-1">
                  Note
                </p>

                <p className="text-sm text-gray-700 break-words">
                  {row.note || "—"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && sortedAdvances.length > 0 && (
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
