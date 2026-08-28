import React, { useState, useEffect } from "react";
import { FiCalendar } from "react-icons/fi";
import CuttingStatCards from "../components/cutting/CuttingStatCards";
import CuttingTable from "../components/cutting/CuttingTable";
import EditCuttingOrderModal from "../components/cutting/EditCuttingOrderModal";
import { api } from "../services/api";

export default function CuttingTeam() {
  const [editOrder, setEditOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Use today's date as default filter if appropriate, or empty for all. We'll start empty.
  const [dateFilter, setDateFilter] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const statsResponse = await api.get('/admin/orders/stats/');
      if (statsResponse.success) {
        setStats(statsResponse.stats);
      }

      // Fetch orders for cutting team (optionally filter by date)
      const query = new URLSearchParams();
      if (dateFilter) query.append("date", dateFilter);
      
      const ordersResponse = await api.get(`/admin/orders/?${query.toString()}`);
      if (ordersResponse.success) {
        // Cutting team only cares about these statuses
        const relevantStatuses = ["Pending", "Cutting", "Ready"];
        const filteredOrders = ordersResponse.orders.filter(o => relevantStatuses.includes(o.status));
        setOrders(filteredOrders);
      }
    } catch (error) {
      console.error("Failed to fetch cutting team data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateFilter]);

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cutting Team</h1>
        <div className="flex items-center gap-2 bg-white border border-[#00000026] rounded-full px-4 py-2">
          <input 
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="text-sm font-semibold text-gray-700 outline-none"
          />
        </div>
      </div>

      <CuttingStatCards stats={stats} />
      
      <CuttingTable orders={orders} loading={loading} onEdit={(order) => setEditOrder(order)} />

      <EditCuttingOrderModal 
        isOpen={!!editOrder} 
        onClose={() => setEditOrder(null)}
        order={editOrder}
        onSuccess={fetchData}
      />
    </div>
  );
}
