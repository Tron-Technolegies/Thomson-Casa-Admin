import React from "react";
import { FiEdit2 } from "react-icons/fi";

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

export default function AccountsTable({ orders = [], loading, onEdit }) {
  return (
    <div className="bg-white border border-[#00000026] rounded-xl overflow-hidden mt-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="text-xs uppercase text-gray-400 font-bold border-b border-[#00000026]">
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
                <td colSpan="9" className="px-6 py-4 text-center text-gray-500">Loading orders...</td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-6 py-4 text-center text-gray-500">No ready/delivered orders found.</td>
              </tr>
            ) : (
              orders.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{row.order_number}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{row.customer}</td>
                  <td className="px-6 py-4">{row.created_at ? new Date(row.created_at).toLocaleDateString() : '-'}</td>
                  <td className="px-6 py-4">{row.delivery_date}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{row.chicken_type}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{row.weight} Kg</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {row.invoice ? `₹ ${row.invoice.total_amount}` : <span className="text-gray-400 font-normal">Unpriced</span>}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => onEdit(row)}
                      className="text-gray-600 hover:text-[#4B5EAA] cursor-pointer transition"
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
  );
}
