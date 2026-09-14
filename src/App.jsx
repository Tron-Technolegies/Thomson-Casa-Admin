import React from "react";
import { Route, Routes } from "react-router-dom";
import { NotificationProvider } from "./context/NotificationContext";
import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/layout/ProtectedRoute";
import Login from "./pages/Login";
import StaffManagement from "./pages/StaffManagement";

import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import CuttingTeam from "./pages/CuttingTeam";
import Accounts from "./pages/Accounts";
import RecordAdvance from "./pages/RecordAdvance";
import AdvanceBalance from "./pages/AdvanceBalance";
import Invoice from "./pages/Invoice";
import Reports from "./pages/Reports";
import SalesReport from "./pages/SalesReport";
import Notification from "./pages/Notification";
import Categories from "./pages/Categories";

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="customers" element={<Customers />} />
              <Route path="orders" element={<Orders />} />
              <Route path="cutting-orders" element={<CuttingTeam />} />
              <Route path="accounts" element={<Accounts />} />
              <Route path="record-advance" element={<RecordAdvance />} />
              <Route path="advance-balance" element={<AdvanceBalance />} />
              <Route path="invoice" element={<Invoice />} />
              <Route path="reports" element={<Reports />} />
              <Route path="sales-report" element={<SalesReport />} />
              <Route path="categories" element={<Categories />} />
              <Route path="notification" element={<Notification />} />
              <Route path="staff" element={<StaffManagement />} />
            </Route>
          </Route>
        </Routes>
      </NotificationProvider>
    </AuthProvider>
  );
}
