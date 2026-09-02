import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { FiDownload, FiPrinter, FiShare2, FiChevronUp, FiChevronDown } from 'react-icons/fi';
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
  
  const totalPurchaseAmount = purchaseHistory.reduce((sum, p) => sum + parseFloat(p.amount.replace(/[^0-9.-]+/g,"")), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-gray-100 px-8 py-6 sticky top-0 bg-white z-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
            Customer Details
          </h2>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <FiDownload /> PDF
            </button>
            {/* <button className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <FiPrinter /> Print
            </button> */}
            <button className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100">
              <FiShare2 /> Share
            </button>
            <button
              onClick={onClose}
              className="ml-2 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
            >
              <IoClose size={24} />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {loading ? (
            <div className="text-center py-10 text-gray-500 font-medium">Loading details...</div>
          ) : (
            <>
              {/* Customer Info Card */}
              <div className="bg-[#F8F9FB] rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{displayCustomer.customer_name || "N/A"}</h3>
                <p className="text-gray-600 text-sm mb-1">{displayCustomer.company_name || "N/A"}, {displayCustomer.address || "No Address"}</p>
                <p className="text-gray-600 text-sm mb-1">{displayCustomer.phone || "N/A"} | {displayCustomer.email || "N/A"}</p>
                <p className="text-gray-600 text-sm">GST: {displayCustomer.gst_number || "N/A"}</p>
              </div>

              {/* Purchase History */}
              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <div 
                  className="flex justify-between items-center bg-[#F8F9FB] px-6 py-4 cursor-pointer select-none"
                  onClick={() => setIsPurchaseOpen(!isPurchaseOpen)}
                >
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-gray-900">Purchase History</h4>
                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {purchaseHistory.length} orders
                    </span>
                  </div>
                  {isPurchaseOpen ? <FiChevronUp className="text-gray-500" /> : <FiChevronDown className="text-gray-500" />}
                </div>
                
                {isPurchaseOpen && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                      <thead className="text-xs uppercase text-gray-400 font-semibold border-y border-gray-100">
                        <tr>
                          <th className="px-6 py-3">INVOICE</th>
                          <th className="px-6 py-3">DATE</th>
                          <th className="px-6 py-3">ITEM</th>
                          <th className="px-6 py-3">WEIGHT</th>
                          <th className="px-6 py-3 text-right">AMOUNT</th>
                          <th className="px-6 py-3 text-center">STATUS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {purchaseHistory.length === 0 ? (
                          <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">No purchase history.</td></tr>
                        ) : (
                          purchaseHistory.map((row, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                              <td className="px-6 py-4 font-medium text-[#4B5EAA]">{row.invoice}</td>
                              <td className="px-6 py-4">{row.date}</td>
                              <td className="px-6 py-4">{row.item}</td>
                              <td className="px-6 py-4">{row.weight}</td>
                              <td className="px-6 py-4 text-right font-semibold text-gray-900">{row.amount}</td>
                              <td className="px-6 py-4 text-center">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                  row.status === 'Pending' || row.status === 'Unpaid' ? 'bg-orange-100 text-orange-600' : 
                                  row.status === 'Partial' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                                }`}>
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
                            <td colSpan={4} className="px-6 py-4 text-gray-500 font-medium">Total ({purchaseHistory.length} purchases)</td>
                            <td className="px-6 py-4 text-right font-bold text-gray-900">₹{totalPurchaseAmount.toLocaleString()}</td>
                            <td></td>
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>
                )}
              </div>

              {/* Transaction History */}
              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <div 
                  className="flex justify-between items-center bg-[#F8F9FB] px-6 py-4 cursor-pointer select-none"
                  onClick={() => setIsTransactionOpen(!isTransactionOpen)}
                >
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-gray-900">Transaction History</h4>
                    <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {transactionHistory.length} entries
                    </span>
                  </div>
                  {isTransactionOpen ? <FiChevronUp className="text-gray-500" /> : <FiChevronDown className="text-gray-500" />}
                </div>
                
                {isTransactionOpen && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                      <thead className="text-xs uppercase text-gray-400 font-semibold border-y border-gray-100">
                        <tr>
                          <th className="px-6 py-3">DATE</th>
                          <th className="px-6 py-3">TYPE</th>
                          <th className="px-6 py-3">REFERENCE</th>
                          <th className="px-6 py-3">MODE</th>
                          <th className="px-6 py-3 text-right">AMOUNT</th>
                          <th className="px-6 py-3 text-right">BALANCE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {transactionHistory.length === 0 ? (
                          <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">No transaction history.</td></tr>
                        ) : (
                          transactionHistory.map((row, i) => {
                            let typeStyle = "";
                            if (row.type === "Invoice Raised") typeStyle = "text-blue-600 border border-blue-200 bg-blue-50 rounded-full px-3 py-1";
                            else if (row.type === "Advance Payment") typeStyle = "text-purple-600 border border-purple-200 bg-purple-50 rounded-full px-3 py-1";
                            else if (row.type === "Payment Received") typeStyle = "text-green-600 border border-green-200 bg-green-50 rounded-full px-3 py-1";

                            return (
                              <tr key={i} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">{row.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`text-xs font-semibold ${typeStyle}`}>{row.type}</span>
                                </td>
                                <td className="px-6 py-4 font-medium text-[#4B5EAA] whitespace-nowrap">{row.reference}</td>
                                <td className="px-6 py-4">{row.mode}</td>
                                <td className={`px-6 py-4 text-right font-semibold whitespace-nowrap ${row.amountColor}`}>
                                  {row.amount}
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-gray-900 whitespace-nowrap">{row.balance}</td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
