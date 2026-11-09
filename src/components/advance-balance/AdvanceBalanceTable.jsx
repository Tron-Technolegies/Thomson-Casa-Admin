
import React, { useState } from "react";
import { FiDownload } from "react-icons/fi";
import { exportTableToPDF } from "../../utils/pdfGenerator";
import Pagination from "../common/Pagination";

export default function AdvanceBalanceTable({ balances = [], loading }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(balances.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBalances = balances.slice(startIndex, startIndex + itemsPerPage);

  const handleDownloadPDF = () => {
    const headers = [
      "CUSTOMER",
      "ADVANCE RECEIVED",
      "CONSUMED",
      "BALANCE",
      "UTILISATION %",
      "LAST TRANSACTION",
    ];

    const data = balances.map((row) => [
      row.customer_name,
      `Rs. ${row.received.toLocaleString()}`,
      `Rs. ${row.consumed.toLocaleString()}`,
      `Rs. ${row.balance.toLocaleString()}`,
      `${row.percent}%`,
      row.last_tx,
    ]);

    exportTableToPDF(
      "Advance Balances",
      headers,
      data,
      "Advance_Balances.pdf"
    );
  };

  const getUtilisationColor = (percent) => {
    if (percent >= 90) return "bg-red-500";
    if (percent >= 70) return "bg-orange-500";
    return "bg-green-500";
  };

  const UtilisationBar = ({ percent }) => (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getUtilisationColor(percent)}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      <span className="text-xs font-bold text-gray-500 min-w-[40px] text-right">
        {percent}%
      </span>
    </div>
  );

  return (
    <div className="bg-white border border-[#00000026] rounded-xl overflow-hidden mt-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 border-b border-[#00000026] gap-4">
        <h2 className="text-lg sm:text-xl font-bold text-[#4B5EAA]">
          Advance Balance Details
        </h2>

        <button
          onClick={handleDownloadPDF}
          className="flex items-center justify-center gap-2 bg-red-100 text-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-red-200 transition cursor-pointer w-full sm:w-auto"
        >
          <FiDownload />
          PDF
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="px-4 py-10 text-center text-gray-500">
          Loading balances...
        </div>
      ) : balances.length === 0 ? (
        <div className="px-4 py-10 text-center text-gray-500">
          No balance records found.
        </div>
      ) : (
        <>
          {/* Desktop / Tablet Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm text-gray-600">
              <thead className="bg-[#F8F9FB] text-xs uppercase text-gray-400 font-bold border-b border-[#00000026]">
                <tr>
                  <th className="px-6 py-4">CUSTOMER</th>
                  <th className="px-6 py-4">ADVANCE RECEIVED</th>
                  <th className="px-6 py-4">CONSUMED</th>
                  <th className="px-6 py-4">BALANCE</th>
                  <th className="px-6 py-4">UTILISATION %</th>
                  <th className="px-6 py-4">LAST TRANSACTION</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#00000026]">
                {currentBalances.map((row, idx) => (
                  <tr
                    key={row.id ?? idx}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-[#4B5EAA]">
                      {row.customer_name}
                    </td>

                    <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                      ₹ {row.received.toLocaleString()}
                    </td>

                    <td className="px-6 py-4">
                      <span className="bg-gray-200 text-gray-700 font-bold px-3 py-1 rounded-full text-xs whitespace-nowrap">
                        ₹ {row.consumed.toLocaleString()}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-bold text-green-500 whitespace-nowrap">
                      ₹ {row.balance.toLocaleString()}
                    </td>

                    <td className="px-6 py-4 min-w-[180px]">
                      <UtilisationBar percent={row.percent} />
                    </td>

                    <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                      {row.last_tx}
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
                key={row.id ?? idx}
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
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">
                      Advance Received
                    </p>
                    <p className="font-bold text-gray-900 text-sm break-words">
                      ₹ {row.received.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">
                      Consumed
                    </p>
                    <p className="font-bold text-gray-700 text-sm break-words">
                      ₹ {row.consumed.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-3 col-span-2">
                    <p className="text-xs text-gray-500 mb-1">
                      Remaining Balance
                    </p>
                    <p className="font-bold text-green-600 text-base break-words">
                      ₹ {row.balance.toLocaleString()}
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
                    {row.last_tx}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {!loading && balances.length > 0 && (
        <div className="border-t border-[#00000026]">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
