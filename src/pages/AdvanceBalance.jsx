import React, { useState, useEffect } from "react";
import { FiCalendar, FiFilter, FiChevronDown } from "react-icons/fi";
import AdvanceBalanceStatCards from "../components/advance-balance/AdvanceBalanceStatCards";
import AdvanceBalanceTable from "../components/advance-balance/AdvanceBalanceTable";
import { api } from "../services/api";

export default function AdvanceBalance() {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState("All Customers");

  const fetchBalances = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/advances/balance/");
      if (res.success) {
        setBalances(res.balances || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, []);

  const uniqueCustomers = ["All Customers", ...new Set(balances.map(b => b.customer_name))];
  const filteredBalances = selectedCustomer === "All Customers" 
    ? balances 
    : balances.filter(b => b.customer_name === selectedCustomer);

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Advance Balance</h1>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-[#F7F7F7] border border-[#00000026] rounded-xl px-4 py-2 text-gray-700 font-semibold hover:bg-gray-100 transition">
            <FiFilter /> Filter
          </button>
        </div>
      </div>

      <div className="mb-6 relative w-64">
        <select 
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="w-full appearance-none rounded-xl border border-[#00000026] bg-white px-4 py-3 font-semibold text-gray-800 outline-none focus:border-[#4B5EAA]"
        >
          {uniqueCustomers.map((c, idx) => (
            <option key={idx} value={c}>{c}</option>
          ))}
        </select>
        <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" />
      </div>

      <AdvanceBalanceStatCards balances={filteredBalances} />
      <AdvanceBalanceTable balances={filteredBalances} loading={loading} />
    </div>
  );
}
