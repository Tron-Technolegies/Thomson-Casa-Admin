import React, { useState, useEffect } from "react";
import DateRange from "../components/sales/DateRange";
import FilterBar from "../components/sales/FilterBar";
import RecentTransactions from "../components/sales/RecentTransactions";
import RevenueGraph from "../components/sales/RevenueGraph";
import SalesStatCard from "../components/sales/SalesStatCard";
import { api } from "../services/api";

function SalesReport() {
  const [sales, setSales] = useState([]);
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_orders: 0,
    revenue_trend: []
  });
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [period, setPeriod] = useState("Daily");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = `/accounts/reports/sales/?period=${period}`;
        if (date) url += `&date=${date}`;
        
        const res = await api.get(url);
        if (res.success) {
          setSales(res.sales || []);
          setStats({
            total_revenue: res.total_revenue || 0,
            total_orders: res.total_orders || 0,
            revenue_trend: res.revenue_trend || []
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [date, period]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold">Sales Report</h1>
        <div className="flex gap-3">
          <DateRange date={date} setDate={setDate} />
        </div>
      </div>

      <FilterBar activeTab={period} setActiveTab={setPeriod} />

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SalesStatCard
          title="Total Revenue"
          value={`₹${stats.total_revenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
          growth={`${period} revenue`}
          positive
        />

        <SalesStatCard 
          title="Orders" 
          value={stats.total_orders.toString()} 
          growth={`${period} invoices generated`} 
          positive 
        />
      </div>

      <RevenueGraph data={stats.revenue_trend} period={period} />

      <RecentTransactions sales={sales} loading={loading} />
    </div>
  );
}

export default SalesReport;
