import React from "react";

const customers = [
  { id: "AS", name: "Amul Stores", orders: "42 Orders", amount: "$18.2k" },
  { id: "KH", name: "Kolkata Hyatt", orders: "28 Orders", amount: "$12.1k" },
  { id: "BM", name: "Big Mart Chain", orders: "35 Orders", amount: "$8.4k" },
  { id: "SP", name: "Sagar Plaza", orders: "12 Orders", amount: "$4.2k" },
];

export default function TopCustomers() {
  return (
    <div className="bg-white border border-[#00000026] rounded-xl p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Top Customers</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {customers.map((cust, idx) => (
          <div key={idx} className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#465C8F] text-white flex items-center justify-center font-semibold text-sm">
                {cust.id}
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">{cust.name}</h4>
                <p className="text-xs text-gray-500">{cust.orders}</p>
              </div>
            </div>
            <div className="text-[#465C8F] font-bold text-sm bg-indigo-50 px-2 py-1 rounded">
              {cust.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
