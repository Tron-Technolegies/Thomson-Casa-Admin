import React, { useState, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { BiMoney } from 'react-icons/bi';
import { api } from '../../services/api';

export default function RecordAdvanceModal({ isOpen, onClose, onSuccess }) {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    customer_id: "",
    amount: "",
    payment_method: "Cash",
    reference_no: "",
    note: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      const fetchCustomers = async () => {
        try {
          const res = await api.get('/admin/customers/');
          if (res.success) {
            setCustomers(res.customers || []);
            if (res.customers && res.customers.length > 0) {
              setFormData(f => ({ ...f, customer_id: res.customers[0].id }));
            }
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchCustomers();
      
      setFormData({
        customer_id: "",
        amount: "",
        payment_method: "Cash",
        reference_no: "",
        note: ""
      });
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer_id || !formData.amount) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/admin/advances/record/", formData);
      if (res.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setError(res.message || "Failed to record advance.");
      }
    } catch (err) {
      setError("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="px-8 py-4 flex justify-between items-center border-b border-gray-100 mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Record Advance
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8">
          {error && <div className="mb-4 text-red-500 text-sm font-semibold">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-6">
            
            {/* Customer Name */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-500">
                Customer
              </label>
              <div className="relative">
                <select
                  value={formData.customer_id}
                  onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                  className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 outline-none focus:border-[#4B5EAA] focus:bg-white text-gray-700 font-medium"
                >
                  <option value="" disabled>Select Customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.customer_name}</option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-500">
                Amount (₹)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 outline-none focus:border-[#4B5EAA] focus:bg-white text-gray-700 font-medium"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-500">
                Payment Method
              </label>
              <div className="relative">
                <select 
                  value={formData.payment_method}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                  className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-9 outline-none focus:border-[#4B5EAA] focus:bg-white text-gray-700 font-medium"
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                  <option value="UPI">UPI</option>
                </select>
                <BiMoney className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Reference No. */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-500">
                Reference No.
              </label>
              <input
                type="text"
                value={formData.reference_no}
                onChange={(e) => setFormData({ ...formData, reference_no: e.target.value })}
                placeholder="e.g. NEFT-20260709-001"
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 outline-none focus:border-[#4B5EAA] focus:bg-white text-gray-700 font-medium"
              />
            </div>

            {/* Note */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-medium text-gray-500">
                Note
              </label>
              <input
                type="text"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="Optional note"
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 outline-none focus:border-[#4B5EAA] focus:bg-white text-gray-700 font-medium"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold mr-4 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#4B5EAA] text-white font-semibold hover:bg-[#3d4f92] transition disabled:opacity-70"
            >
              <span>+</span> {loading ? "Recording..." : "Record Advance"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
