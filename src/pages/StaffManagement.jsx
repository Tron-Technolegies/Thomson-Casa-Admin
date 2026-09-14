import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function StaffManagement() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'cutting', phone: '' });
  const [editingId, setEditingId] = useState(null);
  const { user } = useAuth();

  const fetchStaff = async () => {
    try {
      const data = await api.get('/admin/staff/', false);
      setStaffList(data);
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/staff/${editingId}/update/`, formData);
      } else {
        await api.post('/admin/staff/create/', formData);
      }
      setIsModalOpen(false);
      fetchStaff();
    } catch (error) {
      alert(error.message);
    }
  };

  const openEditModal = (staff) => {
    setFormData({ username: staff.username, email: staff.email, password: '', role: staff.role, phone: staff.phone });
    setEditingId(staff.id);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setFormData({ username: '', email: '', password: '', role: 'cutting', phone: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await api.delete(`/admin/staff/${id}/delete/`);
        fetchStaff();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Staff Management</h1>
        <button
          onClick={openCreateModal}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          + Add Staff
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staffList.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{staff.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${staff.role === 'admin' ? 'bg-red-100 text-red-800' : 
                        staff.role === 'accounts' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {staff.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openEditModal(staff)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                    <button onClick={() => handleDelete(staff.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-white/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{editingId ? 'Edit Staff' : 'Add New Staff'}</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input required name="username" value={formData.username} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-red-500 focus:border-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-red-500 focus:border-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password {editingId && <span className="text-gray-400 font-normal">(Leave blank to keep current)</span>}</label>
                <input type="password" required={!editingId} name="password" value={formData.password} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-red-500 focus:border-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select name="role" value={formData.role} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-red-500 focus:border-red-500">
                  <option value="admin">Admin</option>
                  <option value="accounts">Accounts</option>
                  <option value="cutting">Cutting</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-red-500 focus:border-red-500" />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
