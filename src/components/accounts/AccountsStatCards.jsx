
import React, { useState, useEffect } from "react";
import {
  FiTrendingUp,
  FiShoppingCart,
  FiEdit2,
  FiX
} from "react-icons/fi";
import { api } from "../../services/api";

export default function AccountsStatCards({
  orders = [],
  dailyPrices = {},
  selectedDate,
  onUpdatePrices,
  dailyCategorySales = {}
}) {
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [liveRate, setLiveRate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/admin/categories/");

        if (response.success) {
          setCategories(response.categories || []);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const totalPurchases = orders.reduce(
    (sum, order) => sum + (parseFloat(order.total_amount) || 0),
    0
  );

  const totalOrders = orders.length;

  // Get one common Live Rate from the existing daily prices.
  const currentLiveRate =
    categories
      .map((cat) => dailyPrices[cat.name])
      .find((rate) => rate !== null && rate !== undefined && rate !== "") ?? "";

  const handleEditClick = () => {
    setLiveRate(
      currentLiveRate !== "" ? String(currentLiveRate) : ""
    );
    setError("");
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const numericRate = Number(liveRate);

    if (
      liveRate.trim() === "" ||
      !Number.isFinite(numericRate) ||
      numericRate <= 0
    ) {
      setError("Please enter a valid Live Rate.");
      return;
    }

    if (categories.length === 0) {
      setError("No categories available.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Apply the same Live Rate to every category.
      const prices = {};

      categories.forEach((cat) => {
        prices[cat.name] = numericRate;
      });

      const response = await api.post(
        "/admin/daily-prices/update/",
        {
          prices,
          date: selectedDate
        }
      );

      if (!response.success) {
        throw new Error(
          response.message || "Failed to update Live Rate."
        );
      }

      // Refresh the latest prices in the parent component.
      if (onUpdatePrices) {
        await onUpdatePrices();
      }

      setIsEditing(false);
    } catch (err) {
      console.error("Live Rate update error:", err);

      setError(
        err?.data?.message ||
        err?.message ||
        "Unable to update Live Rate."
      );
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
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              ₹ {totalPurchases.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </h3>

            <div className="flex items-center text-green-600 text-sm font-semibold gap-1">
              <FiTrendingUp />
              Total pending billing amount
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
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              {totalOrders}
            </h3>

            <div className="flex items-center text-green-600 text-sm font-semibold gap-1">
              <FiTrendingUp />
              Orders ready to bill
            </div>
          </div>
        </div>

        {/* Daily Category-wise Sales */}
        <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-gray-400 tracking-wider uppercase">
              Sales by Category
            </span>
          </div>

          <div className="flex-1 overflow-y-auto max-h-32 pr-1 custom-scrollbar space-y-3">
            {Object.keys(dailyCategorySales).length > 0 ? (
              Object.entries(dailyCategorySales).map(([cat, data]) => (
                <div
                  key={cat}
                  className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-100"
                >
                  <div>
                    <div className="text-xs font-bold text-gray-800">
                      {cat}
                    </div>

                    <div className="text-[10px] text-gray-500">
                      {data.weight} kg sold
                    </div>
                  </div>

                  <div className="text-sm font-bold text-green-600">
                    ₹{data.value.toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 text-xs py-4">
                No sales data today.
              </div>
            )}
          </div>
        </div>

        {/* Single Live Rate */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-400 tracking-wider uppercase">
              Today's Market
            </span>

            <button
              onClick={handleEditClick}
              className="text-[#4B5EAA] hover:text-[#3d4f92] text-sm flex items-center gap-1 font-semibold transition"
            >
              <FiEdit2 />
              Edit
            </button>
          </div>

          <div className="bg-white border border-[#00000026] rounded-xl p-5 shadow-sm flex flex-col justify-center h-full">
            <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase">
              LIVE RATE
            </h4>

            <span className="text-orange-500 font-bold text-2xl">
              {currentLiveRate !== ""
                ? `₹${currentLiveRate}/kg`
                : "---"}
            </span>

            <p className="text-xs text-gray-400 mt-2">
              Common rate for all categories
            </p>
          </div>
        </div>
      </div>

      {/* Edit Live Rate Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">

            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <FiX size={24} />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Set Today's Live Rate
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              This rate will be applied to all chicken categories.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Live Rate (₹ / kg)
                </label>

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  value={liveRate}
                  onChange={(e) => setLiveRate(e.target.value)}
                  placeholder="Enter Live Rate"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg font-bold outline-none focus:border-[#4B5EAA]"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#4B5EAA] py-3 font-semibold text-white hover:bg-[#3d4f92] disabled:opacity-70 mt-4"
              >
                {loading ? "Saving..." : "Save Live Rate"}
              </button>

            </form>
          </div>
        </div>
      )}
    </>
  );
}
