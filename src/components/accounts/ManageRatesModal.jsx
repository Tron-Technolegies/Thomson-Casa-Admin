
import React, { useState, useEffect } from 'react';
import { FiX, FiChevronDown, FiSave } from 'react-icons/fi';
import { api } from '../../services/api';

export default function ManageRatesModal({ isOpen, onClose }) {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [liveRate, setLiveRate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
      setSelectedCustomer("");
      setLiveRate("");
      setError("");
      setSuccessMsg("");
    }
  }, [isOpen]);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/admin/customers/');

      if (res.success) {
        setCustomers(res.customers || []);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load customers.");
    }
  };

  useEffect(() => {
    if (selectedCustomer) {
      fetchCustomerLiveRate(selectedCustomer);
    } else {
      setLiveRate("");
    }
  }, [selectedCustomer]);

  const fetchCustomerLiveRate = async (customerId) => {
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await api.get(
        `/admin/customers/${customerId}/live-rate/`
      );

      if (res.success) {
        setLiveRate(
            res.live_rate === null || res.live_rate === undefined
              ? ""
              : String(res.live_rate)
          );
      } else {
        setLiveRate("");
        setError(res.message || "Failed to load customer Live Rate.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load customer Live Rate.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCustomer) {
      setError("Please select a customer first.");
      return;
    }

    if (liveRate !== "" && Number(liveRate) < 0) {
      setError("Live Rate cannot be negative.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await api.put(
        `/admin/customers/${selectedCustomer}/live-rate/update/`,
        {
          live_rate:
              String(liveRate ?? "").trim() === ""
                ? null
                : Number(liveRate)
        }
      );

      if (res.success) {
        setSuccessMsg("Customer Live Rate updated successfully!");
      } else {
        setError(res.message || "Failed to update Live Rate.");
      }
    } catch (err) {
      console.error(err);
      setError(
        err?.data?.message ||
        err?.message ||
        "An error occurred while saving."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* Header */}
        <div className="border-b border-gray-100 px-8 py-6 flex justify-between items-center bg-gray-50/50 rounded-t-3xl">
          <h2 className="text-xl font-bold text-gray-900">
            Manage Customer Live Rate
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 transition"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-8">

          {error && (
            <div className="mb-4 text-red-500 text-sm font-semibold">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 text-green-600 text-sm font-semibold bg-green-50 p-3 rounded-lg border border-green-100">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Customer Selection */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Select Customer
              </label>

              <div className="relative">
                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="h-13 w-full appearance-none rounded-2xl border border-gray-300 bg-white px-5 pr-10 outline-none focus:border-[#4B5EAA]"
                >
                  <option value="">-- Choose a Customer --</option>

                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.customer_name} ({customer.company_name})
                    </option>
                  ))}
                </select>

                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <FiChevronDown size={20} />
                </div>
              </div>
            </div>

            {/* Customer Live Rate */}
            {selectedCustomer && (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">

                <label className="mb-3 block text-sm font-semibold text-gray-700">
                  Customer Live Rate (₹ / kg)
                </label>

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Enter customer Live Rate"
                  value={liveRate}
                  onChange={(e) => setLiveRate(e.target.value)}
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-lg font-semibold outline-none focus:border-[#4B5EAA]"
                />

                <p className="mt-3 text-xs text-gray-500">
                  Leave this field empty to use the global Daily Live Rate.
                </p>
              </div>
            )}

            {/* Save */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={loading || !selectedCustomer}
                className="w-full flex justify-center items-center gap-2 rounded-2xl bg-[#4B5EAA] py-4 font-semibold text-white transition hover:bg-[#3d4f92] disabled:opacity-70"
              >
                <FiSave size={18} />
                {loading ? "Saving..." : "Save Customer Live Rate"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
