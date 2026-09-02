import React, { useState, useEffect } from "react";
import { FiTrendingUp, FiCreditCard, FiShoppingCart, FiDownload } from "react-icons/fi";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { api } from "../../services/api";
import { exportTableToPDF } from "../../utils/pdfGenerator";
import Pagination from "../common/Pagination";

export default function AdvanceBalanceReport({ period = "Daily" }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const res = await api.get(`/admin/advances/balance/?period=${period}`);
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
  }, [period]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const totalReceived = data.reduce((sum, item) => sum + parseFloat(item.received || 0), 0);
  const totalConsumed = data.reduce((sum, item) => sum + parseFloat(item.consumed || 0), 0);
  const totalBalance = data.reduce((sum, item) => sum + parseFloat(item.balance || 0), 0);

  const handleDownloadPDF = () => {
    const headers = ["CUSTOMER", "ADVANCE RECEIVED", "CONSUMED", "BALANCE", "UTILIZATION"];
    const pdfData = data.map(row => {
      const percent = row.received > 0 
        ? Math.round((row.consumed / row.received) * 100) 
        : 0;
      return [
        row.customer_name,
        `Rs. ${parseFloat(row.received).toLocaleString()}`,
        `Rs. ${parseFloat(row.consumed).toLocaleString()}`,
        `Rs. ${parseFloat(row.balance).toLocaleString()}`,
        `${percent}%`
      ];
    });
    exportTableToPDF("Advance Balance Report", headers, pdfData, "Advance_Balance_Report.pdf");
  };

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
            <button 
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-red-100 text-red-500 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-200 transition cursor-pointer">
              <FiDownload size={16} /> Download PDF
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-[#F8F9FB] text-xs uppercase text-gray-400 font-bold border-b border-[#00000026]">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('customer_name')}>CUSTOMER</th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('received')}>ADVANCE RECEIVED</th>
                <th className="px-6 py-4 text-center cursor-pointer hover:bg-gray-100" onClick={() => handleSort('consumed')}>CONSUMED</th>
                <th className="px-6 py-4 text-center cursor-pointer hover:bg-gray-100" onClick={() => handleSort('balance')}>BALANCE</th>
                <th className="px-6 py-4 text-center">UTILIZATION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#00000026]">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-4 text-gray-500">No data available.</td></tr>
              ) : (
                currentData.map((row, idx) => {
                  const percent = row.received > 0 
                    ? Math.round((row.consumed / row.received) * 100) 
                    : 0;
                  return (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-5 font-medium text-gray-900">{row.customer_name}</td>
                      <td className="px-6 py-5 font-medium text-gray-900 text-center">₹{parseFloat(row.received).toLocaleString()}</td>
                      <td className="px-6 py-5 font-medium text-gray-900 text-center">₹{parseFloat(row.consumed).toLocaleString()}</td>
                      <td className="px-6 py-5 font-bold text-[#4B5EAA] text-center">₹{parseFloat(row.balance).toLocaleString()}</td>
                      <td className="px-6 py-5 w-48">
                        <div className="flex justify-center items-center gap-3">
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                percent >= 90
                                  ? "bg-red-500"
                                  : percent >= 70
                                    ? "bg-orange-500"
                                    : "bg-green-500"
                              }`}
                              style={{ width: `${Math.min(percent, 100)}%` }} 
                            />
                          </div>
                          <span className="text-xs font-bold text-gray-400 min-w-[30px]">{percent}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        {!loading && data.length > 0 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
