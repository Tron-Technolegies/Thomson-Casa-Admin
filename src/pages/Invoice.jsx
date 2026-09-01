import React, { useState, useEffect } from "react";
import { FiCalendar, FiFilter } from "react-icons/fi";
import InvoiceStatCards from "../components/invoice/InvoiceStatCards";
import InvoiceTable from "../components/invoice/InvoiceTable";
import InvoiceModal from "../components/invoice/InvoiceModal";
import { api } from "../services/api";

export default function Invoice() {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const pastWeek = new Date(today);
  pastWeek.setDate(pastWeek.getDate() - 7);
  const [startDate, setStartDate] = useState(pastWeek.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (startDate) query.append("start_date", startDate);
        if (endDate) query.append("end_date", endDate);

        const res = await api.get(`/admin/invoices/?${query.toString()}`);
        if (res.success) {
          setInvoices(res.invoices || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [startDate, endDate]);

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Invoice</h1>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-[#F7F7F7] border border-[#00000026] rounded-xl px-4 py-2">
            <FiCalendar className="text-gray-500" />
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-sm font-semibold text-gray-700 outline-none cursor-pointer" 
            />
            <span className="text-gray-400 px-1">—</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-sm font-semibold text-gray-700 outline-none cursor-pointer" 
            />
          </div>
          <button className="flex items-center gap-2 bg-[#F7F7F7] border border-[#00000026] rounded-xl px-4 py-2 text-gray-700 font-semibold hover:bg-gray-100 transition">
            <FiFilter /> Filter
          </button>
        </div>
      </div>

      <InvoiceStatCards invoices={invoices} />
      
      <InvoiceTable invoices={invoices} loading={loading} onOpenModal={(invoice) => setSelectedInvoice(invoice)} />

      <InvoiceModal 
        isOpen={!!selectedInvoice} 
        onClose={() => setSelectedInvoice(null)}
        invoice={selectedInvoice}
      />
    </div>
  );
}
