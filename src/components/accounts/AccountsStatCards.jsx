import React, { useState, useEffect } from "react";
import { FiTrendingUp, FiShoppingCart, FiEdit2, FiX } from "react-icons/fi";
import { api } from "../../services/api";

export default function AccountsStatCards({ orders = [], dailyPrices = {}, selectedDate, onUpdatePrices, dailyCategorySales = {} }) {
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [pricesForm, setPricesForm] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/admin/categories/');
        if (response.success) {
          setCategories(response.categories);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const totalPurchases = orders.reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0);
  const totalOrders = orders.length;

  const handleEditClick = () => {
    const initialForm = {};
    categories.forEach(cat => {
      initialForm[cat.name] = dailyPrices[cat.name] || "";
    });
    setPricesForm(initialForm);
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/admin/daily-prices/update/", { 
        prices: pricesForm,
        date: selectedDate
      });
      if (res.success && onUpdatePrices) {
        onUpdatePrices();
      }
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Purchases */}
        <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-bold text-gray-400 tracking-wider">
              TOTAL PURCHASES
            </span>
            <div className="bg-green-100 p-2 rounded-lg text-green-600">
              <FiShoppingCart size={20} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">₹ {totalPurchases.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <div className="flex items-center text-green-600 text-sm font-semibold gap-1">
              <FiTrendingUp /> Total pending billing amount
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-bold text-gray-400 tracking-wider">
              ORDERS
            </span>
            <div className="bg-green-100 p-2 rounded-lg text-green-600">
              <FiShoppingCart size={20} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{totalOrders}</h3>
            <div className="flex items-center text-green-600 text-sm font-semibold gap-1">
              <FiTrendingUp /> Orders ready to bill
            </div>
          </div>
        </div>

        {/* Daily Category-wise Sales */}
        <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-gray-400 tracking-wider uppercase">Sales by Category</span>
          </div>
          <div className="flex-1 overflow-y-auto max-h-32 pr-1 custom-scrollbar space-y-3">
            {Object.keys(dailyCategorySales).length > 0 ? (
              Object.entries(dailyCategorySales).map(([cat, data]) => (
                <div key={cat} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <div>
                    <div className="text-xs font-bold text-gray-800">{cat}</div>
                    <div className="text-[10px] text-gray-500">{data.weight} kg sold</div>
                  </div>
                  <div className="text-sm font-bold text-green-600">₹{data.value.toLocaleString()}</div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 text-xs py-4">No sales data today.</div>
            )}
          </div>
        </div>

        {/* Market Prices */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-400 tracking-wider uppercase">Today's Market</span>
            <button onClick={handleEditClick} className="text-[#4B5EAA] hover:text-[#3d4f92] text-sm flex items-center gap-1 font-semibold transition">
              <FiEdit2 /> Edit
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 h-full overflow-y-auto max-h-48 pr-1 custom-scrollbar">
            {categories.map((cat, index) => (
              <div 
                key={cat.id} 
                className={`bg-white border border-[#00000026] rounded-xl p-3 shadow-sm flex flex-col justify-center ${categories.length % 2 !== 0 && index === categories.length - 1 ? 'col-span-2' : ''}`}
              >
                <h4 className="text-[10px] font-bold text-gray-500 mb-1 uppercase">{cat.name}</h4>
                <span className="text-orange-500 font-bold text-sm">₹{dailyPrices[cat.name] || "---"}/kg</span>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="col-span-2 text-center text-gray-500 text-xs py-4">
                No categories available. Add categories from Categories page.
              </div>
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
            <button onClick={() => setIsEditing(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <FiX size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Set Today's Market Price</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {Object.keys(pricesForm).map((type) => (
                <div key={type}>
                  <label className="block text-sm font-medium text-gray-600 mb-1">{type} (₹/kg)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={pricesForm[type]}
                    onChange={(e) => setPricesForm({...pricesForm, [type]: e.target.value})}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2 outline-none focus:border-[#4B5EAA]"
                  />
                </div>
              ))}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full rounded-xl bg-[#4B5EAA] py-3 font-semibold text-white hover:bg-[#3d4f92] disabled:opacity-70 mt-4"
              >
                {loading ? "Saving..." : "Save Prices"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
