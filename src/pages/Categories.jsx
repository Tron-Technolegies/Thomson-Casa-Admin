import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FiTrash2, FiPlus } from 'react-icons/fi';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      const response = await api.get('/admin/categories/');
      if (response.success) {
        setCategories(response.categories);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch categories.');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setLoading(true);
    setError('');
    try {
      const response = await api.post('/admin/categories/add/', { name: newCategory });
      if (response.success) {
        setNewCategory('');
        fetchCategories();
      } else {
        setError(response.message || 'Failed to add category.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to remove this category?")) return;
    
    try {
      const response = await api.delete(`/admin/categories/${id}/delete/`);
      if (response.success) {
        fetchCategories();
      } else {
        setError(response.message || 'Failed to delete category.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Product Categories</h1>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-2xl">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Category</h2>
        <form onSubmit={handleAddCategory} className="flex gap-4 mb-8">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="e.g. Alfaham"
            className="flex-1 h-12 rounded-xl border border-gray-300 px-4 outline-none focus:border-[#4B5EAA]"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="h-12 px-6 bg-[#4B5EAA] text-white font-semibold rounded-xl hover:bg-[#3d4f92] transition flex items-center gap-2 disabled:opacity-70"
          >
            <FiPlus /> Add
          </button>
        </form>

        {error && <div className="mb-4 text-red-500 text-sm font-semibold">{error}</div>}

        <h2 className="text-lg font-semibold text-gray-800 mb-4">Active Categories</h2>
        <div className="space-y-3">
          {categories.length === 0 ? (
            <p className="text-gray-500">No categories found. Add one above to get started.</p>
          ) : (
            categories.map(cat => (
              <div key={cat.id} className="flex justify-between items-center p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <span className="font-medium text-gray-800">{cat.name}</span>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="text-red-400 hover:text-red-600 transition p-2"
                  title="Remove Category"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
