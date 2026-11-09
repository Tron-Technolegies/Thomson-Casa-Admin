
import React from "react";
import { FiEdit2 } from "react-icons/fi";

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

export default function AccountsTable({ orders = [], loading, onEdit }) {
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

  const getFormattedDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : "-";
  };

  const renderPrice = (row) => {
    return row.invoice ? (
      <span className="font-bold text-gray-900">
        ₹ {row.invoice.total_amount}
      </span>
    ) : (
      <span className="text-gray-400 font-normal">Unpriced</span>
    );
  };

  return (
    <div className="mt-4 sm:mt-6 bg-white border border-[#00000026] rounded-xl overflow-hidden">

      {/* Desktop / Tablet Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left text-sm text-gray-600">
          <thead className="bg-[#F8F9FB] text-xs uppercase text-gray-400 font-bold border-b border-[#00000026]">
            <tr>
              <th className="px-6 py-4">ORDER NO</th>
              <th className="px-6 py-4">CUSTOMER</th>
              <th className="px-6 py-4">DATE</th>
              <th className="px-6 py-4">DELIVERY</th>
              <th className="px-6 py-4">CHICKEN TYPE</th>
              <th className="px-6 py-4">WEIGHT</th>
              <th className="px-6 py-4 text-center">STATUS</th>
              <th className="px-6 py-4">PRICE</th>
              <th className="px-6 py-4 text-center">ACTION</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#00000026]">
            {loading ? (
              <tr>
                <td
                  colSpan="9"
                  className="px-6 py-8 text-center text-gray-500"
                >
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td
                  colSpan="9"
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No ready/delivered orders found.
                </td>
              </tr>
            ) : (
              orders.map((row) => {
                const displayItems = getDisplayItems(row);
                const types = getChickenTypes(displayItems);
                const totalWeight = getTotalWeight(displayItems);

                return (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {row.order_number}
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-900">
                      {row.customer}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {getFormattedDate(row.created_at)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {row.delivery_date || "-"}
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-900">
                      {types}
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {totalWeight} Kg
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(row.status)}`}
                      >
                        {row.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {renderPrice(row)}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => onEdit(row)}
                        className="text-gray-600 hover:text-[#4B5EAA] cursor-pointer transition"
                        aria-label={`Edit order ${row.order_number}`}
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
          <div className="px-4 py-10 text-center text-sm text-gray-500">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-gray-500">
            No ready/delivered orders found.
          </div>
        ) : (
          orders.map((row) => {
            const displayItems = getDisplayItems(row);
            const types = getChickenTypes(displayItems);
            const totalWeight = getTotalWeight(displayItems);

            return (
              <div key={row.id} className="p-4 space-y-4">

                {/* Order Number and Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 font-medium">
                      ORDER NO
                    </p>
                    <h3 className="text-sm font-bold text-gray-900 break-words">
                      {row.order_number}
                    </h3>
                  </div>

                  <span
                    className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(row.status)}`}
                  >
                    {row.status}
                  </span>
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

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      Order Date
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {getFormattedDate(row.created_at)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      Delivery Date
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {row.delivery_date || "-"}
                    </p>
                  </div>
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

                {/* Price */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      Total Price
                    </p>
                    <p className="text-sm">
                      {renderPrice(row)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onEdit(row)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#465C8F] text-white text-sm font-medium hover:bg-[#384C79] transition"
                  >
                    <FiEdit2 size={15} />
                    Edit
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
