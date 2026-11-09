
import React, { useState, useEffect } from "react";
import {
  FiTrendingUp,
  FiCreditCard,
  FiShoppingCart,
  FiDownload,
} from "react-icons/fi";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { api } from "../../services/api";
import { exportTableToPDF } from "../../utils/pdfGenerator";
import Pagination from "../common/Pagination";

export default function AdvanceBalanceReport({ period = "Daily" }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchBalances = async () => {
      setLoading(true);

      try {
        const res = await api.get(
          `/admin/advances/balance/?period=${period}`
        );

        if (res.success) {
          setData(res.balances || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
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

  const totalReceived = data.reduce(
    (sum, item) => sum + parseFloat(item.received || 0),
    0
  );

  const totalConsumed = data.reduce(
    (sum, item) => sum + parseFloat(item.consumed || 0),
    0
  );

  const totalBalance = data.reduce(
    (sum, item) => sum + parseFloat(item.balance || 0),
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

    const pdfData = data.map((row) => {
      const percent =
        row.received > 0
          ? Math.round((row.consumed / row.received) * 100)
          : 0;

      return [
        row.customer_name,
        `Rs. ${parseFloat(row.received).toLocaleString()}`,
        `Rs. ${parseFloat(row.consumed).toLocaleString()}`,
        `Rs. ${parseFloat(row.balance).toLocaleString()}`,
        `${percent}%`,
      ];
    });

    exportTableToPDF(
      "Advance Balance Report",
      headers,
      pdfData,
      "Advance_Balance_Report.pdf"
    );
  };

  const getUtilizationColor = (percent) => {
    if (percent >= 90) return "bg-red-500";
    if (percent >= 70) return "bg-orange-500";
    return "bg-green-500";
  };

  const formatAmount = (amount) =>
    `₹${parseFloat(amount || 0).toLocaleString()}`;

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

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* Advance Received */}
        <div className="bg-white border border-[#00000026] rounded-xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">
              ADVANCE RECEIVED
            </span>

            <div className="bg-blue-100 p-2 rounded-lg text-blue-500">
              <FiCreditCard size={20} />
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 break-words">
              ₹{totalReceived.toLocaleString()}
            </h3>

            <div className="flex items-center text-green-600 text-xs font-semibold gap-1">
              <FiTrendingUp />
              Total collected
            </div>
          </div>
        </div>

        {/* Consumed */}
        <div className="bg-white border border-[#00000026] rounded-xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">
              CONSUMED
            </span>

            <div className="bg-purple-100 p-2 rounded-lg text-purple-400">
              <FiShoppingCart size={20} />
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 break-words">
              ₹{totalConsumed.toLocaleString()}
            </h3>

            <div className="flex items-center text-gray-400 text-xs font-semibold gap-1">
              Applied to orders
            </div>
          </div>
        </div>

        {/* Remaining Balance */}
        <div className="bg-white border border-[#00000026] rounded-xl p-4 sm:p-6 shadow-sm flex flex-col justify-between sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">
              REMAINING BALANCE
            </span>

            <div className="bg-green-100 p-2 rounded-lg text-green-500">
              <MdOutlineAccountBalanceWallet size={20} />
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 break-words">
              ₹{totalBalance.toLocaleString()}
            </h3>

            <div className="flex items-center text-green-600 text-xs font-semibold gap-1">
              <FiTrendingUp />
              Available advance
            </div>
          </div>
        </div>
      </div>

      {/* Advance Balance Details */}
      <div className="bg-white border border-[#00000026] rounded-xl overflow-hidden shadow-sm">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-4 sm:p-6 border-b border-[#00000026]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Advance Balance Details
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Customer-wise advance and utilization details
            </p>
          </div>

          <button
            onClick={handleDownloadPDF}
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
              <SortButton
                label="Customer"
                sortKey="customer_name"
              />

              <SortButton
                label="Received"
                sortKey="received"
              />

              <SortButton
                label="Consumed"
                sortKey="consumed"
              />

              <SortButton
                label="Balance"
                sortKey="balance"
              />
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="py-12 text-center text-gray-500 text-sm">
            Loading advance balance details...
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
                      onClick={() => handleSort("customer_name")}
                    >
                      CUSTOMER
                    </th>

                    <th
                      className="px-6 py-4 text-center cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("received")}
                    >
                      ADVANCE RECEIVED
                    </th>

                    <th
                      className="px-6 py-4 text-center cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("consumed")}
                    >
                      CONSUMED
                    </th>

                    <th
                      className="px-6 py-4 text-center cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("balance")}
                    >
                      BALANCE
                    </th>

                    <th className="px-6 py-4 text-center">
                      UTILIZATION
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#00000026]">
                  {currentData.map((row, idx) => {
                    const percent =
                      row.received > 0
                        ? Math.round(
                            (row.consumed / row.received) * 100
                          )
                        : 0;

                    return (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-5 font-medium text-gray-900">
                          {row.customer_name}
                        </td>

                        <td className="px-6 py-5 font-medium text-gray-900 text-center">
                          {formatAmount(row.received)}
                        </td>

                        <td className="px-6 py-5 font-medium text-gray-900 text-center">
                          {formatAmount(row.consumed)}
                        </td>

                        <td className="px-6 py-5 font-bold text-[#4B5EAA] text-center">
                          {formatAmount(row.balance)}
                        </td>

                        <td className="px-6 py-5 w-48">
                          <div className="flex justify-center items-center gap-3">
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${getUtilizationColor(
                                  percent
                                )}`}
                                style={{
                                  width: `${Math.min(percent, 100)}%`,
                                }}
                              />
                            </div>

                            <span className="text-xs font-bold text-gray-400 min-w-[35px]">
                              {percent}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile and Tablet Cards */}
            <div className="lg:hidden p-3 sm:p-4 space-y-3">
              {currentData.map((row, idx) => {
                const percent =
                  row.received > 0
                    ? Math.round(
                        (row.consumed / row.received) * 100
                      )
                    : 0;

                return (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm"
                  >
                    {/* Customer Name */}
                    <div className="flex justify-between items-start gap-3 mb-4">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                          Customer
                        </p>

                        <h3 className="text-sm sm:text-base font-bold text-gray-900 break-words">
                          {row.customer_name}
                        </h3>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                          Balance
                        </p>

                        <p className="text-base sm:text-lg font-bold text-[#4B5EAA]">
                          {formatAmount(row.balance)}
                        </p>
                      </div>
                    </div>

                    {/* Received and Consumed */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-[10px] font-semibold text-gray-500 uppercase mb-1">
                          Advance Received
                        </p>

                        <p className="text-sm font-bold text-gray-900 break-words">
                          {formatAmount(row.received)}
                        </p>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-3">
                        <p className="text-[10px] font-semibold text-gray-500 uppercase mb-1">
                          Consumed
                        </p>

                        <p className="text-sm font-bold text-gray-900 break-words">
                          {formatAmount(row.consumed)}
                        </p>
                      </div>
                    </div>

                    {/* Utilization */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-gray-500">
                          Utilization
                        </span>

                        <span className="text-xs font-bold text-gray-700">
                          {percent}%
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${getUtilizationColor(
                            percent
                          )}`}
                          style={{
                            width: `${Math.min(percent, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
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
