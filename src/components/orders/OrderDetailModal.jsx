import React, { useState, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { api } from '../../services/api';

export default function OrderDetailModal({ isOpen, onClose, order, onSuccess }) {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    customer_id: "",
    delivery_date: "",
    chicken_type: "Full Chicken",
    weight: "",
    status: "Pending",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (order) {
      setFormData({
        customer_id: order.customer_id || "",
        delivery_date: order.delivery_date || "",
        chicken_type: order.chicken_type || "Full Chicken",
        weight: order.weight || "",
        status: order.status || "Pending",
        notes: order.notes || ""
      });
    }
  }, [order]);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/admin/customers/');
      if (response.success) {
        setCustomers(response.customers);
      }
    } catch (err) {
      console.error("Failed to load customers:", err);
    }
  };

  if (!isOpen || !order) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.put(`/admin/orders/${order.id}/edit/`, formData);
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
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="border-b border-gray-200 px-8 py-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Order Details
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {error && <div className="mb-4 text-red-500 text-sm font-semibold">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Customer Name */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Customer Name
              </label>
              <div className="relative">
                <select 
                  name="customer_id"
                  value={formData.customer_id}
                  onChange={handleChange}
                  className="h-13 w-full appearance-none rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA] bg-white"
                  required
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.customer_name}</option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Delivery Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Delivery Date
              </label>
              <input
                type="date"
                name="delivery_date"
                value={formData.delivery_date}
                onChange={handleChange}
                className="h-13 w-full rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA]"
                required
              />
            </div>

            {/* Weight (Kg) */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Weight (Kg)
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                step="0.01"
                className="h-13 w-full rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA]"
                required
              />
            </div>

            {/* Chicken Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Chicken Type
              </label>
              <div className="relative">
                <select 
                  name="chicken_type"
                  value={formData.chicken_type}
                  onChange={handleChange}
                  className="h-13 w-full appearance-none rounded-2xl border border-gray-300 pl-10 pr-5 outline-none focus:border-[#4B5EAA] bg-white"
                >
                  <option value="Full Chicken">Full Chicken</option>
                  <option value="Dressed Chicken">Dressed Chicken</option>
                  <option value="Boneless Chicken">Boneless Chicken</option>
                </select>
                <div className="absolute left-5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#4B5EAA]"></div>
                <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500" />
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
                  <option value="Delivered">Delivered</option>
                  <option value="Pending">Pending</option>
                  <option value="Ready">Ready</option>
                  <option value="Cutting">Cutting</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full rounded-2xl border border-gray-300 px-5 py-4 resize-none outline-none focus:border-[#4B5EAA]"
              />
            </div>

          </div>

          {/* Footer */}
          <div className="mt-10 flex flex-col-reverse gap-4 md:flex-row md:justify-center">
            <button
              type="button"
              onClick={onClose}
              className="w-full md:w-44 rounded-2xl border border-[#4B5EAA] py-3 font-semibold text-[#4B5EAA] transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-44 rounded-2xl bg-[#4B5EAA] py-3 font-semibold text-white transition hover:bg-[#3d4f92] disabled:opacity-70"
            >
              {loading ? "Updating..." : "Update Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
