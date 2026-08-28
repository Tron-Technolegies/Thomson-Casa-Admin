import React, { useState, useEffect } from "react";
import { FiTrendingUp, FiCreditCard, FiShoppingCart, FiDownload } from "react-icons/fi";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { api } from "../../services/api";

export default function AdvanceBalanceReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const res = await api.get("/admin/advances/balance/");
        if (res.success) {
          setData(res.balances || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBalances();
  }, []);

  const totalReceived = data.reduce((sum, item) => sum + parseFloat(item.total_advances || 0), 0);
  const totalConsumed = data.reduce((sum, item) => sum + parseFloat(item.advance_used || 0), 0);
  const totalBalance = data.reduce((sum, item) => sum + parseFloat(item.current_balance || 0), 0);

  return (
    <div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">ADVANCE RECEIVED</span>
            <div className="bg-blue-100 p-2 rounded-lg text-blue-500"><FiCreditCard size={20} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">₹{totalReceived.toLocaleString()}</h3>
            <div className="flex items-center text-green-600 text-xs font-semibold gap-1"><FiTrendingUp /> Total collected</div>
          </div>
        </div>

        <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">CONSUMED</span>
            <div className="bg-purple-100 p-2 rounded-lg text-purple-400"><FiShoppingCart size={20} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">₹{totalConsumed.toLocaleString()}</h3>
            <div className="flex items-center text-gray-400 text-xs font-semibold gap-1">Applied to orders</div>
          </div>
        </div>

        <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-400 tracking-wider">REMAINING BALANCE</span>
            <div className="bg-green-100 p-2 rounded-lg text-green-500"><MdOutlineAccountBalanceWallet size={20} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">₹{totalBalance.toLocaleString()}</h3>
            <div className="flex items-center text-green-600 text-xs font-semibold gap-1"><FiTrendingUp /> Available advance</div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-[#00000026] rounded-xl overflow-hidden shadow-sm">
        <div className="flex justify-between items-center p-6 border-b border-[#00000026]">
          <h2 className="text-lg font-bold text-gray-900">Advance Balance Details</h2>
          <div className="flex gap-4">
            <button onClick={() => window.print()} className="flex items-center gap-2 bg-green-100 text-green-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-200 transition">
              <FiDownload size={16} /> Download Report
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-[#F8F9FB] text-xs uppercase text-gray-400 font-bold border-b border-[#00000026]">
              <tr>
                <th className="px-6 py-4">CUSTOMER</th>
                <th className="px-6 py-4 text-center">ADVANCE RECEIVED</th>
                <th className="px-6 py-4 text-center">CONSUMED</th>
                <th className="px-6 py-4 text-center">BALANCE</th>
                <th className="px-6 py-4 text-center">UTILIZATION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#00000026]">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-4 text-gray-500">No data available.</td></tr>
              ) : (
                data.map((row, idx) => {
                  const percent = row.total_advances > 0 
                    ? Math.round((row.advance_used / row.total_advances) * 100) 
                    : 0;
                  return (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-5 font-medium text-gray-900">{row.customer_name}</td>
                      <td className="px-6 py-5 font-medium text-gray-900 text-center">₹{parseFloat(row.total_advances).toLocaleString()}</td>
                      <td className="px-6 py-5 font-medium text-gray-900 text-center">₹{parseFloat(row.advance_used).toLocaleString()}</td>
                      <td className="px-6 py-5 font-bold text-[#4B5EAA] text-center">₹{parseFloat(row.current_balance).toLocaleString()}</td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center items-center gap-3">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-[#4B5EAA] h-2 rounded-full" style={{ width: `${percent}%` }}></div>
                          </div>
                          <span className="text-xs font-bold text-gray-400 w-6">{percent}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
