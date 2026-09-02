import React, { useState } from "react";
import { FiDownload, FiPrinter } from "react-icons/fi";
import { exportTableToPDF } from "../../utils/pdfGenerator";
import Pagination from "../common/Pagination";

export default function AdvanceBalanceTable({ balances = [], loading }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(balances.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBalances = balances.slice(startIndex, startIndex + itemsPerPage);

  const handleDownloadPDF = () => {
    const headers = ["CUSTOMER", "ADVANCE RECEIVED", "CONSUMED", "BALANCE", "UTILISATION %", "LAST TRANSACTION"];
    const data = balances.map(row => [
      row.customer_name,
      `Rs. ${row.received.toLocaleString()}`,
      `Rs. ${row.consumed.toLocaleString()}`,
      `Rs. ${row.balance.toLocaleString()}`,
      `${row.percent}%`,
      row.last_tx
    ]);
    exportTableToPDF("Advance Balances", headers, data, "Advance_Balances.pdf");
  };

  return (
    <div className="bg-white border border-[#00000026] rounded-xl overflow-hidden mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-[#00000026] gap-4">
        <h2 className="text-xl font-bold text-[#4B5EAA]">Advance Balance Details</h2>
        <div className="flex flex-wrap gap-4">
          {/* <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-[#4B5EAA] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#3d4f92] transition cursor-pointer"
          >
            <FiPrinter /> Print
          </button> */}
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-red-100 text-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-red-200 transition cursor-pointer"
          >
            <FiDownload /> PDF
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
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
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">Loading balances...</td>
              </tr>
            ) : balances.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No balance records found.</td>
              </tr>
            ) : (
              currentBalances.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-[#4B5EAA]">{row.customer_name}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">₹ {row.received.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-200 text-gray-700 font-bold px-3 py-1 rounded-full text-xs">
                      ₹ {row.consumed.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-green-500">₹ {row.balance.toLocaleString()}</td>
                  <td className="px-6 py-4 w-48">
                    <div className="flex items-center gap-3">
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            row.percent >= 90
                              ? "bg-red-500"
                              : row.percent >= 70
                                ? "bg-orange-500"
                                : "bg-green-500"
                          }`}
                          style={{ width: `${Math.min(row.percent, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-400 min-w-[30px]">{row.percent}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">{row.last_tx}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {!loading && balances.length > 0 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
