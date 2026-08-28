import React from "react";
import { FiEdit2 } from "react-icons/fi";

const tabs = ["All", "Pending", "Cutting", "Ready", "Delivered", "Cancelled"];

const getStatusStyle = (status) => {
  switch (status) {
    case "Delivered": return "bg-green-100 text-green-600";
    case "Cutting": return "bg-blue-100 text-blue-600";
    case "Ready": return "bg-purple-100 text-purple-600";
    case "Pending": return "bg-orange-100 text-orange-500";
    case "Cancelled": return "bg-red-100 text-red-500";
    default: return "bg-gray-100 text-gray-600";
  }
};

export default function OrderTable({ 
  orders = [], loading, activeTab, setActiveTab, dateFilter, setDateFilter, onEdit 
}) {

  return (
    <div>
      {/* Tabs and Filter */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                activeTab === tab 
                  ? "bg-[#4B5EAA] text-white" 
                  : "bg-white text-gray-600 border border-[#00000026] hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 bg-white border border-[#00000026] rounded-full px-4 py-2">
          <input 
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="text-sm font-semibold text-gray-700 outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#00000026] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-[#F8F9FB] text-xs uppercase text-gray-400 font-bold border-b border-[#00000026]">
              <tr>
                <th className="px-6 py-4">ORDER NO</th>
                <th className="px-6 py-4">CUSTOMER</th>
                <th className="px-6 py-4">DATE</th>
                <th className="px-6 py-4">DELIVERY</th>
                <th className="px-6 py-4">CHICKEN TYPE</th>
                <th className="px-6 py-4">WEIGHT</th>
                <th className="px-6 py-4 text-center">STATUS</th>
                <th className="px-6 py-4 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#00000026]">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">No orders found.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{order.order_number}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{order.customer}</td>
                    <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{new Date(order.delivery_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{order.chicken_type}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{order.weight} Kg</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => onEdit && onEdit(order)}
                        className="text-gray-600 hover:text-[#4B5EAA] transition"
                      >
                        <FiEdit2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
