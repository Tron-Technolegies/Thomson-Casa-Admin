import React from "react";
import { FiShoppingCart, FiCreditCard, FiFileText, FiAlertCircle } from "react-icons/fi";

const notificationsData = [
  {
    id: 1,
    type: "order",
    title: "New Order Received",
    description: "ORD-2026-0187 from Raj Enterprises- 200kg Dressed Chicken",
    time: "2 min ago",
    read: false,
    icon: <FiShoppingCart className="text-green-500" size={20} />,
    bg: "bg-green-100"
  },
  {
    id: 2,
    type: "payment",
    title: "Payment Received",
    description: "Rs.45,000 received from Hotel Grand Palace via Bank Transfer",
    time: "18 min ago",
    read: false,
    icon: <FiCreditCard className="text-blue-500" size={20} />,
    bg: "bg-blue-100"
  },
  {
    id: 3,
    type: "invoice",
    title: "Invoice Generated",
    description: "INV-2026-0092 generated for Suresh Kumar - Rs.33,250",
    time: "1 hr ago",
    read: false,
    icon: <FiFileText className="text-purple-500" size={20} />,
    bg: "bg-purple-100"
  },
  {
    id: 4,
    type: "alert",
    title: "Low Advance Balance",
    description: "Meena Stores advance balance is below Rs.2,000",
    time: "3 hr ago",
    read: true,
    icon: <FiAlertCircle className="text-yellow-600" size={20} />,
    bg: "bg-yellow-100"
  },
  {
    id: 5,
    type: "order",
    title: "Order Delivered",
    description: "ORD-2026-0187 delivered to Raj Enterprises",
    time: "5 hr ago",
    read: true,
    icon: <FiShoppingCart className="text-green-500" size={20} />,
    bg: "bg-green-100"
  },
  {
    id: 6,
    type: "invoice",
    title: "Invoice Overdue",
    description: "INV-2026-0092 for Suresh Kumar is 3 days overdue",
    time: "Yesterday",
    read: true,
    icon: <FiFileText className="text-purple-500" size={20} />,
    bg: "bg-purple-100"
  }
];

export default function Notification() {
  return (
    <div className="max-w-[1200px] mx-auto pb-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Notifications</h1>
          <p className="text-sm text-gray-500 font-semibold">3 Unread</p>
        </div>
        <button className="text-[#4B5EAA] font-semibold text-sm hover:underline">
          Mark all read
        </button>
      </div>

      <div className="bg-white border border-[#00000026] rounded-xl overflow-hidden shadow-sm">
        <div className="flex flex-col">
          {notificationsData.map((item, index) => (
            <div 
              key={item.id} 
              className={`flex items-center gap-6 p-6 border-b border-[#00000026] last:border-0 transition hover:bg-gray-50
                ${!item.read ? 'bg-[#F8FAFC]' : 'bg-white'}
              `}
            >
              {/* Icon */}
              <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${item.bg}`}>
                {item.icon}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                <p className="text-sm font-medium text-gray-500 mt-0.5">{item.description}</p>
                <p className="text-xs font-semibold text-gray-400 mt-2">{item.time}</p>
              </div>

              {/* Unread Indicator */}
              {!item.read && (
                <div className="w-2.5 h-2.5 bg-[#4B5EAA] rounded-full shrink-0"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
