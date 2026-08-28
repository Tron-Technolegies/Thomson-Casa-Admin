import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FiChevronDown } from "react-icons/fi";
import { api } from "../../services/api";

export default function EditCustomerModal({ isOpen, onClose, customer, onSuccess }) {
  const [formData, setFormData] = useState({
    customer_name: "",
    company_name: "",
    contact_person: "",
    phone: "",
    email: "",
    gst_number: "",
    customer_type: "regular",
    status: "active",
    address: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        customer_name: customer.customer_name || "",
        company_name: customer.company_name || "",
        contact_person: customer.contact_person || "",
        phone: customer.phone || "",
        email: customer.email || "",
        gst_number: customer.gst_number || "",
        customer_type: customer.customer_type || "regular",
        status: customer.status || "active",
        address: customer.address || ""
      });
    }
  }, [customer]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.put(`/admin/customers/${customer.id}/edit/`, formData);
      if (response.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setError(response.message || "Failed to update customer.");
      }
    } catch (err) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6">

          <h2 className="text-4xl font-bold text-gray-900">
            Edit Customer
          </h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <IoClose size={24} />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8"
        >
          {error && <p className="mb-4 text-red-500">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

            {/* Customer Name */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Customer Name
              </label>

              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                placeholder="Full Name"
                className="h-13 w-full rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA]"
              />
            </div>

            {/* Company */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Company Name
              </label>

              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="Company Pvt Ltd"
                className="h-13 w-full rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA]"
              />
            </div>

            {/* Contact */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Contact Person
              </label>

              <input
                type="text"
                name="contact_person"
                value={formData.contact_person}
                onChange={handleChange}
                placeholder="Contact Person"
                className="h-13 w-full rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA]"
              />
            </div>

            {/* Phone */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 0000000000"
                className="h-13 w-full rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA]"
              />
            </div>

            {/* Email */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@company.com"
                className="h-13 w-full rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA]"
              />
            </div>

            {/* GST */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                GST Number
              </label>

              <input
                type="text"
                name="gst_number"
                value={formData.gst_number}
                onChange={handleChange}
                placeholder="22AAAAA0000A1Z5"
                className="h-13 w-full rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA]"
              />
            </div>

            {/* Customer Type */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Customer Type
              </label>

              <div className="relative">

                <select 
                  name="customer_type"
                  value={formData.customer_type}
                  onChange={handleChange}
                  className="h-13 w-full appearance-none rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA]"
                >
                  <option value="regular">Regular</option>
                  <option value="wholesale">Wholesale</option>
                  <option value="distributor">Distributor</option>
                </select>

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
                  className="h-13 w-full appearance-none rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA]"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>

                <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500" />

              </div>

            </div>

            {/* Address */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium text-gray-600">
                Address
              </label>

              <textarea
                rows="4"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address, City, State"
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
              {loading ? "Updating..." : "Update Customer"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}