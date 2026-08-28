import React, { useState, useEffect } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import AddCustomerModal from "../components/customers/AddCustomerModal";
import CustomerPreviewModal from "../components/customers/CustomerPreviewModal";
import EditCustomerModal from "../components/customers/EditCustomerModal";
import CustomerTable from "../components/customers/CustomerTable";
import { api } from "../services/api";

export default function Customers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewCustomer, setPreviewCustomer] = useState(null);
  const [editCustomer, setEditCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      let query = "?";
      if (search) query += `search=${search}&`;
      if (statusFilter !== "all") query += `status=${statusFilter}&`;
      if (typeFilter !== "all") query += `customer_type=${typeFilter}`;
      
      const response = await api.get(`/admin/customers/${query}`);
      if (response.success) {
        setCustomers(response.customers);
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search, statusFilter, typeFilter]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        const response = await api.delete(`/admin/customers/${id}/delete/`);
        if (response.success) {
          fetchCustomers();
        }
      } catch (error) {
        alert(error.message || "Failed to delete customer");
      }
    }
  };

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
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent w-full outline-none text-gray-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <FiFilter className="text-gray-400" size={24} />
            <select 
              className="border border-[#00000026] bg-white rounded-xl px-4 py-3 outline-none text-gray-700 min-w-[150px]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select 
              className="border border-[#00000026] bg-white rounded-xl px-4 py-3 outline-none text-gray-700 min-w-[150px]"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="wholesale">Wholesale</option>
              <option value="regular">Regular</option>
              <option value="new_customer">New Customer</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <CustomerTable 
          customers={customers} 
          loading={loading} 
          onPreview={handlePreview} 
          onEdit={(cust) => setEditCustomer(cust)}
          onDelete={handleDelete}
          onRefresh={fetchCustomers}
        />
      </div>

      <AddCustomerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchCustomers}
      />
      
      <EditCustomerModal 
        isOpen={!!editCustomer} 
        onClose={() => setEditCustomer(null)} 
        customer={editCustomer}
        onSuccess={fetchCustomers}
      />
      
      <CustomerPreviewModal 
        isOpen={!!previewCustomer} 
        onClose={() => setPreviewCustomer(null)} 
        customer={previewCustomer} 
      />
    </div>
  );
}
