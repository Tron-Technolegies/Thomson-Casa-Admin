
import { useEffect, useState } from "react";
import {
  FiTrash2,
  FiEdit2,
  FiEye,
} from "react-icons/fi";

import Pagination from "../common/Pagination";
import SortDropdown from "../common/SortDropdown";

import {
  sortRecords,
  getAvailableSortFields,
} from "../../utils/sortUtils";

const getTypeColor = (type) => {
  switch (type?.toLowerCase()) {
    case "wholesale":
      return "bg-purple-100 text-purple-700";
    case "regular":
      return "bg-blue-100 text-blue-700";
    case "new_customer":
      return "bg-indigo-100 text-indigo-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusColor = (status) =>
  status?.toLowerCase() === "active"
    ? "bg-green-100 text-green-700"
    : "bg-gray-100 text-gray-600";

const getScoreColor = (score) => {
  if (score >= 85)
    return "bg-green-100 text-green-700";
  if (score >= 70)
    return "bg-blue-100 text-blue-700";
  if (score >= 55)
    return "bg-yellow-100 text-yellow-700";
  if (score >= 40)
    return "bg-orange-100 text-orange-700";

  return "bg-red-100 text-red-700";
};

const getCategoryColor = (category) => {
  switch (category) {
    case "Excellent":
      return "bg-green-100 text-green-700";
    case "Good":
      return "bg-blue-100 text-blue-700";
    case "Watch Carefully":
      return "bg-yellow-100 text-yellow-700";
    case "Reduce Credit":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-red-100 text-red-700";
  }
};

export default function CustomerTable({
  customers = [],
  loading,
  onPreview,
  onEdit,
  onDelete,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("az");

  const itemsPerPage = 10;

  const sortingConfig = {
    nameKeys: ["customer_name"],
    dateKeys: ["created_at", "date_joined"],
    amountKeys: [],
    idKeys: ["id"],
  };

  const availableSort = getAvailableSortFields(
    customers,
    sortingConfig
  );

  const sortedCustomers = sortRecords(
    customers,
    sortBy,
    sortingConfig
  );

  const totalPages = Math.max(
    1,
    Math.ceil(sortedCustomers.length / itemsPerPage)
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const currentCustomers = sortedCustomers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const renderScore = (cust) => (
    <div className="flex flex-col items-center gap-2">
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreColor(
          cust.performance_score
        )}`}
      >
        {cust.performance_score ?? 0} / 100
      </span>

      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
          cust.performance_category
        )}`}
      >
        {cust.performance_category || "High Risk"}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col w-full min-w-0 max-w-full">

      {/* SORTING HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white border border-gray-200 rounded-t-xl p-4">

        <div className="min-w-0">
          <h2 className="font-semibold text-lg text-gray-900">
            Customer Records
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Showing {sortedCustomers.length} customers
          </p>
        </div>

        <SortDropdown
          value={sortBy}
          onChange={(value) => {
            setSortBy(value);
            setCurrentPage(1);
          }}
          allowDate={availableSort.allowDate}
          allowAmount={false}
        />
      </div>

      {/* DESKTOP AND TABLET */}
      <div className="hidden md:block w-full overflow-x-auto rounded-lg">

        <table className="w-full min-w-[950px] text-left text-sm text-gray-600">

          <thead className="bg-[#F7F7F7] text-xs uppercase text-gray-500 font-semibold border-b border-[#00000026]">
            <tr>
              <th className="px-5 py-4">CUSTOMER</th>
              <th className="px-5 py-4">COMPANY</th>
              <th className="px-5 py-4">PHONE</th>
              <th className="px-5 py-4">ADDRESS</th>
              <th className="px-5 py-4 text-center">
                SCORE
              </th>
              <th className="px-5 py-4 text-center">
                CUSTOMER TYPE
              </th>
              <th className="px-5 py-4 text-center">
                STATUS
              </th>
              <th className="px-5 py-4 text-center">
                ACTION
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  Loading customers...
                </td>
              </tr>
            ) : sortedCustomers.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No customers found.
                </td>
              </tr>
            ) : (
              currentCustomers.map((cust) => (
                <tr
                  key={cust.id}
                  onClick={() => onPreview?.(cust)}
                  className="hover:bg-gray-50 cursor-pointer transition"
                >
                  <td className="px-5 py-4 font-medium text-gray-900">
                    {cust.customer_name}
                  </td>

                  <td className="px-5 py-4">
                    {cust.company_name}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    {cust.phone}
                  </td>

                  <td
                    className="px-5 py-4 truncate max-w-[150px]"
                    title={cust.address}
                  >
                    {cust.address}
                  </td>

                  <td className="px-5 py-4 text-center">
                    {renderScore(cust)}
                  </td>

                  <td className="px-5 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getTypeColor(
                        cust.customer_type
                      )}`}
                    >
                      {cust.customer_type?.replaceAll("_", " ")}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                        cust.status
                      )}`}
                    >
                      {cust.status}
                    </span>
                  </td>

                  <td
                    className="px-5 py-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        title="Delete customer"
                        onClick={() => onDelete?.(cust.id)}
                        className="text-gray-500 hover:text-red-600 transition"
                      >
                        <FiTrash2 size={18} />
                      </button>

                      <button
                        type="button"
                        title="Edit customer"
                        onClick={() => onEdit?.(cust)}
                        className="text-gray-500 hover:text-[#465C8F] transition"
                      >
                        <FiEdit2 size={18} />
                      </button>

                      <button
                        type="button"
                        title="View customer"
                        onClick={() => onPreview?.(cust)}
                        className="text-gray-500 hover:text-[#465C8F] transition"
                      >
                        <FiEye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE CUSTOMER CARDS */}
      <div className="md:hidden p-3 space-y-3">

        {loading ? (
          <div className="py-10 text-center text-gray-500">
            Loading customers...
          </div>
        ) : currentCustomers.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            No customers found.
          </div>
        ) : (
          currentCustomers.map((cust) => (
            <div
              key={cust.id}
              onClick={() => onPreview?.(cust)}
              className="w-full min-w-0 border border-gray-200 rounded-xl bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">
                    Customer
                  </p>

                  <h3 className="font-semibold text-gray-900 break-words">
                    {cust.customer_name}
                  </h3>

                  <p className="text-sm text-gray-500 break-words">
                    {cust.company_name || "—"}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                    cust.status
                  )}`}
                >
                  {cust.status || "—"}
                </span>
              </div>

              <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">
                    Phone
                  </p>
                  <p className="text-sm text-gray-800 break-all">
                    {cust.phone || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1">
                    Customer Type
                  </p>

                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${getTypeColor(
                      cust.customer_type
                    )}`}
                  >
                    {cust.customer_type?.replaceAll("_", " ") || "—"}
                  </span>
                </div>

                <div className="min-[400px]:col-span-2 min-w-0">
                  <p className="text-xs text-gray-400 mb-1">
                    Address
                  </p>

                  <p className="text-sm text-gray-800 break-words">
                    {cust.address || "—"}
                  </p>
                </div>

                <div className="min-[400px]:col-span-2">
                  <p className="text-xs text-gray-400 mb-2">
                    Customer Performance
                  </p>

                  {renderScore(cust)}
                </div>
              </div>

              <div
                className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-gray-100"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => onPreview?.(cust)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#465C8F] bg-blue-50 rounded-lg"
                >
                  <FiEye size={15} />
                  View
                </button>

                <button
                  type="button"
                  onClick={() => onEdit?.(cust)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg"
                >
                  <FiEdit2 size={15} />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => onDelete?.(cust.id)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 rounded-lg"
                >
                  <FiTrash2 size={15} />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PAGINATION */}
      {!loading && sortedCustomers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
