import React, { useState, useEffect } from "react";
import { FiShoppingCart, FiClock, FiCheckCircle, FiUsers, FiCreditCard, FiDollarSign } from "react-icons/fi";
import { api } from "../../services/api";

export default function StatCards() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    outstanding: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/dashboard/stats/");
        if (res.success) {
          setStats({
            revenue: res.revenue,
            orders: res.orders,
            customers: res.customers,
            outstanding: res.outstanding
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const metrics = [
    { title: "Total Orders", value: stats.orders.toString(), trend: "+", trendUp: true, icon: FiShoppingCart },
    { title: "Total Customers", value: stats.customers.toString(), trend: "+", trendUp: true, icon: FiUsers },
    { title: "Outstanding Balance", value: `₹ ${stats.outstanding.toLocaleString()}`, trend: "High", trendUp: false, icon: FiCreditCard },
    { title: "Total Revenue", value: `₹ ${stats.revenue.toLocaleString()}`, trend: "+", trendUp: true, icon: FiDollarSign },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon;
        return (
          <div key={idx} className="bg-white border border-[#00000026] rounded-xl p-6 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Icon size={20} />
              </div>
              <span className={`text-sm font-semibold ${metric.trendUp ? "text-green-500" : "text-red-500"}`}>
                {metric.trend}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-gray-900">{metric.value}</h3>
              <p className="text-gray-500 text-sm mt-1 font-medium">{metric.title}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
