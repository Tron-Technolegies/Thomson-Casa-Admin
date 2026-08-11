import React from "react";
import { FiEdit2 } from "react-icons/fi";

const accountsData = [
  { id: "Inv--9087--34", customer: "Raj Foods Pvt Ltd", date: "2026-10-08", delivery: "2026-10-08", type: "Dressed Chicken", weight: "250 Kg", status: "Delivered", price: "1500" },
  { id: "Inv--9087--34", customer: "Fresh Mart", date: "2026-10-08", delivery: "2026-10-08", type: "Full Chicken", weight: "150 Kg", status: "Cutting", price: "1500" },
  { id: "Inv--9087--34", customer: "Splyzone Pvt Ltd", date: "2026-10-08", delivery: "2026-10-08", type: "Dressed Chicken", weight: "150 Kg", status: "Ready", price: "1500" },
  { id: "Inv--9087--34", customer: "Splyzone Pvt Ltd", date: "2026-10-08", delivery: "2026-10-08", type: "Full Chicken", weight: "250 Kg", status: "Pending", price: "1500" },
  { id: "Inv--9087--34", customer: "Raj Foods Pvt Ltd", date: "2026-10-08", delivery: "2026-10-08", type: "Dressed Chicken", weight: "150 Kg", status: "Pending", price: "1500" },
  { id: "Inv--9087--34", customer: "Splyzone Pvt Ltd", date: "2026-10-08", delivery: "2026-10-08", type: "Full Chicken", weight: "150 Kg", status: "Cancelled", price: "1500" },
  { id: "Inv--9087--34", customer: "Raj Foods Pvt Ltd", date: "2026-10-08", delivery: "2026-10-08", type: "Dressed Chicken", weight: "250 Kg", status: "Delivered", price: "1500" },
  { id: "Inv--9087--34", customer: "Fresh Mart", date: "2026-10-08", delivery: "2026-10-08", type: "Full Chicken", weight: "150 Kg", status: "Cutting", price: "1500" },
  { id: "Inv--9087--34", customer: "Splyzone Pvt Ltd", date: "2026-10-08", delivery: "2026-10-08", type: "Dressed Chicken", weight: "150 Kg", status: "Ready", price: "1500" },
  { id: "Inv--9087--34", customer: "Splyzone Pvt Ltd", date: "2026-10-08", delivery: "2026-10-08", type: "Full Chicken", weight: "250 Kg", status: "Pending", price: "1500" },
  { id: "Inv--9087--34", customer: "Raj Foods Pvt Ltd", date: "2026-10-08", delivery: "2026-10-08", type: "Dressed Chicken", weight: "150 Kg", status: "Pending", price: "1500" },
  { id: "Inv--9087--34", customer: "Splyzone Pvt Ltd", date: "2026-10-08", delivery: "2026-10-08", type: "Full Chicken", weight: "150 Kg", status: "Cancelled", price: "1500" },
];

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

export default function AccountsTable({ onEdit }) {
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
            {accountsData.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{row.id}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{row.customer}</td>
                <td className="px-6 py-4">{row.date}</td>
                <td className="px-6 py-4">{row.delivery}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{row.type}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{row.weight}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(row.status)}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">{row.price}</td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => onEdit(row)}
                    className="text-gray-600 hover:text-[#4B5EAA] cursor-pointer transition"
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
