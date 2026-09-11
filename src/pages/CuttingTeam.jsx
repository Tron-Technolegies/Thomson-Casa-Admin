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
  
  // Use today's date as default filter
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cutting Team</h1>
        <div className="flex gap-4">
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-medium transition ${isFilterOpen ? 'bg-[#465C8F] text-white border-[#465C8F]' : 'bg-white border-[#00000026] text-gray-700 hover:bg-gray-50'}`}
            >
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              Filters
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>

            {isFilterOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 z-20 max-h-[70vh] overflow-y-auto">
                <div className="space-y-5">
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

                  {/* Clear Button */}
                  <div className="pt-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setDateFilter(new Date().toISOString().split('T')[0]);
                        setIsFilterOpen(false);
                      }}
                      className="w-full py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition"
                    >
                      Reset to Today
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
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
