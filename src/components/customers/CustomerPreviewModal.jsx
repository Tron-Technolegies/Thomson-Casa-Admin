
import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import {
  FiDownload,
  FiShare2,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";
import { api } from "../../services/api";

export default function CustomerPreviewModal({ isOpen, onClose, customer }) {
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(true);
  const [isTransactionOpen, setIsTransactionOpen] = useState(true);
  const [detailedCustomer, setDetailedCustomer] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && customer?.id) {
      const fetchCustomer = async () => {
        setLoading(true);

        try {
          const res = await api.get(`/admin/customers/${customer.id}/`);

          if (res.success) {
            setDetailedCustomer(res.customer);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchCustomer();
    }
  }, [isOpen, customer]);

  if (!isOpen || !customer) return null;

  const displayCustomer = detailedCustomer || customer;
  const purchaseHistory = displayCustomer.purchase_history || [];
  const transactionHistory = displayCustomer.transaction_history || [];

  const totalPurchaseAmount = purchaseHistory.reduce(
    (sum, p) =>
      sum + parseFloat(p.amount.replace(/[^0-9.-]+/g, "")),
    0
  );

  const handlePrint = () => {
    setIsPurchaseOpen(true);
    setIsTransactionOpen(true);

    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleShare = async () => {
    const text = `Customer Details:
Name: ${displayCustomer.customer_name || "N/A"}
Company: ${displayCustomer.company_name || "N/A"}
Phone: ${displayCustomer.phone || "N/A"}
Address: ${displayCustomer.address || "N/A"}
Score: ${displayCustomer.performance_score || 0} / 100`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Customer Details",
          text: text,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert("Customer details copied to clipboard!");
    }
  };

  const getPerformanceColor = (category) => {
    switch (category) {
      case "Excellent":
        return "bg-green-100 text-green-700";
      case "Good":
        return "bg-blue-100 text-blue-700";
      case "Watch Carefully":
        return "bg-yellow-100 text-yellow-700";
      case "Reduce Credit":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-red-100 text-red-700";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "bg-green-50 text-green-700 border-green-200";
    if (score >= 50) return "bg-yellow-50 text-yellow-700 border-yellow-200";
    return "bg-red-50 text-red-700 border-red-200";
  };

  const getPurchaseStatusColor = (status) => {
    if (status === "Pending" || status === "Unpaid") {
      return "bg-orange-100 text-orange-600";
    }

    if (status === "Partial") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-green-100 text-green-700";
  };

  const getTransactionTypeColor = (type) => {
    if (type === "Invoice Raised") {
      return "text-blue-600 border border-blue-200 bg-blue-50";
    }

    if (type === "Advance Payment") {
      return "text-purple-600 border border-purple-200 bg-purple-50";
    }

    if (type === "Payment Received") {
      return "text-green-600 border border-green-200 bg-green-50";
    }

    return "text-gray-600 border border-gray-200 bg-gray-50";
  };

  return (
    <>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }

            #printable-modal,
            #printable-modal * {
              visibility: visible;
            }

            #printable-modal {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: auto;
              max-height: none !important;
              overflow: visible !important;
              box-shadow: none !important;
              padding: 0 !important;
              margin: 0 !important;
              border-radius: 0 !important;
            }

            .no-print {
              display: none !important;
            }

            .desktop-history {
              display: block !important;
              overflow: visible !important;
            }

            .mobile-history {
              display: none !important;
            }

            .history-section {
              break-inside: avoid;
            }

            table {
              width: 100% !important;
            }
          }
        `}
      </style>

      {/* Modal Backdrop */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-y-auto p-2 sm:p-4">

        {/* Modal Container */}
        <div
          id="printable-modal"
          className="relative my-auto w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-white shadow-2xl"
        >

          {/* Header */}
          <div className="sticky top-0 z-20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 bg-white px-4 py-4 sm:px-6 md:px-8 md:py-5">

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              Customer Details
            </h2>

            <div className="flex flex-wrap items-center gap-2 no-print">

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 rounded-lg sm:rounded-xl border border-gray-200 px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                <FiDownload size={16} />
                PDF / Print
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 rounded-lg sm:rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-xs sm:text-sm font-medium text-green-700 hover:bg-green-100 transition"
              >
                <FiShare2 size={16} />
                Share
              </button>

              <button
                onClick={onClose}
                className="ml-auto sm:ml-0 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                aria-label="Close modal"
              >
                <IoClose size={22} />
              </button>

            </div>
          </div>

          {/* Modal Content */}
          <div className="p-3 sm:p-5 md:p-8 space-y-5 sm:space-y-6">

            {loading ? (
              <div className="text-center py-10 text-gray-500 font-medium">
                Loading details...
              </div>
            ) : (
              <>

                {/* Customer Information */}
                <div className="bg-[#F8F9FB] rounded-xl sm:rounded-2xl p-4 sm:p-6">

                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                    <div className="min-w-0 flex-1">

                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 break-words">
                        {displayCustomer.customer_name || "N/A"}
                      </h3>

                      <p className="text-gray-600 text-sm mt-2 break-words">
                        {displayCustomer.company_name || "N/A"},{" "}
                        {displayCustomer.address || "No Address"}
                      </p>

                      <p className="text-gray-600 text-sm mt-2 break-words">
                        {displayCustomer.phone || "N/A"} |{" "}
                        {displayCustomer.email || "N/A"}
                      </p>

                      <p className="text-gray-600 text-sm mt-2">
                        GST: {displayCustomer.gst_number || "N/A"}
                      </p>

                      <span
                        className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold ${getPerformanceColor(
                          displayCustomer.performance_category
                        )}`}
                      >
                        {displayCustomer.performance_category || "High Risk"}
                      </span>

                    </div>

                    {/* Performance Score */}
                    <div className="flex flex-col items-start md:items-end shrink-0">

                      <span className="text-xs font-semibold text-gray-500 uppercase mb-2">
                        Performance Score
                      </span>

                      <div
                        className={`px-4 py-2 rounded-xl text-lg font-bold border ${getScoreColor(
                          displayCustomer.performance_score
                        )}`}
                      >
                        {displayCustomer.performance_score ?? 0}
                        <span className="text-xs opacity-70"> / 100</span>
                      </div>

                    </div>

                  </div>
                </div>

                {/* Purchase History */}
                <div className="history-section border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden">

                  <div
                    className="flex justify-between items-center gap-3 bg-[#F8F9FB] px-4 sm:px-6 py-4 cursor-pointer select-none"
                    onClick={() => setIsPurchaseOpen(!isPurchaseOpen)}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">

                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                        Purchase History
                      </h4>

                      <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap">
                        {purchaseHistory.length} orders
                      </span>

                    </div>

                    {isPurchaseOpen ? (
                      <FiChevronUp className="text-gray-500 shrink-0" />
                    ) : (
                      <FiChevronDown className="text-gray-500 shrink-0" />
                    )}

                  </div>

                  {isPurchaseOpen && (
                    <>

                      {/* Desktop Purchase Table */}
                      <div className="desktop-history hidden md:block overflow-x-auto">
                        <table className="w-full min-w-[750px] text-left text-sm text-gray-600">

                          <thead className="text-xs uppercase text-gray-400 font-semibold border-y border-gray-100">
                            <tr>
                              <th className="px-5 py-3">INVOICE</th>
                              <th className="px-5 py-3">DATE</th>
                              <th className="px-5 py-3">ITEM</th>
                              <th className="px-5 py-3">WEIGHT</th>
                              <th className="px-5 py-3 text-right">AMOUNT</th>
                              <th className="px-5 py-3 text-center">STATUS</th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-gray-100">

                            {purchaseHistory.length === 0 ? (
                              <tr>
                                <td colSpan="6" className="px-6 py-6 text-center text-gray-500">
                                  No purchase history.
                                </td>
                              </tr>
                            ) : (
                              purchaseHistory.map((row, i) => (
                                <tr key={i} className="hover:bg-gray-50">

                                  <td className="px-5 py-4 font-medium text-[#4B5EAA]">
                                    {row.invoice}
                                  </td>

                                  <td className="px-5 py-4 whitespace-nowrap">
                                    {row.date}
                                  </td>

                                  <td className="px-5 py-4">
                                    {row.item}
                                  </td>

                                  <td className="px-5 py-4 whitespace-nowrap">
                                    {row.weight}
                                  </td>

                                  <td className="px-5 py-4 text-right font-semibold text-gray-900 whitespace-nowrap">
                                    {row.amount}
                                  </td>

                                  <td className="px-5 py-4 text-center">
                                    <span
                                      className={`px-2 py-1 rounded text-xs font-semibold ${getPurchaseStatusColor(
                                        row.status
                                      )}`}
                                    >
                                      {row.status}
                                    </span>
                                  </td>

                                </tr>
                              ))
                            )}

                          </tbody>

                          {purchaseHistory.length > 0 && (
                            <tfoot className="bg-gray-50 border-t border-gray-200">
                              <tr>
                                <td colSpan={4} className="px-5 py-4 text-gray-500 font-medium">
                                  Total ({purchaseHistory.length} purchases)
                                </td>

                                <td className="px-5 py-4 text-right font-bold text-gray-900">
                                  ₹{totalPurchaseAmount.toLocaleString()}
                                </td>

                                <td></td>
                              </tr>
                            </tfoot>
                          )}

                        </table>
                      </div>

                      {/* Mobile Purchase Cards */}
                      <div className="mobile-history md:hidden p-3 space-y-3">

                        {purchaseHistory.length === 0 ? (
                          <p className="text-center text-sm text-gray-500 py-5">
                            No purchase history.
                          </p>
                        ) : (
                          purchaseHistory.map((row, i) => (
                            <div
                              key={i}
                              className="border border-gray-200 rounded-xl p-3 sm:p-4 bg-white"
                            >

                              <div className="flex justify-between items-start gap-2">

                                <div className="min-w-0">
                                  <p className="text-xs text-gray-400">
                                    Invoice
                                  </p>

                                  <p className="font-semibold text-[#4B5EAA] text-sm break-words">
                                    {row.invoice}
                                  </p>
                                </div>

                                <span
                                  className={`shrink-0 px-2 py-1 rounded text-xs font-semibold ${getPurchaseStatusColor(
                                    row.status
                                  )}`}
                                >
                                  {row.status}
                                </span>

                              </div>

                              <div className="grid grid-cols-2 gap-3 mt-4">

                                <div>
                                  <p className="text-xs text-gray-400">Date</p>
                                  <p className="text-sm text-gray-700 mt-1">
                                    {row.date}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs text-gray-400">Weight</p>
                                  <p className="text-sm text-gray-700 mt-1">
                                    {row.weight}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs text-gray-400">Item</p>
                                  <p className="text-sm text-gray-700 mt-1 break-words">
                                    {row.item}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs text-gray-400">Amount</p>
                                  <p className="text-sm font-bold text-gray-900 mt-1">
                                    {row.amount}
                                  </p>
                                </div>

                              </div>
                            </div>
                          ))
                        )}

                        {purchaseHistory.length > 0 && (
                          <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center gap-2">
                            <span className="text-sm text-gray-600 font-medium">
                              Total ({purchaseHistory.length} purchases)
                            </span>

                            <span className="font-bold text-gray-900">
                              ₹{totalPurchaseAmount.toLocaleString()}
                            </span>
                          </div>
                        )}

                      </div>

                    </>
                  )}

                </div>

                {/* Transaction History */}
                <div className="history-section border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden">

                  <div
                    className="flex justify-between items-center gap-3 bg-[#F8F9FB] px-4 sm:px-6 py-4 cursor-pointer select-none"
                    onClick={() => setIsTransactionOpen(!isTransactionOpen)}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">

                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                        Transaction History
                      </h4>

                      <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap">
                        {transactionHistory.length} entries
                      </span>

                    </div>

                    {isTransactionOpen ? (
                      <FiChevronUp className="text-gray-500 shrink-0" />
                    ) : (
                      <FiChevronDown className="text-gray-500 shrink-0" />
                    )}

                  </div>

                  {isTransactionOpen && (
                    <>

                      {/* Desktop Transaction Table */}
                      <div className="desktop-history hidden md:block overflow-x-auto">
                        <table className="w-full min-w-[750px] text-left text-sm text-gray-600">

                          <thead className="text-xs uppercase text-gray-400 font-semibold border-y border-gray-100">
                            <tr>
                              <th className="px-5 py-3">DATE</th>
                              <th className="px-5 py-3">TYPE</th>
                              <th className="px-5 py-3">REFERENCE</th>
                              <th className="px-5 py-3">MODE</th>
                              <th className="px-5 py-3 text-right">AMOUNT</th>
                              <th className="px-5 py-3 text-right">BALANCE</th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-gray-100">

                            {transactionHistory.length === 0 ? (
                              <tr>
                                <td colSpan="6" className="px-6 py-6 text-center text-gray-500">
                                  No transaction history.
                                </td>
                              </tr>
                            ) : (
                              transactionHistory.map((row, i) => (
                                <tr key={i} className="hover:bg-gray-50">

                                  <td className="px-5 py-4 whitespace-nowrap">
                                    {row.date}
                                  </td>

                                  <td className="px-5 py-4 whitespace-nowrap">
                                    <span
                                      className={`text-xs font-semibold rounded-full px-3 py-1 ${getTransactionTypeColor(
                                        row.type
                                      )}`}
                                    >
                                      {row.type}
                                    </span>
                                  </td>

                                  <td className="px-5 py-4 font-medium text-[#4B5EAA] whitespace-nowrap">
                                    {row.reference}
                                  </td>

                                  <td className="px-5 py-4">
                                    {row.mode}
                                  </td>

                                  <td
                                    className={`px-5 py-4 text-right font-semibold whitespace-nowrap ${row.amountColor}`}
                                  >
                                    {row.amount}
                                  </td>

                                  <td className="px-5 py-4 text-right font-medium text-gray-900 whitespace-nowrap">
                                    {row.balance}
                                  </td>

                                </tr>
                              ))
                            )}

                          </tbody>

                        </table>
                      </div>

                      {/* Mobile Transaction Cards */}
                      <div className="mobile-history md:hidden p-3 space-y-3">

                        {transactionHistory.length === 0 ? (
                          <p className="text-center text-sm text-gray-500 py-5">
                            No transaction history.
                          </p>
                        ) : (
                          transactionHistory.map((row, i) => (
                            <div
                              key={i}
                              className="border border-gray-200 rounded-xl p-3 sm:p-4 bg-white"
                            >

                              <div className="flex flex-wrap items-center justify-between gap-2">

                                <span
                                  className={`text-xs font-semibold rounded-full px-3 py-1 ${getTransactionTypeColor(
                                    row.type
                                  )}`}
                                >
                                  {row.type}
                                </span>

                                <span className="text-xs text-gray-500">
                                  {row.date}
                                </span>

                              </div>

                              <div className="grid grid-cols-2 gap-3 mt-4">

                                <div className="col-span-2 min-w-0">
                                  <p className="text-xs text-gray-400">
                                    Reference
                                  </p>

                                  <p className="text-sm font-medium text-[#4B5EAA] mt-1 break-words">
                                    {row.reference}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs text-gray-400">Mode</p>
                                  <p className="text-sm text-gray-700 mt-1">
                                    {row.mode}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs text-gray-400">Amount</p>
                                  <p
                                    className={`text-sm font-semibold mt-1 break-words ${row.amountColor}`}
                                  >
                                    {row.amount}
                                  </p>
                                </div>

                                <div className="col-span-2">
                                  <p className="text-xs text-gray-400">Balance</p>
                                  <p className="text-sm font-semibold text-gray-900 mt-1">
                                    {row.balance}
                                  </p>
                                </div>

                              </div>
                            </div>
                          ))
                        )}

                      </div>

                    </>
                  )}

                </div>

              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
