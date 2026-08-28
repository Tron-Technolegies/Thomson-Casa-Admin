import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { api } from "../../services/api";

const COLORS = ["#00E396", "#FF4560", "#FEB019", "#FFF950", "#775DD0"];

export default function CustomerRevenue() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopCustomers = async () => {
      try {
        const res = await api.get("/admin/reports/customers/");
        if (res.success) {
          const sorted = (res.customers_report || [])
            .sort((a, b) => parseFloat(b.total_spent) - parseFloat(a.total_spent))
            .slice(0, 5)
            .map((c, i) => ({
              name: c.customer,
              value: parseFloat(c.total_spent),
              color: COLORS[i % COLORS.length],
              displayValue: `₹${(parseFloat(c.total_spent) / 1000).toFixed(1)}k`
            }));
          setData(sorted);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopCustomers();
  }, []);

  return (
    <div className="bg-white border border-[#00000026] rounded-xl p-6 h-full flex flex-col">
      <h3 className="text-xl font-bold text-gray-900 mb-1">Customer-wise Revenue</h3>
      <p className="text-gray-500 text-sm mb-8">All Time</p>

      <div className="flex-1 flex flex-col justify-center">
        {loading ? (
          <div className="flex h-full items-center justify-center text-gray-400">Loading...</div>
        ) : data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-400">No data.</div>
        ) : (
          <>
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
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                    <span className="text-gray-700 truncate max-w-[150px]">{item.name}</span>
                  </div>
                  <span className="text-gray-900 font-medium">{item.displayValue}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
