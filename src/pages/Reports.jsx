import React, { useState } from "react";
import { FiTrendingUp, FiFileText, FiShoppingCart } from "react-icons/fi";
import { BiPurchaseTagAlt } from "react-icons/bi";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { VscCreditCard, VscGraph } from "react-icons/vsc";
import { TbInvoice } from "react-icons/tb";

import SalesReports from "../components/reports/SalesReports";
import CustomerPurchaseReport from "../components/reports/CustomerPurchaseReport";
import CustomerBalanceReport from "../components/reports/CustomerBalanceReport";
import OutstandingPaymentReport from "../components/reports/OutstandingPaymentReport";
import AdvanceBalanceReport from "../components/reports/AdvanceBalanceReport";
import InvoiceReport from "../components/reports/InvoiceReport";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("Sales Report");
  const [period, setPeriod] = useState("Daily");

  const tabs = [
    { name: "Sales Report", icon: <FiFileText /> },
    { name: "Customer Purchase", icon: <BiPurchaseTagAlt /> },
    { name: "Customer balance", icon: <MdOutlineAccountBalanceWallet /> },
    { name: "Outstanding Payment", icon: <VscCreditCard /> },
    { name: "Advance Balance", icon: <VscGraph /> },
    { name: "Invoice Report", icon: <TbInvoice /> },
  ];

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>

        {/* Period Segmented Control */}
        <div className="flex bg-white border border-[#00000026] rounded-xl p-1">
          {["Daily", "Weekly", "Monthly"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
                period === p ? "bg-[#4B5EAA] text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {p === "Daily" && <FiFileText size={14} />}
              {p === "Weekly" && <span>₹</span>}
              {p === "Monthly" && <FiShoppingCart size={14} />}
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto bg-white border border-[#00000026] rounded-xl p-1 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
              activeTab === tab.name ? "bg-[#4B5EAA] text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div>
        {activeTab === "Sales Report" && <SalesReports />}
        {activeTab === "Customer Purchase" && <CustomerPurchaseReport />}
        {activeTab === "Customer balance" && <CustomerBalanceReport />}
        {activeTab === "Outstanding Payment" && <OutstandingPaymentReport />}
        {activeTab === "Advance Balance" && <AdvanceBalanceReport />}
        {activeTab === "Invoice Report" && <InvoiceReport />}
      </div>
    </div>
  );
}
