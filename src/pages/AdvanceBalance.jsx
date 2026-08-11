import React from "react";
import { FiCalendar, FiFilter, FiChevronDown } from "react-icons/fi";
import AdvanceBalanceStatCards from "../components/advance-balance/AdvanceBalanceStatCards";
import AdvanceBalanceTable from "../components/advance-balance/AdvanceBalanceTable";

export default function AdvanceBalance() {
  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Advance Balance</h1>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-[#F7F7F7] border border-[#00000026] rounded-xl px-4 py-2">
            <FiCalendar className="text-gray-500" />
            <span className="text-sm font-semibold text-gray-700">01 Jul 2026 — 09 Jul 2026</span>
          </div>
          <button className="flex items-center gap-2 bg-[#F7F7F7] border border-[#00000026] rounded-xl px-4 py-2 text-gray-700 font-semibold hover:bg-gray-100 transition">
            <FiFilter /> Filter
          </button>
        </div>
      </div>

      <div className="mb-6 relative w-64">
        <select className="w-full appearance-none rounded-xl border border-[#00000026] bg-white px-4 py-3 font-semibold text-gray-800 outline-none focus:border-[#4B5EAA]">
          <option>Adam Hotel</option>
          <option>Apex Industries</option>
          <option>Splyzone Pvt Ltd</option>
        </select>
        <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" />
      </div>

      <AdvanceBalanceStatCards />
      <AdvanceBalanceTable />
    </div>
  );
}
