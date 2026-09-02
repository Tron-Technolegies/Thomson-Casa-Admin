import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaFilePdf, FaShareAlt, FaMoneyBillWave } from "react-icons/fa";
import { api, BASE_URL } from "../../services/api";
import RecordPaymentModal from "./RecordPaymentModal";

function InvoicePreviewModal({ open, onClose, invoice, onPaymentSuccess }) {
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const fetchPayments = async () => {
    if (!invoice) return;
    setLoadingPayments(true);
    try {
      const res = await api.get(`/accounts/invoices/${invoice.invoice_id || invoice.id}/payments/`);
      if (res.success) {
        setPayments(res.payments || []);
      }
    } catch (err) {
      console.error("Failed to load payments", err);
    } finally {
      setLoadingPayments(false);
    }
  };

  useEffect(() => {
    if (open && invoice) {
      fetchPayments();
    } else {
      setPayments([]);
    }
  }, [open, invoice]);

  const handleDownloadPDF = () => {
    if (!invoice) return;
    const invoiceId = invoice.invoice_id || invoice.id;
    window.open(`${BASE_URL}/accounts/invoices/${invoiceId}/pdf/`, '_blank');
  };

  if (!open || !invoice) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white h-[600px] rounded-2xl shadow-2xl w-full max-w-3xl overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#00000026] px-6 py-4 p-5">
          <h2 className="text-2xl font-bold">Invoice #{invoice.id || invoice.invoice_id}</h2>
          <div className="flex items-center gap-3">
            {invoice.status !== "Paid" && (
              <button 
                onClick={() => setShowPaymentForm(true)}
                className="flex items-center gap-2 px-4 py-2 cursor-pointer rounded-lg bg-[#4B5EAA] text-white font-semibold hover:bg-[#3f518f] transition-colors"
              >
                <FaMoneyBillWave />
                Record Payment
              </button>
            )}
            <button 
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer rounded-lg bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors"
            >
              <FaFilePdf />
              PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer bg-green-50 text-green-600 font-semibold hover:bg-green-100 transition-colors">
              <FaShareAlt />
              Share
            </button>
            <button onClick={onClose} className="cursor-pointer text-gray-400 hover:text-gray-600">
              <IoClose size={24} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 space-y-8">
          {/* Company + Invoice */}
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h3 className="text-2xl font-bold text-[#4B5EAA]">Thomson Casa</h3>
              <p className="text-gray-500 font-medium mt-1">Chicken Supply Management</p>
              <p className="text-sm text-gray-500 mt-4">123 Market Street</p>
              <p className="text-sm text-gray-500">Chennai, Tamil Nadu 600001</p>
              <p className="text-sm text-gray-500">GST: 33ABCDE1234F1Z5</p>
            </div>
            <div className="text-right">
              <h2 className="text-4xl font-black text-gray-900 tracking-wider">INVOICE</h2>
              <p className="mt-3 text-gray-600 font-medium">Order : {invoice.order_id || invoice.order}</p>
              <p className="text-gray-600 font-medium">Date : {invoice.date || invoice.due_date}</p>
              <p className="text-gray-600 font-medium">Due : {invoice.delivery_date || invoice.due_date}</p>
            </div>
          </div>

          {/* Bill To */}
          <div className="bg-[#F8F9FB] rounded-xl p-6 border border-gray-100">
            <h4 className="text-xs font-bold text-gray-400 tracking-wider mb-2">BILL TO</h4>
            <h3 className="text-xl font-bold text-gray-900">{invoice.customer}</h3>
            <p className="text-sm text-gray-500 mt-1">Chennai, Tamil Nadu</p>
          </div>

          {/* Item Table */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-bold text-gray-500 uppercase tracking-wider text-xs">Item</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-500 uppercase tracking-wider text-xs">Weight</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-500 uppercase tracking-wider text-xs">Rate</th>
                  <th className="text-right py-3 px-4 font-bold text-gray-500 uppercase tracking-wider text-xs">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoice.items && invoice.items.length > 0 ? (
                  invoice.items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium text-gray-900">{item.chicken_type_snapshot}</td>
                      <td className="py-4 px-4 text-gray-600">{item.weight_snapshot} Kg</td>
                      <td className="py-4 px-4 text-gray-600">₹{item.selling_price_per_kg_snapshot}/Kg</td>
                      <td className="py-4 px-4 text-right font-bold text-gray-900">₹{item.subtotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-4 px-4 text-center text-gray-500">No item details available in this view.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals & Payments */}
          <div className="flex flex-col md:flex-row justify-between pt-4 gap-8">
            {/* Payment History */}
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Payment History</h4>
              {loadingPayments ? (
                <p className="text-sm text-gray-500">Loading payments...</p>
              ) : payments.length > 0 ? (
                <div className="space-y-3">
                  {payments.map(p => (
                    <div key={p.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{p.payment_method}</p>
                        <p className="text-xs text-gray-500">{p.date}</p>
                        {p.reference_no && <p className="text-xs text-gray-400">Ref: {p.reference_no}</p>}
                      </div>
                      <span className="font-bold text-green-600">+₹{parseFloat(p.amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100 text-center">No direct payments made.</p>
              )}
            </div>

            {/* Totals */}
            <div className="w-80 space-y-3 shrink-0">
              <div className="flex justify-between text-gray-600">
                <span className="font-medium">Subtotal</span>
                <span className="font-semibold text-gray-900">₹{invoice.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="font-medium">
                  GST ({invoice.gst_type === 'percentage' ? `${invoice.gst_input}%` : `₹${invoice.gst_input} Fixed`})
                </span>
                <span className="font-semibold text-gray-900">₹{invoice.tax.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-3">
                <span>Total Amount</span>
                <span>₹{invoice.total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between text-red-500 font-medium">
                <span>Advance Used</span>
                <span>-₹{invoice.advance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
              {payments.length > 0 && (
                <div className="flex justify-between text-green-600 font-medium border-t border-gray-100 pt-3">
                  <span>Direct Payments</span>
                  <span>-₹{payments.reduce((sum, p) => sum + parseFloat(p.amount), 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
              )}
              <div className="flex justify-between text-2xl font-black text-gray-900 bg-gray-50 p-4 rounded-xl border border-gray-100 mt-4">
                <span>Balance Due</span>
                <span className="text-[#4B5EAA]">₹{invoice.balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-5 flex justify-between text-sm text-gray-400 font-medium">
            <span>Generated by Thomson Casa ERP</span>
            <span>GST Invoice</span>
          </div>
        </div>
      </div>

      <RecordPaymentModal
        open={showPaymentForm}
        onClose={() => setShowPaymentForm(false)}
        invoice={invoice}
        onSuccess={() => {
          fetchPayments(); // Refresh payments within modal
          if (onPaymentSuccess) onPaymentSuccess(); // Refresh table behind it
        }}
      />
    </div>
  );
}

export default InvoicePreviewModal;
