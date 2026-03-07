import { type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdInventory2,
  MdShoppingCart,
  MdPeople,
  MdCategory,
  MdLogout,
  MdHistory,
} from "react-icons/md";
import { useDispatch } from "react-redux";
import { clearUser } from "@/features/authSlice";
import type { AppDispatch } from "@/app/store";

interface NavItem {
  to: string;
  icon: ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { to: "/dashboard", icon: <MdDashboard size={20} />, label: "Dashboard" },
  { to: "/products", icon: <MdInventory2 size={20} />, label: "Products" },
  { to: "/orders", icon: <MdShoppingCart size={20} />, label: "Orders" },
  { to: "/payments", icon: <MdHistory size={20} />, label: "Payments" },
  { to: "/customers", icon: <MdPeople size={20} />, label: "Customers" },
  { to: "/categories", icon: <MdCategory size={20} />, label: "Categories" },
];

const Sidebar = () => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <aside className="fixed inset-y-0 left-0 w-60 bg-gray-900 flex flex-col z-30">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-700/50">
        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
          <span className="text-white font-bold text-sm">S</span>
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">ShopLK</p>
          <p className="text-gray-400 text-xs">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-700/50">
        <button
          onClick={() => dispatch(clearUser())}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-150"
        >
          <MdLogout size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
