
import  { useState, useEffect } from "react";
import { FiEye } from "react-icons/fi";
import { api } from "../../services/api";
import { Link } from "react-router-dom";

const getStatusColor = (status) => {
  switch ((status || "").toLowerCase()) {
    case "delivered":
      return "bg-green-100 text-green-700";
    case "processing":
      return "bg-orange-100 text-orange-700";
    case "pending":
      return "bg-gray-100 text-gray-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-blue-100 text-blue-700";
  }
};

export default function RecentOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/admin/dashboard/recent-orders/");
        if (res.success) {
          setOrders(res.recent_orders || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-xl border border-[#00000026] bg-white shadow-sm mt-4 sm:mt-6 mb-4 sm:mb-6">

      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-[#00000026] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 lg:p-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
            Recent Orders
          </h3>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Overview of your latest orders
          </p>
        </div>

        <Link to="/orders" className="self-start text-sm font-bold text-[#4B5EAA] transition hover:underline sm:self-auto">
          View All Orders
        </Link>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex min-h-[150px] items-center justify-center p-6 text-sm text-gray-500">
          Loading recent orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="flex min-h-[150px] items-center justify-center p-6 text-sm text-gray-500">
          No orders found.
        </div>
      ) : (
        <>
          {/* Desktop and Tablet Table */}
          <div className="hidden w-full overflow-x-auto md:block">
            <table className="w-full min-w-[700px] text-left text-sm text-gray-500">
              <thead className="border-b border-[#00000026] bg-[#F8F9FB] text-xs font-bold uppercase text-gray-400">
                <tr>
                  <th className="whitespace-nowrap px-4 py-4 lg:px-6">
                    Order ID
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 lg:px-6">
                    Customer
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 lg:px-6">
                    Weight
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 lg:px-6">
                    Date
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 lg:px-6">
                    Status
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 text-center lg:px-6">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#00000026]">
                {orders.map((order, idx) => (
                  <tr
                    key={idx}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-4 py-4 font-medium text-[#4B5EAA] lg:px-6">
                      {order.id}
                    </td>

                    <td className="px-4 py-4 lg:px-6">
                      <div className="flex min-w-[150px] items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                          {(order.customer || "?")
                            .substring(0, 2)
                            .toUpperCase()}
                        </div>
                        <span className="break-words font-bold text-gray-900">
                          {order.customer}
                        </span>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 font-medium text-gray-900 lg:px-6">
                      {order.weight} kg
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 font-medium text-gray-900 lg:px-6">
                      {order.date}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 lg:px-6">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold capitalize ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-center lg:px-6">
                      <Link to={`/orders/${order.id}`} className="mx-auto flex items-center justify-center text-gray-400 transition hover:text-[#4B5EAA]">
                        <FiEye size={18} />
                      </Link >
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Order Cards */}
          <div className="grid grid-cols-1 gap-3 p-3 md:hidden">
            {orders.map((order, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-gray-200 bg-white p-4 transition hover:border-gray-300"
              >
                {/* Order Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Order ID
                    </p>
                    <h4 className="mt-1 break-words text-sm font-bold text-[#4B5EAA]">
                      {order.id}
                    </h4>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold capitalize ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Customer */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                    {(order.customer || "?")
                      .substring(0, 2)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-400">
                      Customer
                    </p>
                    <p className="break-words text-sm font-bold text-gray-900">
                      {order.customer}
                    </p>
                  </div>
                </div>

                {/* Order Details */}
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-3">
                  <div>
                    <p className="text-xs text-gray-400">
                      Weight
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {order.weight} kg
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Date
                    </p>
                    <p className="mt-1 break-words text-sm font-semibold text-gray-900">
                      {order.date}
                    </p>
                  </div>
                </div>

                {/* Action */}
                <div className="mt-3 flex justify-end border-t border-gray-100 pt-3">
                  <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#4B5EAA] transition hover:bg-blue-50">
                    <FiEye size={17} />
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
