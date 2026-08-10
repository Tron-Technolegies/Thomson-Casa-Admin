import React from "react";
import { FiTrendingUp, FiTruck } from "react-icons/fi";

const orderMetrics = [
  { 
    title: "ACTIVE ORDERS", 
    value: "142", 
    trend: "+12%", 
    trendUp: true,
    isStatus: false
  },
  { 
    title: "TOTAL WEIGHT (KG)", 
    value: "2,450.5", 
    trendIcon: <FiTrendingUp className="text-green-500" size={20} />,
    isStatus: false
  },
  { 
    title: "CUTTING QUEUE", 
    value: "18", 
    trendText: "High Load", 
    isStatus: true
  },
  { 
    title: "READY FOR PICKUP", 
    value: "45", 
    icon: <FiTruck className="text-gray-500" size={20} />,
    isStatus: false
  },
];

export default function OrderStatCards() {
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
