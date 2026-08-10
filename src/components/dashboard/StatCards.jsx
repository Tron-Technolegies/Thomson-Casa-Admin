import React from "react";
import { FiShoppingCart, FiClock, FiCheckCircle, FiUsers, FiCreditCard, FiDollarSign } from "react-icons/fi";

const metrics = [
  { title: "Today's Orders", value: "142", trend: "+12%", trendUp: true, icon: FiShoppingCart },
  { title: "Pending Orders", value: "28", trend: "-4%", trendUp: false, icon: FiClock },
  { title: "Delivered Orders", value: "114", trend: "+8%", trendUp: true, icon: FiCheckCircle },
  { title: "Total Customers", value: "842", trend: "+2", trendUp: true, icon: FiUsers },
  { title: "Outstanding Balance", value: "$12.4k", trend: "High", trendUp: false, icon: FiCreditCard },
  { title: "Total Revenue", value: "$42,840", trend: "+22%", trendUp: true, icon: FiDollarSign },
];

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon;
        return (
          <div key={idx} className="bg-white border border-[#00000026] rounded-xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-full bg-[#465C8F1A] flex items-center justify-center text-[#465C8F]">
                <Icon size={20} />
              </div>
              <span className={`text-sm font-semibold ${metric.trendUp ? "text-green-500" : "text-red-500"}`}>
                {metric.trend}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-gray-900">{metric.value}</h3>
              <p className="text-gray-500 text-sm mt-1">{metric.title}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
