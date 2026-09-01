import React, { useState, useEffect } from "react";
import { FiShoppingCart, FiCreditCard, FiFileText, FiAlertCircle } from "react-icons/fi";
import { api } from "../services/api";
import ConfirmModal from "../components/common/ConfirmModal";

const getIconProps = (type) => {
  switch (type) {
    case 'order': return { icon: <FiShoppingCart className="text-green-500" size={20} />, bg: "bg-green-100" };
    case 'payment': return { icon: <FiCreditCard className="text-blue-500" size={20} />, bg: "bg-blue-100" };
    case 'invoice': return { icon: <FiFileText className="text-purple-500" size={20} />, bg: "bg-purple-100" };
    case 'alert': return { icon: <FiAlertCircle className="text-yellow-600" size={20} />, bg: "bg-yellow-100" };
    default: return { icon: <FiAlertCircle className="text-gray-500" size={20} />, bg: "bg-gray-100" };
  }
};

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/admin/notifications/");
      if (res.success) {
        setNotifications(res.notifications || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      const res = await api.post("/admin/notifications/read/");
      if (res.success) {
        fetchNotifications();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = async () => {
    try {
      const res = await api.delete("/admin/notifications/clear/");
      if (res.success) {
        fetchNotifications();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="max-w-[1200px] mx-auto pb-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Notifications</h1>
          <p className="text-sm text-gray-500 font-semibold">{unreadCount} Unread</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleMarkAllRead}
            className="text-[#4B5EAA] font-semibold text-sm hover:underline"
          >
            Mark all read
          </button>
          <button 
            onClick={() => setIsClearModalOpen(true)}
            className="text-red-500 font-semibold text-sm hover:underline"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#00000026] rounded-xl overflow-hidden shadow-sm">
        <div className="flex flex-col">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No notifications.</div>
          ) : (
            notifications.map((item) => {
              const { icon, bg } = getIconProps(item.type);
              return (
                <div 
                  key={item.id} 
                  className={`flex items-center gap-6 p-6 border-b border-[#00000026] last:border-0 transition hover:bg-gray-50
                    ${!item.is_read ? 'bg-[#F8FAFC]' : 'bg-white'}
                  `}
                >
                  {/* Icon */}
                  <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${bg}`}>
                    {icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                    <p className="text-sm font-medium text-gray-500 mt-0.5">{item.description}</p>
                    <p className="text-xs font-semibold text-gray-400 mt-2">{item.time}</p>
                  </div>

                  {/* Unread Indicator */}
                  {!item.is_read && (
                    <div className="w-2.5 h-2.5 bg-[#4B5EAA] rounded-full shrink-0"></div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={handleClearAll}
        title="Clear All Notifications"
        message="Are you sure you want to permanently delete all notifications? This action cannot be undone."
        confirmText="Clear All"
        isDanger={true}
      />
    </div>
  );
}
