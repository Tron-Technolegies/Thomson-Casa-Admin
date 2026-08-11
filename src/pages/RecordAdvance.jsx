import React from "react";
import { FiCalendar, FiFilter } from "react-icons/fi";
import AdvanceStatCards from "../components/advance/AdvanceStatCards";
import AdvanceTable from "../components/advance/AdvanceTable";
import RecordAdvanceModal from "../components/advance/RecordAdvanceModal";

export default function RecordAdvance() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Record Advance</h1>
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

      <AdvanceStatCards />
      
      <AdvanceTable onRecordAdvance={() => setIsModalOpen(true)} />

      <RecordAdvanceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
