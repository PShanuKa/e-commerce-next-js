import { Link } from "react-router-dom";
import {FaHome } from "react-icons/fa";

const Breadcrumb = ({ title, path }: { title: string; path?: string }) => {
  return (
    <div className="flex items-center gap-6 pb-4">
      <p className="text-[20px] font-medium text-(--font-color-primary)">
        {title}
      </p>

      {path && (
      <div className="flex items-center gap-3">
        <Link to="/">
        <FaHome size={20} className="text-(--Primary)" />
        </Link>
        <Link to="/merchant">
          <p className="text-[14px] font-medium text-(--Primary)">- {path}</p>
        </Link>
        <Link to="/merchant/add">
          <p className="text-[14px] font-medium text-(--gray-500)">- {title}</p>
        </Link>
      </div>
      )}
    </div>
  );
};

export default Breadcrumb;
