import React, { useState, useEffect } from "react";
import InvoiceStatCard from "../components/invoice/InvoiceStatCard";
import InvoiceTable from "../components/invoice/InvoiceTable";
import DateRange from "../components/sales/DateRange";
import { api } from "../services/api";

function Invoice() {
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState({
    total_invoiced: 0,
    total_tax: 0,
    gross_total: 0,
    amount_paid: 0,
    cleared_count: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [date, setDate] = useState("");

  const fetchInvoices = async () => {
    try {
      const url = date ? `/accounts/invoices/?date=${date}` : "/accounts/invoices/";
      const res = await api.get(url);
      if (res.success) {
        setInvoices(res.invoices || []);
        setStats(res.stats || {
          total_invoiced: 0,
          total_tax: 0,
          gross_total: 0,
          amount_paid: 0,
          cleared_count: 0
        });
      } else {
        setError(res.message || "Failed to load invoices.");
      }
    } catch (err) {
      setError("Error connecting to server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [date]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Invoice</h1>
          <p className="text-gray-500 mt-1">Manage customer invoices and payments</p>
        </div>
        <DateRange date={date} setDate={setDate} />
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <InvoiceStatCard
          title="Total Invoiced"
          value={`₹${stats.total_invoiced.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
          subtitle="Net amount"
          type="invoice"
        />

        <InvoiceStatCard 
          title="Total Tax" 
          value={`₹${stats.total_tax.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} 
          subtitle="GST collected" 
          type="tax" 
        />

        <InvoiceStatCard
          title="Gross Total"
          value={`₹${stats.gross_total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
          subtitle="Incl. taxes"
          type="gross"
        />

        <InvoiceStatCard
          title="Amount Paid"
          value={`₹${stats.amount_paid.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
          subtitle={`${stats.cleared_count} invoices cleared`}
          type="paid"
        />
      </div>

      {/* Table */}
      <InvoiceTable invoices={invoices} loading={loading} onPaymentSuccess={fetchInvoices} />
    </div>
  );
}

export default Invoice;
