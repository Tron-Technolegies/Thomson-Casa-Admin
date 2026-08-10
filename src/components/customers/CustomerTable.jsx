import React from "react";
import { FiTrash2, FiEdit2, FiEye } from "react-icons/fi";

const customersData = [
  { id: 1, name: "Raj Enterprises", company: "Raj Foods Pvt Ltd", phone: "9876543210", address: "Street, City, State", type: "Wholesale", status: "Active" },
  { id: 2, name: "Suresh Kumar", company: "Fresh Mart", phone: "9812345670", address: "Street, City, State", type: "Regular", status: "Active" },
  { id: 3, name: "Sanjay Das", company: "Spicyzone Pvt Ltd", phone: "9812345670", address: "Street, City, State", type: "New Customer", status: "Inactive" },
  { id: 4, name: "Sanjay Das", company: "Spicyzone Pvt Ltd", phone: "9812345670", address: "Street, City, State", type: "Regular", status: "Inactive" },
  { id: 5, name: "Raj Enterprises", company: "Raj Foods Pvt Ltd", phone: "9876543210", address: "Street, City, State", type: "Wholesale", status: "Active" },
  { id: 6, name: "Sanjay Das", company: "Spicyzone Pvt Ltd", phone: "9812345670", address: "Street, City, State", type: "New Customer", status: "Inactive" },
];

const getTypeColor = (type) => {
  switch (type) {
    case "Wholesale": return "bg-purple-100 text-purple-700";
    case "Regular": return "bg-blue-100 text-blue-700";
    case "New Customer": return "bg-indigo-100 text-indigo-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

const getStatusColor = (status) => {
  return status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600";
};

export default function CustomerTable({ onPreview }) {
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
          {customersData.map((cust) => (
            <tr key={cust.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">{cust.name}</td>
              <td className="px-6 py-4">{cust.company}</td>
              <td className="px-6 py-4">{cust.phone}</td>
              <td className="px-6 py-4">{cust.address}</td>
              <td className="px-6 py-4 text-center">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(cust.type)}`}>
                  {cust.type}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(cust.status)}`}>
                  {cust.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-3">
                  <button className="text-gray-500 hover:text-gray-900"><FiTrash2 size={18} /></button>
                  <button className="text-gray-500 hover:text-[#465C8F]"><FiEdit2 size={18} /></button>
                  <button 
                    onClick={() => onPreview && onPreview(cust)}
                    className="text-gray-500 hover:text-[#465C8F]"
                  >
                    <FiEye size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
