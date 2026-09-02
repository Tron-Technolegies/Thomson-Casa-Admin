import { FiCalendar, FiFilter } from "react-icons/fi";

function DateRange({ date, setDate }) {
  return (
    <div className="flex gap-3">
      <div className="flex items-center gap-2 border-[#00000026] border rounded-xl px-4 py-2 bg-[#EEF1F8] text-[#7A8AAA]">
        <FiCalendar />
        <input 
          type="date" 
          value={date || ""}
          onChange={(e) => setDate(e.target.value)}
          className="bg-transparent outline-none cursor-pointer"
        />
      </div>
    </div>
  );
}

export default DateRange;
