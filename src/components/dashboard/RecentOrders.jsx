import React, { useState, useEffect } from "react";
import { FiEye } from "react-icons/fi";
import { api } from "../../services/api";

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'delivered': return "bg-green-100 text-green-700";
    case 'processing': return "bg-orange-100 text-orange-700";
    case 'pending': return "bg-gray-100 text-gray-700";
    case 'cancelled': return "bg-red-100 text-red-700";
    default: return "bg-blue-100 text-blue-700";
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
    <div className="bg-white border border-[#00000026] rounded-xl overflow-hidden mt-6 mb-6 shadow-sm">
      <div className="p-6 border-b border-[#00000026] flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
        <button className="text-sm text-[#4B5EAA] font-bold hover:underline">View All Orders</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-[#F8F9FB] text-xs uppercase text-gray-400 font-bold border-b border-[#00000026]">
            <tr>
              <th className="px-6 py-4">ORDER ID</th>
              <th className="px-6 py-4">CUSTOMER</th>
              <th className="px-6 py-4">WEIGHT</th>
              <th className="px-6 py-4">DATE</th>
              <th className="px-6 py-4">STATUS</th>
              <th className="px-6 py-4 text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#00000026]">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">Loading recent orders...</td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No orders found.</td>
              </tr>
            ) : (
              orders.map((order, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-[#4B5EAA]">{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                        {order.customer.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-gray-900 font-bold">{order.customer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{order.weight} kg</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{order.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-gray-400 hover:text-[#4B5EAA] transition flex justify-center w-full">
                      <FiEye size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
