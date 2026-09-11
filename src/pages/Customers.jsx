import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiFilter, FiChevronDown } from "react-icons/fi";
import AddCustomerModal from "../components/customers/AddCustomerModal";
import CustomerPreviewModal from "../components/customers/CustomerPreviewModal";
import EditCustomerModal from "../components/customers/EditCustomerModal";
import CustomerTable from "../components/customers/CustomerTable";
import ConfirmModal from "../components/common/ConfirmModal";
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
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleDeleteClick = (id) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      const response = await api.delete(`/admin/customers/${deleteConfirmId}/delete/`);
      if (response.success) {
        fetchCustomers();
      }
    } catch (error) {
      alert(error.message || "Failed to delete customer");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handlePreview = (customer) => {
    setPreviewCustomer(customer);
  };

  const getSortedCustomers = () => {
    let sorted = [...customers];
    switch (sortOption) {
      case "score_high":
        sorted.sort((a, b) => b.performance_score - a.performance_score);
        break;
      case "score_low":
        sorted.sort((a, b) => a.performance_score - b.performance_score);
        break;
      case "qty_high":
        sorted.sort((a, b) => b.total_purchase_volume - a.total_purchase_volume);
        break;
      case "qty_low":
        sorted.sort((a, b) => a.total_purchase_volume - b.total_purchase_volume);
        break;
      case "orders_high":
        sorted.sort((a, b) => b.total_orders - a.total_orders);
        break;
      case "orders_low":
        sorted.sort((a, b) => a.total_orders - b.total_orders);
        break;
      case "newest":
      default:
        // Already sorted by newest from backend
        break;
    }
    return sorted;
  };

  const sortedCustomers = getSortedCustomers();

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#465C8F] text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-800 transition"
        >
          Add Customer +
        </button>
      </div>

      <div className="bg-white border border-[#00000026] rounded-xl">
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
          <div className="flex items-center gap-4 ml-auto relative" ref={filterRef}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-medium transition ${isFilterOpen ? 'bg-[#465C8F] text-white border-[#465C8F]' : 'bg-white border-[#00000026] text-gray-700 hover:bg-gray-50'}`}
            >
              <FiFilter size={20} />
              Filters & Sort
              <FiChevronDown className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {isFilterOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 z-20 max-h-[60vh] overflow-y-auto">
                <div className="space-y-5">
                  
                  {/* Status Filter */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Status</label>
                    <div className="flex gap-2">
                      {['all', 'active', 'inactive'].map(s => (
                        <button
                          key={s}
                          onClick={() => setStatusFilter(s)}
                          className={`flex-1 py-1.5 text-sm font-medium rounded-lg capitalize transition ${statusFilter === s ? 'bg-[#465C8F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Type Filter */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Customer Type</label>
                    <select 
                      className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 outline-none text-gray-700 text-sm focus:border-[#465C8F]"
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                    >
                      <option value="all">All Types</option>
                      <option value="wholesale">Wholesale</option>
                      <option value="regular">Regular</option>
                      <option value="new_customer">New Customer</option>
                    </select>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Sort By Performance</label>
                    <select 
                      className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 outline-none text-gray-700 text-sm focus:border-[#465C8F]"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                    >
                      <option value="newest">Newest First (Default)</option>
                      <option value="score_high">Highest Score First</option>
                      <option value="score_low">Lowest Score First</option>
                      <option value="qty_high">Highest Purchase Qty</option>
                      <option value="qty_low">Lowest Purchase Qty</option>
                      <option value="orders_high">Most Orders</option>
                      <option value="orders_low">Least Orders</option>
                    </select>
                  </div>

                  {/* Clear Button */}
                  <div className="pt-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setStatusFilter('all');
                        setTypeFilter('all');
                        setSortOption('newest');
                        setIsFilterOpen(false);
                      }}
                      className="w-full py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition"
                    >
                      Clear Filters
                    </button>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <CustomerTable 
          customers={sortedCustomers} 
          loading={loading} 
          onPreview={handlePreview} 
          onEdit={(cust) => setEditCustomer(cust)}
          onDelete={handleDeleteClick}
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

      <ConfirmModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone."
      />
    </div>
  );
}
