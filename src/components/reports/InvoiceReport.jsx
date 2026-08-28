import React, { useState, useEffect } from "react";
import { FiTrendingUp, FiFileText, FiDollarSign, FiCreditCard, FiDownload } from "react-icons/fi";
import { api } from "../../services/api";

export default function InvoiceReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await api.get("/admin/invoices/");
        if (res.success) {
          setData(res.invoices || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const totalAmount = data.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
  const totalTax = data.reduce((sum, item) => sum + parseFloat(item.tax || 0), 0);
  const grossTotal = data.reduce((sum, item) => sum + parseFloat(item.total || 0), 0);
  
  const paidInvoices = data.filter(i => i.status === 'Paid');
  const amountPaid = paidInvoices.reduce((sum, item) => sum + parseFloat(item.total || 0), 0);

  return (
    <div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">TOTAL INVOICED</span>
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><FiFileText size={20} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">₹ {totalAmount.toLocaleString()}</h3>
            <div className="flex items-center text-green-600 text-xs font-semibold gap-1"><FiTrendingUp /> Net amount</div>
          </div>
        </div>

        <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">TOTAL TAX</span>
            <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600"><FiFileText size={20} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">₹ {totalTax.toLocaleString()}</h3>
            <div className="flex items-center text-gray-500 text-xs font-semibold gap-1">GST collected</div>
          </div>
        </div>

        <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">GROSS TOTAL</span>
            <div className="bg-green-100 p-2 rounded-lg text-green-600"><FiDollarSign size={20} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">₹ {grossTotal.toLocaleString()}</h3>
            <div className="flex items-center text-green-600 text-xs font-semibold gap-1"><FiTrendingUp /> Incl. taxes</div>
          </div>
        </div>

        <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">AMOUNT PAID</span>
            <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><FiCreditCard size={20} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">₹ {amountPaid.toLocaleString()}</h3>
            <div className="flex items-center text-green-600 text-xs font-semibold gap-1"><FiTrendingUp /> {paidInvoices.length} invoices cleared</div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-[#00000026] rounded-xl overflow-hidden shadow-sm">
        <div className="flex justify-between items-center p-6 border-b border-[#00000026]">
          <h2 className="text-lg font-bold text-gray-900">Invoice Register</h2>
          <div className="flex gap-4">
            <button onClick={() => window.print()} className="flex items-center gap-2 bg-red-100 text-red-500 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-200 transition">
              <FiDownload size={16} /> Download Report
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-[#F8F9FB] text-xs uppercase text-gray-400 font-bold border-b border-[#00000026]">
              <tr>
                <th className="px-6 py-4">INVOICE NO</th>
                <th className="px-6 py-4 text-center">CUSTOMER</th>
                <th className="px-6 py-4 text-center">DATE</th>
                <th className="px-6 py-4 text-center">AMOUNT</th>
                <th className="px-6 py-4 text-center">TAX</th>
                <th className="px-6 py-4 text-center">TOTAL</th>
                <th className="px-6 py-4 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#00000026]">
              {loading ? (
                <tr><td colSpan="7" className="text-center py-4">Loading...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-4 text-gray-500">No data available.</td></tr>
              ) : (
                data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-5 font-medium text-blue-400">{row.id}</td>
                    <td className="px-6 py-5 font-medium text-gray-900 text-center">{row.customer}</td>
                    <td className="px-6 py-5 font-medium text-gray-900 text-center">{row.date}</td>
                    <td className="px-6 py-5 font-medium text-gray-900 text-center">₹ {row.amount.toLocaleString()}</td>
                    <td className="px-6 py-5 font-medium text-gray-900 text-center">₹ {row.tax.toLocaleString()}</td>
                    <td className="px-6 py-5 font-bold text-gray-900 text-center">₹ {row.total.toLocaleString()}</td>
                    <td className="px-6 py-5 text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${row.status === 'Paid' ? 'bg-green-100 text-green-500' : row.status === 'Partial' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-500'}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
