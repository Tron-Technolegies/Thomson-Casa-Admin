import React from "react";
import { FiDownload, FiShare2, FiUser } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

export default function InvoiceModal({ isOpen, onClose, invoice }) {
  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-8 py-5 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">
            Invoice #{invoice.id}
          </h2>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
              <FiDownload /> PDF
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-100 transition">
              <FiShare2 /> Share
            </button>
            <button
              onClick={onClose}
              className="ml-2 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
            >
              <IoClose size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto">
          {/* Company & Invoice Info */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex gap-4">
              <div className="bg-[#4B5EAA] p-4 rounded-xl text-white h-14 w-14 flex items-center justify-center">
                <FiUser size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Thomson Casa</h3>
                <p className="text-sm text-gray-500 font-medium mb-2">Chicken Supply Management</p>
                <p className="text-sm text-gray-500">123 Market Street, Chennai, TN 600001</p>
                <p className="text-sm text-gray-500">GST: 33AABCT1234F1ZK | Phone: +91 44 1234 5678</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-black text-gray-900 mb-2">INVOICE</h2>
              <p className="text-sm text-gray-600 font-medium">ORD-2026-0874</p>
              <p className="text-sm text-gray-500 mt-1">Date: 28 Oct 2024</p>
              <p className="text-sm text-gray-500 mt-1">Due: 07 Nov 2024</p>
            </div>
          </div>

          {/* Bill To */}
          <div className="bg-[#F8F9FB] rounded-2xl p-6 mb-8">
            <p className="text-xs font-bold text-gray-400 tracking-wider mb-2 uppercase">Bill To</p>
            <h4 className="text-lg font-bold text-gray-900 mb-1">{invoice.customer}</h4>
            <p className="text-sm text-gray-500">Fresh Mart, 45 Anna Nagar, Chennai</p>
            <p className="text-sm text-gray-500">+91 98123 45670 | suresh@freshmart.in</p>
            <p className="text-sm text-gray-500">GST: 33AABCS9876F1ZY</p>
          </div>

          {/* Items Table */}
          <table className="w-full text-left text-sm text-gray-600 mb-6">
            <thead className="text-xs uppercase text-gray-400 font-bold border-b border-gray-200">
              <tr>
                <th className="py-3">ITEM</th>
                <th className="py-3">WEIGHT</th>
                <th className="py-3">RATE</th>
                <th className="py-3 text-right">AMOUNT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-4 font-medium text-gray-900">Dressed Chicken</td>
                <td className="py-4 font-medium text-gray-900">95 kg</td>
                <td className="py-4 font-medium text-gray-900">₹350/kg</td>
                <td className="py-4 font-bold text-gray-900 text-right">₹33,250</td>
              </tr>
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end border-t border-gray-200 pt-6">
            <div className="w-64">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 font-medium">Subtotal</span>
                <span className="font-bold text-gray-900">₹33,250</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-red-500 font-bold">Advance Used</span>
                <span className="text-red-500 font-bold">-₹15,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-900 font-black text-lg">Balance Due</span>
                <span className="font-black text-gray-900 text-lg">₹18,250</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <span className="text-xs font-medium text-gray-400">Generated by Thomson Casa Billing System</span>
          <span className="text-xs font-medium text-gray-400">GST Invoice | {invoice.id}</span>
        </div>
      </div>
    </div>
  );
}
