
import React, { useState, useEffect } from "react";
import {
  FiEdit2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

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

export default function CuttingTable({ orders = [], loading, onEdit }) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const totalPages = Math.ceil(orders.length / rowsPerPage);

  const paginatedOrders = orders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [orders.length]);

  const getDisplayItems = (order) => {
    return order.items && order.items.length > 0
      ? order.items
      : [{ chicken_type: order.chicken_type, weight: order.weight }];
  };

  const getChickenTypes = (items) => {
    return [...new Set(items.map((i) => i.chicken_type))].join(" + ");
  };

  const getTotalWeight = (items) => {
    return items.reduce(
      (sum, item) => sum + Number(item.weight || 0),
      0
    );
  };

  const startItem = (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, orders.length);

  return (
    <div className="mt-4 sm:mt-6 bg-white border border-[#00000026] rounded-xl overflow-hidden">

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[750px] text-left text-sm text-gray-600">
          <thead className="bg-[#F8F9FB] text-xs uppercase text-gray-400 font-bold border-b border-[#00000026]">
            <tr>
              <th className="px-6 py-4">ORDER</th>
              <th className="px-6 py-4">CUSTOMER</th>
              <th className="px-6 py-4">TYPE</th>
              <th className="px-6 py-4">WEIGHT</th>
              <th className="px-6 py-4 text-center">STATUS</th>
              <th className="px-6 py-4 text-center">ACTION</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#00000026]">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  Loading orders...
                </td>
              </tr>
            ) : paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order) => {
                const displayItems = getDisplayItems(order);
                const types = getChickenTypes(displayItems);
                const totalWeight = getTotalWeight(displayItems);

                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {order.order_number}
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-900">
                      {order.customer}
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-900">
                      {types}
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {totalWeight} Kg
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => onEdit(order)}
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
            const displayItems = getDisplayItems(order);
            const types = getChickenTypes(displayItems);
            const totalWeight = getTotalWeight(displayItems);

            return (
              <div key={order.id} className="p-4 space-y-3">

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
                    className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(order.status)}`}
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
                      {types}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      Total Weight
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {totalWeight} Kg
                    </p>
                  </div>
                </div>

                {/* Action */}
                <div className="flex justify-end pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => onEdit(order)}
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

      {/* Pagination */}
      {!loading && orders.length > 0 && totalPages > 1 && (
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
              {orders.length}
            </span>{" "}
            orders
          </span>

          <div className="flex items-center justify-between sm:justify-end gap-2">

            {/* Previous */}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="shrink-0 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
              aria-label="Previous page"
            >
              <FiChevronLeft className="text-gray-600" />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1 overflow-x-auto max-w-[calc(100%-80px)] px-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`shrink-0 w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === i + 1
                      ? "bg-[#465C8F] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Next */}
            <button
              type="button"
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
              className="shrink-0 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
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
