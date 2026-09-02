import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { api } from "../../services/api";

function RecordPaymentModal({ open, onClose, invoice, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [referenceNo, setReferenceNo] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open || !invoice) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        amount: parseFloat(amount),
        payment_method: paymentMethod,
        reference_no: referenceNo,
        note: note
      };

      const res = await api.post(`/accounts/invoices/${invoice.invoice_id || invoice.id}/payments/add/`, payload);

      if (res.success) {
        setAmount("");
        setReferenceNo("");
        setNote("");
        onSuccess();
        onClose();
      } else {
        setError(res.message || "Failed to record payment.");
      }
    } catch (err) {
      setError("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Record Payment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <IoClose size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-sm text-blue-800 font-medium flex justify-between">
              <span>Invoice:</span> <span>{invoice.id || invoice.order}</span>
            </p>
            <p className="text-sm text-blue-800 font-medium flex justify-between mt-1">
              <span>Outstanding:</span> <span>₹{invoice.balance?.toLocaleString(undefined, {minimumFractionDigits: 2}) || 0.00}</span>
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4B5EAA]"
                placeholder="Enter amount"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4B5EAA]"
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Reference No (Optional)</label>
              <input
                type="text"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4B5EAA]"
                placeholder="Transaction ID / Cheque No"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Note (Optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows="2"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4B5EAA]"
                placeholder="Additional details..."
              ></textarea>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#4B5EAA] text-white py-2 rounded-lg font-semibold hover:bg-[#3f518f] transition-colors disabled:opacity-50"
                disabled={loading || !amount}
              >
                {loading ? "Recording..." : "Record Payment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RecordPaymentModal;
