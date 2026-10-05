import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { FiTrash2, FiPlus, FiSave } from "react-icons/fi";

export default function Categories() {
  const [categories, setCategories] = useState([]);

  const [newCategory, setNewCategory] = useState("");
  const [newYieldPercentage, setNewYieldPercentage] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await api.get(
        "/admin/categories/",
        false
      );

      if (response.success) {
        setCategories(response.categories);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch categories.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // -----------------------------------
  // Add Category
  // -----------------------------------

  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!newCategory.trim()) {
      setError("Category name is required.");
      return;
    }

    const percentage = Number(newYieldPercentage);

    if (
      newYieldPercentage === "" ||
      isNaN(percentage) ||
      percentage < 0 ||
      percentage > 100
    ) {
      setError(
        "Approx. yield percentage must be between 0 and 100."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post(
        "/admin/categories/add/",
        {
          name: newCategory,
          approx_yield_percentage: percentage
        }
      );

      if (response.success) {
        setNewCategory("");
        setNewYieldPercentage("");

        await fetchCategories();
      } else {
        setError(
          response.message ||
          "Failed to add category."
        );
      }
    } catch (err) {
      setError(
        err.message ||
        "An error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------
  // Update Category
  // -----------------------------------

  const handleUpdateCategory = async (category) => {
    const percentage = Number(
      category.approx_yield_percentage
    );

    if (
      isNaN(percentage) ||
      percentage < 0 ||
      percentage > 100
    ) {
      setError(
        "Yield percentage must be between 0 and 100."
      );
      return;
    }

    try {
      const response = await api.put(
        `/admin/categories/${category.id}/update/`,
        {
          name: category.name,
          approx_yield_percentage: percentage
        }
      );

      if (response.success) {
        setError("");
        await fetchCategories();
      } else {
        setError(
          response.message ||
          "Failed to update category."
        );
      }
    } catch (err) {
      setError(
        err.message ||
        "Failed to update category."
      );
    }
  };

  // -----------------------------------
  // Delete Category
  // -----------------------------------

  const handleDeleteCategory = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this category?"
      )
    ) {
      return;
    }

    try {
      const response = await api.delete(
        `/admin/categories/${id}/delete/`
      );

      if (response.success) {
        await fetchCategories();
      } else {
        setError(
          response.message ||
          "Failed to delete category."
        );
      }
    } catch (err) {
      setError(
        err.message ||
        "An error occurred."
      );
    }
  };

  // -----------------------------------
  // Change Existing Category
  // -----------------------------------

  const handleCategoryChange = (
    id,
    field,
    value
  ) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id
          ? {
              ...cat,
              [field]: value
            }
          : cat
      )
    );
  };

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Product Categories
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Manage categories and their approximate meat yield.
        </p>
      </div>

      {/* -------------------------------- */}
      {/* Add Category */}
      {/* -------------------------------- */}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Add New Category
        </h2>

        <form
          onSubmit={handleAddCategory}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >

          <input
            type="text"
            value={newCategory}
            onChange={(e) =>
              setNewCategory(e.target.value)
            }
            placeholder="Category name"
            className="h-12 rounded-xl border border-gray-300 px-4 outline-none focus:border-[#4B5EAA]"
            disabled={loading}
          />

          <div className="relative">

            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={newYieldPercentage}
              onChange={(e) =>
                setNewYieldPercentage(e.target.value)
              }
              placeholder="Approx. Yield %"
              className="h-12 w-full rounded-xl border border-gray-300 px-4 pr-10 outline-none focus:border-[#4B5EAA]"
              disabled={loading}
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              %
            </span>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-12 px-6 bg-[#4B5EAA] text-white font-semibold rounded-xl hover:bg-[#3d4f92] transition flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <FiPlus />

            {loading ? "Adding..." : "Add Category"}
          </button>

        </form>

        {error && (
          <div className="mt-4 text-red-500 text-sm font-semibold">
            {error}
          </div>
        )}

      </div>

      {/* -------------------------------- */}
      {/* Categories */}
      {/* -------------------------------- */}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Active Categories
        </h2>

        {categories.length === 0 ? (
          <p className="text-gray-500">
            No categories found.
          </p>
        ) : (
          <div className="space-y-3">

            {categories.map((cat) => (

              <div
                key={cat.id}
                className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-gray-50 border border-gray-100 rounded-xl"
              >

                {/* Name */}

                <input
                  type="text"
                  value={cat.name}
                  onChange={(e) =>
                    handleCategoryChange(
                      cat.id,
                      "name",
                      e.target.value
                    )
                  }
                  className="flex-1 h-11 rounded-lg border border-gray-200 px-3 outline-none focus:border-[#4B5EAA]"
                />

                {/* Percentage */}

                <div className="relative w-full md:w-40">

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={
                      cat.approx_yield_percentage ?? ""
                    }
                    onChange={(e) =>
                      handleCategoryChange(
                        cat.id,
                        "approx_yield_percentage",
                        e.target.value
                      )
                    }
                    className="w-full h-11 rounded-lg border border-gray-200 px-3 pr-8 outline-none focus:border-[#4B5EAA]"
                  />

                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    %
                  </span>

                </div>

                {/* Save */}

                <button
                  onClick={() =>
                    handleUpdateCategory(cat)
                  }
                  className="h-11 px-4 bg-[#4B5EAA] text-white rounded-lg hover:bg-[#3d4f92] transition flex items-center justify-center gap-2"
                >
                  <FiSave size={16} />
                  Save
                </button>

                {/* Delete */}

                <button
                  onClick={() =>
                    handleDeleteCategory(cat.id)
                  }
                  className="text-red-400 hover:text-red-600 transition p-2"
                  title="Remove Category"
                >
                  <FiTrash2 size={18} />
                </button>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}