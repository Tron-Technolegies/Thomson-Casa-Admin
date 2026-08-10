import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Amul Stores", value: 320000, color: "#00E396", displayValue: "320k" },
  { name: "Kolkata Hyatt", value: 240000, color: "#FF4560", displayValue: "240k" },
  { name: "Big Mart Chain", value: 180000, color: "#FEB019", displayValue: "180k" },
  { name: "Fresh Mart", value: 150000, color: "#FFF950", displayValue: "150k" }, // lighter yellow
  { name: "Fresh Mart", value: 120000, color: "#775DD0", displayValue: "120k" },
];

export default function CustomerRevenue() {
  return (
    <div className="bg-white border border-[#00000026] rounded-xl p-6 h-full flex flex-col">
      <h3 className="text-xl font-bold text-gray-900 mb-1">Customer-wise Revenue</h3>
      <p className="text-gray-500 text-sm mb-8">This Month</p>

      <div className="flex-1 flex flex-col justify-center">
        <div className="h-64 relative mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} innerRadius={80} outerRadius={110} paddingAngle={0} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4 px-4">
          {data.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-gray-700">{item.name}</span>
              </div>
              <span className="text-gray-900 font-medium">{item.displayValue}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
