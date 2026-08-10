import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const dailySalesData = [
  { name: "Mon", sales: 4000 },
  { name: "Tue", sales: 8000 },
  { name: "Wed", sales: 18000 },
  { name: "Thu", sales: 15000 },
  { name: "Fri", sales: 14000 },
  { name: "Sat", sales: 18000 },
  { name: "Sun", sales: 24000 },
];

const monthlySalesData = [
  { name: "Jan", sales: 20000 },
  { name: "Feb", sales: 6000 },
  { name: "Mar", sales: 29000 },
  { name: "Apr", sales: 13000 },
  { name: "May", sales: 21000 },
  { name: "Jun", sales: 31000 },
  { name: "Jul", sales: 4000 },
  { name: "Aug", sales: 11000 },
  { name: "Sep", sales: 15000 },
  { name: "Oct", sales: 25000 },
];

export default function SalesCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Daily Sales */}
      <div className="bg-white border border-[#00000026] rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1">Daily Sales</h3>
        <p className="text-gray-500 text-sm mb-6">This Week</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailySalesData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#465C8F" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#465C8F" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} dy={10} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} tickFormatter={(val) => `${val / 1000}k`} />
              <Tooltip />
              <Area type="monotone" dataKey="sales" stroke="#465C8F" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Sales */}
      <div className="bg-white border border-[#00000026] rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Monthly Sales</h3>
        <div className="h-64 mt-[28px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlySalesData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} dy={10} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} tickFormatter={(val) => `${val / 1000}k`} />
              <Tooltip cursor={{ fill: "transparent" }} />
              <Bar dataKey="sales" fill="#465C8F" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
