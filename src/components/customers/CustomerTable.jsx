import React from "react";
import { FiTrash2, FiEdit2, FiEye } from "react-icons/fi";

const getTypeColor = (type) => {
  const t = type?.toLowerCase();
  switch (t) {
    case "wholesale": return "bg-purple-100 text-purple-700";
    case "regular": return "bg-blue-100 text-blue-700";
    case "new_customer": return "bg-indigo-100 text-indigo-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

const getStatusColor = (status) => {
  return status?.toLowerCase() === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600";
};

export default function CustomerTable({ customers = [], loading, onPreview, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-[#F7F7F7] text-xs uppercase text-gray-500 font-semibold border-b border-[#00000026]">
          <tr>
            <th className="px-6 py-4">CUSTOMER</th>
            <th className="px-6 py-4">COMPANY</th>
            <th className="px-6 py-4">PHONE</th>
            <th className="px-6 py-4">ADDRESS</th>
            <th className="px-6 py-4 text-center">CUSTOMER TYPE</th>
            <th className="px-6 py-4 text-center">STATUS</th>
            <th className="px-6 py-4 text-center">ACTION</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {loading ? (
            <tr>
              <td colSpan="7" className="px-6 py-4 text-center text-gray-500">Loading customers...</td>
            </tr>
          ) : customers.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No customers found.</td>
            </tr>
          ) : (
            customers.map((cust) => (
              <tr key={cust.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{cust.customer_name}</td>
                <td className="px-6 py-4">{cust.company_name}</td>
                <td className="px-6 py-4">{cust.phone}</td>
                <td className="px-6 py-4 truncate max-w-[150px]" title={cust.address}>{cust.address}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(cust.customer_type)} capitalize`}>
                    {cust.customer_type?.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(cust.status)} capitalize`}>
                    {cust.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <button onClick={() => onDelete && onDelete(cust.id)} className="text-gray-500 hover:text-red-600"><FiTrash2 size={18} /></button>
                    <button onClick={() => onEdit && onEdit(cust)} className="text-gray-500 hover:text-[#465C8F]"><FiEdit2 size={18} /></button>
                    <button 
                      onClick={() => onPreview && onPreview(cust)}
                      className="text-gray-500 hover:text-[#465C8F]"
                    >
                      <FiEye size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
