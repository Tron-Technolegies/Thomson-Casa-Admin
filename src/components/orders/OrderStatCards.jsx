import React, { useState, useEffect } from "react";
import { FiTrendingUp, FiTruck } from "react-icons/fi";
import { api } from "../../services/api";

export default function OrderStatCards() {
  const [stats, setStats] = useState({
    active_orders: 0,
    total_weight: 0,
    cutting_queue: 0,
    ready_pickup: 0
  });

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/orders/stats/');
      if (response.success) {
        setStats(response.stats);
      }
    } catch (error) {
      console.error("Failed to fetch order stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
    // Setting up a basic interval to refresh stats could be done here, 
    // but we will keep it simple and just fetch on mount for now.
  }, []);

  const orderMetrics = [
    { 
      title: "ACTIVE ORDERS", 
      value: stats.active_orders, 
      trend: "", 
      trendUp: true,
      isStatus: false
    },
    { 
      title: "TOTAL WEIGHT (KG)", 
      value: stats.total_weight.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }), 
      trendIcon: <FiTrendingUp className="text-green-500" size={20} />,
      isStatus: false
    },
    { 
      title: "CUTTING QUEUE", 
      value: stats.cutting_queue, 
      trendText: "", 
      isStatus: true
    },
    { 
      title: "READY FOR PICKUP", 
      value: stats.ready_pickup, 
      icon: <FiTruck className="text-gray-500" size={20} />,
      isStatus: false
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {orderMetrics.map((metric, idx) => (
        <div key={idx} className="bg-white border border-[#00000026] rounded-xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">
              {metric.title}
            </span>
            {metric.trend && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${metric.trendUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {metric.trend}
              </span>
            )}
            {metric.trendIcon && metric.trendIcon}
            {metric.trendText && (
              <span className="text-xs font-semibold text-gray-500">
                {metric.trendText}
              </span>
            )}
            {metric.icon && metric.icon}
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900">{metric.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
