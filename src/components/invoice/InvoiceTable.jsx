
import { useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import InvoicePreviewModal from "./InvoicePreviewModal";
import SortDropdown from "../common/SortDropdown";
import {
  sortRecords,
  getAvailableSortFields,
} from "../../utils/sortUtils";

const badge = {
  Paid: "bg-green-100 text-green-700",
  Unpaid: "bg-red-100 text-red-600",
  Partial: "bg-yellow-100 text-yellow-700",
};

function InvoiceTable({
  invoices = [],
  loading = false,
  onPaymentSuccess,
}) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [customerFilter, setCustomerFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const statusOptions = [
    "All",
    "Paid",
    "Partial",
    "Unpaid",
  ];

  const customers = [
    ...new Set(
      invoices
        .map((invoice) => invoice.customer)
        .filter(Boolean)
    ),
  ].sort((a, b) => a.localeCompare(b));

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesStatus =
      statusFilter === "All" ||
      String(invoice.status || "").toLowerCase() ===
        statusFilter.toLowerCase();

    const matchesCustomer =
      customerFilter === "All" ||
      invoice.customer === customerFilter;

    return matchesStatus && matchesCustomer;
  });

  const sortingConfig = {
    nameKeys: ["customer"],
    dateKeys: ["date", "created_at"],
    amountKeys: ["total"],
    idKeys: ["invoice_id", "id"],
  };

  const availableSort = getAvailableSortFields(
    filteredInvoices,
    sortingConfig
  );

  const sortedInvoices = sortRecords(
    filteredInvoices,
    sortBy,
    sortingConfig
  );

  const formatAmount = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const openInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setOpenModal(true);
  };

  const detailFields = (invoice) => [
    {
      label: "Customer",
      value: invoice.customer,
      className: "text-gray-900 font-medium",
    },
    {
      label: "Date",
      value: invoice.date,
      className: "text-gray-600",
    },
    {
      label: "Amount",
      value: `₹${formatAmount(invoice.amount)}`,
      className: "text-gray-900 font-medium",
    },
    {
      label: "Tax",
      value: `₹${formatAmount(invoice.tax)}`,
      className: "text-gray-500",
    },
    {
      label: "Total",
      value: `₹${formatAmount(invoice.total)}`,
      className: "text-gray-900 font-bold",
    },
    {
      label: "Advance Used",
      value: `₹${formatAmount(invoice.advance)}`,
      className: "text-red-500 font-medium",
    },
    {
      label: "Balance",
      value: `₹${formatAmount(invoice.balance)}`,
      className: "text-green-600 font-bold",
    },
  ];

  return (
    <>
      <div className="w-full min-w-0 max-w-full bg-white border border-[#00000026] rounded-2xl overflow-hidden">

        {/* Header and Filters */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 p-4 sm:p-5 border-b border-[#00000026]">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Invoice Records
            </h2>

            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Showing {filteredInvoices.length} of{" "}
              {invoices.length} invoices
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 w-full xl:w-auto min-w-0">

            {/* Customer Filter */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-medium text-gray-600 shrink-0">
                Customer
              </span>

              <select
                value={customerFilter}
                onChange={(e) =>
                  setCustomerFilter(e.target.value)
                }
                className="w-full sm:w-40 min-w-0 border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-[#4B5EAA]/20"
              >
                <option value="All">All Customers</option>

                {customers.map((customer) => (
                  <option
                    key={customer}
                    value={customer}
                  >
                    {customer}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 min-w-0">
              <FiFilter
                size={18}
                className="text-gray-600 shrink-0"
              />

              <span className="text-sm font-medium text-gray-600 shrink-0">
                Status
              </span>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="w-full sm:w-36 min-w-0 border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-[#4B5EAA]/20"
              >
                {statusOptions.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status === "All"
                      ? "All Status"
                      : status}
                  </option>
                ))}
              </select>
            </div>

            {/* Common Sorting */}
            <SortDropdown
              value={sortBy}
              onChange={setSortBy}
              allowDate={availableSort.allowDate}
              allowAmount={availableSort.allowAmount}
            />
          </div>
        </div>

        {/* Mobile and Tablet View */}
        <div className="block 2xl:hidden w-full min-w-0 p-3 sm:p-4">
          {loading ? (
            <p className="py-10 text-center text-gray-500">
              Loading invoices...
            </p>
          ) : sortedInvoices.length === 0 ? (
            <p className="py-10 text-center text-gray-500">
              No invoices match the selected filters.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {sortedInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="w-full min-w-0 border border-gray-200 rounded-xl bg-white p-4 sm:p-5 hover:bg-gray-50 transition"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-4 mb-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-400 font-semibold mb-1">
                        Invoice No
                      </p>

                      <p className="text-[#4B5EAA] font-bold break-all">
                        {invoice.id}
                      </p>
                    </div>

                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                        badge[invoice.status] || badge.Unpaid
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4">
                    {detailFields(invoice).map((field) => (
                      <div
                        key={field.label}
                        className="min-w-0"
                      >
                        <p className="text-xs font-semibold text-gray-400 uppercase mb-1">
                          {field.label}
                        </p>

                        <p
                          className={`${field.className} break-words`}
                        >
                          {field.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-gray-100">
                    <span className="text-xs font-semibold text-gray-400 uppercase">
                      Action
                    </span>

                    <button
                      onClick={() => openInvoice(invoice)}
                      className="bg-[#4B5EAA] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-[#3f518f] text-sm font-semibold"
                    >
                      <FaFilePdf size={14} />
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden 2xl:block w-full min-w-0">
          <table className="w-full table-fixed text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-500">
                <th className="px-3 py-4 w-[13%]">Invoice No</th>
                <th className="px-3 py-4 w-[13%]">Customer</th>
                <th className="px-3 py-4 w-[9%]">Date</th>
                <th className="px-3 py-4 w-[10%]">Amount</th>
                <th className="px-3 py-4 w-[8%]">Tax</th>
                <th className="px-3 py-4 w-[10%]">Total</th>
                <th className="px-3 py-4 w-[9%]">Status</th>
                <th className="px-3 py-4 w-[10%]">Advance Used</th>
                <th className="px-3 py-4 w-[10%]">Balance</th>
                <th className="px-3 py-4 w-[8%] text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Loading invoices...
                  </td>
                </tr>
              ) : sortedInvoices.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No invoices match the selected filters.
                  </td>
                </tr>
              ) : (
                sortedInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-t border-[#00000026] hover:bg-gray-50"
                  >
                    <td className="px-3 py-5 text-[#4B5EAA] font-bold break-all">
                      {invoice.id}
                    </td>

                    <td className="px-3 py-5 font-medium text-gray-900 break-words">
                      {invoice.customer}
                    </td>

                    <td className="px-3 py-5 text-gray-600 break-words">
                      {invoice.date}
                    </td>

                    <td className="px-3 py-5 font-medium text-gray-900 break-all">
                      ₹{formatAmount(invoice.amount)}
                    </td>

                    <td className="px-3 py-5 text-gray-500 break-all">
                      ₹{formatAmount(invoice.tax)}
                    </td>

                    <td className="px-3 py-5 font-bold text-gray-900 break-all">
                      ₹{formatAmount(invoice.total)}
                    </td>

                    <td className="px-3 py-5">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                          badge[invoice.status] || badge.Unpaid
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>

                    <td className="px-3 py-5 font-medium text-red-500 break-all">
                      ₹{formatAmount(invoice.advance)}
                    </td>

                    <td className="px-3 py-5 font-bold text-green-600 break-all">
                      ₹{formatAmount(invoice.balance)}
                    </td>

                    <td className="px-3 py-5 text-center">
                      <button
                        onClick={() => openInvoice(invoice)}
                        className="bg-[#4B5EAA] text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-[#3f518f] mx-auto text-sm font-semibold"
                      >
                        <FaFilePdf size={14} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <InvoicePreviewModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        invoice={selectedInvoice}
        onPaymentSuccess={onPaymentSuccess}
      />
    </>
  );
}

export default InvoiceTable;
