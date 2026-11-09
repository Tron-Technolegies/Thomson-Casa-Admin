
import React, { useState, useEffect, useRef } from "react";
import CuttingStatCards from "../components/cutting/CuttingStatCards";
import CuttingTable from "../components/cutting/CuttingTable";
import EditCuttingOrderModal from "../components/cutting/EditCuttingOrderModal";
import { api } from "../services/api";

export default function CuttingTeam() {
  const [editOrder, setEditOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [dateFilter, setDateFilter] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target)
      ) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchData = async () => {
    setLoading(true);

    try {
      const statsResponse = await api.get("/admin/orders/stats/");

      if (statsResponse.success) {
        setStats(statsResponse.stats);
      }

      const query = new URLSearchParams();

      if (dateFilter) {
        query.append("date", dateFilter);
      }

      const ordersResponse = await api.get(
        `/admin/orders/?${query.toString()}`
      );

      if (ordersResponse.success) {
        const relevantStatuses = ["Pending", "Cutting", "Ready"];

        const filteredOrders = ordersResponse.orders.filter((order) =>
          relevantStatuses.includes(order.status)
        );

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
    <div className="w-full max-w-[1600px] mx-auto pb-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Cutting Team
        </h1>

        {/* Responsive Filter */}
        <div className="w-full sm:w-auto" ref={filterRef}>
          <div className="relative w-full sm:w-auto">

            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 px-4 py-3 rounded-xl border font-medium transition ${
                isFilterOpen
                  ? "bg-[#465C8F] text-white border-[#465C8F]"
                  : "bg-white border-[#00000026] text-gray-700 hover:bg-gray-50"
              }`}
            >
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                height="20"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>

              Filters

              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform ${
                  isFilterOpen ? "rotate-180" : ""
                }`}
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Filter Dropdown */}
            {isFilterOpen && (
              <div className="absolute top-full left-0 right-0 sm:left-auto sm:right-0 mt-2 w-full sm:w-72 max-w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-5 z-30 max-h-[70vh] overflow-y-auto">

                <div className="space-y-5">

                  {/* Date Filter */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Date
                    </label>

                    <input
                      type="date"
                      className="w-full min-w-0 border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 outline-none text-gray-700 text-sm focus:border-[#465C8F]"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                    />
                  </div>

                  {/* Reset Button */}
                  <div className="pt-3 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setDateFilter(
                          new Date().toISOString().split("T")[0]
                        );
                        setIsFilterOpen(false);
                      }}
                      className="w-full py-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition"
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

      {/* Statistics */}
      <CuttingStatCards stats={stats} />

      {/* Orders Table */}
      <CuttingTable
        orders={orders}
        loading={loading}
        onEdit={(order) => setEditOrder(order)}
      />

      {/* Edit Modal */}
      <EditCuttingOrderModal
        isOpen={!!editOrder}
        onClose={() => setEditOrder(null)}
        order={editOrder}
        onSuccess={fetchData}
      />

    </div>
  );
}
