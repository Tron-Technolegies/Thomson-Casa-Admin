import { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";

function FilterBar() {
  const [activeTab, setActiveTab] = useState("Daily");

  const tabs = ["Daily", "Weekly", "Monthly"];

  return (
    <div className="inline-flex items-center bg-white border border-[#00000026] rounded-xl p-1 shadow-2xs cursor-pointer">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 ${
            activeTab === tab ? "bg-[#4B5EAA] text-white shadow" : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          <FaCalendarAlt className="text-xs" />
          {tab}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;
