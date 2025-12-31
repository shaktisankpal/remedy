import { useNavigate, NavLink } from "react-router-dom";

const SupportNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Styling for the navigation links
  const getLinkClasses = ({ isActive }) =>
    isActive
      ? "text-black border-b-2 border-black pb-4 mt-4 text-sm font-medium tracking-wide transition-all duration-300 mb-[-1px]"
      : "text-gray-500 hover:text-black pb-4 mt-4 text-sm font-medium tracking-wide transition-colors duration-300";

  return (
    <nav className="w-full bg-white border-b border-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between relative">
        {/* Left: Brand Identity */}
        <div
          className="text-xl font-bold tracking-tight text-black cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate("/support")}
        >
          Remedy<span className="text-gray-400">.</span>{" "}
          <span className="text-xs font-normal text-gray-500 ml-1 border-l border-gray-300 pl-2">
            Support
          </span>
        </div>

        {/* Center: Navigation Tabs */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full flex items-end gap-12">
          <NavLink to="/support" end className={getLinkClasses}>
            Support Console
          </NavLink>
          {/* Future proofing for a 'History' tab if needed later */}
          {/* <NavLink to="/support/history" className={getLinkClasses}>History</NavLink> */}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center">
          <button
            onClick={handleLogout}
            className="px-5 py-1.5 text-sm font-medium text-red-600 border border-red-200 rounded hover:bg-red-600 hover:border-red-600 hover:text-white transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default SupportNavbar;
