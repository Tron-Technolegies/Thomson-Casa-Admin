
import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import SortDropdown from "../components/common/SortDropdown";
import {
  sortRecords,
  getAvailableSortFields,
} from "../utils/sortUtils";

export default function StaffManagement() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sortBy, setSortBy] = useState("az");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "cutting",
    phone: "",
  });

  const { user } = useAuth();

  const fetchStaff = async () => {
    try {
      const data = await api.get("/admin/staff/", false);
      setStaffList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch staff:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleInputChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(
          `/admin/staff/${editingId}/update/`,
          formData
        );
      } else {
        await api.post(
          "/admin/staff/create/",
          formData
        );
      }

      setIsModalOpen(false);
      await fetchStaff();
    } catch (error) {
      alert(error.message);
    }
  };

  const openEditModal = (staff) => {
    setFormData({
      username: staff.username,
      email: staff.email || "",
      password: "",
      role: staff.role,
      phone: staff.phone || "",
    });

    setEditingId(staff.id);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "cutting",
      phone: "",
    });

    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this staff member?"
      )
    ) {
      return;
    }

    try {
      await api.delete(
        `/admin/staff/${id}/delete/`
      );

      await fetchStaff();
    } catch (error) {
      alert(error.message);
    }
  };

  const getRoleStyle = (role) => {
    if (role === "admin") {
      return "bg-red-100 text-red-800";
    }

    if (role === "accounts") {
      return "bg-blue-100 text-blue-800";
    }

    return "bg-green-100 text-green-800";
  };

  // Common sorting configuration
  const sortingConfig = {
    nameKeys: ["username"],
    dateKeys: ["date_joined", "created_at"],
    amountKeys: [],
    idKeys: ["id"],
  };

  const availableSort = getAvailableSortFields(
    staffList,
    sortingConfig
  );

  const sortedStaff = sortRecords(
    staffList,
    sortBy,
    sortingConfig
  );

  return (
    <div className="w-full min-w-0 p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
            Staff Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your staff members and their access roles.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 sm:w-auto"
        >
          <span className="text-lg leading-none">+</span>
          Add Staff
        </button>
      </div>

      {/* Sorting Header */}
      <div className="mb-4 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">
            Staff Records
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            {staffList.length} staff members
          </p>
        </div>

        <SortDropdown
          value={sortBy}
          onChange={setSortBy}
          allowDate={availableSort.allowDate}
          allowAmount={false}
        />
      </div>

      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-gray-200 bg-white">
          <span className="text-sm text-gray-500">
            Loading staff...
          </span>
        </div>
      ) : staffList.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center shadow-sm">
          <h3 className="font-semibold text-gray-800">
            No staff members found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Add your first staff member to get started.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:block">
            <div className="w-full overflow-x-auto">
              <table className="min-w-[700px] w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Username",
                      "Email",
                      "Role",
                      "Phone",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className={`px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 lg:px-6 ${
                          heading === "Actions"
                            ? "text-right"
                            : "text-left"
                        }`}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {sortedStaff.map((staff) => (
                    <tr
                      key={staff.id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-gray-900 lg:px-6">
                        {staff.username}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-500 lg:px-6">
                        <span className="block max-w-[220px] truncate">
                          {staff.email || "-"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 lg:px-6">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getRoleStyle(
                            staff.role
                          )}`}
                        >
                          {staff.role}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500 lg:px-6">
                        {staff.phone || "-"}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-right text-sm lg:px-6">
                        <div className="flex items-center justify-end gap-4">
                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(staff)
                            }
                            className="font-medium text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(staff.id)
                            }
                            className="font-medium text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {sortedStaff.map((staff) => (
              <div
                key={staff.id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="break-words text-base font-semibold text-gray-900">
                      {staff.username}
                    </h3>

                    <p className="mt-1 break-all text-sm text-gray-500">
                      {staff.email || "-"}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getRoleStyle(
                      staff.role
                    )}`}
                  >
                    {staff.role}
                  </span>
                </div>

                <div className="mt-4 border-t border-gray-100 pt-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Phone
                  </p>

                  <p className="mt-1 break-words text-sm text-gray-700">
                    {staff.phone || "-"}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-3 border-t border-gray-100 pt-3">
                  <button
                    type="button"
                    onClick={() =>
                      openEditModal(staff)
                    }
                    className="flex-1 rounded-lg border border-indigo-200 px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(staff.id)
                    }
                    className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add/Edit Staff Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-3 sm:items-center sm:p-5"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsModalOpen(false);
            }
          }}
        >
          <div className="my-auto w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 sm:px-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingId
                    ? "Edit Staff"
                    : "Add New Staff"}
                </h3>

                <p className="mt-0.5 text-xs text-gray-500">
                  Enter staff account details below.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setIsModalOpen(false)
                }
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="max-h-[calc(100dvh-110px)] space-y-4 overflow-y-auto p-4 sm:p-6"
            >
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Username
                </label>

                <input
                  required
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-red-500"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-red-500"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Password
                  {editingId && (
                    <span className="ml-1 text-xs font-normal text-gray-400">
                      (Leave blank to keep current)
                    </span>
                  )}
                </label>

                <input
                  type="password"
                  required={!editingId}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-red-500"
                  placeholder="Enter password"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Role
                </label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500"
                >
                  <option value="admin">
                    Admin
                  </option>

                  <option value="accounts">
                    Accounts
                  </option>

                  <option value="cutting">
                    Cutting
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Phone
                </label>

                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-red-500"
                  placeholder="Enter phone number"
                />
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end sm:gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setIsModalOpen(false)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 sm:w-auto"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
