import React from "react";
import StatCards from "../components/dashboard/StatCards";
import SalesCharts from "../components/dashboard/SalesCharts";
import CustomerRevenue from "../components/dashboard/CustomerRevenue";
import CustomerBalance from "../components/dashboard/CustomerBalance";
import TopCustomers from "../components/dashboard/TopCustomers";
import RecentOrders from "../components/dashboard/RecentOrders";

export default function Dashboard() {
  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <StatCards />
      <SalesCharts />
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div>
          <CustomerRevenue />
        </div>
        <div className="flex flex-col gap-6">
          <CustomerBalance />
          <TopCustomers />
        </div>
      </div>

      <RecentOrders />
    </div>
  );
}
