
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  MdOutlineDashboard,
  MdPeople,
  MdAssessment,
  MdOutlineAccountBalanceWallet,
  MdAnalytics,
  MdClose,
  MdLogout,
} from "react-icons/md";

import {
  FiShoppingCart,
  FiScissors,
  FiBell,
  FiTag,
  FiFileText,
} from "react-icons/fi";

import { VscGraph } from "react-icons/vsc";
import { TbInvoice } from "react-icons/tb";

const menus = [
  {
    name: "Dashboard",
    icon: <MdOutlineDashboard size={22} />,
    path: "/",
  },
  {
    name: "Categories",
    icon: <FiTag size={22} />,
    path: "/categories",
  },
  {
    name: "Customers",
    icon: <MdPeople size={22} />,
    path: "/customers",
  },
  {
    name: "Orders",
    icon: <FiShoppingCart size={22} />,
    path: "/orders",
  },
  {
    name: "Cutting Orders",
    icon: <FiScissors size={22} />,
    path: "/cutting-orders",
  },
  {
    name: "Accounts",
    icon: <MdAssessment size={22} />,
    path: "/accounts",
  },
  {
    name: "Record Advance",
    icon: <VscGraph size={22} />,
    path: "/record-advance",
  },
  {
    name: "Advance Balance",
    icon: <MdOutlineAccountBalanceWallet size={22} />,
    path: "/advance-balance",
  },
  {
    name: "Invoice",
    icon: <TbInvoice size={22} />,
    path: "/invoice",
  },
  {
    name: "Reports",
    icon: <MdAnalytics size={22} />,
    path: "/reports",
  },
  {
    name: "Notification",
    icon: <FiBell size={22} />,
    path: "/notification",
  },
  {
    name: "Sales Report",
    icon: <FiFileText size={22} />,
    path: "/sales-report",
  },
  {
    name: "Staff Management",
    icon: <MdPeople size={22} />,
    path: "/staff",
    adminOnly: true,
  },
];

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
    navigate("/login");
  };

  const handleMenuClick = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen w-64 max-w-[85vw]
          bg-white border-r border-[#00000026]
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 h-20 sm:h-24 shrink-0 border-b border-[#00000026]">
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-[#465C8F] whitespace-nowrap">
              Thomson Casa
            </h2>

            <p className="text-[#979797] text-xs sm:text-sm">
              Supply ERP
            </p>
          </div>

          {/* Mobile Close Button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <MdClose size={26} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 py-5 space-y-2 custom-scrollbar">
          {menus.map((menu) => (
            <NavLink
              key={menu.path}
              to={menu.path}
              onClick={handleMenuClick}
              className={({ isActive }) =>
                `
                  flex items-center gap-3 sm:gap-4
                  px-4 py-3 rounded-xl
                  text-sm sm:text-base
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-[#465C8F24] text-[#465C8F] font-semibold"
                      : "text-gray-600 hover:bg-gray-100 hover:text-[#465C8F]"
                  }
                `
              }
            >
              <span className="shrink-0">
                {menu.icon}
              </span>

              <span className="truncate">
                {menu.name}
              </span>
            </NavLink>
          ))}

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="
              flex items-center gap-3 sm:gap-4
              px-4 py-3 rounded-xl
              w-full text-left
              text-sm sm:text-base
              text-gray-600
              hover:bg-red-50 hover:text-red-600
              transition-all duration-200
            "
          >
            <MdLogout size={22} className="shrink-0" />

            <span>Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
