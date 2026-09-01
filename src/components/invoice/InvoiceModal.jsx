import React, { useState, useEffect } from "react";
import { FiDownload, FiShare2, FiUser, FiPlus, FiDollarSign } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { exportInvoiceToPDF } from "../../utils/pdfGenerator";
import { api } from "../../services/api";

export default function InvoiceModal({ isOpen, onClose, invoice }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Cash");
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");
  
  // Real-time backend stats
  const [invoiceStats, setInvoiceStats] = useState({
      total_invoice: 0,
      advance_used: 0,
      total_payments: 0,
      remaining_amount: 0,
      status: "Unpaid"
  });

  const fetchPayments = async () => {
      if (!invoice) return;
      setLoading(true);
      setError("");
      try {
          // Note: our new endpoint is /admin/invoices/<id>/payments/
          const res = await api.get(`/admin/invoices/${invoice.id.replace('INV', '').split('-').pop()}/payments/`); // HACK: extracting real ID if invoice.id is string
          // Wait, InvoiceModal gets passed `invoice`. What does `invoice.id` contain?
          // Looking at get_all_invoices, it returns `"id": inv.invoice_number` not the primary key!
          // Ah! I should update `get_all_invoices` to return the real `id` as `pk` or `id` and `invoice_number` as `invoice_number`.
          // For now, let's fix it by relying on the real ID if it's there. 
          // Let's assume we can fetch by invoice_number as well if we pass it, but our API uses <int:invoice_id>.
          // Actually, I'll update get_all_invoices to return `pk: inv.id`.
          const realId = invoice.pk || invoice.id; 
          
          const response = await api.get(`/admin/invoices/${realId}/payments/`);
          if (response.success) {
              setPayments(response.payments);
              setInvoiceStats({
                  total_invoice: response.total_invoice,
                  advance_used: response.advance_used,
                  total_payments: response.total_payments,
                  remaining_amount: response.remaining_amount,
                  status: response.status
              });
          }
      } catch (err) {
          setError(err.message || "Failed to load payments.");
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      if (isOpen && invoice) {
          fetchPayments();
          setShowPaymentForm(false);
          setAmount("");
          setMethod("Cash");
          setReference("");
          setNote("");
      }
  }, [isOpen, invoice]);

  const handleAddPayment = async (e) => {
      e.preventDefault();
      setError("");
      
      const realId = invoice.pk || invoice.id;
      
      try {
          const payload = {
              amount: parseFloat(amount),
              payment_method: method,
              reference_no: reference,
              note: note
          };
          const res = await api.post(`/admin/invoices/${realId}/payments/add/`, payload);
          if (res.success) {
              setShowPaymentForm(false);
              setAmount("");
              setReference("");
              setNote("");
              fetchPayments(); // refresh data
          } else {
              setError(res.message || "Failed to add payment.");
          }
      } catch (err) {
          setError(err.message || "An error occurred adding payment.");
      }
  };

  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-8 py-5 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">
            Invoice #{invoice.invoice_number || invoice.id}
          </h2>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => exportInvoiceToPDF(invoice)}
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              <FiDownload /> PDF
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-100 transition">
              <FiShare2 /> Share
            </button>
            <button
              onClick={onClose}
              className="ml-2 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
            >
              <IoClose size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto">
          {error && <div className="mb-4 text-red-500 bg-red-50 p-3 rounded-lg text-sm font-semibold">{error}</div>}
          
          <div className="flex justify-between items-start mb-8">
            <div className="flex gap-4">
              <div className="bg-[#4B5EAA] p-4 rounded-xl text-white h-14 w-14 flex items-center justify-center">
                <FiUser size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Thomson Casa</h3>
                <p className="text-sm text-gray-500 font-medium mb-2">Chicken Supply Management</p>
                <p className="text-sm text-gray-500">123 Market Street, Chennai, TN 600001</p>
                <p className="text-sm text-gray-500">GST: 33AABCT1234F1ZK | Phone: +91 44 1234 5678</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-black text-gray-900 mb-2">INVOICE</h2>
              <p className="text-sm text-gray-600 font-medium">{invoice.invoice_number || invoice.id}</p>
              <p className="text-sm text-gray-500 mt-1">Date: {invoice.date}</p>
              <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  invoiceStats.status === 'Paid' ? 'bg-green-100 text-green-700' :
                  invoiceStats.status === 'Partial' ? 'bg-orange-100 text-orange-700' :
                  'bg-red-100 text-red-700'
              }`}>{invoiceStats.status.toUpperCase()}</span>
            </div>
          </div>

          <div className="bg-[#F8F9FB] rounded-2xl p-6 mb-8">
            <p className="text-xs font-bold text-gray-400 tracking-wider mb-2 uppercase">Bill To</p>
            <h4 className="text-lg font-bold text-gray-900 mb-1">{invoice.customer}</h4>
            <p className="text-sm text-gray-500">Chennai, Tamil Nadu</p>
          </div>

          <table className="w-full text-left text-sm text-gray-600 mb-6 border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-xs uppercase text-gray-500 font-bold border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">ITEM SUMMARY</th>
                <th className="py-3 px-4 text-right">TOTAL AMOUNT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-4 px-4 font-medium text-gray-900">Total Goods Value (Pre-Tax)</td>
                <td className="py-4 px-4 font-bold text-gray-900 text-right">₹{invoice.amount?.toFixed(2)}</td>
              </tr>
              {invoice.tax > 0 && (
                <tr>
                  <td className="py-4 px-4 font-medium text-gray-900">GST</td>
                  <td className="py-4 px-4 font-bold text-gray-900 text-right">₹{invoice.tax?.toFixed(2)}</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end border-b border-gray-200 pb-6 mb-6">
            <div className="w-80">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 font-medium">Grand Total</span>
                <span className="font-bold text-gray-900">₹{invoiceStats.total_invoice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-red-500 font-bold">Advance Used</span>
                <span className="text-red-500 font-bold">-₹{invoiceStats.advance_used?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-4 border-t border-gray-100 pt-3">
                <span className="text-green-600 font-bold">Direct Payments</span>
                <span className="text-green-600 font-bold">-₹{invoiceStats.total_payments?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                <span className="text-gray-900 font-black text-lg">Balance Due</span>
                <span className="font-black text-[#4B5EAA] text-xl">₹{invoiceStats.remaining_amount?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment History & Action */}
          <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <FiDollarSign className="text-[#4B5EAA]" /> Payment History
                  </h3>
                  {invoiceStats.remaining_amount > 0 && !showPaymentForm && (
                      <button 
                          onClick={() => setShowPaymentForm(true)}
                          className="flex items-center gap-2 rounded-xl bg-[#4B5EAA] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3d4f92] transition"
                      >
                          <FiPlus /> Record Payment
                      </button>
                  )}
              </div>

              {showPaymentForm && (
                  <form onSubmit={handleAddPayment} className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-6">
                      <h4 className="text-sm font-bold text-blue-900 mb-4">Record New Payment</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div>
                              <label className="block text-xs font-semibold text-blue-800 mb-1">Amount (₹)</label>
                              <input 
                                  type="number" 
                                  step="0.01" 
                                  min="0.01"
                                  max={invoiceStats.remaining_amount}
                                  required 
                                  value={amount}
                                  onChange={e => setAmount(e.target.value)}
                                  className="w-full h-10 px-3 rounded-lg border border-blue-200 focus:border-[#4B5EAA] outline-none"
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-semibold text-blue-800 mb-1">Method</label>
                              <select 
                                  value={method}
                                  onChange={e => setMethod(e.target.value)}
                                  className="w-full h-10 px-3 rounded-lg border border-blue-200 focus:border-[#4B5EAA] outline-none"
                              >
                                  <option value="Cash">Cash</option>
                                  <option value="UPI">UPI</option>
                                  <option value="Bank Transfer">Bank Transfer</option>
                                  <option value="Cheque">Cheque</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-semibold text-blue-800 mb-1">Reference No</label>
                              <input 
                                  type="text" 
                                  value={reference}
                                  onChange={e => setReference(e.target.value)}
                                  placeholder="Optional"
                                  className="w-full h-10 px-3 rounded-lg border border-blue-200 focus:border-[#4B5EAA] outline-none"
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-semibold text-blue-800 mb-1">Note</label>
                              <input 
                                  type="text" 
                                  value={note}
                                  onChange={e => setNote(e.target.value)}
                                  placeholder="Optional"
                                  className="w-full h-10 px-3 rounded-lg border border-blue-200 focus:border-[#4B5EAA] outline-none"
                              />
                          </div>
                      </div>
                      <div className="flex justify-end gap-3">
                          <button 
                              type="button"
                              onClick={() => setShowPaymentForm(false)}
                              className="px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 rounded-lg transition"
                          >
                              Cancel
                          </button>
                          <button 
                              type="submit"
                              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                          >
                              Submit Payment
                          </button>
                      </div>
                  </form>
              )}

              {loading ? (
                  <p className="text-sm text-gray-500">Loading payments...</p>
              ) : payments.length === 0 ? (
                  <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">No direct payments recorded yet.</p>
              ) : (
                  <div className="overflow-x-auto border border-gray-200 rounded-xl">
                      <table className="w-full text-left text-sm text-gray-600">
                          <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold border-b border-gray-200">
                              <tr>
                                  <th className="py-3 px-4">Date</th>
                                  <th className="py-3 px-4">Method</th>
                                  <th className="py-3 px-4">Reference</th>
                                  <th className="py-3 px-4">Note</th>
                                  <th className="py-3 px-4 text-right">Amount</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                              {payments.map(p => (
                                  <tr key={p.id} className="hover:bg-gray-50">
                                      <td className="py-3 px-4 font-medium">{p.date}</td>
                                      <td className="py-3 px-4">
                                          <span className="bg-gray-100 px-2 py-1 rounded-md text-xs font-bold text-gray-600">{p.method}</span>
                                      </td>
                                      <td className="py-3 px-4 text-gray-500">{p.reference || '-'}</td>
                                      <td className="py-3 px-4 text-gray-500">{p.note || '-'}</td>
                                      <td className="py-3 px-4 font-bold text-green-600 text-right">₹{p.amount.toFixed(2)}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              )}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <span className="text-xs font-medium text-gray-400">Generated by Thomson Casa Billing System</span>
          <span className="text-xs font-medium text-gray-400">GST Invoice | {invoice.invoice_number || invoice.id}</span>
        </div>
      </div>
    </div>
  );
}
