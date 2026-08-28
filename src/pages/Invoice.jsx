import React, { useState, useEffect } from "react";
import InvoiceStatCards from "../components/invoice/InvoiceStatCards";
import InvoiceTable from "../components/invoice/InvoiceTable";
import InvoiceModal from "../components/invoice/InvoiceModal";
import { api } from "../services/api";

export default function Invoice() {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const res = await api.get("/admin/invoices/");
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
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Invoice</h1>
      </div>

      <InvoiceStatCards />
      
      <InvoiceTable invoices={invoices} loading={loading} onOpenModal={(invoice) => setSelectedInvoice(invoice)} />

      <InvoiceModal 
        isOpen={!!selectedInvoice} 
        onClose={() => setSelectedInvoice(null)}
        invoice={selectedInvoice}
      />
    </div>
  );
}
