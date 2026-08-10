import React, { useState } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import AddCustomerModal from "../components/customers/AddCustomerModal";
import CustomerPreviewModal from "../components/customers/CustomerPreviewModal";
import CustomerTable from "../components/customers/CustomerTable";

export default function Customers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewCustomer, setPreviewCustomer] = useState(null);

  const handlePreview = (customer) => {
    setPreviewCustomer(customer);
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#465C8F] text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-800 transition"
        >
          Add Customer +
        </button>
      </div>

      <div className="bg-white border border-[#00000026] rounded-xl overflow-hidden">
        {/* Filters */}
        <div className="p-6 border-b border-[#00000026] flex gap-4 items-center flex-wrap">
          <div className="flex-1 flex items-center bg-[#F7F7F7] border border-[#00000026] rounded-xl px-4 py-3 min-w-[250px] max-w-2xl">
            <FiSearch className="text-gray-400 mr-2" size={20} />
            <input type="text" placeholder="Search..." className="bg-transparent w-full outline-none text-gray-700" />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <FiFilter className="text-gray-400" size={24} />
            <select className="border border-[#00000026] bg-white rounded-xl px-4 py-3 outline-none text-gray-700 min-w-[150px]">
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <select className="border border-[#00000026] bg-white rounded-xl px-4 py-3 outline-none text-gray-700 min-w-[150px]">
              <option>All</option>
              <option>Wholesale</option>
              <option>Regular</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <CustomerTable onPreview={handlePreview} />
      </div>

      <AddCustomerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <CustomerPreviewModal 
        isOpen={!!previewCustomer} 
        onClose={() => setPreviewCustomer(null)} 
        customer={previewCustomer} 
      />
    </div>
  );
}
