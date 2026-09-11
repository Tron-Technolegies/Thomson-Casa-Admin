import React, { useState, useEffect } from "react";
import OrderStatCards from "../components/orders/OrderStatCards";
import OrderTable from "../components/orders/OrderTable";
import CreateOrderModal from "../components/orders/CreateOrderModal";
import OrderDetailModal from "../components/orders/OrderDetailModal";
import ConfirmModal from "../components/common/ConfirmModal";
import { api } from "../services/api";

export default function Orders() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const filterRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (activeTab && activeTab !== "All") query.append("status", activeTab);
      if (dateFilter) query.append("date", dateFilter);
      if (search) query.append("search", search);

      const response = await api.get(`/admin/orders/?${query.toString()}`);
      if (response.success) {
        setOrders(response.orders);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTab, dateFilter, search]);

  const handleDeleteClick = (id) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      const response = await api.delete(`/admin/orders/${deleteConfirmId}/delete/`);
      if (response.success) {
        fetchOrders();
      }
    } catch (error) {
      alert(error.message || "Failed to delete order");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const getSortedOrders = () => {
    let sorted = [...orders];
    switch (sortOption) {
      case "weight_high":
        sorted.sort((a, b) => b.weight - a.weight); // Assuming backend sends total weight, or calculate it
        break;
      case "weight_low":
        sorted.sort((a, b) => a.weight - b.weight);
        break;
      case "newest":
      default:
        break;
    }
    return sorted;
  };

  const sortedOrders = getSortedOrders();

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#465C8F] text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-800 transition"
        >
          Create Order +
        </button>
      </div>

      <OrderStatCards />

      <div className="bg-white border border-[#00000026] rounded-xl mt-6">
        {/* Filters */}
        <div className="p-6 border-b border-[#00000026] flex gap-4 items-center flex-wrap">
          <div className="flex-1 flex items-center bg-[#F7F7F7] border border-[#00000026] rounded-xl px-4 py-3 min-w-[250px] max-w-2xl">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mr-2" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              placeholder="Search Orders..." 
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
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              Filters & Sort
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>

            {isFilterOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 z-20 max-h-[70vh] overflow-y-auto">
                <div className="space-y-5">
                  
                  {/* Status Filter */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Status</label>
                    <select 
                      className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 outline-none text-gray-700 text-sm focus:border-[#465C8F]"
                      value={activeTab}
                      onChange={(e) => setActiveTab(e.target.value)}
                    >
                      <option value="All">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Cutting">Cutting</option>
                      <option value="Ready">Ready</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Date Filter */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Date</label>
                    <input 
                      type="date"
                      className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 outline-none text-gray-700 text-sm focus:border-[#465C8F]"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                    />
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Sort By</label>
                    <select 
                      className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 outline-none text-gray-700 text-sm focus:border-[#465C8F]"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                    >
                      <option value="newest">Newest First (Default)</option>
                      <option value="weight_high">Highest Weight</option>
                      <option value="weight_low">Lowest Weight</option>
                    </select>
                  </div>

                  {/* Clear Button */}
                  <div className="pt-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setActiveTab('All');
                        setDateFilter('');
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

        <OrderTable 
          orders={sortedOrders}
          loading={loading}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          onEdit={(order) => setEditOrder(order)} 
          onDelete={(order) => handleDeleteClick(order.id)}
        />
      </div>

      <CreateOrderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchOrders}
      />
      <OrderDetailModal 
        isOpen={!!editOrder} 
        onClose={() => setEditOrder(null)} 
        order={editOrder} 
        onSuccess={fetchOrders}
      />
      <ConfirmModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Order"
        message="Are you sure you want to delete this order? This action cannot be undone."
      />
    </div>
  );
}
