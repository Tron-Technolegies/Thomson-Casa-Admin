
import React, { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import Pagination from "../common/Pagination";

const tabs = ["All", "Pending", "Cutting", "Ready", "Delivered", "Cancelled"];

const getStatusStyle = (status) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-600";
    case "Cutting":
      return "bg-blue-100 text-blue-600";
    case "Ready":
      return "bg-purple-100 text-purple-600";
    case "Pending":
      return "bg-orange-100 text-orange-500";
    case "Cancelled":
      return "bg-red-100 text-red-500";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export default function OrderTable({
  orders = [],
  loading,
  activeTab,
  setActiveTab,
  dateFilter,
  setDateFilter,
  onEdit,
  onDelete,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentOrders = orders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getDisplayItems = (order) => {
    return order.items && order.items.length > 0
      ? order.items
      : [{ chicken_type: order.chicken_type, weight: order.weight }];
  };

  const getChickenTypes = (items) => {
    const types = [
      ...new Set(items.map((i) => i.chicken_type)),
    ].join(" + ");

    return items.length > 1 ? types : types;
  };

  const getTotalWeight = (items) => {
    return items.reduce(
      (sum, item) => sum + Number(item.weight || 0),
      0
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="w-full min-w-0">

      <div className="bg-white border border-[#00000026] rounded-xl overflow-hidden">

        {/* Desktop and Tablet Table */}
        <div className="hidden md:block w-full overflow-x-auto">

          <table className="w-full min-w-[950px] text-left text-sm text-gray-600">

            <thead className="bg-[#F8F9FB] text-xs uppercase text-gray-400 font-bold border-b border-[#00000026]">
              <tr>
                <th className="px-5 py-4">ORDER NO</th>
                <th className="px-5 py-4">CUSTOMER</th>
                <th className="px-5 py-4">DATE</th>
                <th className="px-5 py-4">DELIVERY</th>
                <th className="px-5 py-4">CHICKEN TYPE</th>
                <th className="px-5 py-4">WEIGHT</th>
                <th className="px-5 py-4 text-center">STATUS</th>
                <th className="px-5 py-4 text-center">ACTION</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#00000026]">

              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                currentOrders.map((order) => {
                  const displayItems = getDisplayItems(order);
                  const types = getChickenTypes(displayItems);
                  const totalWeight = getTotalWeight(displayItems);

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 cursor-pointer transition"
                      onClick={() => onEdit && onEdit(order)}
                    >

                      <td className="px-5 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {order.order_number}
                      </td>

                      <td className="px-5 py-4 font-medium text-gray-900">
                        {order.customer}
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        {formatDate(order.created_at)}
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        {formatDate(order.delivery_date)}
                      </td>

                      <td className="px-5 py-4 font-medium text-gray-900">
                        {types}
                      </td>

                      <td className="px-5 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {totalWeight} Kg
                      </td>

                      <td className="px-5 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getStatusStyle(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td
                        className="px-5 py-4 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center gap-3">

                          <button
                            onClick={() => onEdit && onEdit(order)}
                            className="text-gray-600 hover:text-[#4B5EAA] transition"
                            title="Edit order"
                          >
                            <FiEdit2 size={18} />
                          </button>

                          <button
                            onClick={() => onDelete && onDelete(order)}
                            className="text-gray-600 hover:text-red-500 transition"
                            title="Delete order"
                          >
                            <FiTrash2 size={18} />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}

            </tbody>
          </table>
        </div>

        {/* Mobile Order Cards */}
        <div className="md:hidden p-3 space-y-3">

          {loading ? (
            <div className="py-10 text-center text-gray-500">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              No orders found.
            </div>
          ) : (
            currentOrders.map((order) => {
              const displayItems = getDisplayItems(order);
              const types = getChickenTypes(displayItems);
              const totalWeight = getTotalWeight(displayItems);

              return (
                <div
                  key={order.id}
                  onClick={() => onEdit && onEdit(order)}
                  className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm cursor-pointer active:bg-gray-50 transition"
                >

                  {/* Order Number and Status */}
                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 mb-1">
                        Order Number
                      </p>

                      <h3 className="font-bold text-gray-900 text-sm break-words">
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
                  <div className="mt-4">
                    <p className="text-xs text-gray-400 mb-1">
                      Customer
                    </p>

                    <p className="text-sm font-semibold text-gray-800 break-words">
                      {order.customer}
                    </p>
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-2 gap-4 mt-4">

                    <div>
                      <p className="text-xs text-gray-400 mb-1">
                        Order Date
                      </p>

                      <p className="text-sm text-gray-700">
                        {formatDate(order.created_at)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 mb-1">
                        Delivery Date
                      </p>

                      <p className="text-sm text-gray-700">
                        {formatDate(order.delivery_date)}
                      </p>
                    </div>

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

                      <p className="text-sm font-bold text-gray-900">
                        {totalWeight} Kg
                      </p>
                    </div>

                  </div>

                  {/* Actions */}
                  <div
                    className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-gray-100"
                    onClick={(e) => e.stopPropagation()}
                  >

                    <button
                      onClick={() => onEdit && onEdit(order)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-[#4B5EAA] text-xs font-semibold hover:bg-blue-100 transition"
                    >
                      <FiEdit2 size={15} />
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete && onDelete(order)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition"
                    >
                      <FiTrash2 size={15} />
                      Delete
                    </button>

                  </div>

                </div>
              );
            })
          )}

        </div>

        {/* Pagination */}
        {!loading && orders.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

      </div>
    </div>
  );
}
