import React from "react";
import InvoiceStatCards from "../components/invoice/InvoiceStatCards";
import InvoiceTable from "../components/invoice/InvoiceTable";
import InvoiceModal from "../components/invoice/InvoiceModal";

export default function Invoice() {
  const [selectedInvoice, setSelectedInvoice] = React.useState(null);

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Invoice</h1>
      </div>

      <InvoiceStatCards />
      
      <InvoiceTable onOpenModal={(invoice) => setSelectedInvoice(invoice)} />

      <InvoiceModal 
        isOpen={!!selectedInvoice} 
        onClose={() => setSelectedInvoice(null)}
        invoice={selectedInvoice}
      />
    </div>
  );
}
