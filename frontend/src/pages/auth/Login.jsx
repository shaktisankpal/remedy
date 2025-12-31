import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);

      // Redirect based on role
      const role = JSON.parse(localStorage.getItem("user"))?.role;

      if (role === "ADMIN") navigate("/admin");
      else if (role === "SUPPORT_L1") navigate("/support");
      else if (role === "DEVELOPER_L2") navigate("/developer");
      else navigate("/client");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black font-sans selection:bg-black selection:text-white px-6">
      {/* Brand Header */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight cursor-default">
          Remedy<span className="text-gray-400">.</span>
        </h1>
        <p className="text-gray-400 text-sm mt-2 tracking-wide font-light">
          Sign in to manage your cases
        </p>
      </div>

      <div className="w-full max-w-md">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-2 border-red-600 text-red-700 text-sm flex items-center gap-2 animate-fadeIn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="group">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-black transition-colors">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-gray-200 text-black p-4 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-300 placeholder:text-gray-300"
              placeholder="name@company.com"
              required
            />
          </div>

          {/* Password Input */}
          <div className="group">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 group-focus-within:text-black transition-colors">
                Password
              </label>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-gray-200 text-black p-4 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-300 placeholder:text-gray-300"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-4 text-sm font-medium hover:bg-gray-900 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 flex justify-center items-center gap-2 mt-8"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Authenticating...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-black font-medium border-b border-black pb-0.5 hover:opacity-70 transition-opacity"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
