
import React, { useState, useEffect } from "react";

import {
  FiEdit2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import SortDropdown from "../common/SortDropdown";

import {
  sortRecords,
  getAvailableSortFields,
} from "../../utils/sortUtils";

const getStatusStyle = (status) => {
  switch (status) {
    case "Cutting":
      return "bg-blue-100 text-blue-600";
    case "Ready":
      return "bg-purple-100 text-purple-600";
    case "Pending":
      return "bg-orange-100 text-orange-500";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getDisplayItems = (order) =>
  order.items && order.items.length > 0
    ? order.items
    : [
        {
          chicken_type: order.chicken_type,
          weight: order.weight,
        },
      ];

const getChickenTypes = (items) =>
  [
    ...new Set(
      items
        .map((item) => item.chicken_type)
        .filter(Boolean)
    ),
  ].join(" + ");

const getTotalWeight = (items) =>
  items.reduce(
    (sum, item) =>
      sum + Number(item.weight || 0),
    0
  );

export default function CuttingTable({
  orders = [],
  loading = false,
  onEdit,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("az");

  const rowsPerPage = 10;

  const sortingConfig = {
    nameKeys: ["customer"],
    dateKeys: [
      "created_at",
      "order_date",
      "delivery_date",
    ],
    amountKeys: [],
    idKeys: ["id", "order_number"],
  };

  const availableSort = getAvailableSortFields(
    orders,
    sortingConfig
  );

  // Sort the entire dataset before pagination
  const sortedOrders = sortRecords(
    orders,
    sortBy,
    sortingConfig
  );

  const totalPages = Math.max(
    1,
    Math.ceil(sortedOrders.length / rowsPerPage)
  );

  const safePage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safePage - 1) * rowsPerPage;

  const paginatedOrders = sortedOrders.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const startItem =
    sortedOrders.length === 0
      ? 0
      : startIndex + 1;

  const endItem = Math.min(
    safePage * rowsPerPage,
    sortedOrders.length
  );

  // Reset pagination when sorting changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, orders.length]);

  return (
    <div className="mt-4 sm:mt-6 w-full min-w-0 bg-white border border-[#00000026] rounded-xl overflow-hidden">

      {/* Sorting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-5 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Cutting Order Records
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            Showing {sortedOrders.length} orders
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

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[750px] text-left text-sm text-gray-600">

          <thead className="bg-[#F8F9FB] text-xs uppercase text-gray-400 font-bold border-b border-[#00000026]">
            <tr>
              <th className="px-6 py-4">ORDER</th>
              <th className="px-6 py-4">CUSTOMER</th>
              <th className="px-6 py-4">TYPE</th>
              <th className="px-6 py-4">WEIGHT</th>
              <th className="px-6 py-4 text-center">
                STATUS
              </th>
              <th className="px-6 py-4 text-center">
                ACTION
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#00000026]">
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  Loading orders...
                </td>
              </tr>
            ) : paginatedOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order) => {
                const items = getDisplayItems(order);
                const types = getChickenTypes(items);
                const weight = getTotalWeight(items);

                return (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {order.order_number}
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-900">
                      {order.customer}
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-900">
                      {types || "-"}
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {weight} Kg
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => onEdit?.(order)}
                        className="text-gray-600 hover:text-[#4B5EAA] transition"
                        aria-label={`Edit order ${order.order_number}`}
                      >
                        <FiEdit2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-[#00000026]">
        {loading ? (
          <div className="px-4 py-10 text-center text-gray-500 text-sm">
            Loading orders...
          </div>
        ) : paginatedOrders.length === 0 ? (
          <div className="px-4 py-10 text-center text-gray-500 text-sm">
            No orders found.
          </div>
        ) : (
          paginatedOrders.map((order) => {
            const items = getDisplayItems(order);
            const types = getChickenTypes(items);
            const weight = getTotalWeight(items);

            return (
              <div
                key={order.id}
                className="p-4 space-y-3"
              >
                {/* Order Number and Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 font-medium">
                      ORDER
                    </p>

                    <h3 className="text-sm font-bold text-gray-900 break-words">
                      {order.order_number}
                    </h3>
                  </div>

                  <span
                    className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Customer */}
                <div>
                  <p className="text-xs text-gray-400 mb-1">
                    Customer
                  </p>

                  <p className="text-sm font-semibold text-gray-800 break-words">
                    {order.customer}
                  </p>
                </div>

                {/* Chicken Type and Weight */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 mb-1">
                      Chicken Type
                    </p>

                    <p className="text-sm font-medium text-gray-800 break-words">
                      {types || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      Total Weight
                    </p>

                    <p className="text-sm font-semibold text-gray-900">
                      {weight} Kg
                    </p>
                  </div>
                </div>

                {/* Action */}
                <div className="flex justify-end pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => onEdit?.(order)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#465C8F] text-white text-sm font-medium hover:bg-[#384C79] transition"
                  >
                    <FiEdit2 size={15} />
                    Edit Order
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Existing Numbered Pagination */}
      {!loading &&
        sortedOrders.length > 0 &&
        totalPages > 1 && (
          <div className="px-4 sm:px-6 py-4 border-t border-[#00000026] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <span className="text-xs sm:text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-900">
                {startItem}
              </span>{" "}
              to{" "}
              <span className="font-medium text-gray-900">
                {endItem}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-900">
                {sortedOrders.length}
              </span>{" "}
              orders
            </span>

            <div className="flex items-center justify-center sm:justify-end gap-2 min-w-0">

              {/* Previous Page */}
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.max(1, page - 1)
                  )
                }
                disabled={safePage === 1}
                className="shrink-0 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                aria-label="Previous page"
              >
                <FiChevronLeft className="text-gray-600" />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1 overflow-x-auto max-w-[190px] sm:max-w-[280px] px-1">
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    type="button"
                    key={page}
                    onClick={() =>
                      setCurrentPage(page)
                    }
                    className={`shrink-0 w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      safePage === page
                        ? "bg-[#465C8F] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    aria-label={`Go to page ${page}`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next Page */}
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(totalPages, page + 1)
                  )
                }
                disabled={safePage === totalPages}
                className="shrink-0 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                aria-label="Next page"
              >
                <FiChevronRight className="text-gray-600" />
              </button>
            </div>
          </div>
        )}
    </div>
  );
}
