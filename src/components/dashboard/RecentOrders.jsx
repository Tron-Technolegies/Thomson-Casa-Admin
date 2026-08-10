import React from "react";
import { FiEye } from "react-icons/fi";

const orders = [
  { id: "#TC-8842", avatar: "AS", customer: "Amul Stores", weight: "240.5 kg", type: "Frozen Whole", status: "Delivered", statusColor: "bg-green-100 text-green-700" },
  { id: "#TC-8841", avatar: "KH", customer: "Kolkata Hyatt", weight: "120.0 kg", type: "Fresh Cuts", status: "Processing", statusColor: "bg-orange-100 text-orange-700" },
];

export default function RecentOrders() {
  return (
    <div className="bg-white border border-[#00000026] rounded-xl overflow-hidden mt-6 mb-6">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
        <button className="text-sm text-[#465C8F] font-semibold hover:underline">View All Orders</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-[#F7F7F7] text-xs uppercase text-gray-500 font-semibold border-b border-[#00000026]">
            <tr>
              <th className="px-6 py-4">ORDER ID</th>
              <th className="px-6 py-4">CUSTOMER</th>
              <th className="px-6 py-4">WEIGHT</th>
              <th className="px-6 py-4">TYPE</th>
              <th className="px-6 py-4">STATUS</th>
              <th className="px-6 py-4 text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#465C8F24] text-[#465C8F] flex items-center justify-center font-semibold text-xs">
                      {order.avatar}
                    </div>
                    <span className="text-gray-900 font-medium">{order.customer}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{order.weight}</td>
                <td className="px-6 py-4">
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">{order.type}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.statusColor}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="text-gray-900 hover:text-[#465C8F] flex justify-center w-full">
                    <FiEye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
