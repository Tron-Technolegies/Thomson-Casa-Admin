import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiX } from 'react-icons/fi';
import { api } from '../../services/api';

export default function PricingModal({ isOpen, onClose, account, dailyPrices = {}, onSuccess }) {
  const [sellingPrice, setSellingPrice] = useState("");
  const [gstAmount, setGstAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const marketPrice = account ? dailyPrices[account.chicken_type] || 0 : 0;

  useEffect(() => {
    if (account) {
      if (account.invoice) {
        setSellingPrice(account.invoice.selling_price_per_kg);
        setGstAmount(account.invoice.gst_amount);
      } else {
        setSellingPrice("");
        setGstAmount("");
      }
      setError("");
    }
  }, [account]);

  if (!isOpen || !account) return null;

  const parsedSellingPrice = parseFloat(sellingPrice) || 0;
  const parsedGst = parseFloat(gstAmount) || 0;
  const totalAmount = (account.weight * parsedSellingPrice) + parsedGst;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sellingPrice) {
      setError("Selling price is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        order_id: account.id,
        selling_price_per_kg: parsedSellingPrice,
        gst_amount: parsedGst,
        total_amount: totalAmount
      };

      const res = await api.post("/admin/invoices/create/", payload);
      if (res.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setError(res.message || "Failed to save invoice.");
      }
    } catch (err) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="border-b border-gray-200 px-8 py-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Pricing
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {error && <div className="mb-4 text-red-500 text-sm font-semibold">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Customer Name */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Customer
              </label>
              <input
                type="text"
                defaultValue={account.customer || "Sanjay Das"}
                readOnly
                className="h-13 w-full rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA]"
              />
            </div>

            {/* Chicken Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Chicken Type
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={account.chicken_type || ""}
                  readOnly
                  className="h-13 w-full rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA] bg-gray-50"
                />
              </div>
            </div>

            {/* Weight */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Weight
              </label>
              <input
                type="text"
                defaultValue={account.weight || ""}
                readOnly
                className="h-13 w-full rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA] bg-gray-50"
              />
            </div>

            {/* Selling Price */}
            <div className="md:col-span-2 relative">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-600">
                  Selling Price (₹/kg)
                </label>
                <span className="text-xs text-gray-500 font-medium">Market: <span className="text-orange-500 font-bold">₹{marketPrice || "---"}</span></span>
              </div>
              <div className="flex gap-4">
                <input
                  type="number"
                  step="0.01"
                  required
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  placeholder="₹----"
                  className="h-13 flex-1 rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA]"
                />
              </div>
            </div>

            {/* GST */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                GST Amount (₹)
              </label>
              <input
                type="number"
                step="0.01"
                value={gstAmount}
                onChange={(e) => setGstAmount(e.target.value)}
                placeholder="0.00"
                className="h-13 w-full rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA]"
              />
            </div>

            {/* Total */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Total Amount (₹)
              </label>
              <input
                type="text"
                value={totalAmount.toFixed(2)}
                readOnly
                className="h-13 w-full rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA] bg-green-50 font-bold text-green-700"
              />
            </div>

          </div>

          {/* Footer */}
          <div className="mt-10">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#4B5EAA] py-4 font-semibold text-white transition hover:bg-[#3d4f92] disabled:opacity-70"
            >
              {loading ? "Saving..." : account.invoice ? "Update Invoice" : "Save Invoice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
