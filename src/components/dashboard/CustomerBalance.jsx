import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { api } from "../../services/api";

export default function CustomerBalance() {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/dashboard/stats/");
        if (res.success) {
          setBalance(res.outstanding_balance || 0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const balanceData = [
    { name: "Due", value: balance > 0 ? balance : 100, color: "#FF4560" },
    { name: "Paid", value: balance > 0 ? 0 : 0, color: "#E0E7FF" },
  ];

  return (
    <div className="bg-white border border-[#00000026] rounded-xl p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Customer Balance</h3>
      
      <div className="h-48 relative flex items-center justify-center">
        {loading ? (
          <div className="text-gray-400">Loading...</div>
        ) : (
          <>
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
              <span className="text-xl font-bold text-gray-900">₹{balance.toLocaleString()}</span>
              <span className="text-xs text-gray-500">Total Due</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
