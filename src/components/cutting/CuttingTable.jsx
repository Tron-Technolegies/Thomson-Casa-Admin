import React from "react";
import { FiEdit2 } from "react-icons/fi";

const cuttingOrdersData = [
  { order: "ORD-2026-0183", customer: "Raj Foods Pvt Ltd", type: "Dressed Chicken", weight: "250 Kg", status: "Ready" },
  { order: "ORD-2026-0183", customer: "Fresh Mart", type: "Full Chicken", weight: "150 Kg", status: "Cutting" },
  { order: "ORD-2026-0183", customer: "Splyzone Pvt Ltd", type: "Dressed Chicken", weight: "150 Kg", status: "Ready" },
  { order: "ORD-2026-0183", customer: "Splyzone Pvt Ltd", type: "Full Chicken", weight: "250 Kg", status: "Pending" },
  { order: "ORD-2026-0183", customer: "Raj Foods Pvt Ltd", type: "Dressed Chicken", weight: "150 Kg", status: "Pending" },
  { order: "ORD-2026-0183", customer: "Splyzone Pvt Ltd", type: "Full Chicken", weight: "150 Kg", status: "Cutting" },
];

const getStatusStyle = (status) => {
  switch (status) {
    case "Cutting": return "bg-blue-100 text-blue-600";
    case "Ready": return "bg-purple-100 text-purple-600";
    case "Pending": return "bg-orange-100 text-orange-500";
    default: return "bg-gray-100 text-gray-600";
  }
};

export default function CuttingTable({ onEdit }) {
  return (
    <div className="bg-white border border-[#00000026] rounded-xl overflow-hidden mt-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
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
            {cuttingOrdersData.map((order, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{order.order}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{order.customer}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{order.type}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{order.weight}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => onEdit(order)}
                    className="text-gray-600 hover:text-[#4B5EAA] transition"
                  >
                    <FiEdit2 size={18} />
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
