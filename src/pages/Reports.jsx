
import React, { useState } from "react";

import {
  FiFileText,
  FiShoppingCart,
} from "react-icons/fi";

import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { VscGraph } from "react-icons/vsc";
import { TbInvoice } from "react-icons/tb";

import SalesReports from "../components/reports/SalesReports";
import BalanceAmountReport from "../components/reports/BalanceAmountReport";
import AdvanceBalanceReport from "../components/reports/AdvanceBalanceReport";
import InvoiceReport from "../components/reports/InvoiceReport";

export default function Reports() {
  const [activeTab, setActiveTab] = useState(
    "Sales Report"
  );

  const [period, setPeriod] = useState("Daily");

  const tabs = [
    {
      name: "Sales Report",
      icon: <FiFileText />,
    },
    {
      name: "Balance Amount Details",
      icon: <MdOutlineAccountBalanceWallet />,
    },
    {
      name: "Advance Balance",
      icon: <VscGraph />,
    },
    {
      name: "Invoice Report",
      icon: <TbInvoice />,
    },
  ];

  return (
    <div className="mx-auto max-w-[1600px] pb-10">

      {/* Page heading */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Reports
        </h1>

        {/* Existing period selector */}
        <div className="flex max-w-full overflow-x-auto rounded-xl border border-[#00000026] bg-white p-1">
          {["Daily", "Weekly", "Monthly"].map(
            (option) => (
              <button
                type="button"
                key={option}
                onClick={() => setPeriod(option)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition sm:px-6 ${
                  period === option
                    ? "bg-[#4B5EAA] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {option === "Daily" && (
                  <FiFileText size={14} />
                )}

                {option === "Weekly" && (
                  <span>₹</span>
                )}

                {option === "Monthly" && (
                  <FiShoppingCart size={14} />
                )}

                {option}
              </button>
            )
          )}
        </div>
      </div>

      {/* Report tabs */}
      <div className="mb-8 flex items-center gap-2 overflow-x-auto rounded-xl border border-[#00000026] bg-white p-1">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.name}
            onClick={() =>
              setActiveTab(tab.name)
            }
            className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold transition sm:px-5 ${
              activeTab === tab.name
                ? "bg-[#4B5EAA] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      {/* Report content */}
      <div>
        {activeTab === "Sales Report" && (
          <SalesReports period={period} />
        )}

        {activeTab === "Balance Amount Details" && (
          <BalanceAmountReport period={period} />
        )}

        {activeTab === "Advance Balance" && (
          <AdvanceBalanceReport period={period} />
        )}

        {activeTab === "Invoice Report" && (
          <InvoiceReport period={period} />
        )}
      </div>
    </div>
  );
}
