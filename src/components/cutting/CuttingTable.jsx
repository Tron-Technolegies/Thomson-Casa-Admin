import React, { useState } from "react";
import { FiEdit2, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const getStatusStyle = (status) => {
  switch (status) {
    case "Cutting": return "bg-blue-100 text-blue-600";
    case "Ready": return "bg-purple-100 text-purple-600";
    case "Pending": return "bg-orange-100 text-orange-500";
    default: return "bg-gray-100 text-gray-600";
  }
};

export default function CuttingTable({ orders = [], loading, onEdit }) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const totalPages = Math.ceil(orders.length / rowsPerPage);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [orders.length]);

  const getDisplayItems = (order) => {
    return order.items && order.items.length > 0 
      ? order.items 
      : [{ chicken_type: order.chicken_type, weight: order.weight }];
  };

  const getChickenTypes = (items) => {
    const types = [...new Set(items.map(i => i.chicken_type))].join(' + ');
    return types;
  };

  const getTotalWeight = (items) => {
    return items.reduce((sum, item) => sum + Number(item.weight || 0), 0);
  };

  return (
    <div className="bg-white border border-[#00000026] rounded-xl overflow-hidden mt-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-[#F8F9FB] text-xs uppercase text-gray-400 font-bold border-b border-[#00000026]">
            <tr>
              <th className="px-6 py-4">ORDER</th>
              <th className="px-6 py-4">CUSTOMER</th>
              <th className="px-6 py-4">TYPE</th>
              <th className="px-6 py-4">WEIGHT</th>
              <th className="px-6 py-4 text-center">STATUS</th>
              <th className="px-6 py-4 text-center">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#00000026]">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">Loading orders...</td>
              </tr>
            ) : paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No orders found.</td>
              </tr>
            ) : (
              paginatedOrders.map((order) => {
                const displayItems = getDisplayItems(order);
                const types = getChickenTypes(displayItems);
                const totalWeight = getTotalWeight(displayItems);

                return (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{order.order_number}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{order.customer}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{types}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{totalWeight} Kg</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => onEdit(order)}
                      className="text-gray-600 hover:text-[#4B5EAA] transition"
                    >
                      <FiEdit2 size={18} />
                    </button>
                  </td>
                </tr>
              )})
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-[#00000026] flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-900">{((currentPage - 1) * rowsPerPage) + 1}</span> to <span className="font-medium text-gray-900">{Math.min(currentPage * rowsPerPage, orders.length)}</span> of <span className="font-medium text-gray-900">{orders.length}</span> orders
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <FiChevronLeft className="text-gray-600" />
            </button>
            
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === i + 1 
                      ? 'bg-[#465C8F] text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <FiChevronRight className="text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
