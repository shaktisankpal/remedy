import { useNavigate, NavLink } from "react-router-dom";

const ClientNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Styling for the navigation links
  // The 'mb-[-1px]' ensures the active border sits perfectly on top of the navbar bottom border
  const getLinkClasses = ({ isActive }) =>
    isActive
      ? "text-black border-b-2 border-black pb-4 mt-4 text-sm font-medium tracking-wide transition-all duration-300 mb-[-1px]"
      : "text-gray-500 hover:text-black pb-4 mt-4 text-sm font-medium tracking-wide transition-colors duration-300";

  return (
    <nav className="w-full bg-white border-b border-b-stone-400 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between relative">
        {/* Left: Brand Identity */}
        <div
          className="text-xl font-bold tracking-tight text-black cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate("/client")}
        >
          Remedy<span className="text-gray-400">.</span>
        </div>

        {/* Center: Navigation Tabs */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full flex items-end gap-12">
          <NavLink to="/client" end className={getLinkClasses}>
            Active Complaints
          </NavLink>

          <NavLink to="/client/closed" className={getLinkClasses}>
            Closed Complaints
          </NavLink>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center">
          <button
            onClick={handleLogout}
            className="px-5 py-1.5 text-sm font-medium text-red-600 border border-red-500 rounded hover:bg-red-500 hover:text-white transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default ClientNavbar;
