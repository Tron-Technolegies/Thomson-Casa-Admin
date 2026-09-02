import { useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import InvoicePreviewModal from "./InvoicePreviewModal";

const badge = {
  Paid: "bg-green-100 text-green-700",
  Unpaid: "bg-red-100 text-red-600",
  Partial: "bg-yellow-100 text-yellow-700",
};

function InvoiceTable({ invoices = [], loading = false, onPaymentSuccess }) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  return (
    <>
      <div className="bg-white border border-[#00000026] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-500 text-sm">
                <th className="px-6 py-4">Invoice No</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Tax</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Advance Used</th>
                <th className="px-6 py-4">Balance</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" className="px-6 py-8 text-center text-gray-500">
                    Loading invoices...
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-6 py-8 text-center text-gray-500">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-t border-[#00000026] hover:bg-gray-50">
                    <td className="px-6 py-5 text-[#4B5EAA] font-bold">{invoice.id}</td>
                    <td className="px-6 font-medium text-gray-900">{invoice.customer}</td>
                    <td className="px-6 text-gray-600">{invoice.date}</td>
                    <td className="px-6 font-medium text-gray-900">₹{invoice.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    <td className="px-6 text-gray-500">₹{invoice.tax.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    <td className="px-6 font-bold text-gray-900">₹{invoice.total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    <td className="px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge[invoice.status] || badge.Unpaid}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 font-medium text-red-500">₹{invoice.advance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    <td className="px-6 font-bold text-green-600">₹{invoice.balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    <td className="px-6">
                      <button
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setOpenModal(true);
                        }}
                        className="bg-[#4B5EAA] text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-[#3f518f] mx-auto text-sm font-semibold transition-colors"
                      >
                        <FaFilePdf size={14} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <InvoicePreviewModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        invoice={selectedInvoice}
        onPaymentSuccess={onPaymentSuccess}
      />
    </>
  );
}

export default InvoiceTable;
