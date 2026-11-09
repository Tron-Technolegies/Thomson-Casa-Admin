
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

        {/* Desktop / Tablet Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-[1200px] w-full">
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
                  <tr
                    key={invoice.id}
                    className="border-t border-[#00000026] hover:bg-gray-50"
                  >
                    <td className="px-6 py-5 text-[#4B5EAA] font-bold whitespace-nowrap">
                      {invoice.id}
                    </td>

                    <td className="px-6 font-medium text-gray-900">
                      {invoice.customer}
                    </td>

                    <td className="px-6 text-gray-600 whitespace-nowrap">
                      {invoice.date}
                    </td>

                    <td className="px-6 font-medium text-gray-900 whitespace-nowrap">
                      ₹{invoice.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    <td className="px-6 text-gray-500 whitespace-nowrap">
                      ₹{invoice.tax.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    <td className="px-6 font-bold text-gray-900 whitespace-nowrap">
                      ₹{invoice.total.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    <td className="px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                          badge[invoice.status] || badge.Unpaid
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>

                    <td className="px-6 font-medium text-red-500 whitespace-nowrap">
                      ₹{invoice.advance.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    <td className="px-6 font-bold text-green-600 whitespace-nowrap">
                      ₹{invoice.balance.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    <td className="px-6">
                      <button
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setOpenModal(true);
                        }}
                        className="bg-[#4B5EAA] text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-[#3f518f] mx-auto text-sm font-semibold transition-colors whitespace-nowrap"
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

        {/* Mobile / Tablet Cards */}
        <div className="lg:hidden p-3 sm:p-4 space-y-3">
          {loading ? (
            <div className="py-8 text-center text-gray-500">
              Loading invoices...
            </div>
          ) : invoices.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No invoices found.
            </div>
          ) : (
            invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="border border-gray-200 rounded-xl p-4 space-y-4 hover:bg-gray-50 transition"
              >
                {/* Invoice Header */}
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 font-semibold uppercase">
                      Invoice No
                    </p>
                    <h3 className="text-base font-bold text-[#4B5EAA] mt-1 break-words">
                      {invoice.id}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 break-words">
                      {invoice.customer}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
                      badge[invoice.status] || badge.Unpaid
                    }`}
                  >
                    {invoice.status}
                  </span>
                </div>

                {/* Date */}
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-400 font-semibold uppercase">
                    Invoice Date
                  </p>
                  <p className="text-sm text-gray-700 font-medium mt-1">
                    {invoice.date}
                  </p>
                </div>

                {/* Amount Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Amount</p>
                    <p className="text-sm font-semibold text-gray-900 break-words">
                      ₹{invoice.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Tax</p>
                    <p className="text-sm font-semibold text-gray-700 break-words">
                      ₹{invoice.tax.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Advance Used</p>
                    <p className="text-sm font-semibold text-red-500 break-words">
                      ₹{invoice.advance.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Balance</p>
                    <p className="text-sm font-bold text-green-600 break-words">
                      ₹{invoice.balance.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center gap-3 border-t border-gray-100 pt-3">
                  <span className="text-sm font-semibold text-gray-600">
                    Invoice Total
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    ₹{invoice.total.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                {/* View Button */}
                <button
                  onClick={() => {
                    setSelectedInvoice(invoice);
                    setOpenModal(true);
                  }}
                  className="w-full bg-[#4B5EAA] text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-[#3f518f] text-sm font-semibold transition-colors"
                >
                  <FaFilePdf size={14} />
                  View Invoice
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Invoice Preview Modal */}
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
