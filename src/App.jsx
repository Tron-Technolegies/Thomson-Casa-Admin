import React from "react";
import { Route, Routes } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import CuttingTeam from "./pages/CuttingTeam";

export default function App() {
  return (
    <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Dashboard />} />
      <Route path="customers" element={<Customers />} />
      <Route path="orders" element={<Orders />} />
      <Route path="cutting-orders" element={<CuttingTeam />} />
    </Route>
  </Routes>
  );
}
