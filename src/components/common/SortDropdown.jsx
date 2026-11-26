
import React from "react";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";;
import { SORT_OPTIONS } from "../../utils/sortUtils";

export default function SortDropdown({
  value = "newest",
  onChange,
  allowAmount = true,
  allowDate = true,
  className = "",
}) {
  return (
    <label
      className={`flex flex-wrap items-center gap-2 min-w-0 ${className}`}
    >
    <div className="flex flex-col shrink-0 text-gray-500">
    <FiArrowUp size={12} />
    <FiArrowDown size={12} />
    </div>

      <span className="text-sm font-medium text-gray-600">
        Sort
      </span>

      <select
        aria-label="Sort table"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="min-w-0 w-full sm:w-52 border border-gray-300 rounded-lg bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#4B5EAA]/25"
      >
        {SORT_OPTIONS.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={
              (!allowDate &&
                ["newest", "oldest"].includes(
                  option.value
                )) ||
              (!allowAmount &&
                ["high", "low"].includes(
                  option.value
                ))
            }
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
