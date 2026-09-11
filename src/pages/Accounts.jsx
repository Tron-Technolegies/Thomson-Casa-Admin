import React, { useState, useEffect } from "react";
import { FiCalendar, FiFilter, FiDownload, FiSearch } from "react-icons/fi";
import AccountsStatCards from "../components/accounts/AccountsStatCards";
import AccountsTable from "../components/accounts/AccountsTable";
import PricingModal from "../components/accounts/PricingModal";
import ManageRatesModal from "../components/accounts/ManageRatesModal";
import { api } from "../services/api";

export default function Accounts() {
  const [editAccount, setEditAccount] = useState(null);
  const [orders, setOrders] = useState([]);
  const [dailyPrices, setDailyPrices] = useState({});
  const [dailyCategorySales, setDailyCategorySales] = useState({});
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isManageRatesOpen, setIsManageRatesOpen] = useState(false);
  const filterRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const priceRes = await api.get(`/admin/daily-prices/?date=${selectedDate}`);
      if (priceRes.success) setDailyPrices(priceRes.prices || {});

      const ordersRes = await api.get(`/admin/accounts/orders/?date=${selectedDate}`);
      if (ordersRes.success) {
        setOrders(ordersRes.orders || []);
        setDailyCategorySales(ordersRes.daily_category_sales || {});
      }
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Accounts & Billing</h1>
      </div>

      <div className="bg-white border border-[#00000026] rounded-xl mb-6">
        <div className="p-6 flex justify-end items-center gap-4 relative" ref={filterRef}>
          <button
            onClick={() => setIsManageRatesOpen(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[#4B5EAA] bg-[#4B5EAA]/5 text-[#4B5EAA] font-semibold hover:bg-[#4B5EAA] hover:text-white transition"
          >
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            Manage Customer Rates
          </button>
          
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-medium transition ${isFilterOpen ? 'bg-[#465C8F] text-white border-[#465C8F]' : 'bg-white border-[#00000026] text-gray-700 hover:bg-gray-50'}`}
          >
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            Filters
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>

          {isFilterOpen && (
            <div className="absolute top-full right-6 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 z-20 max-h-[70vh] overflow-y-auto">
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Date</label>
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 outline-none text-gray-700 text-sm focus:border-[#465C8F]" 
                  />
                </div>
                
                <div className="pt-2 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setSelectedDate(today.toISOString().split('T')[0]);
                      setIsFilterOpen(false);
                    }}
                    className="w-full py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition"
                  >
                    Reset Filter
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AccountsStatCards 
        orders={orders} 
        dailyPrices={dailyPrices} 
        selectedDate={selectedDate} 
        onUpdatePrices={fetchData} 
        dailyCategorySales={dailyCategorySales}
      />
      
      <AccountsTable orders={orders} loading={loading} onEdit={(acc) => setEditAccount(acc)} />

      <PricingModal 
        isOpen={!!editAccount} 
        onClose={() => setEditAccount(null)}
        account={editAccount}
        dailyPrices={dailyPrices}
        onSuccess={fetchData}
      />

      <ManageRatesModal 
        isOpen={isManageRatesOpen}
        onClose={() => setIsManageRatesOpen(false)}
      />
    </div>
  );
}
