import React, { useState, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { api } from '../../services/api';

export default function EditCuttingOrderModal({ isOpen, onClose, order, onSuccess }) {
  const [formData, setFormData] = useState({
    status: "Pending"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (order) {
      setFormData({
        status: order.status || "Pending"
      });
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.put(`/admin/orders/${order.id}/edit/`, {
        status: formData.status
      });
      if (response.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setError(response.message || "Failed to update order.");
      }
    } catch (err) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="border-b border-gray-200 px-8 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Edit Order Status
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-8">
          {error && <div className="mb-4 text-red-500 text-sm font-semibold">{error}</div>}
          <div className="grid grid-cols-1 gap-y-6">
            
            {/* Order Number */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Order Number
              </label>
              <input
                type="text"
                value={order.order_number || ''}
                readOnly
                className="h-13 w-full rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA] bg-gray-50 text-gray-700"
              />
            </div>

            {/* Customer Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Customer Name
              </label>
              <input
                type="text"
                defaultValue={order.customer}
                readOnly
                className="h-13 w-full rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA] bg-gray-50 text-gray-700"
              />
            </div>

            {/* Order Items */}
            <div className="md:col-span-1">
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Order Items
              </label>
              <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm text-gray-700">
                  <thead className="bg-gray-100 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                    <tr>
                      <th className="px-5 py-3">Chicken Type</th>
                      <th className="px-5 py-3">Weight (Kg)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-5 py-3 font-medium">{item.chicken_type}</td>
                          <td className="px-5 py-3">{item.weight}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="px-5 py-3 font-medium">{order.chicken_type}</td>
                        <td className="px-5 py-3">{order.weight}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Status
              </label>
              <div className="relative">
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="h-13 w-full appearance-none rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA] bg-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="Cutting">Cutting</option>
                  <option value="Ready">Ready</option>
                </select>
                <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="mt-10 flex flex-col-reverse gap-4 md:flex-row md:justify-center">
            <button
              type="button"
              onClick={onClose}
              className="w-full md:w-40 rounded-2xl border border-[#4B5EAA] py-3 font-semibold text-[#4B5EAA] transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-40 rounded-2xl bg-[#4B5EAA] py-3 font-semibold text-white transition hover:bg-[#3d4f92] disabled:opacity-70"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
