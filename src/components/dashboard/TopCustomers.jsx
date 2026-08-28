import React, { useState, useEffect } from "react";
import { api } from "../../services/api";

export default function TopCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopCustomers = async () => {
      try {
        const res = await api.get("/admin/reports/customers/");
        if (res.success) {
          const sorted = (res.customers_report || [])
            .sort((a, b) => parseFloat(b.total_spent) - parseFloat(a.total_spent))
            .slice(0, 4);
          setCustomers(sorted);
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
    <div className="bg-white border border-[#00000026] rounded-xl p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Top Customers</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="text-gray-400">Loading...</div>
        ) : customers.length === 0 ? (
          <div className="text-gray-400">No data.</div>
        ) : (
          customers.map((cust, idx) => (
            <div key={idx} className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#465C8F] text-white flex items-center justify-center font-semibold text-sm">
                  {cust.customer.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 truncate max-w-[100px]">{cust.customer}</h4>
                  <p className="text-xs text-gray-500">{cust.total_orders} Orders</p>
                </div>
              </div>
              <div className="text-[#465C8F] font-bold text-sm bg-indigo-50 px-2 py-1 rounded">
                ₹{(parseFloat(cust.total_spent) / 1000).toFixed(1)}k
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
