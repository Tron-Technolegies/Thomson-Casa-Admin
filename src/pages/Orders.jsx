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
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (activeTab !== "All") query.append("status", activeTab);
      if (dateFilter) query.append("date", dateFilter);

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
  }, [activeTab, dateFilter]);

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
      <OrderTable 
        orders={orders}
        loading={loading}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        onEdit={(order) => setEditOrder(order)} 
        onDelete={(order) => handleDeleteClick(order.id)}
      />

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
