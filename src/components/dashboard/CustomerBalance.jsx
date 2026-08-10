import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const balanceData = [
  { name: "Due", value: 75, color: "#FF4560" },
  { name: "Paid", value: 25, color: "#E0E7FF" },
];

export default function CustomerBalance() {
  return (
    <div className="bg-white border border-[#00000026] rounded-xl p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Customer Balance</h3>
      
      <div className="h-48 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={balanceData} innerRadius={60} outerRadius={85} paddingAngle={0} dataKey="value">
              {balanceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold text-gray-900">$12.4k</span>
          <span className="text-xs text-gray-500">Total Due</span>
        </div>
      </div>
    </div>
  );
}
