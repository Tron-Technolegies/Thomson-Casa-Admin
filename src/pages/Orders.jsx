import React, { useState, useEffect } from "react";
import OrderStatCards from "../components/orders/OrderStatCards";
import OrderTable from "../components/orders/OrderTable";
import CreateOrderModal from "../components/orders/CreateOrderModal";
import OrderDetailModal from "../components/orders/OrderDetailModal";
import { api } from "../services/api";

export default function Orders() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [dateFilter, setDateFilter] = useState(""); // empty means all dates

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

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-center mb-8">
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
    </div>
  );
}
