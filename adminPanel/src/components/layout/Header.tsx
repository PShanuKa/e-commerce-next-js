import { MdNotificationsNone, MdSearch } from "react-icons/md";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const user = useSelector((s: RootState) => s.auth.user);

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6">
      {/* Title */}
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-56">
          <MdSearch size={18} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-full"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500">
          <MdNotificationsNone size={21} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-600 font-semibold text-sm">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-700 leading-tight">
              {user?.name || "Admin"}
            </p>
            <p className="text-xs text-gray-400 capitalize">
              {user?.role || "admin"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
