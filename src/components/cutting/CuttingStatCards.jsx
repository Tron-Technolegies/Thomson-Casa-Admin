import React from "react";

export default function CuttingStatCards({ stats }) {
  const cuttingMetrics = [
    { 
      title: "Pending", 
      value: stats?.pending_orders || "0", 
      subtitle: "Orders",
      dotColor: "bg-yellow-400",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-100"
    },
    { 
      title: "In Progress", 
      value: stats?.cutting_queue || "0", 
      subtitle: "Orders",
      dotColor: "bg-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100"
    },
    { 
      title: "Completed", 
      value: stats?.ready_pickup || "0", 
      subtitle: "Orders",
      dotColor: "bg-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-100"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cuttingMetrics.map((metric, idx) => (
        <div key={idx} className={`${metric.bgColor} border ${metric.borderColor} rounded-xl p-6 flex flex-col justify-between shadow-sm`}>
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-2 h-2 rounded-full ${metric.dotColor}`}></div>
            <span className="text-sm font-semibold text-gray-600 tracking-wide">
              {metric.title}
            </span>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-gray-900 mb-1">{metric.value}</h3>
            <p className="text-sm font-medium text-gray-500">{metric.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
