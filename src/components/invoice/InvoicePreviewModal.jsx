
import React, { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import {
  FaFilePdf,
  FaShareAlt,
  FaMoneyBillWave,
  FaWhatsapp,
} from "react-icons/fa";

import { api } from "../../services/api";
import * as invoiceSharing from "../../utils/invoiceSharing";

import {
  downloadDesignedInvoicePDF,
  shareDesignedInvoicePDF,
} from "../../utils/invoiceDesignPDF";

import RecordPaymentModal from "./RecordPaymentModal";

function InvoicePreviewModal({
  open,
  onClose,
  invoice,
  onPaymentSuccess,
}) {
  const invoiceContentRef = useRef(null);

  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const [pdfLoading, setPdfLoading] = useState(false);
  const [shareError, setShareError] = useState("");
  const [shareMessage, setShareMessage] = useState("");

  const [paymentStats, setPaymentStats] = useState(null);

  const invoiceDbId = invoice?.invoice_id ?? invoice?.pk;

  const invoiceNumber =
    invoice?.invoice_number ||
    invoice?.id ||
    "";

  const money = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const getValidInvoiceId = () => {
    const id = Number(invoiceDbId);

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(
        "Invoice database ID is missing. Please refresh the invoice list."
      );
    }

    return id;
  };

  // Fetch invoice payment history
  const fetchPayments = async () => {
    if (!invoice) return;

    setLoadingPayments(true);

    try {
      const id = getValidInvoiceId();

      const res = await api.get(
        `/accounts/invoices/${id}/payments/`,
        false
      );

      if (!res.success) {
        throw new Error(
          res.message || "Failed to load payment history."
        );
      }

      setPayments(res.payments || []);

      if (res.remaining_amount !== undefined) {
        setPaymentStats({
          remaining_amount: Number(res.remaining_amount),
          status: res.status,
          total_payments:
            res.total_payments !== undefined
              ? Number(res.total_payments)
              : null,
        });
      } else {
        setPaymentStats(null);
      }
    } catch (err) {
      console.error("Failed to load payments:", err);

      setShareError(
        err.message || "Unable to load payment history."
      );
    } finally {
      setLoadingPayments(false);
    }
  };

  // Load payments whenever a new invoice opens
  useEffect(() => {
    if (open && invoice) {
      setShareError("");
      setShareMessage("");
      setShowPaymentForm(false);
      setPayments([]);
      setPaymentStats(null);

      fetchPayments();
    } else {
      setPayments([]);
      setPaymentStats(null);
      setShowPaymentForm(false);
    }
    // Run when the active invoice changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, invoiceDbId, invoiceNumber]);

  // Download PDF with the exact invoice preview design
  const handleDownloadPDF = async () => {
    if (!invoice || pdfLoading) return;

    setPdfLoading(true);
    setShareError("");
    setShareMessage("");

    try {
      if (loadingPayments) {
        throw new Error(
          "Payment details are still loading. Please try again."
        );
      }

      await downloadDesignedInvoicePDF(
        invoiceContentRef.current,
        invoice
      );
    } catch (err) {
      console.error("Invoice PDF download error:", err);

      setShareError(
        err.message || "Unable to download invoice PDF."
      );
    } finally {
      setPdfLoading(false);
    }
  };

  // Share the same styled invoice PDF
  const handleSharePDF = async () => {
    if (!invoice || pdfLoading) return;

    setPdfLoading(true);
    setShareError("");
    setShareMessage("");

    try {
      if (loadingPayments) {
        throw new Error(
          "Payment details are still loading. Please try again."
        );
      }

      const result = await shareDesignedInvoicePDF(
        invoiceContentRef.current,
        invoice
      );

      if (result === "downloaded") {
        setShareMessage(
          "Invoice PDF downloaded. You can attach it in WhatsApp, email, or another application."
        );
      }
    } catch (err) {
      console.error("Invoice sharing error:", err);

      setShareError(
        err.message || "Unable to share invoice PDF."
      );
    } finally {
      setPdfLoading(false);
    }
  };

  // WhatsApp message sharing
  const handleWhatsApp = () => {
    if (!invoice) return;

    setShareError("");
    setShareMessage("");

    try {
      // Supports both existing utility function names.
      const whatsappFunction =
        invoiceSharing.shareInvoiceWhatsApp ||
        invoiceSharing.openInvoiceWhatsApp;

      if (typeof whatsappFunction !== "function") {
        throw new Error(
          "WhatsApp sharing function is missing in invoiceSharing.js."
        );
      }

      whatsappFunction(invoice);

      setShareMessage(
        "WhatsApp opened with invoice details. Please attach the downloaded invoice PDF manually."
      );
    } catch (err) {
      console.error("WhatsApp sharing error:", err);

      setShareError(
        err.message || "Unable to open WhatsApp."
      );
    }
  };

  // Refresh payment details after recording payment
  const handlePaymentSuccess = async () => {
    setShowPaymentForm(false);

    await fetchPayments();

    if (onPaymentSuccess) {
      onPaymentSuccess();
    }
  };

  if (!open || !invoice) return null;

  const directPayments = payments.reduce(
    (sum, payment) =>
      sum + Number(payment.amount || 0),
    0
  );

  const total = Number(
    invoice.total ?? invoice.total_amount ?? 0
  );

  const advance = Number(
    invoice.advance ?? invoice.advance_used ?? 0
  );

  const subtotal = Number(
    invoice.amount ??
      invoice.subtotal ??
      total - Number(invoice.tax ?? invoice.gst_amount ?? 0)
  );

  const gstAmount = Number(
    invoice.tax ?? invoice.gst_amount ?? 0
  );

  const balance =
    paymentStats?.remaining_amount ??
    Number(
      invoice.balance ??
      invoice.remaining_amount ??
      Math.max(0, total - advance - directPayments)
    );

  const status =
    paymentStats?.status ||
    invoice.status ||
    "Unpaid";

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* HEADER - NOT INCLUDED IN PDF */}
        <div className="flex flex-wrap justify-between items-center gap-3 border-b border-gray-200 px-5 sm:px-6 py-4 bg-white shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
            Invoice #{invoiceNumber}
          </h2>

          <div className="flex flex-wrap items-center gap-2">

            {balance > 0 && (
              <button
                type="button"
                onClick={() => setShowPaymentForm(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#4B5EAA] text-white text-sm font-semibold hover:bg-[#3f518f] transition"
              >
                <FaMoneyBillWave />
                Record Payment
              </button>
            )}

            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={pdfLoading || loadingPayments}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 disabled:opacity-50 transition"
            >
              <FaFilePdf />
              {pdfLoading ? "Preparing..." : "PDF"}
            </button>

            <button
              type="button"
              onClick={handleSharePDF}
              disabled={pdfLoading || loadingPayments}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 text-green-600 text-sm font-semibold hover:bg-green-100 disabled:opacity-50 transition"
            >
              <FaShareAlt />
              Share
            </button>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
            >
              <FaWhatsapp />
              WhatsApp
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close invoice"
              className="p-2 text-gray-400 hover:text-red-500 transition"
            >
              <IoClose size={24} />
            </button>
          </div>
        </div>

        {/* NOTIFICATIONS - OUTSIDE PDF */}
        {shareError && (
          <div
            role="alert"
            className="mx-5 sm:mx-6 mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shrink-0"
          >
            {shareError}
          </div>
        )}

        {shareMessage && (
          <div
            role="status"
            className="mx-5 sm:mx-6 mt-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 shrink-0"
          >
            {shareMessage}
          </div>
        )}

        {/* SCROLLABLE INVOICE AREA */}
        <div className="overflow-y-auto flex-1 min-h-0">

          {/* ONLY THIS CONTENT IS CAPTURED FOR PDF */}
          <div
            ref={invoiceContentRef}
            className="p-6 sm:p-8 space-y-8 bg-white text-gray-900"
          >

            {/* COMPANY AND INVOICE DETAILS */}
            <div className="flex flex-col md:flex-row justify-between gap-5">
              <div>
                <h3 className="text-2xl font-bold text-[#4B5EAA]">
                  Thomson Casa
                </h3>

                <p className="text-gray-500 font-medium mt-1">
                  Chicken Supply Management
                </p>

                <p className="text-sm text-gray-500 mt-4">
                  Kombidinjamakkal, Thazhekkad P.O.
                </p>

                <p className="text-sm text-gray-500">
                  Thrissur
                </p>
              </div>

              <div className="md:text-right">
                <h2 className="text-4xl font-black text-gray-900 tracking-wider">
                  INVOICE
                </h2>

                <p className="mt-3 text-gray-600 font-semibold">
                  #{invoiceNumber}
                </p>

                <p className="text-gray-600 font-medium">
                  Order: {invoice.order_id || invoice.order || "—"}
                </p>

                <p className="text-gray-600 font-medium">
                  Date: {invoice.date || invoice.due_date || "—"}
                </p>

                <p className="text-gray-600 font-medium">
                  Due: {invoice.delivery_date || invoice.due_date || "—"}
                </p>

                <span
                  className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold ${
                    status === "Paid"
                      ? "bg-green-100 text-green-700"
                      : status === "Partial"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {status}
                </span>
              </div>
            </div>

            {/* BILL TO */}
            <div className="bg-[#F8F9FB] rounded-xl p-6 border border-gray-100">
              <h4 className="text-xs font-bold text-gray-400 tracking-wider mb-2 uppercase">
                Bill To
              </h4>

              <h3 className="text-xl font-bold text-gray-900">
                {invoice.customer || "Customer"}
              </h3>

              <p className="text-sm text-gray-500 mt-1 whitespace-pre-line">
                {invoice.customer_address || "Address not available"}
              </p>
            </div>

            {/* ITEM TABLE */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-bold text-gray-500 uppercase tracking-wider text-xs">
                      Item
                    </th>

                    <th className="text-left py-3 px-4 font-bold text-gray-500 uppercase tracking-wider text-xs">
                      Weight
                    </th>

                    <th className="text-left py-3 px-4 font-bold text-gray-500 uppercase tracking-wider text-xs">
                      Rate
                    </th>

                    <th className="text-right py-3 px-4 font-bold text-gray-500 uppercase tracking-wider text-xs">
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {invoice.items?.length > 0 ? (
                    invoice.items.map((item, index) => (
                      <tr
                        key={item.id ?? index}
                        className="hover:bg-gray-50"
                      >
                        <td className="py-4 px-4 font-medium text-gray-900">
                          {item.chicken_type_snapshot ||
                            item.chicken_type ||
                            item.item_name}
                        </td>

                        <td className="py-4 px-4 text-gray-600">
                          {Number(
                            item.weight_snapshot ??
                            item.weight ??
                            0
                          ).toFixed(3)}{" "}
                          Kg
                        </td>

                        <td className="py-4 px-4 text-gray-600">
                          ₹{money(
                            item.selling_price_per_kg_snapshot ??
                            item.rate ??
                            0
                          )}/Kg
                        </td>

                        <td className="py-4 px-4 text-right font-bold text-gray-900">
                          ₹{money(
                            item.subtotal ??
                            item.subtotal_snapshot ??
                            item.amount ??
                            0
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-4 px-4 text-center text-gray-500"
                      >
                        No item details available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAYMENT HISTORY AND TOTALS */}
            <div className="flex flex-col md:flex-row justify-between pt-4 gap-8">

              {/* PAYMENT HISTORY */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">
                  Payment History
                </h4>

                {loadingPayments ? (
                  <p className="text-sm text-gray-500">
                    Loading payments...
                  </p>
                ) : payments.length > 0 ? (
                  <div className="space-y-3">
                    {payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex justify-between items-center gap-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {payment.payment_method ||
                              payment.method}
                          </p>

                          <p className="text-xs text-gray-500">
                            {payment.date}
                          </p>

                          {payment.reference_no && (
                            <p className="text-xs text-gray-400">
                              Ref: {payment.reference_no}
                            </p>
                          )}

                          {payment.note && (
                            <p className="text-xs text-gray-400">
                              {payment.note}
                            </p>
                          )}
                        </div>

                        <span className="font-bold text-green-600 whitespace-nowrap">
                          +₹{money(payment.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    No direct payments recorded.
                  </p>
                )}
              </div>

              {/* INVOICE TOTALS */}
              <div className="w-full md:w-80 space-y-3 shrink-0">

                <div className="flex justify-between text-gray-600 gap-3">
                  <span className="font-medium">
                    Subtotal
                  </span>

                  <span className="font-semibold text-gray-900">
                    ₹{money(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600 gap-3">
                  <span className="font-medium">
                    GST (
                    {invoice.gst_type === "percentage"
                      ? `${invoice.gst_input || 0}%`
                      : `₹${money(invoice.gst_input)} Fixed`}
                    )
                  </span>

                  <span className="font-semibold text-gray-900">
                    ₹{money(gstAmount)}
                  </span>
                </div>

                <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-3 gap-3">
                  <span>Total Amount</span>

                  <span>
                    ₹{money(total)}
                  </span>
                </div>

                <div className="flex justify-between text-red-500 font-medium gap-3">
                  <span>Advance Used</span>

                  <span>
                    -₹{money(advance)}
                  </span>
                </div>

                {directPayments > 0 && (
                  <div className="flex justify-between text-green-600 font-medium gap-3">
                    <span>Direct Payments</span>

                    <span>
                      -₹{money(directPayments)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-lg font-black text-gray-900 bg-gray-50 p-4 rounded-xl border border-gray-100 mt-4 gap-3">
                  <span>Balance Due</span>

                  <span
                    className={
                      balance > 0
                        ? "text-red-600"
                        : "text-green-600"
                    }
                  >
                    ₹{money(balance)}
                  </span>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="border-t border-gray-200 pt-5 flex justify-between text-sm text-gray-400 font-medium gap-3">
              <span>Generated by Thomson Casa ERP</span>
              <span>GST Invoice</span>
            </div>
          </div>
        </div>
      </div>

      {/* RECORD PAYMENT MODAL - NOT INCLUDED IN PDF */}
      <RecordPaymentModal
        open={showPaymentForm}
        onClose={() => setShowPaymentForm(false)}
        invoice={{
          ...invoice,
          invoice_id: invoiceDbId,
          balance,
        }}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}

export default InvoicePreviewModal;
