import { NavLink } from "react-router-dom";

import {
  MdOutlineDashboard,
  MdDescription,
  MdPeople,
  MdAssessment,
  MdOutlineAccountBalanceWallet,
  MdAnalytics,
  MdReceipt,
  MdClose,
} from "react-icons/md";
import { BiPurchaseTagAlt } from "react-icons/bi";
import { VscCreditCard, VscGraph } from "react-icons/vsc";
import { FiFileText, FiShoppingCart, FiScissors } from "react-icons/fi";
import { IoAnalytics } from "react-icons/io5";
import { TbInvoice } from "react-icons/tb";
const menus = [
  {
    name: "Dashboard",
    icon: <MdOutlineDashboard size={22} />,
    path: "/",
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
  //   {
  //     name: "Sales Report",
  //     icon: <FiFileText size={22} />,
  //     path: "/sales-report",
  //   },
  //   {
  //     name: "Customer Purchase",
  //     icon: <BiPurchaseTagAlt size={22} />,
  //     path: "/customer-purchase",
  //   },
  //   {
  //     name: "Outstanding Payment",
  //     icon: <VscCreditCard size={22} />,
  //     path: "/outstanding-payment",
  //   },
  //   {
  //     name: "Record Advances",
  //     icon: <VscGraph size={22} />,
  //     path: "/record-advance",
  //   },
  //   {
  //     name: "Advance Balance",
  //     icon: <MdOutlineAccountBalanceWallet size={22} />,
  //     path: "/advance-balance",
  //   },
  //   {
  //     name: "Advance Analytics",
  //     icon: <IoAnalytics size={22} />,
  //     path: "/advance-analytics",
  //   },
  //   {
  //     name: "Invoice",
  //     icon: <TbInvoice size={22} />,
  //     path: "/invoice",
  //   },
];

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-[#00000026] transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        {/* Logo */}

        <div className="flex items-center justify-between px-6 h-24 border-b border-[#00000026]">
          <div>
            <h2 className="text-2xl font-bold text-[#465C8F]">Thomson Casa</h2>

            <p className="text-[#979797] text-sm">Supply ERP</p>
          </div>

          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <MdClose size={28} />
          </button>
        </div>

        {/* Menu */}

        <nav className="mt-6 px-4 space-y-2">
          {menus.map((menu) => (
            <NavLink
              key={menu.path}
              to={menu.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl transition
                 ${
                   isActive
                     ? "bg-[#465C8F24] text-[#465C8F] font-semibold"
                     : "text-gray-600 hover:bg-gray-100"
                 }`
              }
            >
              {menu.icon}

              <span>{menu.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
