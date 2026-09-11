import React, { useState, useEffect } from 'react';
import { FiX, FiChevronDown, FiSave } from 'react-icons/fi';
import { api } from '../../services/api';

export default function ManageRatesModal({ isOpen, onClose }) {
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [pricesForm, setPricesForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
      fetchCategories();
      setSelectedCustomer("");
      setPricesForm({});
      setError("");
      setSuccessMsg("");
    }
  }, [isOpen]);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/admin/customers/');
      if (res.success) {
        setCustomers(res.customers);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/admin/categories/');
      if (res.success) {
        setCategories(res.categories);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedCustomer) {
      fetchCustomerPrices(selectedCustomer);
    } else {
      setPricesForm({});
    }
  }, [selectedCustomer]);

  const fetchCustomerPrices = async (customerId) => {
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await api.get(`/admin/customers/${customerId}/prices/`);
      if (res.success) {
        setPricesForm(res.prices || {});
      } else {
        setPricesForm({});
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load customer prices.");
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (categoryName, value) => {
    setPricesForm(prev => ({ ...prev, [categoryName]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) {
      setError("Please select a customer first.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");
    
    // In our backend API we used PUT method via @require_http_methods(["PUT"])
    // but in api.js we usually use api.post or api.put. Our views.py says:
    // @require_http_methods(["PUT"])
    // wait, I can just use api.request or just api.put
    try {
      const res = await api.put(`/admin/customers/${selectedCustomer}/prices/update/`, { prices: pricesForm });
      if (res.success) {
        setSuccessMsg("Prices updated successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setError(res.message || "Failed to update prices.");
      }
    } catch (err) {
      setError(err.message || "An error occurred.");
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
            Manage Customer Rates
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition">
            <FiX size={24} />
          </button>
        </div>

        <div className="p-8">
          {error && <div className="mb-4 text-red-500 text-sm font-semibold">{error}</div>}
          {successMsg && <div className="mb-4 text-green-600 text-sm font-semibold bg-green-50 p-3 rounded-lg border border-green-100">{successMsg}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
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
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.customer_name} ({c.company_name})</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <FiChevronDown size={20} />
                </div>
              </div>
            </div>

            {selectedCustomer && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden mt-4">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-100 text-gray-500 uppercase text-xs font-semibold border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Rate (₹/kg)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {categories.map(cat => (
                      <tr key={cat.id} className="bg-white hover:bg-gray-50 transition">
                        <td className="px-4 py-3 font-medium text-gray-800">{cat.name}</td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="Default Market Rate"
                            value={pricesForm[cat.name] !== undefined ? pricesForm[cat.name] : ""}
                            onChange={(e) => handlePriceChange(cat.name, e.target.value)}
                            className="h-10 w-full rounded-xl border border-gray-300 px-3 outline-none focus:border-[#4B5EAA]"
                          />
                        </td>
                      </tr>
                    ))}
                    {categories.length === 0 && (
                      <tr>
                        <td colSpan="2" className="px-4 py-4 text-center text-gray-500 text-sm">
                          No categories available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            
            <p className="text-xs text-gray-500 mt-2">
              Note: Leave the rate empty to fallback to the "Today's Market" price for this customer.
            </p>

            <div className="mt-8">
              <button
                type="submit"
                disabled={loading || !selectedCustomer}
                className="w-full flex justify-center items-center gap-2 rounded-2xl bg-[#4B5EAA] py-4 font-semibold text-white transition hover:bg-[#3d4f92] disabled:opacity-70"
              >
                <FiSave size={18} />
                {loading ? "Saving..." : "Save Customer Rates"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
