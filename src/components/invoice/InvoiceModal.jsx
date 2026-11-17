
import { useState, useEffect } from "react";
import {
  FiDownload,
  FiShare2,
  FiUser,
  FiPlus,
  FiDollarSign,
} from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { api } from "../../services/api";
import {
  downloadInvoicePDF,
  shareInvoicePDF,
  shareInvoiceWhatsApp,
} from "../../utils/invoiceSharing";

export default function InvoiceModal({
  isOpen,
  onClose,
  invoice,
  onPaymentSuccess,
}) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState("");
  const [shareMessage, setShareMessage] = useState("");

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Cash");
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");

  const [invoiceStats, setInvoiceStats] = useState({
    total_invoice: 0,
    advance_used: 0,
    total_payments: 0,
    remaining_amount: 0,
    status: "Unpaid",
  });

  const invoiceNumber =
    invoice?.invoice_number || invoice?.id;

  const getValidInvoiceId = () => {
    const rawId = invoice?.pk ?? invoice?.invoice_id;
    const realId = Number(rawId);

    if (!Number.isInteger(realId) || realId <= 0) {
      throw new Error(
        "Invoice database ID is missing. Refresh the invoice list."
      );
    }

    return realId;
  };

  const money = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const fetchPayments = async () => {
    if (!invoice) return;

    setLoading(true);
    setError("");

    try {
      const realId = getValidInvoiceId();

      const response = await api.get(
        `/admin/invoices/${realId}/payments/`,
        false
      );

      if (!response.success) {
        throw new Error(
          response.message || "Failed to load payments."
        );
      }

      setPayments(response.payments || []);

      setInvoiceStats({
        total_invoice: Number(
          response.total_invoice ?? invoice.total ?? 0
        ),
        advance_used: Number(
          response.advance_used ?? invoice.advance ?? 0
        ),
        total_payments: Number(
          response.total_payments ?? 0
        ),
        remaining_amount: Number(
          response.remaining_amount ?? invoice.balance ?? 0
        ),
        status: response.status || invoice.status || "Unpaid",
      });
    } catch (err) {
      console.error("Fetch payments error:", err);
      setError(err.message || "Failed to load payments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen || !invoice) return;

    setShowPaymentForm(false);
    setAmount("");
    setMethod("Cash");
    setReference("");
    setNote("");
    setError("");
    setShareMessage("");

    fetchPayments();
  }, [isOpen, invoice?.pk, invoice?.invoice_id, invoice?.id]);

  const handleAddPayment = async (e) => {
    e.preventDefault();

    if (submitting) return;

    setError("");

    const paymentAmount = Number(amount);

    if (
      !Number.isFinite(paymentAmount) ||
      paymentAmount <= 0
    ) {
      setError("Please enter a valid payment amount.");
      return;
    }

    if (
      paymentAmount >
      Number(invoiceStats.remaining_amount)
    ) {
      setError(
        "Payment cannot exceed the outstanding balance."
      );
      return;
    }

    setSubmitting(true);

    try {
      const realId = getValidInvoiceId();

      const payload = {
        amount: paymentAmount,
        payment_method: method,
        reference_no: reference.trim(),
        note: note.trim(),
      };

      const res = await api.post(
        `/admin/invoices/${realId}/payments/add/`,
        payload
      );

      if (!res.success) {
        throw new Error(
          res.message || "Failed to record payment."
        );
      }

      setShowPaymentForm(false);
      setAmount("");
      setReference("");
      setNote("");

      await fetchPayments();

      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(
        err.message || "Unable to record payment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!invoice || pdfLoading) return;

    setPdfLoading(true);
    setError("");
    setShareMessage("");

    try {
      await downloadInvoicePDF(invoice);
    } catch (err) {
      console.error("PDF download error:", err);
      setError(
        err.message || "Unable to download invoice."
      );
    } finally {
      setPdfLoading(false);
    }
  };

  const handleSharePDF = async () => {
    if (!invoice || pdfLoading) return;

    setPdfLoading(true);
    setError("");
    setShareMessage("");

    try {
      const result = await shareInvoicePDF(invoice);

      if (result === "downloaded") {
        setShareMessage(
          "PDF downloaded. Attach it manually in WhatsApp, email, or another application."
        );
      }
    } catch (err) {
      console.error("Invoice share error:", err);
      setError(
        err.message || "Unable to share invoice."
      );
    } finally {
      setPdfLoading(false);
    }
  };

  const handleWhatsApp = () => {
    if (!invoice) return;

    setError("");
    setShareMessage("");

    try {
      shareInvoiceWhatsApp(invoice);
      setShareMessage(
        "WhatsApp opened with invoice details. Attach the invoice PDF manually."
      );
    } catch (err) {
      setError(
        err.message || "Unable to open WhatsApp."
      );
    }
  };

  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[92vh]">

        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-5 bg-white">
          <h2 className="text-xl font-bold text-gray-900">
            Invoice #{invoiceNumber}
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={pdfLoading}
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <FiDownload />
              {pdfLoading ? "Preparing..." : "PDF"}
            </button>

            <button
              type="button"
              onClick={handleSharePDF}
              disabled={pdfLoading}
              className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-100 disabled:opacity-50"
            >
              <FiShare2 />
              Share
            </button>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              WhatsApp
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close invoice"
              className="ml-2 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <IoClose size={24} />
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 sm:p-8 overflow-y-auto">

          {error && (
            <div
              role="alert"
              className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm"
            >
              {error}
            </div>
          )}

          {shareMessage && (
            <div
              role="status"
              className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg p-3 text-sm"
            >
              {shareMessage}
            </div>
          )}

          {/* Company */}
          <div className="flex flex-col md:flex-row justify-between gap-5 mb-8">
            <div className="flex gap-4">
              <div className="bg-[#4B5EAA] p-4 rounded-xl text-white h-14 w-14 flex items-center justify-center">
                <FiUser size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Thomson Casa
                </h3>
                <p className="text-sm text-gray-500 font-medium mb-2">
                  Chicken Supply Management
                </p>
                <p className="text-sm text-gray-500">
                  123 Market Street, Chennai, TN 600001
                </p>
                <p className="text-sm text-gray-500">
                  GST: 33AABCT1234F1ZK | Phone: +91 44 1234 5678
                </p>
              </div>
            </div>

            <div className="md:text-right">
              <h2 className="text-3xl font-black text-gray-900 mb-2">
                INVOICE
              </h2>
              <p className="text-sm text-gray-600">
                {invoiceNumber}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Date: {invoice.date}
              </p>

              <span
                className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  invoiceStats.status === "Paid"
                    ? "bg-green-100 text-green-700"
                    : invoiceStats.status === "Partial"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {invoiceStats.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Customer */}
          <div className="bg-[#F8F9FB] rounded-2xl p-6 mb-8">
            <p className="text-xs font-bold text-gray-400 uppercase mb-2">
              Bill To
            </p>
            <h4 className="text-lg font-bold text-gray-900">
              {invoice.customer}
            </h4>
            <p className="text-sm text-gray-500">
              Chennai, Tamil Nadu
            </p>
          </div>

          {/* Invoice summary */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left text-sm border border-gray-200">
              <thead className="bg-gray-100 text-xs uppercase text-gray-500 font-bold">
                <tr>
                  <th className="py-3 px-4">
                    Item Summary
                  </th>
                  <th className="py-3 px-4 text-right">
                    Total Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="py-4 px-4 font-medium">
                    Total Goods Value (Pre-Tax)
                  </td>
                  <td className="py-4 px-4 font-bold text-right">
                    ₹{money(invoice.amount)}
                  </td>
                </tr>

                {Number(invoice.tax) > 0 && (
                  <tr className="border-t">
                    <td className="py-4 px-4 font-medium">
                      GST
                    </td>
                    <td className="py-4 px-4 font-bold text-right">
                      ₹{money(invoice.tax)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Invoice totals */}
          <div className="flex justify-end border-b border-gray-200 pb-6 mb-6">
            <div className="w-full sm:w-80 space-y-4">

              <div className="flex justify-between">
                <span className="text-gray-600">
                  Grand Total
                </span>
                <span className="font-bold">
                  ₹{money(invoiceStats.total_invoice)}
                </span>
              </div>

              <div className="flex justify-between text-red-500 font-bold">
                <span>Advance Used</span>
                <span>
                  -₹{money(invoiceStats.advance_used)}
                </span>
              </div>

              <div className="flex justify-between text-green-600 font-bold">
                <span>Direct Payments</span>
                <span>
                  -₹{money(invoiceStats.total_payments)}
                </span>
              </div>

              <div className="flex justify-between bg-gray-50 p-4 rounded-xl border border-gray-200 font-black">
                <span>Balance Due</span>
                <span className="text-[#4B5EAA]">
                  ₹{money(invoiceStats.remaining_amount)}
                </span>
              </div>
            </div>
          </div>

          {/* PAYMENT HISTORY */}
          <div className="mt-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FiDollarSign className="text-[#4B5EAA]" />
                Payment History
              </h3>

              {invoiceStats.remaining_amount > 0 &&
                !showPaymentForm && (
                  <button
                    type="button"
                    onClick={() => setShowPaymentForm(true)}
                    className="flex items-center gap-2 rounded-xl bg-[#4B5EAA] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3d4f92]"
                  >
                    <FiPlus />
                    Record Payment
                  </button>
                )}
            </div>

            {/* RECORD PAYMENT FORM */}
            {showPaymentForm && (
              <form
                onSubmit={handleAddPayment}
                className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-6"
              >
                <h4 className="text-sm font-bold text-blue-900 mb-4">
                  Record New Payment
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-blue-800 mb-1">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      max={invoiceStats.remaining_amount}
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-blue-200 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-blue-800 mb-1">
                      Method
                    </label>
                    <select
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-blue-200 outline-none bg-white"
                    >
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="Bank Transfer">
                        Bank Transfer
                      </option>
                      <option value="Cheque">Cheque</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-blue-800 mb-1">
                      Reference No
                    </label>
                    <input
                      type="text"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="Optional"
                      className="w-full h-10 px-3 rounded-lg border border-blue-200 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-blue-800 mb-1">
                      Note
                    </label>
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Optional"
                      className="w-full h-10 px-3 rounded-lg border border-blue-200 outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPaymentForm(false)}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting || loading}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
                  >
                    {submitting
                      ? "Saving..."
                      : "Submit Payment"}
                  </button>
                </div>
              </form>
            )}

            {/* PAYMENT LIST */}
            {loading ? (
              <p className="text-sm text-gray-500">
                Loading payments...
              </p>
            ) : payments.length === 0 ? (
              <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                No direct payments recorded yet.
              </p>
            ) : (
              <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full min-w-[600px] text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Method</th>
                      <th className="py-3 px-4">Reference</th>
                      <th className="py-3 px-4">Note</th>
                      <th className="py-3 px-4 text-right">
                        Amount
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {payments.map((p) => (
                      <tr key={p.id}>
                        <td className="py-3 px-4">
                          {p.date}
                        </td>
                        <td className="py-3 px-4">
                          {p.payment_method || p.method}
                        </td>
                        <td className="py-3 px-4">
                          {p.reference_no || p.reference || "-"}
                        </td>
                        <td className="py-3 px-4">
                          {p.note || "-"}
                        </td>
                        <td className="py-3 px-4 font-bold text-green-600 text-right">
                          ₹{money(p.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center gap-3">
          <span className="text-xs text-gray-400">
            Generated by Thomson Casa Billing System
          </span>
          <span className="text-xs text-gray-400">
            GST Invoice | {invoiceNumber}
          </span>
        </div>
      </div>
    </div>
  );
}
