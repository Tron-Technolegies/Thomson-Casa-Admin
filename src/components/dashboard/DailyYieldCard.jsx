import React, { useState, useEffect } from "react";
import { FiTrendingDown, FiCheckCircle, FiArchive } from "react-icons/fi";
import { api } from "../../services/api";

export default function DailyYieldCard() {
  const [yieldData, setYieldData] = useState({
    received: 0,
    waste: 0,
    meat: 0
  });

  useEffect(() => {
    const fetchYield = async () => {
      try {
        const res = await api.get("/admin/dashboard/stats/?period=Daily");
        if (res.success && res.yield) {
          setYieldData(res.yield);
        }
      } catch (err) {
        console.error("Failed to load yield stats:", err);
      }
    };
    fetchYield();
  }, []);

  const totalProcessed = yieldData.received || 1; // Prevent div by 0
  const meatPercent = ((yieldData.meat / totalProcessed) * 100).toFixed(1);
  const wastePercent = ((yieldData.waste / totalProcessed) * 100).toFixed(1);

  return (
    <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Today's Production Yield</h3>
        <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
          Daily
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
            <FiArchive size={18} />
          </div>
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Received</span>
          <span className="text-xl font-bold text-gray-900">{yieldData.received} <span className="text-sm font-medium text-gray-500">kg</span></span>
        </div>

        <div className="flex flex-col items-center p-3 bg-green-50 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-2">
            <FiCheckCircle size={18} />
          </div>
          <span className="text-xs text-green-700 font-medium uppercase tracking-wider mb-1">Meat Yield</span>
          <span className="text-xl font-bold text-green-700">{yieldData.meat} <span className="text-sm font-medium">kg</span></span>
        </div>

        <div className="flex flex-col items-center p-3 bg-red-50 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-2">
            <FiTrendingDown size={18} />
          </div>
          <span className="text-xs text-red-700 font-medium uppercase tracking-wider mb-1">Waste</span>
          <span className="text-xl font-bold text-red-700">{yieldData.waste} <span className="text-sm font-medium">kg</span></span>
        </div>
      </div>

      {/* Progress Bar Visualizer */}
      <div className="mt-auto">
        <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
          <span>Meat Output ({meatPercent}%)</span>
          <span>Waste ({wastePercent}%)</span>
        </div>
        <div className="w-full h-3 flex rounded-full overflow-hidden bg-gray-100">
          <div 
            className="bg-green-500 h-full transition-all duration-500" 
            style={{ width: `${Math.min(100, Math.max(0, meatPercent))}%` }}
          ></div>
          <div 
            className="bg-red-500 h-full transition-all duration-500" 
            style={{ width: `${Math.min(100, Math.max(0, wastePercent))}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
