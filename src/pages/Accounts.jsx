import React, { useState, useEffect } from "react";
import { FiCalendar, FiFilter, FiDownload, FiSearch } from "react-icons/fi";
import AccountsStatCards from "../components/accounts/AccountsStatCards";
import AccountsTable from "../components/accounts/AccountsTable";
import PricingModal from "../components/accounts/PricingModal";
import { api } from "../services/api";

export default function Accounts() {
  const [editAccount, setEditAccount] = useState(null);
  const [orders, setOrders] = useState([]);
  const [dailyPrices, setDailyPrices] = useState({});
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const priceRes = await api.get(`/admin/daily-prices/?date=${selectedDate}`);
      if (priceRes.success) setDailyPrices(priceRes.prices || {});

      const ordersRes = await api.get(`/admin/accounts/orders/?date=${selectedDate}`);
      if (ordersRes.success) setOrders(ordersRes.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Accounts & Billing</h1>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-[#F7F7F7] border border-[#00000026] rounded-xl px-4 py-2">
            <FiCalendar className="text-gray-500" />
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-sm font-semibold text-gray-700 outline-none cursor-pointer" 
            />
          </div>
          <button className="flex items-center gap-2 bg-[#F7F7F7] border border-[#00000026] rounded-xl px-4 py-2 text-gray-700 font-semibold hover:bg-gray-100 transition">
            <FiFilter /> Filter
          </button>
        </div>
      </div>

      <AccountsStatCards orders={orders} dailyPrices={dailyPrices} selectedDate={selectedDate} onUpdatePrices={fetchData} />
      
      <AccountsTable orders={orders} loading={loading} onEdit={(acc) => setEditAccount(acc)} />

      <PricingModal 
        isOpen={!!editAccount} 
        onClose={() => setEditAccount(null)}
        account={editAccount}
        dailyPrices={dailyPrices}
        onSuccess={fetchData}
      />
    </div>
  );
}
