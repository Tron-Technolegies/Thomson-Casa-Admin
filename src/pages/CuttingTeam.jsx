import React, { useState } from "react";
import { FiCalendar } from "react-icons/fi";
import CuttingStatCards from "../components/cutting/CuttingStatCards";
import CuttingTable from "../components/cutting/CuttingTable";
import EditCuttingOrderModal from "../components/cutting/EditCuttingOrderModal";

export default function CuttingTeam() {
  const [editOrder, setEditOrder] = useState(null);

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cutting Team</h1>
        <div className="flex items-center gap-2 bg-white border border-[#00000026] rounded-full px-4 py-2">
          <FiCalendar className="text-gray-400" />
          <span className="text-sm font-semibold text-gray-700">20/10/2026</span>
        </div>
      </div>

      <CuttingStatCards />
      
      <CuttingTable onEdit={(order) => setEditOrder(order)} />

      <EditCuttingOrderModal 
        isOpen={!!editOrder} 
        onClose={() => setEditOrder(null)}
        order={editOrder}
      />
    </div>
  );
}
