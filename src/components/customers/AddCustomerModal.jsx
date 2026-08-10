import { IoClose } from "react-icons/io5";
import { FiChevronDown } from "react-icons/fi";

export default function AddCustomerModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6">

          <h2 className="text-4xl font-bold text-gray-900">
            Add New Customer
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

            {/* Customer Name */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Customer Name
              </label>

              <input
                type="text"
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

                <select className="h-13 w-full appearance-none rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA]">

                  <option>Regular</option>
                  <option>Wholesale</option>
                  <option>Distributor</option>

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

                <select className="h-13 w-full appearance-none rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA]">

                  <option>Active</option>
                  <option>Inactive</option>

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
              className="w-full md:w-44 rounded-2xl bg-[#4B5EAA] py-3 font-semibold text-white transition hover:bg-[#3d4f92]"
            >
              Save Customer
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}