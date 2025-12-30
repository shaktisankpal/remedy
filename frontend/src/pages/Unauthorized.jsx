import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const goBack = () => {
    if (role === "ADMIN") navigate("/admin");
    else if (role === "SUPPORT_L1") navigate("/support");
    else if (role === "DEVELOPER_L2") navigate("/developer");
    else navigate("/client");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-2">Unauthorized</h1>
      <p className="text-gray-600 mb-6">
        You do not have permission to access this page.
      </p>
      <button
        onClick={goBack}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default Unauthorized;
