import React from "react";
import { Route, Routes } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import CuttingTeam from "./pages/CuttingTeam";
import Accounts from "./pages/Accounts";
import RecordAdvance from "./pages/RecordAdvance";
import AdvanceBalance from "./pages/AdvanceBalance";
import Invoice from "./pages/Invoice";

export default function App() {
  return (
    <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Dashboard />} />
      <Route path="customers" element={<Customers />} />
      <Route path="orders" element={<Orders />} />
      <Route path="cutting-orders" element={<CuttingTeam />} />
      <Route path="accounts" element={<Accounts />} />
      <Route path="record-advance" element={<RecordAdvance />} />
      <Route path="advance-balance" element={<AdvanceBalance />} />
      <Route path="invoice" element={<Invoice />} />
    </Route>
  </Routes>
  );
}
