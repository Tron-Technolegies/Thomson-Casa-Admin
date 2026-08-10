import React, { useState } from "react";
import OrderStatCards from "../components/orders/OrderStatCards";
import OrderTable from "../components/orders/OrderTable";
import CreateOrderModal from "../components/orders/CreateOrderModal";

import OrderDetailModal from "../components/orders/OrderDetailModal";

export default function Orders() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editOrder, setEditOrder] = useState(null);

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
      <OrderTable onEdit={(order) => setEditOrder(order)} />

      <CreateOrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <OrderDetailModal isOpen={!!editOrder} onClose={() => setEditOrder(null)} order={editOrder} />
    </div>
  );
}
