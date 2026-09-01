import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiX } from 'react-icons/fi';
import { api } from '../../services/api';

export default function PricingModal({ isOpen, onClose, account, dailyPrices = {}, onSuccess }) {
  const [itemPrices, setItemPrices] = useState({});
  const [gstType, setGstType] = useState("fixed");
  const [gstInput, setGstInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (account && account.items) {
      const initialPrices = {};
      account.items.forEach(item => {
        initialPrices[item.id] = item.price_per_kg || "";
      });
      setItemPrices(initialPrices);
      setGstType("fixed");
      setGstInput("");
      setError("");
    }
  }, [account]);

  if (!isOpen || !account) return null;

  const handlePriceChange = (itemId, value) => {
    setItemPrices(prev => ({ ...prev, [itemId]: value }));
  };

  const getSubtotal = (item) => {
    const price = parseFloat(itemPrices[item.id]) || 0;
    const weight = parseFloat(item.weight) || 0;
    return price * weight;
  };

  const itemsTotal = account?.items?.reduce((sum, item) => sum + getSubtotal(item), 0) || 0;
  
  let parsedGstAmount = 0;
  const gInput = parseFloat(gstInput) || 0;
  if (gstType === "percentage") {
      parsedGstAmount = itemsTotal * (gInput / 100);
  } else {
      parsedGstAmount = gInput;
  }
  
  const totalAmount = itemsTotal + parsedGstAmount;

  const handleSavePricing = async () => {
    if (!account.items || account.items.length === 0) {
        setError("No items found in this order.");
        return false;
    }

    const itemsPayload = account.items.map(item => ({
      id: item.id,
      price_per_kg: parseFloat(itemPrices[item.id])
    }));
    
    if (itemsPayload.some(i => isNaN(i.price_per_kg))) {
      setError("Please enter a valid price for all items.");
      return false;
    }

    setLoading(true);
    setError("");

    try {
      const payload = { items: itemsPayload };
      const res = await api.post(`/admin/orders/${account.id}/pricing/`, payload);
      if (res.success) {
        return true;
      } else {
        setError(res.message || "Failed to save pricing.");
        return false;
      }
    } catch (err) {
      setError(err.message || "An error occurred while saving pricing.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const onSaveDraft = async (e) => {
      e.preventDefault();
      const success = await handleSavePricing();
      if (success) {
          if (onSuccess) onSuccess();
          onClose();
      }
  };

  const onGenerateInvoice = async (e) => {
      e.preventDefault();
      
      const priceSaved = await handleSavePricing();
      if (!priceSaved) return;

      setLoading(true);
      setError("");

      try {
          const payload = {
              order_id: account.id,
              gst_type: gstType,
              gst_input: parseFloat(gstInput) || 0
          };
          const res = await api.post(`/admin/invoices/create/`, payload);
          if (res.success) {
              if (onSuccess) onSuccess();
              onClose();
          } else {
              setError(res.message || "Failed to generate invoice.");
          }
      } catch (err) {
          setError(err.message || "An error occurred while generating the invoice.");
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="border-b border-gray-200 px-8 py-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Order Pricing & Invoice Generation
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition">
            <FiX size={24} />
          </button>
        </div>

        <div className="p-8">
          {error && <div className="mb-4 text-red-500 text-sm font-semibold">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Customer Name */}
            <div className="md:col-span-1">
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Customer
              </label>
              <input
                type="text"
                defaultValue={account.customer || ""}
                readOnly
                className="h-13 w-full rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA] bg-gray-50"
              />
            </div>
            
            <div className="md:col-span-1">
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Order Number
              </label>
              <input
                type="text"
                defaultValue={account.order_number || ""}
                readOnly
                className="h-13 w-full rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA] bg-gray-50"
              />
            </div>

            {/* Order Items Table */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Item Pricing
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-100 text-gray-500 uppercase text-xs font-semibold border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3">Item Type</th>
                      <th className="px-4 py-3 text-right">Weight (Kg)</th>
                      <th className="px-4 py-3 text-right">Market Price</th>
                      <th className="px-4 py-3">Selling Price (₹)</th>
                      <th className="px-4 py-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {account.items && account.items.map(item => {
                      const marketPrice = dailyPrices[item.chicken_type] || 0;
                      return (
                        <tr key={item.id} className="bg-white hover:bg-gray-50 transition">
                          <td className="px-4 py-3 font-medium text-gray-800">{item.chicken_type}</td>
                          <td className="px-4 py-3 text-right text-gray-600">{item.weight}</td>
                          <td className="px-4 py-3 text-right text-orange-500 font-semibold">₹{marketPrice || "---"}</td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              required
                              value={itemPrices[item.id] !== undefined ? itemPrices[item.id] : ""}
                              onChange={(e) => handlePriceChange(item.id, e.target.value)}
                              placeholder="₹----"
                              className="h-10 w-full min-w-[100px] rounded-xl border border-gray-300 px-3 outline-none focus:border-[#4B5EAA]"
                            />
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-gray-800">
                            ₹{getSubtotal(item).toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t border-gray-200">
                      <tr>
                          <td colSpan="4" className="px-4 py-3 text-right font-bold text-gray-700">Items Total:</td>
                          <td className="px-4 py-3 text-right font-bold text-gray-900">₹{itemsTotal.toFixed(2)}</td>
                      </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* GST Config */}
            <div className="md:col-span-1">
              <label className="mb-2 block text-sm font-medium text-gray-600">
                GST Type
              </label>
              <div className="relative">
                <select
                  value={gstType}
                  onChange={(e) => setGstType(e.target.value)}
                  className="h-13 w-full appearance-none rounded-2xl border border-gray-300 bg-white px-5 pr-10 outline-none focus:border-[#4B5EAA]"
                >
                  <option value="fixed">Fixed Amount</option>
                  <option value="percentage">Percentage (%)</option>
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <FiChevronDown size={20} />
                </div>
              </div>
            </div>

            <div className="md:col-span-1">
              <label className="mb-2 block text-sm font-medium text-gray-600">
                GST Value {gstType === "percentage" ? "(%)" : "(₹)"}
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={gstInput}
                onChange={(e) => setGstInput(e.target.value)}
                placeholder="0.00"
                className="h-13 w-full rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA]"
              />
              <p className="text-xs text-gray-400 mt-1">Calculated GST: ₹{parsedGstAmount.toFixed(2)}</p>
            </div>

            {/* Total */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Total Invoice Amount (₹)
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
          <div className="mt-10 flex gap-4">
            <button
              onClick={onSaveDraft}
              disabled={loading}
              className="flex-1 rounded-2xl border border-gray-300 bg-white py-4 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-70"
            >
              {loading ? "Processing..." : "Save Draft Pricing"}
            </button>
            <button
              onClick={onGenerateInvoice}
              disabled={loading}
              className="flex-1 rounded-2xl bg-[#4B5EAA] py-4 font-semibold text-white transition hover:bg-[#3d4f92] disabled:opacity-70"
            >
              {loading ? "Processing..." : "Generate Invoice"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
